import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import MediumEditor from '../../components/admin/MediumEditor';
import { Edit2, Trash2, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const ProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [externalLink, setExternalLink] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const coverInputRef = useRef(null);
    const formTopRef = useRef(null);

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

    const resetForm = () => {
        setEditingId(null);
        setTitle('');
        setDescription('');
        setContent('');
        setCoverImage('');
        setCoverPreview('');
        setExternalLink('');
        setTagsInput('');
    };

    const handleStartEdit = (project) => {
        setEditingId(project._id);
        setTitle(project.title || '');
        setDescription(project.description || '');
        setContent(project.content || '');
        setCoverImage(project.coverImage || '');
        setCoverPreview(project.coverImage ? (project.coverImage.startsWith('/') ? `${API}${project.coverImage}` : project.coverImage) : '');
        setExternalLink(project.externalLink || '');
        setTagsInput(Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || ''));

        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        toast.info(`Editing: ${project.title}`);
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title) return toast.error("Title is required.");
        setIsSaving(true);

        const payload = {
            title,
            description,
            content,
            coverImage,
            externalLink,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            published: true
        };

        try {
            const url = editingId ? `${API}/api/projects/${editingId}` : `${API}/api/projects`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? 'Project Updated Successfully!' : 'Project Published Successfully!');
                resetForm();
                fetchProjects();
            } else {
                toast.error('Failed to save project');
            }
        } catch {
            toast.error('Network Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, projectTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${projectTitle}"?`)) return;
        try {
            await fetch(`${API}/api/projects/${id}`, { method: 'DELETE' });
            toast.success('Project Deleted');
            if (editingId === id) resetForm();
            fetchProjects();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto" ref={formTopRef}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">PROJECTS</h1>
                    <p className="text-xs font-mono text-textMuted mt-1">
                        {editingId ? `Editing Project (${editingId})` : 'Showcase your engineering builds and case studies'}
                    </p>
                </div>
                {editingId && (
                    <button
                        onClick={resetForm}
                        type="button"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg neu-flat text-xs font-mono uppercase text-red-400 hover:text-red-300"
                    >
                        <X size={14} /> Cancel Edit
                    </button>
                )}
            </div>

            <form onSubmit={handlePublish} className={`space-y-5 ${editingId ? 'p-6 rounded-2xl neu-pressed' : ''}`}>
                {editingId && (
                    <div className="flex items-center justify-between pb-3 border-b border-border/40">
                        <span className="font-mono text-xs text-primary font-bold uppercase tracking-wider flex items-center gap-2">
                            <Edit2 size={14} /> Editing Mode
                        </span>
                        <span className="font-mono text-[10px] text-textMuted">ID: {editingId}</span>
                    </div>
                )}

                {/* Cover Image */}
                <div>
                    <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Cover Image</label>
                    <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleCoverUpload(f); }} />
                    {coverPreview ? (
                        <div className="relative group">
                            <img src={coverPreview} alt="Cover" className="cover-image-preview max-h-64 w-full object-cover rounded-xl" />
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
                    <input className="neu-input" placeholder="External Link (GitHub / Live URL)" value={externalLink} onChange={e => setExternalLink(e.target.value)} />
                    <input className="neu-input" placeholder="Tags (comma separated, e.g. React, Swift, IoT)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                </div>

                {/* Medium-style content editor */}
                <div>
                    <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Case Study Content (HTML / Markdown Supported)</label>
                    <MediumEditor value={content} onChange={setContent} placeholder="Write the full project case study here..." />
                </div>

                <div className="flex items-center justify-between pt-3">
                    {editingId ? (
                        <button type="button" onClick={resetForm} className="font-mono text-xs text-textMuted hover:underline">
                            Discard Changes
                        </button>
                    ) : <div />}
                    <div className="flex gap-3">
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Project' : 'Save & Publish')}
                        </button>
                    </div>
                </div>
            </form>

            {/* List */}
            <div className="pt-8 border-t border-border/40">
                <h3 className="font-mono text-xs uppercase tracking-widest text-textMuted mb-4">Published Projects ({projects.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map(p => {
                        const isCurrentlyEditing = editingId === p._id;
                        const coverSrc = p.coverImage?.startsWith('/') ? `${API}${p.coverImage}` : p.coverImage;
                        return (
                            <div key={p._id} className={`neu-flat p-4 flex flex-col justify-between transition-all ${isCurrentlyEditing ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                {coverSrc && <img src={coverSrc} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />}
                                <div>
                                    <h4 className="font-bold text-textMain line-clamp-1">{p.title}</h4>
                                    <p className="text-sm text-textMuted line-clamp-2 mt-1">{p.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                                    <div className="flex gap-1 flex-wrap max-w-[65%]">
                                        {p.tags?.slice(0, 3).map(t => <span key={t} className="text-[9px] font-mono bg-white/30 px-2 py-0.5 rounded">{t}</span>)}
                                        {p.tags?.length > 3 && <span className="text-[9px] font-mono text-textMuted">+{p.tags.length - 3}</span>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(p)}
                                            className="text-primary font-mono text-xs uppercase hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <Edit2 size={12} /> Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(p._id, p.title)}
                                            className="text-red-400 font-mono text-xs uppercase hover:underline flex items-center gap-1 cursor-pointer"
                                        >
                                            <Trash2 size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProjectsAdmin;
