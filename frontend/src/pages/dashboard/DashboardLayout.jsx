import React from 'react'
import { Routes, Route, Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
// Icons
import { LayoutDashboard, FileText, Image as ImageIcon, GitMerge, BookOpen, Settings, LogOut } from 'lucide-react'

// Placeholder modules
import { ManageProjects } from './ManageProjects'
const DashboardHome = () => <div className="p-8"><h1 className="text-3xl font-display text-text-primary">Overview</h1><p className="text-text-secondary mt-2 text-sm font-mono">System metrics and recent activity.</p></div>
const ManageMedia = () => <div className="p-8">Manage Media</div>
const ManageJourney = () => <div className="p-8">Manage Journey</div>
const ManageBlog = () => <div className="p-8">Manage Blog</div>

export const DashboardLayout = () => {
    const { authStatus, logout } = useAppStore()
    const navigate = useNavigate()
    const location = useLocation()

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!authStatus.isAuthenticated) {
            // In real app, we'd navigate to /dashboard/login
            // navigate('/dashboard/login')
        }
    }, [authStatus.isAuthenticated, navigate])

    const menuItems = [
        { label: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { label: 'Projects', path: '/dashboard/projects', icon: <FileText size={18} /> },
        { label: 'Media', path: '/dashboard/media', icon: <ImageIcon size={18} /> },
        { label: 'Journey', path: '/dashboard/journey', icon: <GitMerge size={18} /> },
        { label: 'Blog', path: '/dashboard/blog', icon: <BookOpen size={18} /> },
    ]

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-bg-card flex flex-col">
                <div className="p-6 border-b border-border">
                    <Link to="/" className="text-xl font-display font-bold text-accent-primary">Yadev<span className="text-text-primary">.dev</span></Link>
                    <div className="text-xs font-mono text-text-secondary mt-1">Admin // System</div>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2">
                    {menuItems.map(item => {
                        const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
                        return (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm transition-colors ${isActive ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20' : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-border">
                    <button
                        onClick={() => {
                            logout()
                            navigate('/')
                        }}
                        className="flex w-full items-center gap-3 px-4 py-3 rounded-lg font-mono text-sm text-text-secondary hover:bg-white/5 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-[#0f0f13]">
                <header className="h-16 border-b border-border bg-bg-card/50 backdrop-blur sticky top-0 z-10 flex items-center px-8 justify-between">
                    <div className="font-mono text-sm text-text-secondary">
                        [ System Active ] / {new Date().toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-accent-primary px-3 py-1 bg-accent-primary/10 rounded-full border border-accent-primary/20 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                            Online
                        </span>
                        <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs font-bold font-display">Y</div>
                    </div>
                </header>

                <Outlet />

                {/* Render child routes if matching parent route, or default */}
                <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="projects/*" element={<ManageProjects />} />
                    <Route path="media/*" element={<ManageMedia />} />
                    <Route path="journey/*" element={<ManageJourney />} />
                    <Route path="blog/*" element={<ManageBlog />} />
                </Routes>
            </main>
        </div>
    )
}
