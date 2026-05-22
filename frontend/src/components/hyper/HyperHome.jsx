import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useAppStore from '../../store/useAppStore';
import HyperScene from './HyperScene';
import HyperHero from './sections/HyperHero';
import HyperProjects from './sections/HyperProjects';
import HyperSkills from './sections/HyperSkills';
import HyperBlog from './sections/HyperBlog';
import HyperDetail from './HyperDetail';

gsap.registerPlugin(ScrollTrigger);

// Standardized palette for Hyper Mode
const PALETTE = {
    orange: '#df4418',
    charcoal: '#080808',
    cream: '#f8f8f8',
    deepBlack: '#050505'
};

const HyperHome = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [selectedProject, setSelectedProject] = useState(null);
    const { toggleHyperMode } = useAppStore();
    
    const containerRef = useRef();
    const sceneRef = useRef();
    const sectionsRef = useRef([]);

    useLayoutEffect(() => {
        // 1. Initialize Lenis for Smooth Inertial Scroll
        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.1,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // 2. GSAP ScrollTrigger Orchestration
        const sections = sectionsRef.current;
        const totalSections = sections.length;
        
        // Pin the main container for the duration of the 3D journey
        const mainTl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${totalSections * 200}%`, // 200% scroll per section for breathing room
                pin: true,
                scrub: 0.5,
                onUpdate: (self) => setScrollProgress(self.progress),
            }
        });

        // 3. Section Transition Logic (The Duty Cycle)
        sections.forEach((section, i) => {
            if (!section) return;

            // Entrance logic: Scale up and fade in
            mainTl.fromTo(section, 
                { opacity: 0, scale: 0.8, pointerEvents: 'none' },
                { 
                    opacity: 1, 
                    scale: 1, 
                    pointerEvents: 'auto',
                    duration: 0.4,
                    ease: "power2.out"
                }
            );

            // Active Zone (Interactive Plateau)
            // Section stays stationary and interactive while the user "scrolls" through this phase
            mainTl.to(section, {
                opacity: 1,
                scale: 1,
                duration: 1.2, // 60% of section duration
                ease: "none"
            });

            // Exit Zone (Zoom Past)
            mainTl.to(section, {
                opacity: 0,
                scale: 4,
                pointerEvents: 'none',
                duration: 0.4,
                ease: "power2.in"
            });
        });

        return () => {
            lenis.destroy();
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="w-full selection:bg-[#df4418] selection:text-white overflow-hidden bg-[#080808]"
            style={{ color: PALETTE.cream }}
        >
            {/* Background 3D Engine */}
            <div ref={sceneRef} className="fixed inset-0 pointer-events-none z-0">
                <HyperScene scroll={scrollProgress} />
            </div>

            {/* Cinematic Warp Gate Flash (Synced in HyperScene) */}
            <div className="warp-flash fixed inset-0 z-[80] pointer-events-none bg-white opacity-0" />

            {/* Sticky Sections Wrapper */}
            <div className="relative w-full h-full z-10">
                {/* HERO */}
                <section 
                    ref={el => sectionsRef.current[0] = el}
                    className="fixed inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="pointer-events-auto">
                        <HyperHero />
                    </div>
                </section>

                {/* PROJECTS */}
                <section 
                    ref={el => sectionsRef.current[1] = el}
                    className="fixed inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full overflow-y-auto no-scrollbar pt-32 pb-20 pointer-events-auto">
                        <HyperProjects onProjectClick={setSelectedProject} />
                    </div>
                </section>

                {/* SKILLS */}
                <section 
                    ref={el => sectionsRef.current[2] = el}
                    className="fixed inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full overflow-y-auto no-scrollbar pt-32 pb-20 pointer-events-auto">
                        <HyperSkills />
                    </div>
                </section>

                {/* BLOG */}
                <section 
                    ref={el => sectionsRef.current[3] = el}
                    className="fixed inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-full h-full overflow-y-auto no-scrollbar pt-32 pb-20 pointer-events-auto">
                        <HyperBlog />
                    </div>
                </section>

                {/* FOOTER */}
                <section 
                    ref={el => sectionsRef.current[4] = el}
                    className="fixed inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="text-center pointer-events-auto">
                        <motion.h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase mb-12">
                            End of <br />
                            <span style={{ color: PALETTE.orange }}>Transmission</span>
                        </motion.h2>
                        <button 
                            onClick={toggleHyperMode}
                            className="px-12 py-5 border border-white/20 hover:border-[#df4418] hover:text-[#df4418] transition-all duration-500 font-mono text-xs uppercase tracking-[0.4em]"
                        >
                            Return to Reality
                        </button>
                    </div>
                </section>
            </div>

            {/* Persistent Controls Overlay */}
            <div className="fixed top-0 left-0 w-full z-[100] flex justify-between p-8 pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className="w-10 h-[1px] bg-white/20" />
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase opacity-40">Hyper Mode</span>
                </div>
                
                <button 
                    onClick={toggleHyperMode}
                    className="h-10 px-6 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-[#df4418] hover:border-[#df4418] transition-all duration-300 group pointer-events-auto"
                >
                    <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase">
                        Exit Hyper
                    </span>
                </button>
            </div>
            
            {/* Scroll Progress Tracker */}
            <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Journey Progress</span>
                <div className="w-48 h-[1px] bg-white/10 relative">
                    <motion.div 
                        className="absolute top-0 left-0 h-full bg-[#df4418]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${scrollProgress * 100}%` }}
                    />
                </div>
            </div>

            {/* Project Deep Dive Overlay */}
            <AnimatePresence>
                {selectedProject && (
                    <HyperDetail 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default HyperHome;
