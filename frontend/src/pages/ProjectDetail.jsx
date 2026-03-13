import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { MagneticButton } from '../components/ui/MagneticButton'

export const ProjectDetail = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { scrollYProgress } = useScroll()
    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 })

    // Stub data
    const project = {
        _id: "1",
        title: "RequestLab",
        slug: "requestlab",
        tagline: "Postman meets git diff context. Built for robust API testing.",
        description: "<p>A deep dive into why existing API clients fail context awareness and how RequestLab approaches the diffing problem.</p>",
        problem: "<p>Developers hate comparing JSON.</p>",
        solution: "<p>We built a native AST diff engine.</p>",
        tech_stack: ["React", "Node", "Electron"],
        accent_color: "#A26EF7",
        cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop"
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-bg-primary text-text-primary font-body pb-32"
        >
            {/* Reading Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
                style={{ scaleX: pathLength, backgroundColor: project.accent_color }}
            />

            <div className="relative h-[60vh] w-full overflow-hidden flex items-end">
                <img
                    src={project.cover_image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-[120%] object-cover object-bottom"
                    style={{ transform: 'translateY(-10%)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent" />

                <div className="relative z-10 max-w-5xl mx-auto w-full px-4 md:px-20 pb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-text-secondary hover:text-white font-mono text-sm mb-6 flex items-center"
                    >
                        ← Back to Gallery
                    </button>
                    <motion.h1
                        layoutId={`project-${project._id}`}
                        className="text-5xl md:text-7xl font-display font-bold mb-4"
                    >
                        {project.title}
                    </motion.h1>
                    <p className="text-xl md:text-2xl text-text-secondary font-mono max-w-3xl">
                        {project.tagline}
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto w-full px-4 md:px-20 mt-20 grid grid-cols-1 md:grid-cols-3 gap-16">

                <div className="md:col-span-2 prose prose-invert prose-p:text-text-secondary prose-headings:font-display prose-headings:text-text-primary max-w-none">
                    <h2>Overview</h2>
                    <div dangerouslySetInnerHTML={{ __html: project.description }} />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-12">
                        <div className="bg-bg-card p-6 rounded-2xl border border-border">
                            <h3 className="text-accent-primary mt-0">The Problem</h3>
                            <div dangerouslySetInnerHTML={{ __html: project.problem }} />
                        </div>
                        <div className="bg-bg-card p-6 rounded-2xl border border-border">
                            <h3 className="text-accent-secondary mt-0">The Solution</h3>
                            <div dangerouslySetInnerHTML={{ __html: project.solution }} />
                        </div>
                    </div>
                </div>

                <div className="md:col-span-1 space-y-10">
                    <div>
                        <h4 className="font-mono text-sm text-text-secondary uppercase tracking-widest mb-4">Tech Stack</h4>
                        <div className="flex flex-wrap gap-2">
                            {project.tech_stack.map(tech => (
                                <span key={tech} className="px-3 py-1 bg-white/5 border border-border rounded-full text-sm font-mono text-text-primary">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border">
                        <MagneticButton className="w-full text-center" variant="secondary">
                            View Live Demo ↗
                        </MagneticButton>
                        <button className="w-full mt-4 text-text-secondary hover:text-white font-mono text-sm transition-colors">
                            GitHub Repository
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
