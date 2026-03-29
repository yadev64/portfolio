import React from 'react';
import { motion } from 'framer-motion';
import useAppStore from '../../store/useAppStore';

const aesthetics = [
    { id: 'neumorphism', label: 'Neumo', icon: '🎨' },
    { id: 'glass', label: 'Glass', icon: '🪞' },
    { id: 'brutal', label: 'Brutal', icon: '🏗️' },
    { id: 'clay', label: 'Clay', icon: '☁️' }
];

export const AestheticSwitcher = () => {
    const { aesthetic, setAesthetic } = useAppStore();

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] scale-90 md:scale-100 origin-bottom">
            <div className="neu-pressed flex items-center gap-2 p-2 rounded-full border border-border/10 backdrop-blur-md">
                {aesthetics.map((t) => {
                    const isActive = aesthetic === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => setAesthetic(t.id)}
                            className={`relative px-4 py-2 text-xs font-mono font-bold tracking-wider rounded-full flex items-center gap-2 transition-colors duration-300 ${
                                isActive ? 'text-primary' : 'text-textMuted hover:text-textMain'
                            }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="aesthetic-pill"
                                    className="neu-flat absolute inset-0 rounded-full !border-none"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{t.icon}</span>
                            <span className="relative z-10 hidden sm:inline">{t.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
