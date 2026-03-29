import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuCard, NeuButton, NeuToggle, NeuProgress, NeuLED, NeuIconButton, NeuThemeSlider } from '../components/ui/NeumorphicPrimitives';
import DotMatrixDisplay from '../components/ui/DotMatrixDisplay';
import HyperHome from '../components/hyper/HyperHome';
import { ExternalLink, Github, Linkedin, Mail, ChevronDown, ArrowUpRight, BookOpen, Briefcase, GraduationCap, Award, Sun, Moon, Flame, Snowflake, FolderOpen, Layers, MapPin, Clock, Coffee, Calendar, Camera, CameraOff, Aperture } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

/* ──────────────────────── DATA FROM LOCAL CMS ──────────────────────── */
import PROJECTS_DATA from '../data/projects.json';
import CAREER_DATA from '../data/career.json';
import SKILLS_DATA from '../data/skills.json';
import WRITING_DATA from '../data/writing.json';

const ROLES = [
    'Software Engineer_',
    'Builder of Tools_',
    'Maker_',
    'UI Craftsman_',
];

// Map JSON data to the shapes this component expects
const PROJECTS = PROJECTS_DATA.map(p => ({
    title: p.title,
    tagline: p.description,
    tech: p.tags || [],
    image: p.coverImage,
    slug: p.slug || p._id,
}));

// Map skills — normalize category to lowercase for filtering
const SKILLS = SKILLS_DATA.map(s => ({
    name: s.name,
    category: (s.category || '').toLowerCase().replace('other technologies', 'cloud').replace('people and community', 'tools'),
    proficiency: s.proficiency || 80,
}));

// Map career/journey
const JOURNEY = CAREER_DATA.map(c => ({
    type: c.type || 'job',
    title: c.designation,
    org: c.company,
    period: c.isPresent ? `${c.fromDate} — Present` : `${c.fromDate} — ${c.toDate}`,
    description: c.details,
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
    { label: 'Skills', icon: <Layers size={14} />, href: '#skills' },
    { label: 'Blog', icon: <BookOpen size={14} />, href: '#blog' },
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

                    // Calculate widths so the container exactly fits 100%
                    const inactiveWidth = 52;
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
                                <div className="w-full h-full flex items-center justify-center group-hover:bg-surface transition-colors">
                                    <span
                                        className="font-mono text-[10px] uppercase tracking-[0.25em] text-textMuted group-hover:text-primary transition-colors whitespace-nowrap"
                                        style={{
                                            writingMode: 'vertical-rl',
                                            textOrientation: 'mixed',
                                            transform: 'rotate(180deg)',
                                        }}
                                    >
                                        {String(i + 1).padStart(2, '0')} {project.title}
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
                        return (
                            <button
                                key={project.slug}
                                onClick={() => setActive(i)}
                                className="flex-1 py-3 rounded-xl neu-flat cursor-pointer group"
                            >
                                <span className="font-mono text-[9px] uppercase tracking-widest text-textMuted group-hover:text-primary transition-colors block text-center">
                                    {String(i + 1).padStart(2, '0')} {project.title}
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
    const { theme, toggleTheme, aesthetic, setAestheticLive, tempDisplayValue, isHyperMode, toggleHyperMode } = useAppStore();
    const [glyphCameraMode, setGlyphCameraMode] = useState(false);
    const glyphRef = useRef(null);

    const isDark = theme === 'dark';
    const typedRole = useTypingEffect(ROLES);
    const clock = useLiveClock();
    const [activeSkillCategory, setActiveSkillCategory] = useState('all');

    const filteredSkills = activeSkillCategory === 'all'
        ? SKILLS
        : SKILLS.filter(s => s.category === activeSkillCategory);

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
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter text-textMain leading-[0.9] portfolio-logo">
                            Yadev<span className="text-primary">.</span>dev
                        </h1>
                        <h2 className="text-xl md:text-2xl font-display text-textMuted mt-6 h-10">
                            {typedRole}<span className="animate-pulse">|</span>
                        </h2>
                        <p className="text-textMuted text-sm md:text-base max-w-lg mt-6 leading-relaxed">
                            Senior Software Engineer at <span className="text-primary font-semibold">Tricog Health</span>, Bangalore. I build production-grade web apps, open-source dev tools, and cloud infrastructure.
                        </p>
                        <div className="flex flex-wrap gap-4 mt-10">
                            <a href="#projects"><NeuButton variant="primary">View My Work</NeuButton></a>
                            <a href="mailto:yadev@example.com"><NeuButton>Say Hello</NeuButton></a>
                        </div>
                        <div className="flex gap-4 mt-8 social-links">
                            <a href="https://github.com/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" icon={<Github size={16} />} /></a>
                            <a href="https://www.linkedin.com/in/yadev-jayachandran/" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" icon={<Linkedin size={16} />} /></a>
                            <a href="https://www.behance.net/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12.5a5 5 0 0 1 5-5h1a5 5 0 0 1 0 10H1V4h6a4 4 0 0 1 0 8" /><path d="M14 13h7" /><path d="M14 8.5h7" /><ellipse cx="17.5" cy="13" rx="3.5" ry="4.5" /></svg>} /></a>
                        </div>
                    </div>

                    {/* Right: Card Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* CARD 1: Quick Navigation (Pressed IN) */}
                        <NeuCard className="!p-5 neu-pressed border-none quick-jump-container relative overflow-hidden">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-4 pb-3 border-b border-border/10">Quick Jump</p>
                            <div className="grid grid-cols-2 gap-3">
                                {NAV_ITEMS.map(item => (
                                    <a key={item.label} href={item.href}
                                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl neu-flat text-textMuted hover:text-primary font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer quick-jump-item">
                                        {item.icon}
                                        <span className="font-semibold">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </NeuCard>

                        {/* CARDS 2a & 2b: Glyph Display (fixed square) + Location (flexible) */}
                        <div className="flex gap-4 md:gap-6">
                            {/* Left: Circular Dot Matrix Display — split layout on mobile */}
                            <NeuCard className="flex-1 md:flex-none !p-3 md:!p-4 flex items-center justify-between md:justify-center overflow-hidden">
                                <div className="shrink-0">
                                    <DotMatrixDisplay 
                                        ref={glyphRef}
                                        tempDisplayValue={tempDisplayValue} 
                                        cameraMode={glyphCameraMode}
                                        setCameraMode={setGlyphCameraMode}
                                        showBuiltinControls={false}
                                    />
                                </div>
                                
                                {/* Mobile-only Controls Subsection */}
                                <div className="md:hidden flex flex-col items-center justify-center gap-4 pl-4 mr-2 border-l border-border/10">
                                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-textMuted/60 leading-none">Controls</span>
                                    
                                    <div className="flex flex-col gap-5 items-center">
                                        {/* Camera Toggle */}
                                        <button 
                                            onClick={() => setGlyphCameraMode(!glyphCameraMode)}
                                            className="p-2.5 rounded-xl neu-flat bg-background transition-all active:scale-95"
                                        >
                                            {glyphCameraMode ? <CameraOff size={16} className="text-primary" /> : <Camera size={16} className="text-textMuted" />}
                                        </button>

                                        {/* Live Indicator / Capture */}
                                        {glyphCameraMode ? (
                                            <button 
                                                onClick={() => glyphRef.current?.captureAndDownload()}
                                                className="flex flex-col items-center gap-1 group"
                                            >
                                                <div className="flex items-center gap-1.5 mb-1 bg-red-500/10 px-2 py-1 rounded-full border border-red-500/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    <span className="font-mono text-[8px] font-bold text-red-500 tracking-tighter uppercase">Live</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl neu-flat bg-background group-active:scale-95 transition-all">
                                                    <Aperture size={16} className="text-primary" />
                                                </div>
                                            </button>
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 opacity-20 filter grayscale">
                                                 <div className="flex items-center gap-1.5 mb-1 px-2 py-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-textMuted" />
                                                    <span className="font-mono text-[8px] font-medium text-textMuted uppercase tracking-tighter">Standby</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl neu-flat bg-background">
                                                    <Aperture size={16} className="text-textMuted" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </NeuCard>
                            
                            {/* Right: Location + Calendar — hidden on mobile */}
                            <NeuCard className="hidden md:flex !p-5 flex-col justify-between flex-1 min-w-0">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-4">Location</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={14} className="text-primary" />
                                    <span className="font-mono text-xs text-textMain">Bangalore, IN</span>
                                </div>

                                {/* Mini Calendar */}
                                <div className="neu-pressed rounded-xl p-3 flex items-center gap-3">
                                    <Calendar size={16} className="text-primary shrink-0 " />
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[10px] text-textMuted uppercase">{dayName}</span>
                                        <span className="font-display text-lg font-bold text-textMain leading-tight">{monthName} {dayNum}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-3">
                                    <Coffee size={12} className="text-textMuted" />
                                    <span className="font-mono text-[10px] text-textMuted uppercase">Open to collab</span>
                                </div>
                            </NeuCard>
                        </div>

                        {/* CARD 3: Remote Control (Car AC style) */}
                        <NeuCard className="!p-4 md:!p-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-4 md:mb-5 pb-3 border-b border-border/30">System Remote</p>

                            {/* Hyper Mode toggle */}
                            <div className="flex items-center justify-between mb-4 border-b border-border/10 pb-4">
                                <div className="flex items-center gap-2">
                                    <Flame size={14} className={isHyperMode ? "text-[#df4418]" : "text-textMuted"} />
                                    <span className="font-mono text-[10px] text-textMuted uppercase tracking-[0.2em]">Hyper Mode</span>
                                </div>
                                <NeuToggle 
                                    checked={isHyperMode}
                                    onChange={toggleHyperMode}
                                />
                            </div>

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
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" />
                    <motion.div variants={stagger} initial="hidden" animate="show" className="flex flex-col gap-8">
                        {JOURNEY.map((node, i) => (
                            <motion.div key={i} variants={fadeUp} className="flex gap-6 items-start">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 relative z-10 ${node.highlight ? 'neu-convex text-primary' : 'neu-flat text-textMuted'}`}>
                                    {node.type === 'job' && <Briefcase size={18} />}
                                    {node.type === 'milestone' && <Award size={18} />}
                                    {node.type === 'education' && <GraduationCap size={18} />}
                                </div>
                                <NeuCard className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                        <h4 className="text-lg font-display font-bold text-textMain">{node.title}</h4>
                                        <span className="font-mono text-xs text-primary">{node.period}</span>
                                    </div>
                                    <p className="text-sm font-semibold text-textMuted mb-1">{node.org}</p>
                                    <p className="text-sm text-textMuted leading-relaxed">{node.description}</p>
                                </NeuCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════ SKILLS ═══════════════ */}
            <section id="skills" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Technical Skills" number={3} />
                <div className="flex flex-wrap gap-3 mb-10">
                    {['all', 'frontend', 'backend', 'database', 'cloud', 'tools'].map(cat => (
                        <button key={cat} onClick={() => setActiveSkillCategory(cat)}
                            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${activeSkillCategory === cat ? 'neu-pressed text-primary' : 'neu-flat text-textMuted hover:text-textMain'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <AnimatePresence mode="wait">
                        {filteredSkills.map(skill => (
                            <motion.div key={skill.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                                <NeuProgress progress={skill.proficiency} label={skill.name} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* ═══════════════ BLOG ═══════════════ */}
            <section id="blog" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Writing" number={4} />
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
                        <h2 className="text-2xl font-display font-bold text-textMain">Yadev<span className="text-primary">.</span>dev</h2>
                        <p className="font-mono text-xs text-textMuted mt-2">Designed & built by Yadev. Powered by curiosity and coffee.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="https://github.com/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton hoverColor="#8B5CF6" icon={<Github size={18} />} /></a>
                        <a href="https://www.linkedin.com/in/yadev-jayachandran/" target="_blank" rel="noopener noreferrer"><NeuIconButton hoverColor="#0A66C2" icon={<Linkedin size={18} />} /></a>
                        <a href="https://www.behance.net/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton hoverColor="#1769FF" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12.5a5 5 0 0 1 5-5h1a5 5 0 0 1 0 10H1V4h6a4 4 0 0 1 0 8" /><path d="M14 13h7" /><path d="M14 8.5h7" /><ellipse cx="17.5" cy="13" rx="3.5" ry="4.5" /></svg>} /></a>
                        <a href="mailto:yadev64@gmail.com" target="_blank" rel="noopener noreferrer">
                            <NeuIconButton hoverColor="#995d5dff" icon={<Mail size={18} />} />
                        </a>                    </div>
                </NeuCard>
            </footer>

        </div>
    );
};

export default NeumorphicDashboard;
