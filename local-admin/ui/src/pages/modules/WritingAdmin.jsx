import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import WysiwygEditor from '../../components/admin/WysiwygEditor';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const WritingAdmin = () => {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [readTime, setReadTime] = useState('');
    const [mood, setMood] = useState('📝');
    const [isSaving, setIsSaving] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API}/api/writing`);
            const data = await res.json();
            if (Array.isArray(data)) setPosts(data);
        } catch { toast.error("Failed to load posts"); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!title || !content) return toast.error("Title and Content are required.");
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
                setTitle(''); setSubtitle(''); setContent(''); setCoverImage(''); setTagsInput(''); setReadTime(''); setMood('📝');
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

            <div className="neu-flat p-6 space-y-5">
                <h2 className="text-lg font-bold text-textMain border-b border-border pb-3">Draft New Post</h2>
                <form onSubmit={handlePublish} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="neu-input" placeholder="Post Title" value={title} onChange={e => setTitle(e.target.value)} required />
                        <input className="neu-input" placeholder="Subtitle / Excerpt" value={subtitle} onChange={e => setSubtitle(e.target.value)} />
                        <input className="neu-input" placeholder="Cover Image URL" value={coverImage} onChange={e => setCoverImage(e.target.value)} />
                        <div className="flex gap-3">
                            <input className="neu-input flex-1" placeholder="Tags (e.g. Code, Life)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                            <input className="neu-input w-24" placeholder="5 min" value={readTime} onChange={e => setReadTime(e.target.value)} />
                            <input className="neu-input w-16 text-center text-xl" placeholder="📝" value={mood} onChange={e => setMood(e.target.value)} title="Mood emoji" />
                        </div>
                    </div>
                    <div className="pt-2">
                        <label className="block font-mono text-[10px] uppercase text-textMuted mb-2 tracking-widest">Post Content</label>
                        <WysiwygEditor value={content} onChange={setContent} placeholder="Start writing..." />
                    </div>
                    <div className="flex justify-end pt-3">
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>

            <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-4">Published Posts ({posts.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {posts.map(p => (
                        <div key={p._id} className="neu-flat p-4">
                            <h4 className="font-bold text-textMain">{p.title}</h4>
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
