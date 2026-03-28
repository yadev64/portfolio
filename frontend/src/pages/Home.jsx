import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuCard, NeuButton, NeuToggle, NeuProgress, NeuLED, NeuIconButton, NeuTempSlider } from '../components/ui/NeumorphicPrimitives';
import DotMatrixDisplay from '../components/ui/DotMatrixDisplay';
import { ExternalLink, Github, Linkedin, Mail, ChevronDown, ArrowUpRight, BookOpen, Briefcase, GraduationCap, Award, Sun, Moon, Flame, Snowflake, FolderOpen, Layers, MapPin, Clock, Coffee, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
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

/* ══════════════════════════════════════════════════════════════
   MAIN DASHBOARD
   ══════════════════════════════════════════════════════════════ */
const NeumorphicDashboard = () => {
    const { theme, toggleTheme, colorTemp, setColorTempLive, tempDisplayValue } = useAppStore();
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

    return (
        <div className="min-h-screen bg-background text-textMain font-body selection:bg-primary selection:text-white">

            {/* ═══════════════ HERO SECTION ═══════════════ */}
            <section className="min-h-screen flex items-center relative px-6 md:px-16 lg:px-24 py-20">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

                    {/* Left: Identity */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-4">Identity Matrix</p>
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter text-textMain leading-[0.9]">
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
                        <div className="flex gap-4 mt-8">
                            <a href="https://github.com/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" hoverColor="#c54af9ff" icon={<Github size={16} />} /></a>
                            <a href="https://www.linkedin.com/in/yadev-jayachandran/" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" hoverColor="#0077ffff" icon={<Linkedin size={16} />} /></a>
                            <a href="https://www.behance.net/yadev64" target="_blank" rel="noopener noreferrer"><NeuIconButton size="sm" hoverColor="#1769FF" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12.5a5 5 0 0 1 5-5h1a5 5 0 0 1 0 10H1V4h6a4 4 0 0 1 0 8" /><path d="M14 13h7" /><path d="M14 8.5h7" /><ellipse cx="17.5" cy="13" rx="3.5" ry="4.5" /></svg>} /></a>
                        </div>
                    </div>

                    {/* Right: Card Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* CARD 1: Quick Navigation (Pressed IN) */}
                        <NeuCard className="!p-5 neu-pressed border-none">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold mb-4 pb-3 border-b border-border/10">Quick Jump</p>
                            <div className="grid grid-cols-2 gap-3">
                                {NAV_ITEMS.map(item => (
                                    <a key={item.label} href={item.href}
                                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl neu-flat text-textMuted hover:text-primary font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer">
                                        {item.icon}
                                        <span className="font-semibold">{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </NeuCard>

                        {/* CARDS 2a & 2b: Glyph Display (fixed square) + Location (flexible) */}
                        <div className="flex gap-6">
                            {/* Left: Circular Dot Matrix Display — fixed size, stays square */}
                            <NeuCard className="!p-4 flex items-center justify-center shrink-0">
                                <DotMatrixDisplay tempDisplayValue={tempDisplayValue} />
                            </NeuCard>

                            {/* Right: Location + Calendar — fills remaining space */}
                            <NeuCard className="!p-5 flex flex-col justify-between flex-1 min-w-0">
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
                                    {/* <span className="ml-auto text-xs">🟢</span> */}
                                </div>
                            </NeuCard>
                        </div>

                        {/* CARD 3: Remote Control (Car AC style) */}
                        <NeuCard className="!p-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-5 pb-3 border-b border-border/30">System Remote</p>

                            {/* Dark / Light switch */}
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    {isDark ? <Moon size={14} className="text-textMuted" /> : <Sun size={14} className="text-primary" />}
                                    <span className="font-mono text-xs text-textMuted uppercase">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
                                </div>
                                <NeuToggle checked={!isDark} onChange={() => toggleTheme()} />
                            </div>

                            {/* Temperature slider — Car AC style */}
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-xs text-textMuted uppercase">Ambient</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Snowflake size={16} className="text-[#0078FF] shrink-0" />
                                <NeuTempSlider value={colorTemp} onChange={setColorTempLive} min={0} max={100} />
                                <Flame size={16} className="text-[#FF4500] shrink-0" />
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
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {PROJECTS.map((project) => (
                        <motion.div key={project.slug} variants={fadeUp}>
                            <Link to={`/projects/${project.slug}`}>
                                <NeuCard className="group cursor-pointer hover:shadow-neu-glow transition-shadow duration-500 h-full flex flex-col !p-0 overflow-hidden">
                                    <div className="w-full h-48 overflow-hidden relative">
                                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                                        <div className="absolute top-4 right-4">
                                            <ArrowUpRight size={18} className="text-white/60 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <NeuLED active color="primary" />
                                            <span className="font-mono text-[10px] text-textMuted uppercase">Active</span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-textMain mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                        <p className="text-sm text-textMuted leading-relaxed flex-1">{project.tagline}</p>
                                        <div className="flex flex-wrap gap-2 mt-5">
                                            {project.tech.map(t => (
                                                <span key={t} className="text-[10px] font-mono uppercase px-3 py-1.5 rounded-full neu-pressed tracking-widest text-textMuted">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </NeuCard>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════════════ EXPERIENCE ═══════════════ */}
            <section id="experience" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Experience" number={2} />
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" />
                    <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="flex flex-col gap-8">
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
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {BLOG_POSTS.map(post => (
                        <motion.div key={post.slug} variants={fadeUp}>
                            <Link to={`/blog/${post.slug}`}>
                                <NeuCard className="group cursor-pointer hover:shadow-neu-glow transition-shadow duration-500 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-2xl">{post.mood}</span>
                                            <span className="font-mono text-[10px] text-textMuted uppercase">{post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-textMain mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                                        <p className="text-sm text-textMuted leading-relaxed">{post.excerpt}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-6 text-primary font-mono text-xs uppercase tracking-widest">
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
