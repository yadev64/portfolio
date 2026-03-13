import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const MOCK_SKILLS = {
    frontend: [
        { id: 'react', name: 'React', prof: 95 },
        { id: 'three', name: 'Three.js', prof: 75, parent: 'react' },
        { id: 'tailwind', name: 'Tailwind', prof: 90, parent: 'react' },
    ],
    backend: [
        { id: 'node', name: 'Node.js', prof: 85 },
        { id: 'hono', name: 'Hono', prof: 80, parent: 'node' },
        { id: 'python', name: 'Python', prof: 85 },
    ],
    cloud: [
        { id: 'aws', name: 'AWS', prof: 80 },
        { id: 'gcp', name: 'GCP', prof: 70 },
    ],
    database: [
        { id: 'mongo', name: 'MongoDB', prof: 90 },
        { id: 'redis', name: 'Redis', prof: 80 },
    ]
}

const SkillNode = ({ skill, index, categoryColor }) => {
    return (
        <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.1 }}
            className="relative group cursor-pointer"
        >
            <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-border bg-bg-card flex items-center justify-center relative z-10 overflow-hidden shadow-xl`}>
                {/* Proficiency Fill */}
                <div
                    className="absolute bottom-0 left-0 w-full opacity-20 transition-all duration-500"
                    style={{ height: `${skill.prof}%`, backgroundColor: categoryColor }}
                />
                <span className="font-mono text-sm md:text-base font-bold text-text-primary z-10">{skill.name}</span>
            </div>

            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-bg-secondary border border-border px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-20">
                <span className="text-xs font-mono text-text-secondary">Level: {skill.prof}%</span>
                {/* We can add the fun one-liner here from DB later */}
            </div>
        </motion.div>
    )
}

const SkillBranch = ({ title, skills, color }) => {
    return (
        <div className="flex flex-col items-center">
            <h3 className="text-2xl font-display font-bold mb-8" style={{ color }}>{title}</h3>
            <div className="flex flex-wrap justify-center gap-6 relative">
                {/* In a real D3 tree we would calculate exact line paths. Here we use a stylized flex layout that implies grouping. */}
                {skills.map((skill, idx) => (
                    <SkillNode key={skill.id} skill={skill} index={idx} categoryColor={color} />
                ))}
            </div>
        </div>
    )
}

export const SkillsSection = () => {
    return (
        <section id="skills" className="min-h-full py-12 px-4 md:px-12 relative bg-bg-secondary/50 border-t border-b border-border">
            <div className="max-w-7xl mx-auto">

                <div className="text-center mb-20">
                    <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-4">
                        Tech <span className="text-accent-primary italic">Skill Tree</span>
                    </h2>
                    <p className="text-text-secondary font-mono">Proficiency mapping across the stack.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    <SkillBranch title="Frontend" skills={MOCK_SKILLS.frontend} color="var(--accent-primary)" />
                    <SkillBranch title="Backend" skills={MOCK_SKILLS.backend} color="var(--accent-secondary)" />
                    <SkillBranch title="Cloud & Infra" skills={MOCK_SKILLS.cloud} color="var(--accent-tertiary)" />
                    <SkillBranch title="Databases" skills={MOCK_SKILLS.database} color="#F0EFE8" />
                </div>

            </div>
        </section>
    )
}
