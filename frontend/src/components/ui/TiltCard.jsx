import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const defaultOptions = {
    reverse: false,  // reverse the tilt direction
    max: 15,     // max tilt rotation (degrees)
    perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.02,   // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000,   // Speed of the enter/exit transition
    transition: true,   // Set a transition on enter/exit.
    axis: null,   // What axis should be disabled. Can be X or Y.
    reset: true,   // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

export const TiltCard = ({ project, layoutId, className = "" }) => {
    const navigate = useNavigate()

    return (
        <Tilt options={defaultOptions} className={`w-full h-full ${className}`}>
            <motion.div
                layoutId={layoutId} // Framer motion shared layout
                onClick={() => navigate(`/projects/${project.slug}`)}
                className="group relative w-full h-full bg-bg-card border border-border rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-end"
                style={{ '--project-accent': project.accent_color || 'var(--accent-primary)' }}
            >
                {/* Background Image */}
                {project.cover_image && (
                    <img
                        src={project.cover_image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity duration-500"
                    />
                )}

                {/* Hover Gradient Overlay */}
                <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                    style={{ background: `linear-gradient(to top right, var(--project-accent), transparent)` }}
                />

                {/* Content */}
                <div className="relative z-10 p-6 md:p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex gap-2 flex-wrap mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {project.tech_stack?.slice(0, 3).map(tech => (
                            <span key={tech} className="text-xs font-mono px-2 py-1 rounded-full border border-border bg-bg-primary/50 text-text-secondary backdrop-blur-sm">
                                {tech}
                            </span>
                        ))}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-display font-bold text-text-primary mb-2">
                        {project.title}
                    </h3>

                    <p className="text-text-secondary font-body line-clamp-2 mb-4 max-w-sm">
                        {project.tagline}
                    </p>

                    <div className="flex items-center text-[var(--project-accent)] font-bold italic tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        View Project <span className="ml-2">→</span>
                    </div>
                </div>
            </motion.div>
        </Tilt>
    )
}
