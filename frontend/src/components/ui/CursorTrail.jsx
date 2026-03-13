import { useEffect, useState, useCallback } from 'react'
import { motion, useSpring } from 'framer-motion'

export const CursorTrail = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 })
    const [isHovering, setIsHovering] = useState(false)
    const [hasMoved, setHasMoved] = useState(false)

    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 }
    const ringX = useSpring(-100, springConfig)
    const ringY = useSpring(-100, springConfig)

    const handleMouseMove = useCallback((e) => {
        setMousePosition({ x: e.clientX, y: e.clientY })
        ringX.set(e.clientX)
        ringY.set(e.clientY)
        if (!hasMoved) setHasMoved(true)
    }, [ringX, ringY, hasMoved])

    useEffect(() => {
        const handleMouseOver = (e) => {
            const target = e.target
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') !== null ||
                target.closest('button') !== null ||
                window.getComputedStyle(target).cursor === 'pointer'
            setIsHovering(isClickable)
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseover', handleMouseOver)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseover', handleMouseOver)
        }
    }, [handleMouseMove])

    if (!hasMoved) return null

    return (
        <>
            {/* Inner dot — follows mouse exactly */}
            <div
                className="fixed pointer-events-none z-[9999] rounded-full transition-[width,height,background-color] duration-200"
                style={{
                    left: mousePosition.x,
                    top: mousePosition.y,
                    width: isHovering ? 12 : 8,
                    height: isHovering ? 12 : 8,
                    backgroundColor: isHovering ? 'var(--accent-secondary)' : 'var(--accent-primary)',
                    transform: 'translate(-50%, -50%)',
                }}
            />
            {/* Outer ring — springs behind */}
            <motion.div
                className="fixed pointer-events-none z-[9998] rounded-full border"
                style={{
                    left: ringX,
                    top: ringY,
                    width: isHovering ? 60 : 40,
                    height: isHovering ? 60 : 40,
                    borderColor: isHovering ? 'var(--accent-secondary)' : 'rgba(255,69,0,0.4)',
                    x: '-50%',
                    y: '-50%',
                    scale: isHovering ? 1.2 : 1,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            />
        </>
    )
}
