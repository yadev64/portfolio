import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import MediumEditor from '../../components/admin/MediumEditor';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const coverInputRef = useRef(null);

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API}/api/projects`);
            const data = await res.json();
            if (Array.isArray(data)) setProjects(data);
        } catch { toast.error("Failed to load projects"); }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleCoverUpload = useCallback(async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const res = await fetch(`${API}/api/upload`, { method: 'POST', body: formData });
            const data = await res.json();
            if (data.url) {
                setCoverImage(data.url);
                setCoverPreview(`${API}${data.url}`);
            }
        } catch { toast.error('Cover upload failed'); }
    }, []);

    const handleCoverDrop = useCallback((e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) handleCoverUpload(file);
    }, [handleCoverUpload]);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title) return toast.error("Title is required.");
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
                setCoverImage(''); setCoverPreview(''); setExternalLink(''); setTagsInput('');
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

            <form onSubmit={handlePublish} className="space-y-5">
                {/* Cover Image */}
                <div>
                    <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Cover Image</label>
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
                    {coverPreview ? (
                        <div className="relative group">
                            <img src={coverPreview} alt="Cover" className="cover-image-preview" />
                            <button type="button" onClick={() => { setCoverImage(''); setCoverPreview(''); }}
                                className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm">✕</button>
                        </div>
                    ) : (
                        <div className="cover-upload-zone"
                            onClick={() => coverInputRef.current?.click()}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleCoverDrop}>
                            📷 Drop cover image here or click to upload
                        </div>
                    )}
                </div>

                {/* Title — large, Medium-style */}
                <input className="w-full bg-transparent text-3xl font-display font-bold placeholder:text-textMuted/50 outline-none border-none py-2"
                    placeholder="Project Title" value={title} onChange={e => setTitle(e.target.value)} required />

                <input className="w-full bg-transparent text-lg placeholder:text-textMuted/40 outline-none border-none"
                    placeholder="Short description / subtitle" value={description} onChange={e => setDescription(e.target.value)} />

                {/* Metadata row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="neu-input" placeholder="External Link (optional)" value={externalLink} onChange={e => setExternalLink(e.target.value)} />
                    <input className="neu-input" placeholder="Tags (comma separated)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                </div>

                {/* Medium-style content editor */}
                <div>
                    <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Case Study Content</label>
                    <MediumEditor value={content} onChange={setContent} placeholder="Write the full project case study here..." />
                </div>

                <div className="flex justify-end pt-3">
                    <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                        {isSaving ? 'Publishing...' : 'Save & Publish'}
                    </button>
                </div>
            </form>

            {/* List */}
            <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-4">Published Projects ({projects.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => (
                        <div key={p._id} className="neu-flat p-4 flex flex-col justify-between">
                            {p.coverImage && <img src={p.coverImage.startsWith('/') ? `${API}${p.coverImage}` : p.coverImage} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />}
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
