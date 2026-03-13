import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// 3D Canvas
import { HeroCanvas } from '../components/three/HeroCanvas'
// Sections as HUD panels
import { AboutSection } from '../components/sections/AboutSection'
import { ProjectsSection } from '../components/sections/ProjectsSection'
import { SkillsSection } from '../components/sections/SkillsSection'
import { JourneySection } from '../components/sections/JourneySection'
import { MediaSection } from '../components/sections/MediaSection'
import { BlogSection } from '../components/sections/BlogSection'

const Home = () => {
    // state machine for active HUD: null (hub) | 'about' | 'projects' | 'skills' | 'journey' | 'media' | 'blog'
    const [activeOverlay, setActiveOverlay] = useState(null)

    // Mapping string IDs to their respective React Section components
    const OverlayComponents = {
        about: AboutSection,
        projects: ProjectsSection,
        skills: SkillsSection,
        journey: JourneySection,
        media: MediaSection,
        blog: BlogSection
    }

    const ActiveComponent = activeOverlay ? OverlayComponents[activeOverlay] : null

    return (
        // Body is restricted. No vertical scrolling on the page level.
        <div className="bg-bg-primary h-screen w-screen overflow-hidden font-body selection:bg-accent-primary selection:text-bg-primary relative">

            {/* Layer 1: The perpetual 3D Space Hub */}
            <HeroCanvas activeOverlay={activeOverlay} setActiveOverlay={setActiveOverlay} />

            {/* Layer 2: Default UI overlay (when in Hub mode) */}
            <AnimatePresence>
                {!activeOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between p-8 md:p-16"
                    >
                        <div className="max-w-xl">
                            <h1 className="text-5xl md:text-8xl font-display font-bold text-text-primary tracking-tight leading-[0.9]">
                                Yadev<span className="text-accent-primary">.dev</span>
                            </h1>
                            <p className="mt-4 text-xl font-mono text-text-secondary uppercase tracking-widest bg-black/40 inline-block px-4 py-2 rounded-xl backdrop-blur-sm border border-border">
                                Navigate the System
                            </p>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="font-mono text-sm text-text-secondary bg-black/40 px-4 py-2 rounded-xl backdrop-blur-sm border border-border">
                                [ Click and drag to orbit ]<br />
                                [ Select a node to initiate link ]
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Layer 3: The Diegetic Glassmorphic Section HUDs */}
            <AnimatePresence>
                {activeOverlay && (
                    <motion.div
                        key="hud-container"
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -30 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
                        className="absolute inset-4 md:inset-10 z-50 bg-bg-primary/90 backdrop-blur-2xl border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* HUD Header Bar */}
                        <header className="h-16 md:h-20 border-b border-border bg-black/20 flex items-center justify-between px-6 md:px-10 shrink-0">
                            <h2 className="font-mono text-lg text-accent-primary uppercase tracking-[0.2em] font-bold">
                // {activeOverlay}
                            </h2>

                            <button
                                onClick={() => setActiveOverlay(null)}
                                className="group flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
                            >
                                <span className="font-mono text-sm text-text-secondary group-hover:text-white transition-colors">Abort Link</span>
                                <span className="text-white">✕</span>
                            </button>
                        </header>

                        {/* HUD Content Area - This is where the sections scroll internally */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
                            {ActiveComponent && <ActiveComponent />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}

export default Home
