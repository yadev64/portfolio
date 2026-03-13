import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const Terminal = ({ lines }) => {
    const [displayedLines, setDisplayedLines] = useState([])
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < lines.length) {
            const timer = setTimeout(() => {
                setDisplayedLines(prev => [...prev, lines[currentIndex]])
                setCurrentIndex(curr => curr + 1)
            }, 400) // 400ms delay per line
            return () => clearTimeout(timer)
        }
    }, [currentIndex, lines])

    return (
        <div className="w-full max-w-2xl bg-bg-secondary rounded-xl overflow-hidden shadow-2xl border border-border">
            <div className="flex items-center px-4 py-3 bg-bg-primary border-b border-border">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="ml-4 text-xs font-mono text-text-secondary">yadev@mbp:~</div>
            </div>

            <div className="p-6 font-mono text-sm md:text-base h-80 overflow-y-auto">
                {displayedLines.map((line, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`mb-2 ${line.startsWith('>') ? 'text-accent-primary' : 'text-text-primary pl-4'}`}
                    >
                        {line.startsWith('>') ? (
                            <span className="opacity-80">yadev ~ {line}</span>
                        ) : (
                            line
                        )}
                    </motion.div>
                ))}
                {currentIndex >= lines.length && (
                    <motion.div
                        className="w-2 h-5 bg-text-primary ml-1 mt-1 inline-block"
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8 }}
                    />
                )}
            </div>
        </div>
    )
}
