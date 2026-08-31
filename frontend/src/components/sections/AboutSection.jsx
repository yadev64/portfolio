import React from 'react'
import { motion } from 'framer-motion'
import { Terminal } from '../ui/Terminal'

export const AboutSection = () => {
    const terminalLines = [
        "> whoami",
        "Yadev — Leading R&D @ Tricog Health, Bangalore",
        "> focus",
        "[\"autonomous agents\", \"agentic SDLC\", \"skills creation\", \"railway CI/CD\"]",
        "> currently_architecting",
        "Agentic SDLC pipelines & Autonomous Workflows",
        "> stack",
        "Agentic Workflows | Railway | Python | React | Node | PostgreSQL",
        "> fun_fact",
        "Rides a Royal Enfield Interceptor 650. Will talk about it unprompted."
    ]

    return (
        <div id="about" className="min-h-full relative flex items-center py-12 px-4 md:px-12 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-accent-tertiary/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="order-2 lg:order-1"
                >
                    <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-8">
                        System <span className="text-accent-secondary">Identity</span>
                    </h2>
                    <Terminal lines={terminalLines} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="order-1 lg:order-2 flex justify-center"
                >
                    <div className="relative w-72 h-96 md:w-96 md:h-[500px]">
                        {/* Duotone filtered image styling using CSS filters and absolute positioning */}
                        <div className="absolute inset-0 bg-accent-primary mix-blend-multiply rounded-[2rem] z-10 opacity-60 transition-opacity hover:opacity-0" />
                        <div className="absolute inset-0 bg-black mix-blend-color z-10" />
                        <img
                            src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1470&auto=format&fit=crop"
                            alt="Yadev Portrait"
                            className="w-full h-full object-cover rounded-[2rem] grayscale shadow-2xl border border-border"
                        />
                        {/* Decorative frame */}
                        <div className="absolute -inset-4 border border-border rounded-[2.5rem] -z-10" />
                    </div>
                </motion.div>

            </div>
        </div>
    )
}
