import React from 'react';
import { motion } from 'framer-motion';

const HyperHero = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Massive Heading - Inspired by wlt.design */}
            <div className="relative flex flex-col items-center">
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-7xl md:text-[11rem] lg:text-[13rem] font-black tracking-tighter leading-none text-center uppercase mix-blend-difference"
                >
                    YADEV
                </motion.h1>

                {/* Secondary full name + domain tag */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col sm:flex-row items-center gap-4 mt-2 sm:mt-4 mix-blend-difference"
                >
                    <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.25em] text-white/70 uppercase">
                        JAYACHANDRAN
                    </span>
                    <span className="px-3 py-1 text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase rounded border border-[#df4418]/60 bg-[#df4418]/10 text-[#df4418] whitespace-nowrap">
                        .CC
                    </span>
                </motion.div>

                {/* Secondary Tagline */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-6 text-center"
                >
                    <span className="text-xl md:text-3xl font-bold tracking-[0.2em] text-white/20 uppercase">
                        Builder of Systems
                    </span>
                </motion.div>

                {/* Decorative Subline */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 w-full max-w-lg justify-center whitespace-nowrap"
                >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#df4418]">Full-Stack Engineer</span>
                    <div className="w-12 h-[1px] bg-white/20" />
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">UI/UX Craftsman</span>
                </motion.div>
            </div>

            {/* Scroll Prompt */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-12 flex flex-col items-center gap-4"
            >
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-[#df4418] to-transparent" />
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/30">Scroll to Explore</span>
            </motion.div>
        </div>
    );
};

export default HyperHero;
