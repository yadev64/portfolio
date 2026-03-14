import React from 'react';
import { motion } from 'framer-motion';

// Basic Neumorphic Container (Extruded)
export const NeuCard = ({ children, className = '', convex = false, onClick }) => {
    const shadowClass = convex ? 'neu-convex' : 'neu-flat';
    return (
        <div onClick={onClick} className={`${shadowClass} p-6 md:p-8 ${className}`}>
            {children}
        </div>
    );
};

// Neumorphic Button — clean lift on hover, no orange glow, no black shadows
export const NeuButton = ({ children, onClick, active, disabled, className = '', variant = 'default' }) => {
    const isPrimary = variant === 'primary';
    const textColor = isPrimary || active ? 'text-primary' : 'text-textMain';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-6 py-3 rounded-full font-bold tracking-wider uppercase text-sm font-display
                transition-all duration-300 ease-in-out
                ${active ? 'neu-pressed-sm' : 'neu-btn'}
                ${textColor} ${className}
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
                flex items-center justify-center rounded-full cursor-pointer
                transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${active ? 'neu-pressed text-primary' : 'neu-flat text-textMuted hover:text-textMain'}
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
        off: 'bg-[#333] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.8)]'
    };

    return (
        <div className={`w-3 h-3 rounded-full ${active ? colorMap[color] : colorMap.off} transition-colors duration-500`} />
    );
};

// Neumorphic Toggle Switch — stable shadow
export const NeuToggle = ({ checked, onChange }) => {
    return (
        <div
            onClick={() => onChange(!checked)}
            className="w-16 h-8 rounded-full flex items-center p-1 cursor-pointer neu-pressed relative"
        >
            <motion.div
                initial={false}
                animate={{ x: checked ? 32 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 rounded-full shadow-md relative"
                style={{ backgroundColor: checked ? 'var(--accent-primary)' : '#555' }}
            >
                <div className="w-2 h-2 rounded-full bg-white opacity-40 absolute top-1 left-2 blur-[1px]" />
            </motion.div>
        </div>
    );
};

// Neumorphic Progress Bar
export const NeuProgress = ({ progress, label = '', color = 'bg-primary' }) => {
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
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${color} shadow-neu-glow relative`}
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-white opacity-30 mix-blend-overlay" />
                </motion.div>
            </div>
        </div>
    );
};

// Neumorphic Temperature Slider
// Props: min, max, value, onChange(value)
export const NeuTempSlider = ({ value, onChange, min = 0, max = 100 }) => {
    const trackRef = React.useRef(null);
    const knobRef = React.useRef(null);
    const inputRef = React.useRef(null);

    const toPct = React.useCallback((val) => ((val - min) / (max - min)) * 100, [min, max]);

    const updateVisuals = React.useCallback((val) => {
        const pct = toPct(val);
        // 4px padding at both edges: at 0% → 4px, at 100% → calc(100% - 24px)
        if (knobRef.current) {
            knobRef.current.style.left = `calc(${pct}% - ${pct * 0.28 - 4}px)`;
        }
    }, [toPct]);

    React.useEffect(() => { updateVisuals(value); }, [value, updateVisuals]);

    const handleInput = React.useCallback((e) => {
        const val = Number(e.target.value);
        updateVisuals(val);
        onChange(val);
    }, [onChange, updateVisuals]);

    const initPct = toPct(value);

    return (
        <div className="relative w-full h-7">
            {/* Track — full gradient always visible, thick enough to contain the knob */}
            <div
                ref={trackRef}
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                    background: 'linear-gradient(90deg, #0078FF, #FF4500)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)',
                }}
            />
            {/* Hidden range input — covers entire track for interaction */}
            <input
                ref={inputRef}
                type="range"
                min={min}
                max={max}
                defaultValue={value}
                onInput={handleInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Knob — round, sits inside the track */}
            <div
                ref={knobRef}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full pointer-events-none z-20"
                style={{
                    left: `calc(${initPct}% - ${initPct * 0.28 - 4}px)`,
                    background: 'var(--bg-primary)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)',
                }}
            />
        </div>
    );
};
