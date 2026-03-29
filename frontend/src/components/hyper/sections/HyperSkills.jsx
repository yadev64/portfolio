import React from 'react';
import { motion } from 'framer-motion';

const SKILLS = [
    { category: "Architect", items: ["System Design", "Microservices", "Cloud Native"] },
    { category: "Frontend", items: ["React", "Three.js", "GSAP", "Tailwind"] },
    { category: "Backend", items: ["Node.js", "Go", "PostgreSQL", "Redis"] },
    { category: "DevOps", items: ["Docker", "K8s", "AWS", "CI/CD"] }
];

const HyperSkills = () => {
    return (
        <div className="px-6 md:px-20 py-32 relative z-10 w-full overflow-hidden">
            <div className="mb-24">
                <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#df4418] mb-6 block"
                >
                    Expertise
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8] mb-12"
                >
                    Technological <br />
                    <span className="text-white/5 outline-text">Mastery</span>
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-white/5 pt-12">
                {SKILLS.map((skill, i) => (
                    <motion.div 
                        key={skill.category}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="group"
                    >
                        <h3 className="text-xs font-mono uppercase tracking-[0.3em] text-[#df4418] mb-8 flex items-center gap-3">
                            <div className="w-1 h-1 bg-[#df4418] rounded-full" />
                            {skill.category}
                        </h3>
                        <div className="space-y-4">
                            {skill.items.map((item, j) => (
                                <motion.div 
                                    key={item}
                                    whileHover={{ x: 10, color: '#df4418' }}
                                    className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-white/40 cursor-default transition-all duration-300"
                                >
                                    {item}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Decorative 3D Wireframe Overlay */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 opacity-10 pointer-events-none -z-10 blur-3xl rounded-full bg-[#df4418]" />
        </div>
    );
};

export default HyperSkills;
