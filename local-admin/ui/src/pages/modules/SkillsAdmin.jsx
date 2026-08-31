import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Edit2, Trash2, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CATEGORIES = ['AI & Agents', 'DevOps & Cloud', 'Frontend', 'Backend', 'Architecture', 'Tools'];

const SkillsAdmin = () => {
    const [skills, setSkills] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [iconClass, setIconClass] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [proficiency, setProficiency] = useState(80);
    const [isSaving, setIsSaving] = useState(false);
    const formTopRef = useRef(null);

    const fetchSkills = async () => {
        try {
            const res = await fetch(`${API}/api/skills`);
            const data = await res.json();
            if (Array.isArray(data)) setSkills(data);
        } catch { toast.error("Failed to load skills"); }
    };

    useEffect(() => { fetchSkills(); }, []);

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setIconClass('');
        setCategory(CATEGORIES[0]);
        setProficiency(80);
    };

    const handleStartEdit = (skill) => {
        setEditingId(skill._id);
        setName(skill.name || '');
        setIconClass(skill.iconClass || '');
        setCategory(skill.category || CATEGORIES[0]);
        setProficiency(skill.proficiency || 80);

        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        toast.info(`Editing skill: ${skill.name}`);
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!name) return toast.error("Skill name is required.");
        setIsSaving(true);

        const payload = {
            name,
            iconClass,
            category,
            proficiency: Number(proficiency)
        };

        try {
            const url = editingId ? `${API}/api/skills/${editingId}` : `${API}/api/skills`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? 'Skill Updated!' : 'Skill Added!');
                resetForm();
                fetchSkills();
            } else {
                toast.error('Failed to save skill');
            }
        } catch {
            toast.error('Network Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, skillName) => {
        if (!window.confirm(`Are you sure you want to delete "${skillName}"?`)) return;
        try {
            await fetch(`${API}/api/skills/${id}`, { method: 'DELETE' });
            toast.success('Skill Deleted');
            if (editingId === id) resetForm();
            fetchSkills();
        } catch {
            toast.error('Delete failed');
        }
    };

    const grouped = skills.reduce((acc, s) => {
        const cat = s.category || 'Other Technologies';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(s);
        return acc;
    }, {});

    return (
        <div className="space-y-8 max-w-4xl mx-auto" ref={formTopRef}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">SKILLS</h1>
                    <p className="text-xs font-mono text-textMuted mt-1">
                        {editingId ? `Editing Skill (${editingId})` : 'Manage technical proficiencies and categories'}
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

            <div className={`neu-flat p-6 ${editingId ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center justify-between border-b border-border pb-3 mb-5">
                    <h2 className="text-lg font-bold text-textMain flex items-center gap-2">
                        {editingId ? <><Edit2 size={16} className="text-primary" /> Edit Skill</> : 'Add Skill'}
                    </h2>
                    {editingId && <span className="font-mono text-[10px] text-textMuted">ID: {editingId}</span>}
                </div>

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
                            <input className="neu-input" placeholder="e.g. React / Next.js" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">Devicon Class (optional)</label>
                            <input className="neu-input" placeholder="e.g. devicon-react-original" value={iconClass} onChange={e => setIconClass(e.target.value)} />
                        </div>
                        <div>
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">Proficiency ({proficiency}%)</label>
                            <input type="range" min="0" max="100" value={proficiency} onChange={e => setProficiency(e.target.value)} className="w-full accent-primary mt-2" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        {editingId ? (
                            <button type="button" onClick={resetForm} className="font-mono text-xs text-textMuted hover:underline">
                                Cancel
                            </button>
                        ) : <div />}
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Skill' : 'Add Skill')}
                        </button>
                    </div>
                </form>
            </div>

            <div className="space-y-6">
                {Object.keys(grouped).map(cat => {
                    const items = grouped[cat] || [];
                    if (items.length === 0) return null;
                    return (
                        <div key={cat}>
                            <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-3 border-b border-border pb-2">
                                {cat} ({items.length})
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {items.map(s => {
                                    const isCurrentlyEditing = editingId === s._id;
                                    return (
                                        <div key={s._id} className={`neu-flat p-3 flex items-center justify-between group transition-all ${isCurrentlyEditing ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                {s.iconClass && <i className={`${s.iconClass} text-lg text-primary shrink-0`}></i>}
                                                <div className="min-w-0">
                                                    <span className="font-bold text-sm text-textMain truncate block">{s.name}</span>
                                                    <span className="font-mono text-[10px] text-textMuted">{s.proficiency}%</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStartEdit(s)}
                                                    className="p-1 rounded text-primary hover:bg-primary/10 transition-colors"
                                                    title="Edit Skill"
                                                >
                                                    <Edit2 size={12} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(s._id, s.name)}
                                                    className="p-1 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                                                    title="Delete Skill"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SkillsAdmin;
