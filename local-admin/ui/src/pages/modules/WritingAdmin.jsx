import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import MediumEditor from '../../components/admin/MediumEditor';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const WritingAdmin = () => {
    const [posts, setPosts] = useState([]);
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

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title) return toast.error("Title is required.");
        setIsSaving(true);

        try {
            const res = await fetch(`${API}/api/writing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title, subtitle, content, coverImage, readTime, mood,
                    tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
                    slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                    published: true,
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                })
            });
            if (res.ok) {
                toast.success('Post Published!');
                setTitle(''); setSubtitle(''); setContent(''); setCoverImage(''); setCoverPreview(''); setTagsInput(''); setReadTime(''); setMood('📝');
                fetchPosts();
            } else toast.error('Failed');
        } catch { toast.error('Network Error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        await fetch(`${API}/api/writing/${id}`, { method: 'DELETE' });
        toast.success('Deleted'); fetchPosts();
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">WRITING</h1>

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
                    placeholder="Post Title" value={title} onChange={e => setTitle(e.target.value)} required />

                <input className="w-full bg-transparent text-lg placeholder:text-textMuted/40 outline-none border-none"
                    placeholder="Subtitle / excerpt" value={subtitle} onChange={e => setSubtitle(e.target.value)} />

                {/* Metadata row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input className="neu-input" placeholder="Tags (e.g. Code, Life)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                    <input className="neu-input" placeholder="Read time (e.g. 5 min)" value={readTime} onChange={e => setReadTime(e.target.value)} />
                    <input className="neu-input text-center text-xl" placeholder="📝" value={mood} onChange={e => setMood(e.target.value)} title="Mood emoji" />
                </div>

                {/* Medium-style content editor */}
                <div>
                    <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Post Content</label>
                    <MediumEditor value={content} onChange={setContent} placeholder="Start writing your story..." />
                </div>

                <div className="flex justify-end pt-3">
                    <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                        {isSaving ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>

            <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-4">Published Posts ({posts.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map(p => (
                        <div key={p._id} className="neu-flat p-4">
                            {p.coverImage && <img src={p.coverImage.startsWith('/') ? `${API}${p.coverImage}` : p.coverImage} className="w-full h-32 object-cover rounded-lg mb-3" alt="" />}
                            <div className="flex items-start justify-between">
                                <div>
                                    <span className="text-lg mr-2">{p.mood}</span>
                                    <h4 className="font-bold text-textMain inline">{p.title}</h4>
                                </div>
                                <span className="font-mono text-[10px] text-textMuted shrink-0">{p.readTime}</span>
                            </div>
                            <p className="text-sm text-textMuted line-clamp-2 mt-1">{p.subtitle}</p>
                            <div className="flex items-center justify-between mt-3">
                                <span className="font-mono text-[10px] text-textMuted">{p.date}</span>
                                <button onClick={() => handleDelete(p._id)} className="text-red-500 font-mono text-[10px] uppercase hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WritingAdmin;
