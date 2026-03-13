import React from 'react'

export const ManageProjects = () => {
    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-display font-bold text-text-primary">Projects</h1>
                    <p className="text-text-secondary mt-2 text-sm font-mono">Manage case studies and works.</p>
                </div>
                <button className="bg-accent-primary text-bg-primary px-6 py-2 rounded-lg font-mono text-sm font-bold hover:bg-[#86f8ce] transition-colors">
                    + New Project
                </button>
            </div>

            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
                <table className="w-full text-left font-mono text-sm">
                    <thead className="bg-[#1a1a24] text-text-secondary border-b border-border">
                        <tr>
                            <th className="p-4 font-normal">Title</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-text-primary">RequestLab</td>
                            <td className="p-4"><span className="text-accent-primary">Published</span></td>
                            <td className="p-4 text-text-secondary">2025-08-01</td>
                            <td className="p-4">
                                <button className="text-text-secondary hover:text-accent-secondary mr-3 transition-colors">Edit</button>
                                <button className="text-text-secondary hover:text-red-400 transition-colors">Delete</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-text-primary">Tricog Health Platform</td>
                            <td className="p-4"><span className="text-accent-primary">Published</span></td>
                            <td className="p-4 text-text-secondary">2024-05-01</td>
                            <td className="p-4">
                                <button className="text-text-secondary hover:text-accent-secondary mr-3 transition-colors">Edit</button>
                                <button className="text-text-secondary hover:text-red-400 transition-colors">Delete</button>
                            </td>
                        </tr>
                        <tr className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-text-primary">New API Tool</td>
                            <td className="p-4"><span className="text-yellow-500">Draft</span></td>
                            <td className="p-4 text-text-secondary">--</td>
                            <td className="p-4">
                                <button className="text-text-secondary hover:text-accent-secondary mr-3 transition-colors">Edit</button>
                                <button className="text-text-secondary hover:text-red-400 transition-colors">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
