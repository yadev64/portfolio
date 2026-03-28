import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CATEGORIES = ['Frontend', 'Backend', 'Other Technologies', 'Design', 'People and Community'];

const SkillsAdmin = () => {
    const [skills, setSkills] = useState([]);
    const [name, setName] = useState('');
    const [iconClass, setIconClass] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [proficiency, setProficiency] = useState(80);
    const [isSaving, setIsSaving] = useState(false);

    const fetchSkills = async () => {
        try {
            const res = await fetch(`${API}/api/skills`);
            const data = await res.json();
            if (Array.isArray(data)) setSkills(data);
        } catch { toast.error("Failed to load skills"); }
    };

    useEffect(() => { fetchSkills(); }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Skill name is required.");
        setIsSaving(true);

        try {
            const res = await fetch(`${API}/api/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, iconClass, category, proficiency: Number(proficiency) })
            });
            if (res.ok) {
                toast.success('Skill added!');
                setName(''); setIconClass(''); setProficiency(80);
                fetchSkills();
            } else toast.error('Failed');
        } catch { toast.error('Network Error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        await fetch(`${API}/api/skills/${id}`, { method: 'DELETE' });
        toast.success('Deleted'); fetchSkills();
    };

    const grouped = skills.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
    }, {});

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">SKILLS</h1>

            <div className="neu-flat p-6">
                <h2 className="text-lg font-bold text-textMain border-b border-border pb-3 mb-5">Add Skill</h2>
                <form onSubmit={handlePublish} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">Category</label>
                            <select className="neu-input appearance-none" value={category} onChange={e => setCategory(e.target.value)}>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">Skill Name</label>
                            <input className="neu-input" placeholder="e.g. React.js" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">Proficiency ({proficiency}%)</label>
                            <input type="range" min="0" max="100" value={proficiency} onChange={e => setProficiency(e.target.value)} className="w-full accent-primary" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? 'Adding...' : 'Add Skill'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                {CATEGORIES.map(cat => {
                    const items = grouped[cat] || [];
                    if (items.length === 0) return null;
                    return (
                        <div key={cat}>
                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-3 border-b border-border pb-2">{cat}</h3>
                            <div className="flex flex-wrap gap-3">
                                {items.map(s => (
                                    <div key={s._id} className="neu-flat px-4 py-2 flex items-center gap-2 group">
                                        {s.iconClass && <i className={`${s.iconClass} text-lg text-primary`}></i>}
                                        <span className="font-bold text-sm text-textMain">{s.name}</span>
                                        <button onClick={() => handleDelete(s._id)} className="text-red-400 text-[9px] ml-2 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsAdmin;
