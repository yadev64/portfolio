import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

/**
 * Minimal neumorphic header for non-home pages.
 * Shows logo, back button, and nav links.
 */
const Header = () => {
    const location = useLocation();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
                {/* Left: Back + Logo */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-textMuted hover:text-primary transition-colors font-mono text-sm"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                    <span className="w-px h-5 bg-border/50" />
                    <Link to="/" className="font-display font-bold text-lg text-textMain tracking-tight">
                        Yadev<span className="text-primary">.</span>cc
                    </Link>
                </div>

                {/* Right: Nav links */}
                <nav className="flex items-center gap-6">
                    <Link to="/#projects" className="font-mono text-xs uppercase tracking-widest text-textMuted hover:text-primary transition-colors">
                        Projects
                    </Link>
                    <Link to="/#blog" className="font-mono text-xs uppercase tracking-widest text-textMuted hover:text-primary transition-colors">
                        Writing
                    </Link>
                    <Link to="/" className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-textMuted hover:text-primary transition-colors shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)]">
                        <Home size={14} />
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
