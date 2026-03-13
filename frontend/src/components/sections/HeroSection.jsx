import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeroCanvas } from '../three/HeroCanvas'
import { MagneticButton } from '../ui/MagneticButton'

export const HeroSection = () => {
    const roles = [
        "Senior Software Engineer_",
        "Builder of Tools_",
        "Debugging the World_",
        "Crafting Systems_"
    ]
    const [roleIndex, setRoleIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setRoleIndex(curr => (curr + 1) % roles.length)
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    }

    return (
        <section id="hero" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
            <HeroCanvas />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 text-center px-4"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-secondary drop-shadow-xl mb-4"
                >
                    Yadev.
                </motion.h1>

                <motion.div variants={itemVariants} className="text-xl md:text-2xl text-accent-primary font-mono mb-12 h-8 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={roleIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="inline-block"
                        >
                            {roles[roleIndex]}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                    <MagneticButton onClick={() => document.getElementById('projects')?.scrollIntoView()}>
                        View My Work
                    </MagneticButton>
                    <MagneticButton variant="secondary" onClick={() => window.location.href = 'mailto:yadev@example.com'}>
                        Say Hello
                    </MagneticButton>
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-border to-transparent" />
            </motion.div>
        </section>
    )
}
