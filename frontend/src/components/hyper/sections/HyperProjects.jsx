import React from 'react';
import { motion } from 'framer-motion';
import PROJECTS_DATA from '../../../data/projects.json';

const PALETTE = {
    orange: '#df4418',
    charcoal: '#101010',
    cream: '#f8f8f8',
};

const HyperProjects = ({ onProjectClick }) => {
    return (
        <div className="px-6 md:px-20 py-20 relative z-10 overflow-hidden">
            {/* Section Header */}
            <div className="mb-24 md:mb-32">
                <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#df4418] mb-6 block"
                >
                    Case Studies
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]"
                >
                    Real-World <br />
                    <span className="text-white/10 outline-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.1)', color: 'transparent' }}>Impact</span>
                </motion.h2>
            </div>

            {/* High-End List Layout */}
            <div className="flex flex-col border-t border-white/10">
                {PROJECTS_DATA.map((project, i) => (
                    <motion.div 
                        key={project._id}
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        onClick={() => onProjectClick?.(project)}
                        className="group relative border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between py-12 md:py-24 cursor-pointer hover:bg-white/[0.02] transition-all duration-500 overflow-visible"
                    >
                        {/* Title & Metadata */}
                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-6 mb-4">
                                <span className="font-mono text-[10px] text-white/20">0{i + 1}</span>
                                <div className="flex gap-2">
                                    {project.tags.slice(0, 2).map(tag => (
                                        <span key={tag} className="font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 border border-white/10 text-white/40">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-4xl md:text-8xl font-bold tracking-tighter uppercase leading-none transition-all duration-500 group-hover:translate-x-4 group-hover:text-[#df4418]">
                                {project.title}
                            </h3>
                        </div>

                        {/* Short Snippet */}
                        <div className="mt-8 md:mt-0 md:max-w-[30%] relative z-10">
                            <p className="text-white/30 text-xs md:text-sm font-medium leading-relaxed group-hover:text-white/70 transition-colors duration-500 uppercase tracking-wide">
                                {project.description}
                            </p>
                        </div>

                        {/* Hover Reveal Image - Absolute Layer */}
                        <div className="absolute left-[40%] top-1/2 -translate-y-1/2 w-48 h-64 md:w-72 md:h-96 pointer-events-none z-0 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 blur-xl group-hover:blur-0 transition-all duration-700 ease-[0.23,1,0.32,1]">
                            <img 
                                src={project.coverImage} 
                                alt={project.title}
                                className="w-full h-full object-cover rounded-2xl shadow-2xl grayscale-[0.6] group-hover:grayscale-0 transition-all duration-700"
                            />
                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border border-[#df4418]/30 rounded-2xl translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-700" />
                        </div>

                        {/* Arrow Indicator */}
                        <div className="hidden md:flex ml-8 opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 transition-all duration-500">
                             <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#df4418" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                             </svg>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Interactive "More" Button */}
            <div className="mt-20 flex justify-center">
                 <button className="px-12 py-5 rounded-full border border-white/10 hover:border-[#df4418] hover:text-[#df4418] transition-all duration-500 font-mono text-xs uppercase tracking-[0.3em] group relative overflow-hidden">
                    <span className="relative z-10">View Archive</span>
                    <div className="absolute inset-0 bg-[#df4418] translate-y-full group-hover:translate-y-0 transition-transform duration-500 -z-0" />
                 </button>
            </div>
        </div>
    );
};

export default HyperProjects;
