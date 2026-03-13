import React from 'react'
import { motion } from 'framer-motion'
import { TiltCard } from '../ui/TiltCard'

// Mock data until API is wired
const MOCK_PROJECTS = [
    {
        _id: "1",
        title: "RequestLab",
        slug: "requestlab",
        tagline: "Postman meets git diff context. Built for robust API testing.",
        tech_stack: ["React", "Node", "Electron"],
        accent_color: "#A26EF7",
        cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop",
        featured: true
    },
    {
        _id: "2",
        title: "Tricog Health Platform",
        slug: "tricog-platform",
        tagline: "Cloud infra scale out for millions of ECG reads.",
        tech_stack: ["AWS", "Python", "MongoDB"],
        accent_color: "#6EF7C4",
        cover_image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1528&auto=format&fit=crop",
    },
    {
        _id: "3",
        title: "FinDash",
        slug: "findash",
        tagline: "Personal finance aggregator with real-time Plaid sync.",
        tech_stack: ["Next.js", "Plaid API", "Tailwind"],
        accent_color: "#F7A26E",
        cover_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop",
    }
]

export const ProjectsSection = () => {
    return (
        <section id="projects" className="min-h-full py-12 px-4 md:px-10 lg:px-12 relative z-10">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="mb-16 flex items-end justify-between"
                >
                    <div>
                        <h2 className="text-5xl md:text-7xl font-display font-bold text-text-primary mb-4">
                            Selected <span className="italic text-accent-tertiary">Works</span>
                        </h2>
                        <p className="text-text-secondary font-mono max-w-md">
                            A collection of tools, platforms, and experiments. Built for scale and aesthetic.
                        </p>
                    </div>
                    <div className="hidden md:block">
                        <button className="text-accent-primary border-b border-accent-primary pb-1 font-mono hover:text-white transition-colors">
                            View Archive ↗
                        </button>
                    </div>
                </motion.div>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6 auto-rows-[400px]">
                    {MOCK_PROJECTS.map((project, idx) => {
                        // Asymmetric layout rules based on index or featured flag
                        let colSpanClasses = "md:col-span-6 lg:col-span-4"
                        if (idx === 0) colSpanClasses = "md:col-span-6 lg:col-span-8" // large featured
                        if (idx === 1) colSpanClasses = "md:col-span-6 lg:col-span-4"
                        if (idx === 2) colSpanClasses = "md:col-span-12 lg:col-span-12" // full width flat

                        return (
                            <motion.div
                                key={project._id}
                                className={`${colSpanClasses}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                            >
                                <TiltCard project={project} layoutId={`project-${project._id}`} />
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
