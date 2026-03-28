import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const CAREER_TYPES = ['job', 'milestone', 'education'];

const CareerAdmin = () => {
    const [nodes, setNodes] = useState([]);
    const [designation, setDesignation] = useState('');
    const [company, setCompany] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [isPresent, setIsPresent] = useState(false);
    const [details, setDetails] = useState('');
    const [entryType, setEntryType] = useState('job');
    const [highlight, setHighlight] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const fetchNodes = async () => {
        try {
            const res = await fetch(`${API}/api/career`);
            const data = await res.json();
            if (Array.isArray(data)) setNodes(data);
        } catch { toast.error("Failed to load career"); }
    };

    useEffect(() => { fetchNodes(); }, []);

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!designation || !company || !fromDate) return toast.error("Designation, Company, and From Date are required.");
        setIsSaving(true);

        try {
            const res = await fetch(`${API}/api/career`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ designation, company, fromDate, toDate: isPresent ? 'Present' : toDate, isPresent, details, type: entryType, highlight })
            });
            if (res.ok) {
                toast.success('Career node added!');
                setDesignation(''); setCompany(''); setFromDate(''); setToDate(''); setIsPresent(false); setDetails(''); setEntryType('job'); setHighlight(false);
                fetchNodes();
            } else toast.error('Failed');
        } catch { toast.error('Network Error'); }
        finally { setIsSaving(false); }
    };

    const handleDelete = async (id) => {
        await fetch(`${API}/api/career/${id}`, { method: 'DELETE' });
        toast.success('Deleted'); fetchNodes();
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-display font-bold text-textMain tracking-wider">CAREER</h1>

            <div className="neu-flat p-6">
                <h2 className="text-lg font-bold text-textMain border-b border-border pb-3 mb-5">Add New Role</h2>
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
                            <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">From</label>
                            <input type="month" className="neu-input" value={fromDate} onChange={e => setFromDate(e.target.value)} required />
                        </div>
                        {!isPresent && (
                            <div>
                                <label className="block font-mono text-[10px] uppercase text-textMuted mb-1">To</label>
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
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="neu-btn px-8 py-3 font-mono text-xs uppercase tracking-wider text-primary font-bold">
                            {isSaving ? 'Saving...' : 'Add Career Node'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Timeline */}
            <div>
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-textMuted mb-4">Timeline ({nodes.length})</h3>
                {nodes.map(n => (
                    <div key={n._id} className="border-l-2 border-primary/30 pl-6 pb-6 relative">
                        <div className="absolute w-3 h-3 rounded-full bg-primary -left-[7px] top-1"></div>
                        <h4 className="font-bold text-textMain">{n.designation} <span className="text-primary font-normal">@ {n.company}</span></h4>
                        <p className="font-mono text-[10px] text-textMuted mt-0.5">{n.fromDate} — {n.isPresent ? 'Present' : n.toDate}</p>
                        <p className="text-sm text-textMuted mt-2">{n.details}</p>
                        <button onClick={() => handleDelete(n._id)} className="text-red-500 font-mono text-[10px] uppercase mt-2 hover:underline">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CareerAdmin;
