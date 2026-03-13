import React, { useRef, useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export const MagneticButton = ({ children, onClick, className = "", variant = "primary" }) => {
    const buttonRef = useRef(null)
    const [{ x, y }, setPosition] = useState({ x: 0, y: 0 })
    const controls = useAnimation()

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return
        const { clientX, clientY } = e
        const { left, top, width, height } = buttonRef.current.getBoundingClientRect()

        // Magnetic pull distance logic
        const distanceThreshold = 80 // px
        const centerX = left + width / 2
        const centerY = top + height / 2
        const distanceX = clientX - centerX
        const distanceY = clientY - centerY

        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

        if (distance < distanceThreshold) {
            // Pull effect dampening factor
            const pullX = distanceX * 0.4
            const pullY = distanceY * 0.4
            setPosition({ x: pullX, y: pullY })
            controls.start({ x: pullX, y: pullY, transition: { type: "spring", stiffness: 300, damping: 15 } })
        } else {
            setPosition({ x: 0, y: 0 })
            controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 15 } })
        }
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
        controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 300, damping: 15 } })
    }

    const baseStyles = "relative px-8 py-3 rounded-full font-display font-bold tracking-wide transition-colors duration-300"

    const variants = {
        primary: "bg-accent-primary text-bg-primary hover:bg-[#86f8ce]",
        secondary: "bg-transparent border border-border text-text-primary hover:border-accent-primary"
    }

    return (
        <motion.button
            ref={buttonRef}
            animate={controls}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className={`relative inline-block ${baseStyles} ${variants[variant]} ${className}`}
            whileTap={{ scale: 0.95 }}
        >
            <span className="relative z-10">{children}</span>
        </motion.button>
    )
}
