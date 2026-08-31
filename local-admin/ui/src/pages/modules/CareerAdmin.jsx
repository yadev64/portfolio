import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Edit2, Trash2, X } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CAREER_TYPES = ['job', 'milestone', 'education'];

const CareerAdmin = () => {
    const [nodes, setNodes] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [designation, setDesignation] = useState('');
    const [company, setCompany] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isPresent, setIsPresent] = useState(false);
    const [details, setDetails] = useState('');
    const [entryType, setEntryType] = useState('job');
    const [highlight, setHighlight] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const formTopRef = useRef(null);

    const fetchNodes = async () => {
        try {
            const res = await fetch(`${API}/api/career`);
            const data = await res.json();
            if (Array.isArray(data)) setNodes(data);
        } catch { toast.error("Failed to load career"); }
    };

    useEffect(() => { fetchNodes(); }, []);

    const resetForm = () => {
        setEditingId(null);
        setDesignation('');
        setCompany('');
        setFromDate('');
        setToDate('');
        setIsPresent(false);
        setDetails('');
        setEntryType('job');
        setHighlight(false);
    };

    const handleStartEdit = (node) => {
        setEditingId(node._id);
        setDesignation(node.designation || '');
        setCompany(node.company || '');
        setFromDate(node.fromDate || '');
        setToDate(node.toDate === 'Present' || node.isPresent ? '' : (node.toDate || ''));
        setIsPresent(Boolean(node.isPresent || node.toDate === 'Present'));
        setDetails(node.details || '');
        setEntryType(node.type || 'job');
        setHighlight(Boolean(node.highlight));

        formTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        toast.info(`Editing: ${node.designation} @ ${node.company}`);
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!designation || !company || !fromDate) return toast.error("Designation, Company, and From Date are required.");
        setIsSaving(true);

        const payload = {
            designation,
            company,
            fromDate,
            toDate: isPresent ? 'Present' : toDate,
            isPresent,
            details,
            type: entryType,
            highlight
        };

        try {
            const url = editingId ? `${API}/api/career/${editingId}` : `${API}/api/career`;
            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success(editingId ? 'Career node updated!' : 'Career node added!');
                resetForm();
                fetchNodes();
            } else {
                toast.error('Failed to save career node');
            }
        } catch {
            toast.error('Network Error');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            await fetch(`${API}/api/career/${id}`, { method: 'DELETE' });
            toast.success('Deleted');
            if (editingId === id) resetForm();
            fetchNodes();
        } catch {
            toast.error('Delete failed');
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto" ref={formTopRef}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">CAREER</h1>
                    <p className="text-xs font-mono text-textMuted mt-1">
                        {editingId ? `Editing Career Node (${editingId})` : 'Manage your professional trajectory and milestones'}
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
                        {editingId ? <><Edit2 size={16} className="text-primary" /> Edit Career Node</> : 'Add New Role'}
                    </h2>
                    {editingId && <span className="font-mono text-[10px] text-textMuted">ID: {editingId}</span>}
                </div>

                <form onSubmit={handlePublish} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input className="neu-input" placeholder="Designation" value={designation} onChange={e => setDesignation(e.target.value)} required />
                        <input className="neu-input" placeholder="Company / Organization" value={company} onChange={e => setCompany(e.target.value)} required />
                        <div>
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">Type</label>
                            <select className="neu-input appearance-none" value={entryType} onChange={e => setEntryType(e.target.value)}>
                                {CAREER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                        <div>
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">From (YYYY-MM)</label>
                            <input type="month" className="neu-input" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
                        </div>
                        {!isPresent && (
                            <div>
                                <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">To (YYYY-MM)</label>
                                <input type="month" className="neu-input" value={toDate} onChange={e => setToDate(e.target.value)} required={!isPresent} />
                            </div>
                        )}
                        <label className="flex items-center gap-2 cursor-pointer pb-3">
                            <input type="checkbox" checked={isPresent} onChange={e => setIsPresent(e.target.checked)} className="w-4 h-4 accent-primary" />
                            <span className="font-mono text-xs text-textMain">Currently here</span>
                        </label>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} className="w-4 h-4 accent-primary" />
                        <span className="font-mono text-xs text-textMain">Highlight on portfolio</span>
                    </label>
                    <textarea className="neu-input resize-none h-28" placeholder="Responsibilities & details..." value={details} onChange={e => setDetails(e.target.value)} />
                    <div className="flex items-center justify-between pt-2">
                        {editingId ? (
                            <button type="button" onClick={resetForm} className="font-mono text-xs text-textMuted hover:underline">
                                Cancel
                            </button>
                        ) : <div />}
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Career Node' : 'Add Career Node')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Timeline */}
            <div>
                <h3 className="font-mono text-xs uppercase tracking-widest text-textMuted mb-4">Timeline Nodes ({nodes.length})</h3>
                <div className="space-y-4">
                    {nodes.map(n => {
                        const isCurrentlyEditing = editingId === n._id;
                        return (
                            <div key={n._id} className={`neu-flat p-4 rounded-xl relative transition-all ${isCurrentlyEditing ? 'ring-2 ring-primary bg-primary/5' : ''}`}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-bold text-textMain text-base">
                                            {n.designation} <span className="text-primary font-normal">@ {n.company}</span>
                                        </h4>
                                        <p className="font-mono text-[10px] text-textMuted mt-0.5">
                                            {n.fromDate} — {n.isPresent ? 'Present' : n.toDate} · <span className="uppercase text-primary">{n.type}</span>
                                        </p>
                                    </div>
                                    {n.highlight && (
                                        <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-primary/20 text-primary border border-primary/30">
                                            Highlighted
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-textMuted mt-2">{n.details}</p>
                                <div className="flex items-center justify-end gap-3 mt-3 pt-2 border-t border-border/30">
                                    <button
                                        type="button"
                                        onClick={() => handleStartEdit(n)}
                                        className="text-primary font-mono text-xs uppercase hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <Edit2 size={12} /> Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(n._id, `${n.designation} @ ${n.company}`)}
                                        className="text-red-400 font-mono text-xs uppercase hover:underline flex items-center gap-1 cursor-pointer"
                                    >
                                        <Trash2 size={12} /> Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default CareerAdmin;
