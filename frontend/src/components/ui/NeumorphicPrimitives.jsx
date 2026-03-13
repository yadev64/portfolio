import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Basic Neumorphic Container (Extruded)
export const NeuCard = ({ children, className = '', convex = false }) => {
    // Convex gives it a slight gradient dome, flat is pure Dieter Rams
    const shadowClass = convex ? 'neu-convex' : 'neu-flat';
    return (
        <div className={`${shadowClass} p-6 md:p-8 ${className}`}>
            {children}
        </div>
    );
};

// Neumorphic Button (Presses in on active)
export const NeuButton = ({ children, onClick, active, disabled, className = '', variant = 'default' }) => {
    const isPrimary = variant === 'primary';

    // Base shadow transitions
    const shadowStyle = active
        ? 'neu-pressed-sm shadow-[inset_0_0_10px_rgba(255,69,0,0.2)]' // Pressed state (with slight orange inner glow if active)
        : 'neu-sm hover:shadow-[4px_4px_8px_#161619,-4px_-4px_8px_#26262b,0_0_15px_rgba(255,69,0,0.3)]'; // Hover glow

    const textColor = isPrimary || active ? 'text-primary' : 'text-textMain';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 rounded-full font-bold tracking-wider uppercase text-sm font-display
                transition-all duration-300 ease-in-out
                ${shadowStyle} ${textColor} ${className}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
        >
            {children}
        </button>
    );
};

// Neumorphic Icon Button (Circular)
export const NeuIconButton = ({ icon, onClick, active, size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-16 h-16'
    };

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center justify-center rounded-full
                transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${active ? 'neu-pressed text-primary' : 'neu-flat text-textMuted hover:text-white'}
                ${sizeClasses[size]} ${className}
            `}
        >
            {icon}
        </button>
    );
};

// Neumorphic Indicator Light / Status LED
export const NeuLED = ({ active, color = 'primary' }) => {
    const colorMap = {
        primary: 'bg-primary shadow-neu-glow',
        secondary: 'bg-secondary shadow-[0_0_15px_rgba(0,229,255,0.4)]',
        off: 'bg-[#111] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]'
    };

    return (
        <div className={`w-3 h-3 rounded-full ${active ? colorMap[color] : colorMap.off} transition-colors duration-500`} />
    );
};

// Neumorphic Toggle Switch (Physical hardware feel)
export const NeuToggle = ({ checked, onChange }) => {
    return (
        <div
            onClick={() => onChange(!checked)}
            className={`
                w-16 h-8 rounded-full flex items-center p-1 cursor-pointer
                transition-colors duration-300 neu-pressed relative
            `}
        >
            <motion.div
                layout
                initial={false}
                animate={{
                    x: checked ? 32 : 0,
                    backgroundColor: checked ? 'var(--accent-primary)' : '#444' // Neon Orange when on, dull grey when off
                }}
                className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center"
            >
                {/* Inner reflection to make the knob look 3D */}
                <div className="w-2 h-2 rounded-full bg-white opacity-40 absolute top-1 left-2 blur-[1px]"></div>
            </motion.div>
        </div>
    );
};

// Neumorphic Progress Bar / Slider Track
export const NeuProgress = ({ progress, label = '' }) => {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <div className="flex justify-between text-xs font-mono uppercase tracking-widest text-textMuted">
                    <span>{label}</span>
                    <span className="text-primary">{progress}%</span>
                </div>
            )}
            <div className="h-3 w-full rounded-full neu-pressed overflow-hidden p-[2px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-primary shadow-neu-glow relative"
                >
                    {/* Add a physical light reflection to the bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30 MixBlendMode-overlay" />
                </motion.div>
            </div>
        </div>
    );
};
