import React from 'react'
import { motion } from 'framer-motion'
import SKILLS_DATA from '../../data/skills.json'

export const SkillsSection = () => {
    // Group skills by category from resume
    const grouped = SKILLS_DATA.reduce((acc, skill) => {
        const cat = skill.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});

    return (
        <section id="skills" className="min-h-full py-16 px-4 md:px-12 relative bg-bg-secondary/50 border-t border-b border-border">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-3">
                        Technical <span className="text-accent-primary italic">Skills</span>
                    </h2>
                    <p className="text-text-secondary font-mono text-sm">Directly aligned with resume across core disciplines.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(grouped).map(([category, items], idx) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08, duration: 0.4 }}
                            className="p-6 rounded-2xl bg-bg-card border border-border flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/50">
                                    <h3 className="font-mono text-xs uppercase tracking-wider text-accent-primary font-bold">
                                        {category}
                                    </h3>
                                    <span className="text-[10px] font-mono text-text-secondary px-2 py-0.5 rounded-full bg-bg-secondary border border-border">
                                        {items.length} tags
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {items.map(skill => (
                                        <span
                                            key={skill._id || skill.name}
                                            className="px-3 py-1.5 rounded-xl bg-bg-secondary border border-border text-xs font-mono text-text-primary hover:border-accent-primary transition-colors cursor-default"
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
