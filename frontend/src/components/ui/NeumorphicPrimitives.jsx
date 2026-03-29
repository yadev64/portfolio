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
export const NeuIconButton = ({ icon, onClick, active, size = 'md', className = '', hoverColor }) => {
    const [hovered, setHovered] = React.useState(false);
    const sizeClasses = {
        sm: 'w-10 h-10',
        md: 'w-14 h-14',
        lg: 'w-16 h-16'
    };

    return (
        <button
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`
                flex items-center justify-center rounded-full cursor-pointer
                transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)]
                ${active ? 'neu-pressed text-primary' : `neu-flat text-textMuted ${!hoverColor ? 'hover:text-textMain' : ''}`}
                ${sizeClasses[size]} ${className}
            `}
            style={hovered && hoverColor ? { color: hoverColor } : undefined}
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
    const knobRef = React.useRef(null);
    const isDragging = React.useRef(false);
    const lastEmitted = React.useRef(value);

    const toPct = React.useCallback((val) => ((val - min) / (max - min)) * 100, [min, max]);

    const positionKnob = React.useCallback((pct) => {
        if (knobRef.current) {
            knobRef.current.style.left = `calc(${pct}% - ${pct * 0.28 - 4}px)`;
        }
    }, []);

    // Sync visuals from prop — but NOT during active drag
    React.useEffect(() => {
        if (!isDragging.current) {
            positionKnob(toPct(value));
        }
    }, [value, positionKnob, toPct]);

    const handleStart = React.useCallback(() => {
        isDragging.current = true;
        if (knobRef.current) knobRef.current.style.transition = 'none';
        // Lazily create audio context on first user gesture
        if (!audioCtx.current) {
            audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
        }
    }, []);

    // Short tick sound — iOS picker style
    const audioCtx = React.useRef(null);
    const playTick = React.useCallback(() => {
        const ctx = audioCtx.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    }, []);

    const handleInput = React.useCallback((e) => {
        const raw = Number(e.target.value);
        positionKnob(toPct(raw));
        const snapped = Math.round(raw / 5) * 5;
        if (snapped !== lastEmitted.current) {
            lastEmitted.current = snapped;
            playTick();
            onChange(snapped);
        }
    }, [onChange, positionKnob, toPct, playTick]);

    const handleEnd = React.useCallback(() => {
        isDragging.current = false;
        // Restore easing transition for programmatic updates
        if (knobRef.current) knobRef.current.style.transition = 'left 0.15s ease-out';
        // Snap to final emitted value
        positionKnob(toPct(lastEmitted.current));
    }, [positionKnob, toPct]);

    const initPct = toPct(value);

    return (
        <div className="relative w-full h-7">
            {/* Track — full gradient */}
            <div
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{
                    background: 'linear-gradient(90deg, #0078FF, #FF4500)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 2px rgba(255,255,255,0.1)',
                }}
            />
            {/* Hidden range input */}
            <input
                type="range"
                min={min}
                max={max}
                defaultValue={value}
                onInput={handleInput}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                onMouseUp={handleEnd}
                onTouchEnd={handleEnd}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Knob */}
            <div
                ref={knobRef}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full pointer-events-none z-20"
                style={{
                    left: `calc(${initPct}% - ${initPct * 0.28 - 4}px)`,
                    background: 'var(--bg-primary)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.15)',
                    transition: 'left 0.15s ease-out',
                }}
            />
        </div>
    );
};

export const NeuThemeSlider = ({ value, onChange, steps = 4 }) => {
    // value is index based on available themes
    const knobRef = React.useRef(null);
    const isDragging = React.useRef(false);
    const lastEmitted = React.useRef(value);
    const maxVal = steps - 1;

    const toPct = React.useCallback((val) => (val / maxVal) * 100, [maxVal]);

    const positionKnob = React.useCallback((pct) => {
        if (knobRef.current) {
            knobRef.current.style.left = `calc(${pct}% - ${pct * 0.28 - 4}px)`;
        }
    }, []);

    React.useEffect(() => {
        if (!isDragging.current) positionKnob(toPct(value));
    }, [value, positionKnob, toPct]);

    const handleStart = React.useCallback(() => {
        isDragging.current = true;
        if (knobRef.current) knobRef.current.style.transition = 'none';
        if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }, []);

    const audioCtx = React.useRef(null);
    const playTick = React.useCallback(() => {
        const ctx = audioCtx.current;
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.03);
    }, []);

    const handleInput = React.useCallback((e) => {
        const raw = Number(e.target.value);
        positionKnob(toPct(raw));
        const snapped = Math.round(raw);
        if (snapped !== lastEmitted.current) {
            lastEmitted.current = snapped;
            playTick();
            onChange(snapped);
        }
    }, [onChange, positionKnob, toPct, playTick]);

    const handleEnd = React.useCallback(() => {
        isDragging.current = false;
        if (knobRef.current) knobRef.current.style.transition = 'left 0.15s ease-out';
        positionKnob(toPct(lastEmitted.current));
    }, [positionKnob, toPct]);

    const initPct = toPct(value);

    return (
        <div className="relative w-full h-7">
            {/* Track — steps design */}
            <div className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-between px-3 neu-theme-track">
                {Array.from({ length: steps }).map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-border" />
                ))}
            </div>
            
            <input type="range" min={0} max={maxVal} step={0.01} defaultValue={value} onInput={handleInput} onMouseDown={handleStart} onTouchStart={handleStart} onMouseUp={handleEnd} onTouchEnd={handleEnd} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div
                ref={knobRef}
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full pointer-events-none z-20 flex items-center justify-center neu-theme-knob"
                style={{
                    left: `calc(${initPct}% - ${initPct * 0.28 - 4}px)`,
                    transition: 'left 0.15s ease-out',
                }}
            >
                <div className="w-2 h-2 rounded-full opacity-60" style={{ background: 'var(--text-main)' }} />
            </div>
        </div>
    );
};
