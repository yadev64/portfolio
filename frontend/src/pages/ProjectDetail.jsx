import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, ArrowUpRight } from 'lucide-react';
import Header from '../components/ui/Header';
import PROJECTS_DATA from '../data/projects.json';

export const ProjectDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const project = PROJECTS_DATA.find(p => (p.slug || p._id) === slug);
    const otherProjects = PROJECTS_DATA.filter(p => (p.slug || p._id) !== slug).slice(0, 3);

    if (!project) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-display font-bold text-textMain mb-4">Project not found</h1>
                    <button onClick={() => navigate('/')} className="text-primary font-mono text-sm">← Back to home</button>
                </div>
            </div>
        );
    }

    const coverSrc = project.coverImage?.startsWith('/uploads')
        ? project.coverImage
        : project.coverImage;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background text-textMain font-body"
        >
            <Header />

            {/* Cover Image */}
            {coverSrc && (
                <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden">
                    <img
                        src={coverSrc}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
            )}

            {/* Content */}
            <div className={`max-w-4xl mx-auto px-6 md:px-12 ${coverSrc ? '-mt-20 relative z-10' : 'pt-24'}`}>
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-textMuted hover:text-primary transition-colors font-mono text-xs uppercase tracking-widest mb-6"
                >
                    <ArrowLeft size={14} /> Back
                </button>

                {/* Tags */}
                {project.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map(tag => (
                            <span key={tag} className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider bg-surface text-textMuted rounded-full shadow-[2px_2px_5px_var(--shadow-dark),-2px_-2px_5px_var(--shadow-light)]">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-display font-bold text-textMain mb-4 leading-tight">
                    {project.title}
                </h1>

                {/* Description */}
                {project.description && (
                    <p className="text-lg text-textMuted leading-relaxed mb-8 max-w-2xl">
                        {project.description}
                    </p>
                )}

                {/* External link */}
                {project.externalLink && (
                    <a
                        href={project.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-mono text-sm uppercase tracking-wider mb-12 hover:opacity-90 transition-opacity"
                    >
                        Visit Project <ExternalLink size={14} />
                    </a>
                )}

                {/* Rich Content from CMS */}
                {project.content && (
                    <article
                        className="prose prose-lg max-w-none mb-16
                            prose-headings:font-display prose-headings:text-textMain prose-headings:font-bold
                            prose-p:text-textMuted prose-p:leading-relaxed
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-blockquote:border-l-primary prose-blockquote:text-textMuted prose-blockquote:italic
                            prose-code:text-primary prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                            prose-pre:bg-[#1a1a2e] prose-pre:text-[#e0e0e0] prose-pre:rounded-xl
                            prose-img:rounded-xl prose-img:shadow-lg
                            prose-strong:text-textMain
                            prose-li:text-textMuted
                            prose-hr:border-border"
                        dangerouslySetInnerHTML={{ __html: project.content }}
                    />
                )}

                {!project.content && (
                    <div className="py-16 text-center">
                        <p className="text-textMuted font-mono text-sm">Case study coming soon...</p>
                    </div>
                )}
            </div>

            {/* ─── Suggestions: Other Projects ─── */}
            {otherProjects.length > 0 && (
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-20 mt-8">
                    <div className="border-t border-border/50 pt-12">
                        <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-textMuted mb-8">Other Projects</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {otherProjects.map(p => {
                                const pSlug = p.slug || p._id;
                                const pCover = p.coverImage;
                                return (
                                    <Link
                                        key={p._id}
                                        to={`/projects/${pSlug}`}
                                        className="group bg-surface rounded-2xl overflow-hidden shadow-[4px_4px_10px_var(--shadow-dark),-4px_-4px_10px_var(--shadow-light)] hover:shadow-[6px_6px_14px_var(--shadow-dark),-6px_-6px_14px_var(--shadow-light)] transition-shadow"
                                    >
                                        {pCover && (
                                            <img src={pCover} alt={p.title} className="w-full h-36 object-cover" />
                                        )}
                                        <div className="p-5">
                                            <h4 className="font-display font-bold text-textMain group-hover:text-primary transition-colors mb-1">
                                                {p.title}
                                            </h4>
                                            <p className="text-sm text-textMuted line-clamp-2">{p.description}</p>
                                            <div className="flex items-center gap-1 mt-3 text-primary font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                View <ArrowUpRight size={12} />
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};
