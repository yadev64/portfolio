import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { format } from 'date-fns'

export const BlogPost = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { scrollYProgress } = useScroll()
    const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 })

    const blog = {
        title: 'Why I left GCP for AWS, and never looked back',
        mood: 'Thoughts',
        published_at: '2025-11-20',
        content: "<h2>The Tipping Point</h2><p>It was a cold tuesday when I realized IAM on GCP was not the same.</p><p>We had scaling issues, and AWS provided a more granular set of tools...</p><blockquote>The shift wasn't easy, but the documentation delta was massive.</blockquote>",
        read_time: '8 min read'
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-bg-primary text-text-primary font-body pb-32"
        >
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 z-50 origin-left"
                style={{ scaleX: pathLength, backgroundColor: 'var(--accent-secondary)' }}
            />

            <div className="max-w-3xl mx-auto px-4 pt-32">
                <button
                    onClick={() => navigate(-1)}
                    className="text-text-secondary hover:text-white font-mono text-sm mb-12 flex items-center"
                >
                    ← Back to Writings
                </button>

                <div className="flex items-center gap-4 mb-8">
                    <span className="text-sm font-mono text-text-secondary uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full border border-border">
                        {blog.mood}
                    </span>
                    <span className="text-sm font-mono text-text-secondary">
                        {format(new Date(blog.published_at), 'MMMM dd, yyyy')} • {blog.read_time}
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 leading-tight">
                    {blog.title}
                </h1>

                <article
                    className="prose prose-invert prose-lg prose-p:text-text-secondary prose-headings:font-display prose-headings:text-text-primary prose-a:text-accent-secondary max-w-none"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </div>
        </motion.div>
    )
}
