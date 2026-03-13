import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NeuCard, NeuButton, NeuToggle, NeuProgress, NeuLED, NeuIconButton } from '../components/ui/NeumorphicPrimitives';
import { Terminal, Code, Cpu, Zap, Layout, ExternalLink, Github, Linkedin, Twitter, Mail, ChevronDown, ArrowUpRight, BookOpen, Image as ImageIcon, Briefcase, GraduationCap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAppStore from '../store/useAppStore';

/* ──────────────────────── STATIC DATA ──────────────────────── */
const ROLES = [
    'Senior Software Engineer_',
    'Builder of Tools_',
    'Debugging the World_',
    'Cloud Architect_',
    'UI Craftsman_',
];

const TERMINAL_LINES = [
    { prompt: '> whoami', response: 'Yadev — Senior SWE @ Tricog Health, Bangalore' },
    { prompt: '> interests', response: '["developer tooling", "cloud infra", "building companies", "motorcycles"]' },
    { prompt: '> currently_building', response: 'RequestLab — Postman × diff tool × open source' },
    { prompt: '> stack', response: 'GCP | AWS | React | Node | MongoDB | Python' },
    { prompt: '> fun_fact', response: 'Rides a Royal Enfield Interceptor 650. Will talk about it unprompted.' },
];

const PROJECTS = [
    { title: 'Restaurant OS', tagline: 'Full-stack multi-tenant SaaS platform for hotel management.', tech: ['React', 'Node.js', 'MongoDB', 'Express'], featured: true, accent: '#FF4500', slug: 'restaurant-os' },
    { title: 'RequestLab', tagline: 'Postman meets diff tool — open source API testing.', tech: ['React', 'Electron', 'TypeScript'], featured: true, accent: '#00E5FF', slug: 'requestlab' },
    { title: 'MacBar', tagline: 'Aesthetic macOS status bar replacement with widgets.', tech: ['SwiftUI', 'AppKit', 'Combine'], featured: false, accent: '#A855F7', slug: 'macbar' },
    { title: 'Portfolio v3', tagline: 'This site. Neumorphic Dieter Rams aesthetic.', tech: ['React', 'Tailwind', 'Framer Motion'], featured: false, accent: '#F59E0B', slug: 'portfolio-v3' },
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
    { type: 'job', title: 'Senior Software Engineer', org: 'Tricog Health', period: '2023 — Present', highlight: true },
    { type: 'job', title: 'Full Stack Developer', org: 'Freelance', period: '2021 — 2023', highlight: false },
    { type: 'milestone', title: 'Launched RequestLab', org: 'Open Source', period: '2022', highlight: true },
    { type: 'education', title: 'B.Tech Computer Science', org: 'University', period: '2017 — 2021', highlight: false },
];

const BLOG_POSTS = [
    { title: 'Why I Ditched 3D for Neumorphism', mood: '💡', readTime: '5 min', excerpt: 'The journey from WebGL chaos to Dieter Rams simplicity.', slug: 'ditched-3d-for-neumorphism' },
    { title: 'Building a Multi-Tenant SaaS from Zero', mood: '🔧', readTime: '12 min', excerpt: 'Architecting Restaurant OS with isolated data and shared billing.', slug: 'multi-tenant-saas' },
    { title: 'The Zustand + TanStack Combo', mood: '⚡', readTime: '4 min', excerpt: 'Why this lightweight pairing beats Redux for 90% of apps.', slug: 'zustand-tanstack' },
];

/* ──────────────────────── TYPING HOOK ──────────────────────── */
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

/* ──────────────────────── TERMINAL COMPONENT ──────────────────────── */
const NeuTerminal = () => {
    const [visibleLines, setVisibleLines] = useState(0);

    useEffect(() => {
        if (visibleLines < TERMINAL_LINES.length) {
            const timer = setTimeout(() => setVisibleLines(v => v + 1), 600);
            return () => clearTimeout(timer);
        }
    }, [visibleLines]);

    return (
        <div className="neu-pressed p-5 md:p-6 font-mono text-xs md:text-sm leading-relaxed overflow-hidden">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/30">
                <div className="w-3 h-3 rounded-full bg-primary opacity-80" />
                <div className="w-3 h-3 rounded-full bg-secondary opacity-60" />
                <div className="w-3 h-3 rounded-full bg-tertiary opacity-40" />
                <span className="ml-3 text-textMuted text-[10px] uppercase tracking-widest">yadev@system ~</span>
            </div>
            {TERMINAL_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                    <p className="text-primary">{line.prompt}</p>
                    <p className="text-textMuted mb-3 pl-2">{line.response}</p>
                </motion.div>
            ))}
            <span className="inline-block w-2 h-4 bg-primary animate-pulse" />
        </div>
    );
};

/* ──────────────────────── SECTION HEADER ──────────────────────── */
const SectionHeader = ({ label, number }) => (
    <div className="flex items-center gap-4 mb-10">
        <span className="font-mono text-[10px] text-primary opacity-60">0{number}</span>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted">{label}</p>
        <div className="flex-1 h-px bg-border/50" />
    </div>
);

/* ──────────────────────── MAIN DASHBOARD ──────────────────────── */
const NeumorphicDashboard = () => {
    const [systemPower, setSystemPower] = useState(true);
    const { theme, toggleTheme } = useAppStore();
    const isDark = theme === 'dark';
    const typedRole = useTypingEffect(ROLES);
    const [activeSkillCategory, setActiveSkillCategory] = useState('all');

    const filteredSkills = activeSkillCategory === 'all'
        ? SKILLS
        : SKILLS.filter(s => s.category === activeSkillCategory);

    const stagger = {
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } }
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-background text-textMain font-body selection:bg-primary selection:text-white">

            {/* ═══════ HERO SECTION ═══════ */}
            <section className="min-h-screen flex flex-col justify-center relative px-6 md:px-16 lg:px-24 py-20">
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-[1600px] mx-auto w-full">

                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-4">Identity Matrix</p>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-tighter text-textMain leading-[0.9]">
                                Yadev<span className="text-primary">.</span>dev
                            </h1>
                        </div>
                        <div className="flex gap-6 items-start">
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={toggleTheme}
                                    className={`w-12 h-16 rounded-xl flex flex-col items-center justify-between p-2 pb-3 transition-all duration-300 cursor-pointer ${isDark ? 'neu-pressed' : 'neu-flat'}`}
                                >
                                    <div className={`w-full h-1/2 rounded-md transition-colors duration-300 ${!isDark ? 'bg-primary shadow-neu-glow' : 'bg-transparent'}`} />
                                    <div className={`w-full h-1/2 rounded-md transition-colors duration-300 ${isDark ? 'bg-primary shadow-neu-glow' : 'bg-transparent'}`} />
                                </button>
                                <span className="font-mono text-[10px] uppercase text-textMuted">{isDark ? 'DARK' : 'LIGHT'}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <NeuLED active={systemPower} color="primary" />
                                <span className="font-mono text-[10px] uppercase text-textMuted">PWR</span>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-xl md:text-3xl font-display text-textMuted mt-4 h-10">
                        {typedRole}<span className="animate-pulse">|</span>
                    </h2>

                    <div className="flex flex-wrap gap-4 mt-12">
                        <a href="#projects"><NeuButton variant="primary">View My Work</NeuButton></a>
                        <a href="mailto:yadev@example.com"><NeuButton>Say Hello</NeuButton></a>
                    </div>

                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
                        <ChevronDown className="text-textMuted" size={24} />
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════ ABOUT SECTION ═══════ */}
            <section id="about" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="System Identity" number={1} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <NeuCard>
                        <NeuTerminal />
                    </NeuCard>
                    <NeuCard className="flex flex-col justify-between">
                        <div>
                            <h3 className="text-3xl font-display font-bold text-textMain mb-4">About the Operator</h3>
                            <p className="text-textMuted leading-relaxed mb-6">
                                Senior Software Engineer based in Bangalore, India. I specialize in building production-grade web applications with modern frameworks such as React, Node, and cloud-native infrastructure on AWS and GCP. Every line of code I write is in service of elegance, performance, and user delight.
                            </p>
                            <p className="text-textMuted leading-relaxed">
                                When I'm not shipping code, I'm out riding my Royal Enfield Interceptor 650 through the Western Ghats, or tinkering with open source developer tools.
                            </p>
                        </div>
                        <div className="flex gap-4 mt-8">
                            <NeuIconButton icon={<Github size={18} />} />
                            <NeuIconButton icon={<Linkedin size={18} />} />
                            <NeuIconButton icon={<Twitter size={18} />} />
                            <NeuIconButton icon={<Mail size={18} />} />
                        </div>
                    </NeuCard>
                </div>
            </section>

            {/* ═══════ PROJECTS SECTION ═══════ */}
            <section id="projects" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Active Directives" number={2} />
                <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {PROJECTS.map((project, i) => (
                        <motion.div key={project.slug} variants={fadeUp} className={project.featured ? 'md:col-span-1' : ''}>
                            <Link to={`/projects/${project.slug}`}>
                                <NeuCard className="group cursor-pointer hover:shadow-neu-glow transition-shadow duration-500 h-full flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <NeuLED active color="primary" />
                                            <ArrowUpRight size={18} className="text-textMuted group-hover:text-primary transition-colors" />
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-textMain mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                        <p className="text-sm text-textMuted leading-relaxed">{project.tagline}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {project.tech.map(t => (
                                            <span key={t} className="text-[10px] font-mono uppercase px-3 py-1.5 rounded-full neu-pressed tracking-widest text-textMuted">{t}</span>
                                        ))}
                                    </div>
                                </NeuCard>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════ SKILLS SECTION ═══════ */}
            <section id="skills" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Technical Arsenal" number={3} />

                <div className="flex flex-wrap gap-3 mb-10">
                    {['all', 'frontend', 'backend', 'database', 'cloud', 'tools'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveSkillCategory(cat)}
                            className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer ${activeSkillCategory === cat ? 'neu-pressed text-primary' : 'neu-flat text-textMuted hover:text-textMain'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <AnimatePresence mode="wait">
                        {filteredSkills.map(skill => (
                            <motion.div key={skill.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                                <NeuProgress progress={skill.proficiency} label={skill.name} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* ═══════ JOURNEY SECTION ═══════ */}
            <section id="journey" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Mission Timeline" number={4} />
                <div className="relative">
                    {/* Vertical line */}
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
                                    <p className="text-sm text-textMuted">{node.org}</p>
                                </NeuCard>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════ BLOG SECTION ═══════ */}
            <section id="blog" className="px-6 md:px-16 lg:px-24 py-20 max-w-[1600px] mx-auto">
                <SectionHeader label="Transmissions" number={5} />
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
                                        <span>Read Transmission</span>
                                    </div>
                                </NeuCard>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer className="px-6 md:px-16 lg:px-24 py-16 max-w-[1600px] mx-auto">
                <NeuCard className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-textMain">Yadev<span className="text-primary">.</span>dev</h2>
                        <p className="font-mono text-xs text-textMuted mt-2">Built by Yadev. Powered by curiosity and too much Coca-Cola.</p>
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
