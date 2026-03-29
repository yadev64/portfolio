import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Github, ExternalLink } from 'lucide-react';

const HyperDetail = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-[#0a0a0a] overflow-y-auto no-scrollbar"
        >
            {/* Close Controller */}
            <button 
                onClick={onClose}
                className="fixed top-8 right-8 z-[210] p-4 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 hover:bg-[#df4418] transition-all duration-300 group"
            >
                <X size={20} className="text-white group-hover:scale-110 transition-transform" />
            </button>

            <div className="min-h-screen flex flex-col md:flex-row">
                {/* Left: Immersive Visuals */}
                <div className="w-full md:w-1/2 h-[60vh] md:h-screen sticky top-0 bg-[#111] overflow-hidden">
                    <motion.img 
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        src={project.coverImage} 
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                </div>

                {/* Right: Rich Metadata & Content */}
                <div className="flex-1 px-8 md:px-20 py-24 md:py-40 bg-[#0a0a0a]">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="font-mono text-[10px] uppercase tracking-[0.5em] text-[#df4418] mb-8 block">
                            Case Study 0{project._id.split('_')[1] || '1'}
                        </span>
                        
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-none mb-12">
                            {project.title}
                        </h2>

                        <div className="flex flex-wrap gap-4 mb-16">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[10px] uppercase tracking-widest text-white/50">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <p className="text-xl md:text-2xl text-white/40 leading-relaxed mb-20 font-medium">
                            {project.description}
                        </p>

                        {/* Content Placeholder / Real Content */}
                        <div className="space-y-12 mb-20 border-t border-white/5 pt-12">
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#df4418] mb-4">Role</h4>
                                    <p className="text-white/60">Lead Developer / Designer</p>
                                </div>
                                <div>
                                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#df4418] mb-4">Date</h4>
                                    <p className="text-white/60">2026</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            {project.externalLink && (
                                <a 
                                    href={project.externalLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="h-16 px-10 flex items-center justify-center gap-4 bg-[#df4418] text-white rounded-full font-mono text-[10px] uppercase tracking-[0.3em] font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-[#df4418]/20"
                                >
                                    <span>Launch Project</span>
                                    <ArrowRight size={14} />
                                </a>
                            )}
                            <button className="h-16 px-10 flex items-center justify-center gap-4 border border-white/10 text-white/40 rounded-full font-mono text-[10px] uppercase tracking-[0.3em] hover:text-white hover:border-white transition-all">
                                <span>Code Specs</span>
                                <Github size={14} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default HyperDetail;
