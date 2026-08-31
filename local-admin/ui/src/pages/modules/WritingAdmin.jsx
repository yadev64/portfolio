import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import MediumEditor from '../../components/admin/MediumEditor';
import { Edit2, Trash2, X, Plus } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const WritingAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [readTime, setReadTime] = useState('');
    const [mood, setMood] = useState('📝');
    const [isSaving, setIsSaving] = useState(false);
    const coverInputRef = useRef(null);
    const formTopRef = useRef(null);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API}/api/writing`);
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch { toast.error("Failed to load posts"); }
    };

    useEffect(() => { fetchPosts(); }, []);

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
        setSubtitle('');
        setContent('');
        setCoverImage('');
        setCoverPreview('');
        setTagsInput('');
        setReadTime('');
        setMood('📝');
    };

    const handleStartEdit = (post) => {
        setEditingId(post._id);
        setTitle(post.title || '');
        setSubtitle(post.subtitle || '');
        setContent(post.content || '');
        setCoverImage(post.coverImage || '');
        setCoverPreview(post.coverImage ? (post.coverImage.startsWith('/') ? `${API}${post.coverImage}` : post.coverImage) : '');
        setTagsInput(Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''));
        setReadTime(post.readTime || '');
        setMood(post.mood || '📝');

        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        toast.info(`Editing: ${post.title}`);
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title) return toast.error("Title is required.");
        setIsSaving(true);

        const payload = {
            title,
            subtitle,
            content,
            coverImage,
            readTime: readTime || '5 min',
            mood,
            tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
            slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            published: true,
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        };

        try {
            const url = editingId ? `${API}/api/writing/${editingId}` : `${API}/api/writing`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? 'Post Updated Successfully!' : 'Post Published Successfully!');
                resetForm();
                fetchPosts();
            } else {
                toast.error('Failed to save post');
            }
        } catch {
            toast.error('Network Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, postTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) return;
        try {
            await fetch(`${API}/api/writing/${id}`, { method: 'DELETE' });
            toast.success('Post Deleted');
            if (editingId === id) resetForm();
            fetchPosts();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto" ref={formTopRef}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">WRITING</h1>
                    <p className="text-xs font-mono text-textMuted mt-1">
                        {editingId ? `Editing Post (${editingId})` : 'Author a new long-form article or technical story'}
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
                    placeholder="Post Title" value={title} onChange={e => setTitle(e.target.value)} required />

                <input className="w-full bg-transparent text-lg placeholder:text-textMuted/40 outline-none border-none"
                    placeholder="Subtitle / excerpt" value={subtitle} onChange={e => setSubtitle(e.target.value)} />

                {/* Metadata row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="neu-input" placeholder="Tags (e.g. Code, Architecture)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                    <input className="neu-input" placeholder="Read time (e.g. 8 min)" value={readTime} onChange={e => setReadTime(e.target.value)} />
                    <input className="neu-input text-center text-xl" placeholder="📝" value={mood} onChange={e => setMood(e.target.value)} title="Mood emoji" />
                </div>

                {/* Medium-style content editor */}
                <div>
                    <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Post Content (HTML / Markdown Supported)</label>
                    <MediumEditor value={content} onChange={setContent} placeholder="Start writing your story..." />
                </div>

                <div className="flex items-center justify-between pt-3">
                    {editingId ? (
                        <button type="button" onClick={resetForm} className="font-mono text-xs text-textMuted hover:underline">
                            Discard Changes
                        </button>
                    ) : <div />}
                    <div className="flex gap-3">
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? (editingId ? 'Updating...' : 'Publishing...') : (editingId ? 'Update Post' : 'Publish Post')}
                        </button>
                    </div>
                </div>
            </form>

            <div className="pt-8 border-t border-border/40">
                <h3 className="font-mono text-xs uppercase tracking-widest text-textMuted mb-4">Published Posts ({posts.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map(p => {
                        const isCurrentlyEditing = editingId === p._id;
                        const coverSrc = p.coverImage?.startsWith('/') ? `${API}${p.coverImage}` : p.coverImage;
                        return (
                            <div key={p._id} className={`neu-flat p-4 flex flex-col justify-between transition-all ${isCurrentlyEditing ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                {coverSrc && <img src={coverSrc} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />}
                                <div>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{p.mood || '📝'}</span>
                                            <h4 className="font-bold text-textMain line-clamp-1">{p.title}</h4>
                                        </div>
                                        <span className="font-mono text-[10px] text-textMuted shrink-0 ml-2">{p.readTime}</span>
                                    </div>
                                    <p className="text-sm text-textMuted line-clamp-2 mt-1.5">{p.subtitle}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
                                    <span className="font-mono text-[10px] text-textMuted">{p.date || 'Recent'}</span>
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

export default WritingAdmin;
