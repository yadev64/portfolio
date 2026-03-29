import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import useAppStore from '../../store/useAppStore';
import HyperScene from './HyperScene';
import HyperHero from './sections/HyperHero';
import HyperProjects from './sections/HyperProjects';
import HyperSkills from './sections/HyperSkills';
import HyperBlog from './sections/HyperBlog';
import HyperDetail from './HyperDetail';
import { AnimatePresence } from 'framer-motion';

// Standardized palette for Hyper Mode
const PALETTE = {
    orange: '#df4418',
    charcoal: '#101010',
    cream: '#f8f8f8',
    deepBlack: '#050505'
};

const HyperHome = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const { toggleHyperMode } = useAppStore();
    const lenisRef = useRef();

    useEffect(() => {
        // Initialize Lenis for that "buttery" inertial scroll from wlt.design
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.1,
            touchMultiplier: 1.5,
        });

        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        lenis.on('scroll', ({ progress }) => {
            setScrollProgress(progress);
        });

        // Hide scrollbar globally for Hyper Mode
        document.body.style.overflow = 'hidden';

        return () => {
            lenis.destroy();
            document.body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div 
            className="min-h-screen selection:bg-[#df4418] selection:text-white"
            style={{ 
                backgroundColor: PALETTE.charcoal,
                color: PALETTE.cream,
                fontFamily: "'Inter', sans-serif" 
            }}
        >
            {/* Background 3D Engine */}
            <HyperScene scroll={scrollProgress} />

            {/* Content Sections */}
            <main className="relative z-10 w-full overflow-x-hidden">
                <section className="h-[100vh]">
                    <HyperHero />
                </section>

                <section className="min-h-[100vh]">
                    <HyperProjects onProjectClick={setSelectedProject} />
                </section>

                <section className="min-h-[100vh]">
                    <HyperSkills />
                </section>

                <section className="min-h-[100vh]">
                    <HyperBlog />
                </section>

                {/* Footer / Final Reveal */}
                <section className="h-[100vh] flex items-center justify-center px-6">
                    <div className="text-center">
                        <motion.h2 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-8"
                        >
                            End of <br />
                            <span style={{ color: PALETTE.orange }}>Transmission</span>
                        </motion.h2>
                        <p className="max-w-md mx-auto text-white/50 text-sm md:text-base leading-relaxed mb-12 uppercase tracking-widest font-mono">
                            Crafting high-performance digital experiences.
                        </p>
                        <button 
                            onClick={toggleHyperMode}
                            className="px-12 py-5 border border-white/20 hover:border-[#df4418] hover:text-[#df4418] transition-all duration-500 font-mono text-xs uppercase tracking-[0.4em]"
                        >
                            Return to Reality
                        </button>
                    </div>
                </section>
            </main>

            {/* Immersive Detail Overlay */}
            <AnimatePresence>
                {selectedProject && (
                    <HyperDetail 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                    />
                )}
            </AnimatePresence>

            {/* Persistent Exit Controller */}
            <button 
                onClick={toggleHyperMode}
                className="fixed top-8 right-8 z-[100] h-12 px-6 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-[#df4418] hover:border-[#df4418] transition-all duration-300 group"
                title="Exit Hyper Mode"
            >
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase group-hover:scale-110 transition-transform">
                    Exit Hyper
                </span>
            </button>
            
            {/* Scroll Indicator */}
            <div className="fixed bottom-8 left-8 z-[100] flex items-center gap-4">
                <div className="w-[1px] h-12 bg-white/10 overflow-hidden relative">
                    <motion.div 
                        className="absolute top-0 left-0 w-full bg-[#df4418]"
                        initial={{ height: "0%" }}
                        animate={{ height: `${scrollProgress * 100}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 30 }}
                    />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                    {Math.round(scrollProgress * 100).toString().padStart(3, '0')}
                </span>
            </div>
        </div>
    );
};

export default HyperHome;
