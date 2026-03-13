import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { toast } from 'sonner'
import { Lock } from 'lucide-react'

export const DashboardLogin = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { setAuth } = useAppStore()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Stub api call
            // const res = await fetch('http://localhost:8787/api/auth/login', { ... })
            setTimeout(() => {
                if (email === 'yadev@example.com' && password === 'admin') {
                    setAuth('mock-jwt-token-123')
                    toast.success('Authentication successful')
                    navigate('/dashboard')
                } else {
                    toast.error('Invalid credentials')
                }
                setLoading(false)
            }, 1000)
        } catch (err) {
            toast.error('Connection failed')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-bg-card border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-tertiary" />

                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-bg-secondary border border-border flex items-center justify-center">
                        <Lock className="text-accent-primary" size={24} />
                    </div>
                </div>

                <h1 className="text-2xl font-display font-bold text-center mb-2">System Login</h1>
                <p className="text-center font-mono text-sm text-text-secondary mb-8">Authorized personnel only.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-mono text-text-secondary mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary font-mono transition-colors"
                            placeholder="admin@yadev.dev"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-text-secondary mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-bg-secondary border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent-primary font-mono transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-text-primary text-bg-primary font-bold font-display py-3 rounded-lg hover:bg-white transition-colors mt-8 disabled:opacity-70 flex items-center justify-center"
                    >
                        {loading ? <span className="w-5 h-5 border-2 border-bg-primary border-t-transparent rounded-full animate-spin" /> : 'Authenticate'}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
