import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuCard, NeuButton, NeuToggle, NeuProgress, NeuLED, NeuIconButton, NeuTempSlider } from '../components/ui/NeumorphicPrimitives';
import { ExternalLink, Github, Linkedin, Twitter, Mail, ChevronDown, ArrowUpRight, BookOpen, Briefcase, GraduationCap, Award, Sun, Moon, Flame, Snowflake, FolderOpen, Layers, MapPin, Clock, Coffee, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

/* ──────────────────────── STATIC DATA ──────────────────────── */
const ROLES = [
    'Senior Software Engineer_',
    'Builder of Tools_',
    'Cloud Architect_',
    'UI Craftsman_',
];

const PROJECTS = [
    {
        title: 'Restaurant OS',
        tagline: 'Full-stack multi-tenant SaaS platform for hotel chain management. Isolated databases, real-time orders, shared billing.',
        tech: ['React', 'Node.js', 'MongoDB', 'Express'],
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=340&fit=crop',
        slug: 'restaurant-os',
    },
    {
        title: 'RequestLab',
        tagline: 'Postman meets diff tool — open-source API testing with visual request comparison.',
        tech: ['React', 'Electron', 'TypeScript'],
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=340&fit=crop',
        slug: 'requestlab',
    },
    {
        title: 'MacBar',
        tagline: 'Aesthetic macOS status bar replacement with customizable Liquid Glass widgets.',
        tech: ['SwiftUI', 'AppKit', 'Combine'],
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=340&fit=crop',
        slug: 'macbar',
    },
    {
        title: 'Portfolio v3',
        tagline: 'This site. Neumorphic design system inspired by Dieter Rams.',
        tech: ['React', 'Tailwind', 'Framer Motion'],
        image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=340&fit=crop',
        slug: 'portfolio-v3',
    },
];

const SKILLS = [
    { name: 'React / Next.js', category: 'frontend', proficiency: 95 },
    { name: 'TypeScript', category: 'frontend', proficiency: 88 },
    { name: 'Tailwind / CSS', category: 'frontend', proficiency: 90 },
    { name: 'Node.js / Express', category: 'backend', proficiency: 85 },
    { name: 'Python', category: 'backend', proficiency: 72 },
    { name: 'MongoDB', category: 'database', proficiency: 88 },
    { name: 'AWS / GCP', category: 'cloud', proficiency: 80 },
    { name: 'Docker / CI-CD', category: 'tools', proficiency: 78 },
    { name: 'Three.js / WebGL', category: 'frontend', proficiency: 75 },
    { name: 'PostgreSQL', category: 'database', proficiency: 70 },
];

const JOURNEY = [
    { type: 'job', title: 'Senior Software Engineer', org: 'Tricog Health', period: '2023 — Present', description: 'Leading frontend architecture and cloud-native tooling for healthcare AI.', highlight: true },
    { type: 'milestone', title: 'Launched RequestLab', org: 'Open Source', period: '2022', description: 'Built and publicly released an API testing tool with visual diffing.', highlight: true },
    { type: 'job', title: 'Full Stack Developer', org: 'Freelance', period: '2021 — 2023', description: 'Shipped 10+ production apps for startups across fintech and e-commerce.', highlight: false },
    { type: 'education', title: 'B.Tech Computer Science', org: 'University', period: '2017 — 2021', description: 'Graduated with specialization in distributed systems and web technologies.', highlight: false },
];

const BLOG_POSTS = [
    { title: 'Why I Ditched 3D for Neumorphism', mood: '💡', readTime: '5 min', excerpt: 'The journey from WebGL chaos to Dieter Rams simplicity.', slug: 'ditched-3d-for-neumorphism' },
    { title: 'Building a Multi-Tenant SaaS from Zero', mood: '🔧', readTime: '12 min', excerpt: 'Architecting Restaurant OS with isolated data and shared billing.', slug: 'multi-tenant-saas' },
    { title: 'The Zustand + TanStack Combo', mood: '⚡', readTime: '4 min', excerpt: 'Why this lightweight pairing beats Redux for 90% of apps.', slug: 'zustand-tanstack' },
];

const NAV_ITEMS = [
    { label: 'Projects', icon: <FolderOpen size={14} />, href: '#projects' },
    { label: 'Experience', icon: <Briefcase size={14} />, href: '#experience' },
    { label: 'Skills', icon: <Layers size={14} />, href: '#skills' },
    { label: 'Blog', icon: <BookOpen size={14} />, href: '#blog' },
];

/* ──────────────────────── DIGIT PATTERNS (5×3 dot matrix) ──────────────────────── */
const DIGIT_MAP = {
    '0': [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
    '1': [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
    '2': [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
    '3': [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    '4': [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
    '5': [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    '6': [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    '7': [1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
    '8': [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1],
    '9': [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    ':': [0, 0, 1, 0, 0, 0, 1, 0, 0],  // special: 3 rows
};

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

/* ──────────────────────── DOT MATRIX DIGIT COMPONENT ──────────────────────── */
const DotDigit = ({ char, dotSize = 6, gap = 2 }) => {
    const pattern = DIGIT_MAP[char];
    if (!pattern) return null;

    // Colon is special: 3 cols = 1, 5 rows but we use fewer cells
    const isColon = char === ':';
    const cols = isColon ? 1 : 3;
    const rows = isColon ? 9 : 5;

    if (isColon) {
        // Custom colon layout: blank, dot, blank, blank, dot, blank (vertical)
        return (
            <div className="flex flex-col items-center justify-center gap-[2px] mx-1" style={{ gap: `${gap}px` }}>
                <div style={{ width: dotSize, height: dotSize }} />
                <div className="rounded-sm bg-primary opacity-90" style={{ width: dotSize, height: dotSize }} />
                <div style={{ width: dotSize, height: dotSize }} />
                <div style={{ width: dotSize, height: dotSize }} />
                <div className="rounded-sm bg-primary opacity-90" style={{ width: dotSize, height: dotSize }} />
            </div>
        );
    }

    return (
        <div
            className="grid"
            style={{
                gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
                gap: `${gap}px`,
            }}
        >
            {pattern.map((on, i) => (
                <div
                    key={i}
                    className="rounded-sm transition-opacity duration-300"
                    style={{
                        width: dotSize,
                        height: dotSize,
                        backgroundColor: on ? 'var(--accent-primary)' : 'var(--bg-primary)',
                        opacity: on ? 0.95 : 0.15,
                        boxShadow: on ? '0 0 4px var(--accent-glow)' : 'none',
                    }}
                />
            ))}
        </div>
    );
};

const DotMatrixClock = () => {
    const clock = useLiveClock();
    const hours = clock.getHours().toString().padStart(2, '0');
    const minutes = clock.getMinutes().toString().padStart(2, '0');
    const seconds = clock.getSeconds().toString().padStart(2, '0');

    // Blink the colon dots every second
    const showColon = clock.getSeconds() % 2 === 0;

    return (
        <div className="flex items-center justify-center gap-[6px]">
            <DotDigit char={hours[0]} />
            <DotDigit char={hours[1]} />
            {showColon && <DotDigit char=":" />}
            {!showColon && <div className="w-[10px]" />}
            <DotDigit char={minutes[0]} />
            <DotDigit char={minutes[1]} />
            <div className="w-1" />
            <div className="flex flex-col items-center gap-[2px] ml-1">
                <DotDigit char={seconds[0]} dotSize={3} gap={1} />
                <DotDigit char={seconds[1]} dotSize={3} gap={1} />
            </div>
        </div>
    );
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
    const { theme, toggleTheme, colorTemp, setColorTemp } = useAppStore();
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
                            <NeuIconButton size="sm" icon={<Github size={16} />} />
                            <NeuIconButton size="sm" icon={<Linkedin size={16} />} />
                            <NeuIconButton size="sm" icon={<Twitter size={16} />} />
                        </div>
                    </div>

                    {/* Right: Card Stack */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* CARD 1: Remote Control (Car AC style) */}
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
                                <Flame size={16} className="text-[#FF4500] shrink-0" />
                                <NeuTempSlider value={colorTemp} onChange={setColorTemp} min={0} max={100} />
                                <Snowflake size={16} className="text-[#0078FF] shrink-0" />
                            </div>

                            {/* PWR LED */}
                            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/30">
                                <NeuLED active color="primary" />
                                <span className="font-mono text-[10px] text-textMuted uppercase tracking-widest">System Online</span>
                            </div>
                        </NeuCard>

                        {/* CARD 2: Quick Navigation */}
                        <NeuCard className="!p-5">
                            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-4 pb-3 border-b border-border/30">Quick Jump</p>
                            <div className="grid grid-cols-2 gap-3">
                                {NAV_ITEMS.map(item => (
                                    <a key={item.label} href={item.href}
                                        className="flex items-center gap-2.5 px-4 py-3 rounded-xl neu-flat text-textMuted hover:text-primary font-mono text-xs uppercase tracking-wider transition-colors duration-200 cursor-pointer">
                                        {item.icon}
                                        {item.label}
                                    </a>
                                ))}
                            </div>
                        </NeuCard>

                        {/* CARDS 3a & 3b: Split — Dot Matrix Clock + Location/Calendar */}
                        <div className="grid grid-cols-2 gap-6">
                            {/* Left: Dot Matrix Clock */}
                            <NeuCard className="!p-5 flex flex-col items-center justify-center">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-4 self-start">Local Time</p>
                                <div className="neu-pressed rounded-xl p-4 w-full flex items-center justify-center">
                                    <DotMatrixClock />
                                </div>
                                <span className="font-mono text-[10px] text-textMuted mt-3 uppercase tracking-widest">IST</span>
                            </NeuCard>

                            {/* Right: Location + Calendar */}
                            <NeuCard className="!p-5 flex flex-col justify-between">
                                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-textMuted mb-4">Location</p>

                                <div className="flex items-center gap-2 mb-4">
                                    <MapPin size={14} className="text-primary" />
                                    <span className="font-mono text-xs text-textMain">Bangalore, IN</span>
                                </div>

                                {/* Mini Calendar */}
                                <div className="neu-pressed rounded-xl p-3 flex items-center gap-3">
                                    <Calendar size={16} className="text-primary shrink-0" />
                                    <div className="flex flex-col">
                                        <span className="font-mono text-[10px] text-textMuted uppercase">{dayName}</span>
                                        <span className="font-display text-lg font-bold text-textMain leading-tight">{monthName} {dayNum}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-3">
                                    <Coffee size={12} className="text-textMuted" />
                                    <span className="font-mono text-[10px] text-textMuted uppercase">Open to collab</span>
                                    <span className="ml-auto text-xs">🟢</span>
                                </div>
                            </NeuCard>
                        </div>
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
                        <p className="font-mono text-xs text-textMuted mt-2">Designed & built by Yadev. Powered by curiosity and Coca-Cola.</p>
                    </div>
                    <div className="flex gap-4">
                        <NeuIconButton icon={<Github size={18} />} />
                        <NeuIconButton icon={<Linkedin size={18} />} />
                        <NeuIconButton icon={<Twitter size={18} />} />
                        <NeuIconButton icon={<Mail size={18} />} />
                    </div>
                </NeuCard>
            </footer>

        </div>
    );
};

export default NeumorphicDashboard;
