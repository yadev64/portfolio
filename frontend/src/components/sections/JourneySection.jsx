import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const MOCK_JOURNEY = [
    {
        _id: "1",
        type: "job",
        title: "Senior Software Engineer",
        organization: "Tricog Health",
        start_date: "2023-01-01",
        is_current: true,
        description: "Leading the core platform team. Scaling infra for millions of ECG analyses.",
        tech_stack: ["Python", "AWS", "React"]
    },
    {
        _id: "2",
        type: "job",
        title: "Software Engineer",
        organization: "Tricog Health",
        start_date: "2020-05-01",
        end_date: "2022-12-31",
        description: "Built the internal dashboard. Optimized MongoDB queries.",
        tech_stack: ["Node", "MongoDB", "Angular"]
    },
    {
        _id: "3",
        type: "milestone",
        title: "Launched RequestLab",
        organization: "Open Source",
        start_date: "2022-08-01",
        description: "Created an open source API testing client with built-in diffing tools.",
        tech_stack: ["Electron", "React", "Rust"]
    }
]

export const JourneySection = () => {
    return (
        <section id="journey" className="min-h-full py-12 px-4 md:px-12 relative">
            <div className="max-w-5xl mx-auto">

                <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-20">
                    Career <span className="text-accent-secondary italic">Timeline</span>
                </h2>

                <div className="relative border-l border-border ml-6 md:ml-10">
                    {MOCK_JOURNEY.map((node, idx) => {
                        const isMilestone = node.type === 'milestone'

                        return (
                            <motion.div
                                key={node._id}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                className="mb-16 pl-10 md:pl-16 relative group"
                            >
                                {/* Timeline Dot */}
                                <span className={`absolute -left-3 top-1 flex h-6 w-6 rounded-full bg-bg-card border-2 ${isMilestone ? 'border-accent-tertiary' : 'border-accent-primary'} ring-4 ring-bg-primary transition-transform duration-300 group-hover:scale-125`} />

                                <div className="flex flex-col md:flex-row md:items-baseline mb-2">
                                    <h3 className="text-2xl font-display font-bold text-text-primary mr-4">
                                        {node.title}
                                    </h3>
                                    <span className={`text-sm font-mono ${isMilestone ? 'text-accent-tertiary' : 'text-accent-primary'} uppercase tracking-widest`}>
                                        @ {node.organization}
                                    </span>
                                </div>

                                <div className="text-sm font-mono text-text-secondary mb-4 opacity-70">
                                    {format(new Date(node.start_date), 'MMM yyyy')}{node.is_current ? ' - PRESENT' : node.end_date ? ` - ${format(new Date(node.end_date), 'MMM yyyy')}` : ''}
                                </div>

                                <p className="text-text-secondary font-body mb-4 max-w-2xl leading-relaxed">
                                    {node.description}
                                </p>

                                <div className="flex gap-2 flex-wrap">
                                    {node.tech_stack.map(tech => (
                                        <span key={tech} className="text-xs font-mono px-2 py-1 rounded-md bg-white/5 text-text-secondary border border-border">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
