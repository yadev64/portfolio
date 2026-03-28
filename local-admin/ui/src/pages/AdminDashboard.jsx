import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Feather, Code2 } from 'lucide-react';

import ProjectsAdmin from './modules/ProjectsAdmin';
import CareerAdmin from './modules/CareerAdmin';
import WritingAdmin from './modules/WritingAdmin';
import SkillsAdmin from './modules/SkillsAdmin';

const AdminDashboard = () => {
    const location = useLocation();

    const navItems = [
        { path: '/projects', label: 'Projects', icon: <LayoutDashboard size={18} /> },
        { path: '/career', label: 'Career', icon: <Briefcase size={18} /> },
        { path: '/writing', label: 'Writing', icon: <Feather size={18} /> },
        { path: '/skills', label: 'Skills', icon: <Code2 size={18} /> },
    ];

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border flex flex-col pt-8 bg-surface">
                <div className="px-6 mb-8">
                    <h2 className="text-xl font-display font-bold text-textMain tracking-wider">COMMANDER</h2>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-textMuted mt-1">Local CMS · Portfolio</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                                    isActive
                                        ? 'neu-pressed text-primary font-bold'
                                        : 'text-textMuted hover:text-textMain hover:bg-white/30'
                                }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <p className="font-mono text-[9px] text-textMuted text-center">Files write to frontend/src/data/</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                <Routes>
                    <Route path="/" element={
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">YADEV CMS</h1>
                            <p className="font-mono text-sm text-textMuted">Select a module from the sidebar to begin.</p>
                        </div>
                    } />
                    <Route path="/projects" element={<ProjectsAdmin />} />
                    <Route path="/career" element={<CareerAdmin />} />
                    <Route path="/writing" element={<WritingAdmin />} />
                    <Route path="/skills" element={<SkillsAdmin />} />
                </Routes>
            </main>
        </div>
    );
};

export default AdminDashboard;
