import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuCard, NeuButton, NeuToggle, NeuProgress, NeuLED, NeuIconButton, NeuThemeSlider } from '../components/ui/NeumorphicPrimitives';
import DotMatrixDisplay from '../components/ui/DotMatrixDisplay';
import ConwaysGameOfLife from '../components/ui/ConwaysGameOfLife';
import HyperHome from '../components/hyper/HyperHome';
import { ExternalLink, Github, Linkedin, Mail, ChevronDown, ArrowUpRight, BookOpen, Briefcase, GraduationCap, Award, Sun, Moon, Snowflake, FolderOpen, Layers, MapPin, Clock, Coffee, Calendar, Camera, CameraOff, Aperture, Trophy, Star, BadgeCheck, CheckCircle2, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

/* ──────────────────────── DATA FROM LOCAL CMS ──────────────────────── */
import PROJECTS_DATA from '../data/projects.json';
import CAREER_DATA from '../data/career.json';
import ACHIEVEMENTS_DATA from '../data/achievements.json';
import CERTIFICATIONS_DATA from '../data/certifications.json';
import SKILLS_DATA from '../data/skills.json';
import WRITING_DATA from '../data/writing.json';

// Authentic Behance Bē vector icon
const BehanceIcon = ({ size = 16, className = '' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.357 0-6.625-2.909-6.625-6.785 0-4.069 2.508-6.965 6.551-6.965 4.394 0 6.275 3.256 5.86 6.965h-9.582c.083 1.944 1.344 3.528 3.654 3.528 1.637 0 2.754-.732 3.243-1.743h2.001zm-5.789-5.918c-.033-1.477-.92-2.582-2.508-2.582-1.638 0-2.607 1.085-2.734 2.582h5.242zm-12.937-6.082h5.503c2.473 0 4.225.882 4.225 3.018 0 1.309-.765 2.193-1.895 2.637 1.542.433 2.378 1.597 2.378 3.167 0 2.457-1.956 3.928-4.708 3.928h-5.503v-12.75zm3.176 4.965h1.921c1.077 0 1.838-.415 1.838-1.396 0-.898-.693-1.307-1.737-1.307h-2.022v2.703zm0 5.48h2.083c1.233 0 2.052-.513 2.052-1.585 0-1.073-.834-1.572-2.062-1.572h-2.073v3.157z" />
    </svg>
);

const ROLES = [
    'Senior Software Engineer @ Tricog Health_',
    'Full-Stack & AI-Native Engineering_',
    'CoreTech Team & Platform Lead_',
    'AI Cybersecurity & Agentic Engineering_',
    'Developer Tools & Systems Architect_',
];

// Map JSON data to the shapes this component expects
const PROJECTS = PROJECTS_DATA.map(p => ({
    title: p.title,
    tagline: p.description,
    tech: p.tags || [],
    image: p.coverImage,
    slug: p.slug || p._id,
}));

// Map skills from resume
const SKILLS = SKILLS_DATA.map(s => ({
    _id: s._id,
    name: s.name,
    category: s.category || 'Other',
    categoryKey: (s.category || '').toLowerCase().trim(),
    iconClass: s.iconClass || '',
}));

const SKILL_CATEGORIES = [
    { label: 'All', key: 'all' },
    { label: 'AI & Agentic', key: 'ai and agentic engineering' },
    { label: 'Backend', key: 'backend' },
    { label: 'Frontend & Design', key: 'frontend and design' },
    { label: 'Data', key: 'data' },
    { label: 'Cloud & DevOps', key: 'cloud and devops' },
    { label: 'Healthcare & Security', key: 'healthcare, security and quality' },
    { label: 'Leadership', key: 'leadership' },
];

const EXP_CATEGORIES = [
    { label: 'All', key: 'all' },
    { label: 'Work Experience', key: 'job' },
    { label: 'Communities & Fellowships', key: 'community' },
    { label: 'Formal Education', key: 'education' },
];

// Map career/journey
const JOURNEY = CAREER_DATA.map(c => ({
    type: c.type || 'job',
    title: c.designation,
    org: c.company,
    period: c.isPresent ? `${c.fromDate} — Present` : `${c.fromDate} — ${c.toDate}`,
    description: c.details,
    stack: c.stack ? c.stack.split(',').map(s => s.trim()) : [],
    highlight: c.highlight ?? false,
}));

// Map blog posts
const BLOG_POSTS = WRITING_DATA.map(w => ({
    title: w.title,
    mood: w.mood || '📝',
    readTime: w.readTime || '5 min',
    excerpt: w.subtitle,
    slug: w.slug || w._id,
}));

const NAV_ITEMS = [
    { label: 'Projects', icon: <FolderOpen size={14} />, href: '#projects' },
    { label: 'Experience', icon: <Briefcase size={14} />, href: '#experience' },
    { label: 'Honors & Certs', icon: <Trophy size={14} />, href: '#achievements' },
    { label: 'Skills', icon: <Layers size={14} />, href: '#skills' },
    { label: 'Writing', icon: <BookOpen size={14} />, href: '#blog' },
];

/* ──────────────────────── HOOKS ──────────────────────── */
const useTypingEffect = (strings, typingSpeed = 80, pauseTime = 2000) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const current = strings[currentIndex];
        let timeout;
        if (!isDeleting && displayText === current) {
            timeout = setTimeout(() => setIsDeleting(true), pauseTime);
        } else if (isDeleting && displayText === '') {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % strings.length);
        } else {
            timeout = setTimeout(() => {
                setDisplayText(current.substring(0, displayText.length + (isDeleting ? -1 : 1)));
            }, isDeleting ? typingSpeed / 2 : typingSpeed);
        }
        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentIndex, strings, typingSpeed, pauseTime]);

    return displayText;
};

const useLiveClock = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);
    return time;
};


/* ──────────────────────── SUB-COMPONENTS ──────────────────────── */
const SectionHeader = ({ label, number }) => (
    <div className="flex items-center gap-4 mb-10">
        <span className="font-mono text-[10px] text-primary opacity-60">0{number}</span>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted">{label}</p>
        <div className="flex-1 h-px bg-border/50" />
    </div>
);

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

/* ── Project Highlights — Stacked Tabs (reference-inspired, neumorphic) ── */
const ProjectHighlights = ({ projects }) => {
    const [active, setActive] = useState(0);
    const highlights = projects.slice(0, Math.min(projects.length, 4));
    const navigate = useNavigate();

    useEffect(() => {
        if (highlights.length <= 1) return;
        const timer = setInterval(() => {
            setActive(prev => (prev + 1) % highlights.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [highlights.length, active]);

    if (highlights.length === 0) return null;
    const current = highlights[active];

    // Build ordered list: active first, then subsequent in order
    const orderedTabs = highlights.map((_, i) => (i - active + highlights.length) % highlights.length);

    return (
        <div className="relative">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-6">Highlights</p>

            {/* ──── Desktop: all items in one flex row, widths animate ──── */}
            <div className="hidden md:flex h-[380px] relative gap-0 w-full">
                {highlights.map((project, i) => {
                    const isActive = i === active;
                    const isRightSide = i > active;
                    const shortTitle = (project.title || '').split('—')[0].split(' - ')[0].trim();

                    // Calculate widths so the container exactly fits 100%
                    const inactiveWidth = 56;
                    const activeWidthCalc = `calc(100% - ${(highlights.length - 1) * inactiveWidth}px)`;

                    // Inverted shadow for tabs on the right, normal for left/active
                    const shadowClass = isRightSide && !isActive ? 'neu-flat-invert-x' : 'neu-flat';
                    const roundedClass = isActive ? 'rounded-3xl' : (isRightSide ? 'rounded-r-2xl' : 'rounded-l-2xl');

                    return (
                        <motion.div
                            key={project.slug}
                            className={`relative h-full overflow-hidden cursor-pointer group highlight-card ${isActive ? 'active' : ''} ${shadowClass} ${roundedClass}`}
                            style={{
                                flexShrink: 0,
                                zIndex: 20 - Math.abs(i - active)
                            }}
                            animate={{
                                width: isActive ? activeWidthCalc : `${inactiveWidth}px`,
                                opacity: 1,
                            }}
                            initial={false}
                            transition={{
                                width: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.3 },
                            }}
                            onClick={() => isActive ? navigate(`/projects/${project.slug}`) : setActive(i)}
                        >
                            {/* ── Expanded Content (visible only when active) ── */}
                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.35, delay: 0.2 }}
                                        className="flex h-full absolute inset-0"
                                    >
                                        {/* Left: Framed Image */}
                                        <div className="w-1/2 p-5 shrink-0">
                                            <div className="w-full h-full rounded-2xl overflow-hidden">
                                                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                            </div>
                                        </div>

                                        {/* Right: Info */}
                                        <div className="w-1/2 flex flex-col justify-center pr-10 py-8">
                                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-3">
                                                {String(i + 1).padStart(2, '0')} — Featured
                                            </span>
                                            <h3 className="text-3xl font-display font-bold text-textMain mb-3 leading-tight">{project.title}</h3>
                                            <p className="text-sm text-textMuted leading-relaxed mb-6 line-clamp-3">{project.tagline}</p>
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {project.tech.slice(0, 4).map(t => (
                                                    <span key={t} className="text-[9px] font-mono uppercase px-2.5 py-1 rounded-full neu-pressed tracking-widest text-textMuted">{t}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
                                                <ArrowUpRight size={14} />
                                                <span>View Case Study</span>
                                            </div>
                                        </div>

                                        {/* Progress bar at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20">
                                            <motion.div
                                                key={`progress-${active}`}
                                                className="h-full bg-primary rounded-full"
                                                initial={{ width: '0%' }}
                                                animate={{ width: '100%' }}
                                                transition={{ duration: 5, ease: 'linear' }}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ── Collapsed Tab Label (visible only when inactive) ── */}
                            {!isActive && (
                                <div className="w-full h-full flex flex-col items-center justify-center py-10 px-2 overflow-hidden group-hover:bg-surface transition-colors select-none">
                                    <span
                                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-textMuted group-hover:text-primary transition-colors whitespace-nowrap overflow-hidden text-ellipsis block"
                                        style={{
                                            writingMode: 'vertical-rl',
                                            textOrientation: 'mixed',
                                            transform: 'rotate(180deg)',
                                            maxHeight: '260px',
                                        }}
                                        title={project.title}
                                    >
                                        {String(i + 1).padStart(2, '0')} · {shortTitle}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* ──── Mobile: vertical stacked layout ──── */}
            <div className="md:hidden flex flex-col gap-3">
                {/* Active Card */}
                <div
                    className="rounded-2xl neu-flat overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/projects/${current.slug}`)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="p-4">
                                <div className="w-full h-48 rounded-xl overflow-hidden">
                                    <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="px-5 pb-5">
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-2 block">
                                    {String(active + 1).padStart(2, '0')} — Featured
                                </span>
                                <h3 className="text-xl font-display font-bold text-textMain mb-2">{current.title}</h3>
                                <p className="text-sm text-textMuted leading-relaxed mb-4 line-clamp-2">{current.tagline}</p>
                                <div className="flex flex-wrap gap-2">
                                    {current.tech.slice(0, 3).map(t => (
                                        <span key={t} className="text-[9px] font-mono uppercase px-2.5 py-1 rounded-full neu-pressed tracking-widest text-textMuted">{t}</span>
                                    ))}
                                </div>
                            </div>
                            {/* Progress bar */}
                            <div className="h-1 bg-border/20">
                                <motion.div
                                    key={`m-progress-${active}`}
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 5, ease: 'linear' }}
                                />
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Horizontal tab strips (below active, like collapsed tabs) */}
                <div className="flex gap-2">
                    {highlights.map((project, i) => {
                        if (i === active) return null;
                        const shortTitle = (project.title || '').split('—')[0].split(' - ')[0].trim();
                        return (
                            <button
                                key={project.slug}
                                onClick={() => setActive(i)}
                                className="flex-1 py-3 px-2 rounded-xl neu-flat cursor-pointer group overflow-hidden"
                            >
                                <span className="font-mono text-[9px] uppercase tracking-widest text-textMuted group-hover:text-primary transition-colors block text-center truncate">
                                    {String(i + 1).padStart(2, '0')} {shortTitle}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════════════════ */
const NeumorphicDashboard = () => {
    const { theme, toggleTheme, aesthetic, setAestheticLive, tempDisplayValue, isHyperMode } = useAppStore();
    const [glyphCameraMode, setGlyphCameraMode] = useState(false);
    const glyphRef = useRef(null);

    const isDark = theme === 'dark';
    const typedRole = useTypingEffect(ROLES);
    const clock = useLiveClock();
    const [activeSkillCategory, setActiveSkillCategory] = useState('all');
    const [activeExpCategory, setActiveExpCategory] = useState('all');

    const filteredJourney = activeExpCategory === 'all'
        ? JOURNEY
        : JOURNEY.filter(j => j.type === activeExpCategory);

    // Group skills by category
    const groupedSkills = useMemo(() => {
        const groups = {};
        SKILLS.forEach(skill => {
            const cat = skill.category;
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(skill);
        });
        return groups;
    }, []);

    const visibleCategories = useMemo(() => {
        if (activeSkillCategory === 'all') {
            return Object.entries(groupedSkills);
        }
        return Object.entries(groupedSkills).filter(([cat]) => cat.toLowerCase().trim() === activeSkillCategory);
    }, [activeSkillCategory, groupedSkills]);

    // Current date info for the calendar card
    const dayName = clock.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = clock.toLocaleDateString('en-US', { month: 'short' });
    const dayNum = clock.getDate();

    if (isHyperMode) return <HyperHome />;

    return (
        <div className="min-h-screen bg-background text-textMain font-body selection:bg-primary selection:text-white">

            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <section className="min-h-screen flex items-center relative px-6 md:px-16 lg:px-24 py-20">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                    {/* Left: Identity */}
                    <div className="lg:col-span-7 flex flex-col justify-center hero-identity">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-4">Identity Matrix</p>
                        <div className="relative mb-6 select-none group">
                            <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-display font-extrabold tracking-tighter text-textMain leading-[0.8] portfolio-logo">
                                Yadev
                            </h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-3 md:mt-4">
                                <span className="text-2xl md:text-4xl lg:text-5xl font-light tracking-widest text-textMuted uppercase font-body">
                                    Jayachandran
                                </span>
                            </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-display text-textMuted mt-6 h-10">
                            {typedRole}<span className="animate-pulse">|</span>
                        </h2>
                        <p className="text-textMuted text-sm md:text-base max-w-lg mt-6 leading-relaxed">
                            Full-stack engineer with 6+ years of experience. Senior Software Engineer on the CoreTech team at <span className="text-primary font-semibold">Tricog Health</span> with tech-lead scope, co-leading <span className="text-textMain font-medium">AI-driven cybersecurity</span> and <span className="text-textMain font-medium">agentic engineering</span>. Building developer tools, high-scale platforms, and mentoring engineers.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-10">
                            <a href="#projects"><NeuButton variant="primary">View My Work</NeuButton></a>
                            <a href="mailto:yadev64@gmail.com"><NeuButton>Say Hello</NeuButton></a>
                        </div>
                        <div className="flex gap-4 mt-8 social-links">
                            <a href="https://github.com/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" icon={<Github size={16} />} /></a>
                            <a href="https://www.linkedin.com/in/yadev-jayachandran/" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" icon={<Linkedin size={16} />} /></a>
                            <a href="https://www.behance.net/yadev64" target="_blank" rel="noopener noreferrer" title="Behance"><NeuIconButton size="sm" hoverColor="#1769FF" icon={<BehanceIcon size={16} />} /></a>
                        </div>
                    </div>

                    {/* Right: Card Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-6 w-full max-w-full min-w-0">

                        {/* CARD 1: Quick Navigation (Pressed IN) */}
                        <NeuCard className="w-full !p-5 neu-pressed border-none quick-jump-container relative overflow-hidden">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-4 pb-3 border-b border-border/10">Quick Jump</p>
                            <div className="grid grid-cols-2 gap-2.5">
                                {NAV_ITEMS.map((item, idx) => (
                                    <a key={item.label} href={item.href}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl neu-flat text-textMuted hover:text-primary font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer quick-jump-item ${
                                            idx === NAV_ITEMS.length - 1 ? 'col-span-2' : ''
                                        }`}>
                                        {item.icon}
                                        <span className="font-semibold truncate">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </NeuCard>

                        {/* CARDS 2a & 2b: Glyph Display + Location (Full width on mobile, flex bounded on desktop) */}
                        <div className="w-full flex gap-3.5 items-stretch min-w-0">
                            {/* Left: Circular Dot Matrix Display */}
                            <NeuCard className="w-full sm:w-auto sm:shrink-0 !p-3 md:!p-4 flex items-center justify-between overflow-hidden min-w-0">
                                <div className="flex-1 sm:flex-none flex items-center justify-center sm:justify-start shrink-0">
                                    <DotMatrixDisplay
                                        ref={glyphRef}
                                        tempDisplayValue={tempDisplayValue}
                                        cameraMode={glyphCameraMode}
                                        setCameraMode={setGlyphCameraMode}
                                        showBuiltinControls={false}
                                    />
                                </div>

                                {/* Controls Subsection */}
                                <div className="flex flex-col items-center justify-center gap-3 pl-3 ml-1 border-l border-border/10 w-14 shrink-0">
                                    <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-textMuted/60 leading-none">Controls</span>

                                    <div className="flex flex-col gap-3.5 items-center">
                                        {/* Camera Toggle */}
                                        <button
                                            onClick={() => setGlyphCameraMode(!glyphCameraMode)}
                                            className="p-2 rounded-xl neu-flat bg-background transition-all active:scale-95 cursor-pointer"
                                            title={glyphCameraMode ? "Disable Camera" : "Enable Camera"}
                                        >
                                            {glyphCameraMode ? <CameraOff size={15} className="text-primary" /> : <Camera size={15} className="text-textMuted" />}
                                        </button>

                                        {/* Live Indicator / Capture */}
                                        {glyphCameraMode ? (
                                            <button
                                                onClick={() => glyphRef.current?.captureAndDownload()}
                                                className="flex flex-col items-center gap-1 group cursor-pointer"
                                                title="Capture Frame"
                                            >
                                                <div className="flex items-center gap-1 mb-0.5 bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
                                                    <div className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="font-mono text-[7px] font-bold text-red-500 tracking-tighter uppercase">Live</span>
                                                </div>
                                                <div className="p-2 rounded-xl neu-flat bg-background group-active:scale-95 transition-all">
                                                    <Aperture size={15} className="text-primary" />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 opacity-20 filter grayscale">
                                                <div className="flex items-center gap-1 mb-0.5 px-1.5 py-0.5">
                                                    <div className="w-1 h-1 rounded-full bg-textMuted" />
                                                    <span className="font-mono text-[7px] font-medium text-textMuted uppercase tracking-tighter">Standby</span>
                                                </div>
                                                <div className="p-2 rounded-xl neu-flat bg-background">
                                                    <Aperture size={15} className="text-textMuted" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </NeuCard>

                            {/* Right: Conway's Game of Life Widget — flex-1 takes exact remaining width, perfectly bounded */}
                            <NeuCard className="hidden sm:flex !p-3 flex-col justify-between flex-1 min-w-0 overflow-hidden">
                                <ConwaysGameOfLife />
                            </NeuCard>
                        </div>

                        {/* CARD 3: Remote Control (Car AC style) */}
                        <NeuCard className="w-full !p-4 md:!p-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-4 md:mb-5 pb-3 border-b border-border/30">System Remote</p>


                            {/* Dark Mode toggle */}
                            <div className="flex items-center justify-between mb-4 md:mb-5">
                                <div className="flex items-center gap-3">
                                    {isDark ? <Moon size={14} className="text-primary" /> : <Sun size={14} className="text-textMuted" />}
                                    <span className="font-mono text-xs text-textMuted uppercase">Dark Mode</span>
                                </div>
                                <NeuToggle checked={isDark} onChange={() => toggleTheme()} />
                            </div>

                            {/* Theme Slider — 3 aesthetics */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-xs text-textMuted uppercase">Aesthetic</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] text-textMuted uppercase shrink-0">Default</span>
                                <div className="flex-1 opacity-90"><NeuThemeSlider
                                    value={['neumorphism', 'clay', 'brutal'].indexOf(aesthetic) !== -1 ? ['neumorphism', 'clay', 'brutal'].indexOf(aesthetic) : 0}
                                    onChange={(val) => {
                                        const themes = ['neumorphism', 'clay', 'brutal'];
                                        if (themes[val]) setAestheticLive(themes[val]);
                                    }}
                                    steps={3}
                                /></div>
                                <span className="font-mono text-[10px] text-textMuted uppercase shrink-0">Brutal</span>
                            </div>

                            {/* PWR LED */}
                            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/30">
                                <NeuLED active color="primary" />
                                <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">System Online</span>
                            </div>
                        </NeuCard>
                    </div>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <ChevronDown className="text-textMuted" size={24} />
                </motion.div>
            </section>

            {/* ═══════════════ PROJECTS ═══════════════ */}
            <section id="projects" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Selected Work" number={1} />

                {/* ── Highlights Carousel (stacked cards, auto-scroll 5s) ── */}
                <ProjectHighlights projects={PROJECTS} />

                {/* ── All Projects Grid (3 columns) ── */}
                <div className="mt-16">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-8">All Projects</p>
                    <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {PROJECTS.map((project) => (
                            <motion.div key={project.slug} variants={fadeUp}>
                                <Link to={`/projects/${project.slug}`}>
                                    <NeuCard className="group cursor-pointer h-full flex flex-col !p-0 overflow-hidden neu-project-card">
                                        {/* Framed Image — padding creates the frame effect */}
                                        <div className="p-4 pb-0">
                                            <div className="w-full h-44 overflow-hidden rounded-xl relative">
                                                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-90" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl" />
                                            </div>
                                        </div>
                                        <div className="p-5 pt-4 flex flex-col flex-1">
                                            <h3 className="text-lg font-display font-bold text-textMain mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                            <p className="text-sm text-textMuted leading-relaxed flex-1 line-clamp-2">{project.tagline}</p>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                {project.tech.slice(0, 3).map(t => (
                                                    <span key={t} className="text-[9px] font-mono uppercase px-2.5 py-1 rounded-full neu-pressed tracking-widest text-textMuted">{t}</span>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30 text-primary font-mono text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <ArrowUpRight size={12} />
                                                <span>View Project</span>
                                            </div>
                                        </div>
                                    </NeuCard>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ EXPERIENCE ═══════════════ */}
            <section id="experience" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Experience" number={2} />
                
                {/* Category Filter Pills for Experience */}
                <div className="flex flex-wrap gap-2.5 mb-10">
                    {EXP_CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveExpCategory(cat.key)}
                            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                                activeExpCategory === cat.key ? 'neu-pressed text-primary' : 'neu-flat text-textMuted hover:text-textMain'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" />
                    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8">
                        {filteredJourney.map((node, i) => (
                            <motion.div key={i} variants={fadeUp} className="flex gap-6 items-start">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 ${node.highlight ? 'neu-convex text-primary' : 'neu-flat text-textMuted'}`}>
                                    {node.type === 'job' && <Briefcase size={18} />}
                                    {node.type === 'community' && <Users size={18} />}
                                    {node.type === 'education' && <GraduationCap size={18} />}
                                </div>
                                <NeuCard className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                        <h4 className="text-lg font-display font-bold text-textMain">{node.title}</h4>
                                        <span className="font-mono text-xs text-primary">{node.period}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-textMuted mb-2">{node.org}</p>
                                    <p className="text-sm text-textMuted leading-relaxed whitespace-pre-line">{node.description}</p>
                                    {node.stack && node.stack.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/20 items-center">
                                            <span className="font-mono text-[10px] text-textMuted uppercase tracking-wider mr-1">Stack:</span>
                                            {node.stack.map(st => (
                                                <span key={st} className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full neu-pressed tracking-wider text-textMuted">
                                                    {st}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </NeuCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ ACHIEVEMENTS & CERTIFICATIONS ═══════════════ */}
            <section id="achievements" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Achievements & Certifications" number={3} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Left: Achievements */}
                    <NeuCard className="flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full neu-pressed flex items-center justify-center text-primary">
                                        <Trophy size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-mono text-sm uppercase tracking-wider text-textMain font-bold">
                                            Achievements
                                        </h3>
                                        <span className="font-mono text-[10px] text-textMuted">Honors, Hackathons & Awards</span>
                                    </div>
                                </div>
                                <span className="font-mono text-[10px] text-textMuted uppercase px-2.5 py-0.5 rounded-full neu-pressed">
                                    {ACHIEVEMENTS_DATA.length} Honors
                                </span>
                            </div>

                            <div className="space-y-3.5">
                                {ACHIEVEMENTS_DATA.map(ach => (
                                    <div key={ach._id} className="p-4 rounded-2xl neu-flat hover:neu-pressed transition-all duration-200 group">
                                        <div className="flex items-start justify-between gap-3 mb-1">
                                            <div className="flex items-center gap-2">
                                                <Star size={14} className="text-amber-500 shrink-0 fill-amber-500/20" />
                                                <h4 className="font-display font-bold text-sm text-textMain group-hover:text-primary transition-colors">
                                                    {ach.title}
                                                </h4>
                                            </div>
                                            <span className="font-mono text-xs text-primary font-semibold shrink-0 px-2 py-0.5 rounded-md neu-pressed">
                                                {ach.year}
                                            </span>
                                        </div>
                                        <p className="font-mono text-xs text-textMuted mb-1 ml-5">
                                            {ach.organization}
                                        </p>
                                        {ach.details && (
                                            <p className="text-xs text-textMuted/80 leading-relaxed ml-5">
                                                {ach.details}
                                            </p>
                                        )}
                                        {ach.link && (
                                            <a
                                                href={ach.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-[11px] font-mono text-primary hover:underline ml-5 mt-2"
                                            >
                                                <span>View Project</span>
                                                <ArrowUpRight size={12} />
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </NeuCard>

                    {/* Right: Certifications */}
                    <NeuCard className="flex flex-col justify-between h-full">
                        <div>
                            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full neu-pressed flex items-center justify-center text-primary">
                                        <BadgeCheck size={18} />
                                    </div>
                                    <div>
                                        <h3 className="font-mono text-sm uppercase tracking-wider text-textMain font-bold">
                                            Certifications
                                        </h3>
                                        <span className="font-mono text-[10px] text-textMuted">Professional Credentials</span>
                                    </div>
                                </div>
                                <span className="font-mono text-[10px] text-textMuted uppercase px-2.5 py-0.5 rounded-full neu-pressed">
                                    {CERTIFICATIONS_DATA.length} Credentials
                                </span>
                            </div>

                            <div className="space-y-3.5">
                                {CERTIFICATIONS_DATA.map(cert => (
                                    <div key={cert._id} className="p-4 rounded-2xl neu-flat hover:neu-pressed transition-all duration-200 group flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-8 h-8 rounded-xl neu-pressed flex items-center justify-center text-primary shrink-0">
                                                <CheckCircle2 size={15} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-display font-bold text-sm text-textMain group-hover:text-primary transition-colors truncate">
                                                    {cert.title}
                                                </h4>
                                                <p className="font-mono text-xs text-textMuted">
                                                    {cert.issuer}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-xs text-primary font-semibold shrink-0 px-2.5 py-1 rounded-md neu-pressed">
                                            {cert.year}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </NeuCard>
                </div>
            </section>

            {/* ═══════════════ SKILLS ═══════════════ */}
            <section id="skills" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Technical Skills" number={4} />
                
                {/* Category Filter Pills */}
                <div className="flex flex-wrap gap-2.5 mb-10">
                    {SKILL_CATEGORIES.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveSkillCategory(cat.key)}
                            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                                activeSkillCategory === cat.key ? 'neu-pressed text-primary' : 'neu-flat text-textMuted hover:text-textMain'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Categorized Skills Tags Grid (No Percentage Meters) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence mode="wait">
                        {visibleCategories.map(([categoryName, items]) => (
                            <motion.div
                                key={categoryName}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                            >
                                <NeuCard className="h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/20">
                                            <h3 className="font-mono text-xs uppercase tracking-widest text-primary font-bold flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                {categoryName}
                                            </h3>
                                            <span className="font-mono text-[10px] text-textMuted uppercase px-2.5 py-0.5 rounded-full neu-pressed">
                                                {items.length} {items.length === 1 ? 'tag' : 'tags'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2.5 pt-1">
                                            {items.map(skill => (
                                                <span
                                                    key={skill._id || skill.name}
                                                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl neu-flat hover:neu-pressed text-xs font-mono text-textMain hover:text-primary transition-all duration-200 cursor-default select-none group"
                                                >
                                                    {skill.iconClass ? (
                                                        <i className={`${skill.iconClass} text-sm text-primary opacity-80 group-hover:opacity-100 shrink-0`} />
                                                    ) : (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                                                    )}
                                                    <span>{skill.name}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </NeuCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* ═══════════════ BLOG ═══════════════ */}
            <section id="blog" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Writing" number={5} />
                <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {BLOG_POSTS.map(post => (
                        <motion.div key={post.slug} variants={fadeUp}>
                            <Link to={`/blog/${post.slug}`}>
                                <NeuCard className="group cursor-pointer neu-project-card h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl">{post.mood}</span>
                                            <span className="font-mono text-[10px] text-textMuted uppercase">{post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-textMain mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                                        <p className="text-sm text-textMuted leading-relaxed">{post.excerpt}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-6 text-primary font-mono text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <BookOpen size={14} />
                                        <span>Read</span>
                                    </div>
                                </NeuCard>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════════ FOOTER ═══════════════ */}
            <footer className="px-6 md:px-16 lg:px-24 py-16 max-w-[1600px] mx-auto">
                <NeuCard className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-textMain">Yadev<span className="text-primary">.</span>cc</h2>
                        <p className="font-mono text-xs text-textMuted mt-2">Designed & built by Yadev. Powered by curiosity and coffee.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="https://github.com/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton hoverColor="#8B5CF6" icon={<Github size={18} />} /></a>
                        <a href="https://www.linkedin.com/in/yadev-jayachandran/" target="_blank" rel="noopener noreferrer"><NeuIconButton hoverColor="#0A66C2" icon={<Linkedin size={18} />} /></a>
                        <a href="https://www.behance.net/yadev64" target="_blank" rel="noopener noreferrer" title="Behance"><NeuIconButton hoverColor="#1769FF" icon={<BehanceIcon size={18} />} /></a>
                        <a href="mailto:yadev64@gmail.com" target="_blank" rel="noopener noreferrer">
                            <NeuIconButton hoverColor="#995d5dff" icon={<Mail size={18} />} />
                        </a>                    </div>
                </NeuCard>
            </footer>

        </div>
    );
};

export default NeumorphicDashboard;
