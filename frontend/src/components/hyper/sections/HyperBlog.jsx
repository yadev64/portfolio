import React from 'react';
import { motion } from 'framer-motion';
import BLOG_DATA from '../../../data/writing.json';

const HyperBlog = () => {
    return (
        <div className="px-6 md:px-20 py-32 relative z-10">
            {/* Section Heading - Right Aligned for dynamic flow */}
            <div className="mb-24 text-right">
                <motion.span 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#df4418] mb-6 block"
                >
                    Thinking
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-6xl md:text-[10rem] font-black tracking-tighter uppercase leading-[0.8]"
                >
                    Journal <br />
                    <span className="text-white/5 outline-text" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)', color: 'transparent' }}>Archive</span>
                </motion.h2>
            </div>

            {/* Typography-heavy Blog List */}
            <div className="space-y-0 border-t border-white/5">
                {BLOG_DATA.slice(0, 5).map((post, i) => (
                    <motion.div 
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="group border-b border-white/5 py-16 md:py-24 flex flex-col md:flex-row md:items-end justify-between hover:bg-white/[0.01] transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-6 mb-6 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                                <span className="text-[#df4418]">{post.date}</span>
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <span>{post.readTime}</span>
                            </div>
                            <h3 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight uppercase group-hover:text-[#df4418] transition-all duration-500 group-hover:translate-x-4">
                                {post.title}
                            </h3>
                            <p className="mt-6 text-white/20 text-sm md:text-base font-medium uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                                {post.subtitle || "Deep dive into system architecture and design principles."}
                            </p>
                        </div>
                        
                        <div className="mt-12 md:mt-0 flex items-center gap-8 relative z-10">
                            <div className="hidden md:block w-32 h-[1px] bg-white/10 group-hover:bg-[#df4418] group-hover:w-48 transition-all duration-700 ease-out" />
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 group-hover:text-white/80 transition-colors">
                                    Navigate
                                </span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:translate-x-2 transition-transform duration-500">
                                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#df4418" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        </div>

                        {/* Background Hover Text Effect */}
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20rem] font-black text-white/[0.01] pointer-events-none select-none -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                            {post.mood || i + 1}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Call to action */}
            <div className="mt-32 border-t border-white/5 pt-20 flex flex-col md:flex-row items-center justify-between gap-12">
                <p className="text-white/30 font-mono text-xs uppercase tracking-[0.2em] max-w-sm text-center md:text-left">
                    Regularly documenting the intersection of software engineering and visual arts.
                </p>
                <button className="h-16 px-12 border border-[#df4418] rounded-full text-[#df4418] font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-[#df4418] hover:text-white transition-all duration-500">
                    Enter Archive
                </button>
            </div>
        </div>
    );
};

export default HyperBlog;
