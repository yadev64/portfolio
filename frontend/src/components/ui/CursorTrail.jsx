import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import useAppStore from '../../store/useAppStore'

export const CursorTrail = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isHovering, setIsHovering] = useState(false)

    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 }
    const cursorX = useSpring(mousePosition.x, springConfig)
    const cursorY = useSpring(mousePosition.y, springConfig)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

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
    }, [])

    return (
        <>
            <div
                className="custom-cursor"
                style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                    backgroundColor: isHovering ? 'var(--accent-secondary)' : 'var(--accent-primary)'
                }}
            />
            <motion.div
                className="custom-cursor-ring"
                style={{
                    x: cursorX,
                    y: cursorY,
                    scale: isHovering ? 1.5 : 1,
                    borderColor: isHovering ? 'var(--accent-secondary)' : 'var(--accent-primary)'
                }}
            />
        </>
    )
}
