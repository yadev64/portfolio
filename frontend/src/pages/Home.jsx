import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NeuCard, NeuButton, NeuToggle, NeuProgress, NeuLED } from '../components/ui/NeumorphicPrimitives';
import { Terminal, Code, Cpu, Shield, Zap, Layout, Moon, Sun } from 'lucide-react';
import useAppStore from '../store/useAppStore';

const NeumorphicDashboard = () => {
    const [systemPower, setSystemPower] = useState(true);
    const [networkLink, setNetworkLink] = useState(false);

    // Global Theme State
    const { theme, toggleTheme } = useAppStore();
    const isDark = theme === 'dark';

    return (
        <div className="min-h-screen bg-background text-textMain font-body p-6 md:p-12 lg:p-16 flex items-center justify-center selection:bg-primary selection:text-white">
            <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-stretch">

                {/* Header / Identity Card (Spans full width on mobile, 8 cols on desktop) */}
                <NeuCard className="col-span-1 md:col-span-8 flex justify-between flex-col relative overflow-hidden">
                    <div className="flex justify-between items-start mb-12">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-4">Identity Matrix</p>
                            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tighter text-textMain">Yadev.dev</h1>
                            <h2 className="text-xl md:text-2xl font-display text-textMuted mt-2">Frontend Systems Engineer</h2>
                        </div>
                        <div className="flex gap-6 items-start">
                            {/* Physical Light Switch */}
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={toggleTheme}
                                    className={`w-12 h-16 rounded-xl flex flex-col items-center justify-between p-2 pb-3 transition-all duration-300 ${isDark ? 'neu-pressed' : 'neu-flat'}`}
                                >
                                    <div className={`w-full h-1/2 rounded-md transition-colors ${!isDark ? 'bg-primary shadow-neu-glow' : 'bg-transparent'}`}></div>
                                    <div className={`w-full h-1/2 rounded-md transition-colors ${isDark ? 'bg-primary shadow-neu-glow' : 'bg-transparent'}`}></div>
                                </button>
                                <span className="font-mono text-[10px] uppercase text-textMuted">{isDark ? 'DARK' : 'LIGHT'}</span>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <NeuLED active={systemPower} color="primary" />
                                <span className="font-mono text-[10px] uppercase text-textMuted">PWR</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-auto">
                        <NeuButton active variant="primary">Access Files</NeuButton>
                        <NeuButton>Contact Protocol</NeuButton>
                    </div>

                    {/* Industrial details */}
                    <div className="absolute top-8 right-8 w-32 h-32 border-2 border-border rounded-full opacity-10 pointer-events-none" />
                    <div className="absolute -bottom-16 -right-16 w-64 h-64 border-[40px] border-border rounded-full opacity-5 pointer-events-none" />
                </NeuCard>

                {/* Control Panel (Spans 4 cols) */}
                <NeuCard className="col-span-1 md:col-span-4 flex flex-col gap-8 justify-between">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-6 pb-4 border-b border-border/50">System Controls</p>

                        <div className="flex items-center justify-between mb-6">
                            <span className="font-mono text-sm text-textMuted">Core Matrix</span>
                            <NeuToggle checked={systemPower} onChange={setSystemPower} />
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="font-mono text-sm text-textMuted">Network Link</span>
                            <NeuToggle checked={networkLink} onChange={setNetworkLink} />
                        </div>
                    </div>

                    <div className="bg-[#111] p-4 rounded-xl shadow-[inset_2px_2px_10px_rgba(0,0,0,0.5)]">
                        <p className="font-mono text-xs text-primary leading-relaxed opacity-80">
                            &gt; SYSTEM ONLINE<br />
                            &gt; INITIALIZING NEUMORPHIC_RENDERER.exe<br />
                            &gt; DIETER_RAMS.cfg LOADED<br />
                            &gt; AWAITING INPUT_
                        </p>
                    </div>
                </NeuCard>

                {/* Arsenal / Skills Panel (4 Cols) */}
                <NeuCard className="col-span-1 md:col-span-4">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-8 pb-4 border-b border-border/50">Technical Arsenal</p>

                    <div className="flex flex-col gap-8">
                        <NeuProgress progress={95} label="React / Next.js" />
                        <NeuProgress progress={88} label="TypeScript Core" />
                        <NeuProgress progress={90} label="Tailwind / CSS" />
                        <NeuProgress progress={75} label="WebGL / Three.js" />
                    </div>
                </NeuCard>

                {/* Timeline / Experience Mini Widgets (4 Cols) */}
                <div className="col-span-1 md:col-span-4 grid grid-rows-2 gap-8 md:gap-10">
                    <NeuCard className="flex flex-col justify-center items-center text-center p-0">
                        <h3 className="text-4xl font-display font-bold text-textMain mb-2">4+</h3>
                        <p className="font-mono text-xs text-textMuted uppercase tracking-widest">Years Active Duty</p>
                    </NeuCard>
                    <NeuCard className="flex justify-between items-center px-10">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full neu-flat flex items-center justify-center text-textMuted">
                                <Terminal size={20} />
                            </div>
                            <span className="font-mono text-[10px] text-textMuted uppercase">Dev</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full neu-pressed text-primary flex items-center justify-center">
                                <Layout size={20} />
                            </div>
                            <span className="font-mono text-[10px] text-primary uppercase shadow-neu-glow">UI/UX</span>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-12 h-12 rounded-full neu-flat flex items-center justify-center text-textMuted">
                                <Zap size={20} />
                            </div>
                            <span className="font-mono text-[10px] text-textMuted uppercase">Perf</span>
                        </div>
                    </NeuCard>
                </div>

                {/* Featured Project / Mission Log (4 Cols) */}
                <NeuCard className="col-span-1 md:col-span-4 flex flex-col">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-6 pb-4 border-b border-border/50">Active Directive</p>

                    <div className="flex-1 rounded-xl bg-opacity-5 shadow-[inset_4px_4px_8px_rgba(var(--shadow-dark),0.6)] p-6 mb-6 overflow-hidden relative border border-border/20">
                        <h3 className="text-2xl font-display font-bold text-textMain relative z-10">Restaurant OS</h3>
                        <p className="text-sm text-textMuted mt-2 relative z-10">Full-stack multi-tenant platform.</p>

                        {/* Decorative blueprint grids */}
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute top-4 right-4"><NeuLED active /></div>
                    </div>

                    <NeuButton className="w-full">Initialize Logs</NeuButton>
                </NeuCard>
            </div>
        </div>
    );
};

export default NeumorphicDashboard;
