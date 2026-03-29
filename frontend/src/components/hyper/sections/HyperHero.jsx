import React from 'react';
import { motion } from 'framer-motion';

const HyperHero = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Massive Heading - Inspired by wlt.design */}
            <div className="relative">
                <motion.h1 
                    initial={{ opacity: 0, scale: 0.8, y: 100 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="text-8xl md:text-[16rem] font-black tracking-tighter leading-none text-center uppercase mix-blend-difference"
                >
                    YADEV<span style={{ color: '#df4418' }}>.DEV</span>
                </motion.h1>

                {/* Secondary Tagline */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-4 text-center"
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
                    className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-8 w-full max-w-lg justify-center whitespace-nowrap"
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
