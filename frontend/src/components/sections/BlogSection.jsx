import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'

const MOCK_BLOGS = [
    {
        slug: 'why-i-left-gcp',
        title: 'Why I left GCP for AWS, and never looked back',
        excerpt: 'An objective look at IAM roles, managed Kubernetes, and the developer experience that ultimately won me over.',
        mood: 'Thoughts',
        published_at: '2025-11-20',
        read_time: '8 min read'
    },
    {
        slug: 'building-requestlab',
        title: 'Building an Open Source Postman Alternative in Rust',
        excerpt: 'How I used Tauri and Rust to build a blazingly fast API client with native git diffing capabilities.',
        mood: 'Built This',
        published_at: '2025-10-05',
        read_time: '12 min read'
    },
    {
        slug: 'react-server-components',
        title: 'React Server Components: The Good, The Bad, and The Fetch',
        excerpt: 'Demystifying RSC patterns. When to use them, when to avoid them, and why everyone is so confused.',
        mood: 'Deep Dive',
        published_at: '2025-09-12',
        read_time: '6 min read'
    }
]

const MOODS = ['All', 'Deep Dive', 'Quick Take', 'Built This', 'Thoughts']

export const BlogSection = () => {
    const navigate = useNavigate()
    const [filter, setFilter] = useState('All')

    const filteredBlogs = filter === 'All'
        ? MOCK_BLOGS
        : MOCK_BLOGS.filter(b => b.mood === filter)

    return (
        <section id="blog" className="min-h-full py-12 px-4 md:px-12 relative bg-bg-secondary/30">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl md:text-6xl font-display font-bold text-text-primary mb-12">
                    Written <span className="text-accent-secondary italic">Thoughts</span>
                </h2>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-16">
                    {MOODS.map(mood => (
                        <button
                            key={mood}
                            onClick={() => setFilter(mood)}
                            className={`px-4 py-2 rounded-full font-mono text-sm border transition-all duration-300 ${filter === mood
                                ? 'bg-accent-primary text-bg-primary border-accent-primary'
                                : 'bg-transparent text-text-secondary border-border hover:border-accent-primary'
                                }`}
                        >
                            {mood}
                        </button>
                    ))}
                </div>

                {/* Blog Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredBlogs.map((blog, idx) => (
                            <motion.div
                                key={blog.slug}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                                onClick={() => navigate(`/blog/${blog.slug}`)}
                                className="bg-bg-card border border-border rounded-2xl p-8 cursor-pointer group hover:border-accent-primary transition-colors flex flex-col h-full"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-xs font-mono text-text-secondary uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-border group-hover:bg-accent-primary/10 group-hover:text-accent-primary transition-colors">
                                        {blog.mood}
                                    </span>
                                    <span className="text-xs font-mono text-text-secondary">
                                        {format(new Date(blog.published_at), 'MMM dd, yyyy')}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-display font-bold text-text-primary mb-4 group-hover:text-accent-primary transition-colors">
                                    {blog.title}
                                </h3>

                                <p className="text-text-secondary font-body line-clamp-3 mb-8 flex-grow">
                                    {blog.excerpt}
                                </p>

                                <div className="flex justify-between items-center text-sm font-mono text-text-secondary mt-auto">
                                    <span>{blog.read_time}</span>
                                    <span className="opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all text-accent-primary">
                                        Read →
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    )
}
