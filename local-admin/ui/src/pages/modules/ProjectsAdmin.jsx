import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import WysiwygEditor from '../../components/admin/WysiwygEditor';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API}/api/projects`);
            const data = await res.json();
            if (Array.isArray(data)) setProjects(data);
        } catch { toast.error("Failed to load projects"); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title || !content) return toast.error("Title and Content are required.");
        setIsSaving(true);

        try {
            const res = await fetch(`${API}/api/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title, description, content, coverImage, externalLink,
                    tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    published: true
                })
            });
            if (res.ok) {
                toast.success('Project Published!');
                setTitle(''); setDescription(''); setContent('');
                setCoverImage(''); setExternalLink(''); setTagsInput('');
                fetchProjects();
            } else toast.error('Failed to publish');
        } catch { toast.error('Network Error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API}/api/projects/${id}`, { method: 'DELETE' });
            toast.success('Deleted');
            fetchProjects();
        } catch { toast.error('Delete failed'); }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">PROJECTS</h1>

            <div className="neu-flat p-6 space-y-5">
                <h2 className="text-lg font-bold text-textMain border-b border-border pb-3">New Project / Case Study</h2>
                <form onSubmit={handlePublish} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="neu-input" placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />
                        <input className="neu-input" placeholder="External Link (optional)" value={externalLink} onChange={e => setExternalLink(e.target.value)} />
                        <input className="neu-input" placeholder="Cover Image URL" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
                        <input className="neu-input" placeholder="Tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                    </div>
                    <textarea className="neu-input resize-none h-20" placeholder="Short description / subtitle" value={description} onChange={e => setDescription(e.target.value)} />

                    <div className="pt-2">
                        <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Case Study Content</label>
                        <WysiwygEditor value={content} onChange={setContent} placeholder="Write the full project case study here..." />
                    </div>

                    <div className="flex justify-end pt-3">
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? 'Publishing...' : 'Save & Publish'}
                        </button>
                    </div>
                </form>
            </div>

            {/* List */}
            <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-4">Published Projects ({projects.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => (
                        <div key={p._id} className="neu-flat p-4 flex flex-col justify-between">
                            <div>
                                <h4 className="font-bold text-textMain">{p.title}</h4>
                                <p className="text-sm text-textMuted line-clamp-2 mt-1">{p.description}</p>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex gap-1 flex-wrap">
                                    {p.tags?.map(t => <span key={t} className="text-[9px] font-mono bg-white/30 px-2 py-0.5 rounded">{t}</span>)}
                                </div>
                                <button onClick={() => handleDelete(p._id)} className="text-red-500 font-mono text-[10px] uppercase hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectsAdmin;
