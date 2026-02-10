"use client";
import { useState, useEffect } from "react";
import { Search, FolderOpen, User, Clock, CheckCircle } from 'lucide-react';
import { clsx } from "clsx";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/admin/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(project => {
        const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
        const matchesSearch = project.title.toLowerCase().includes(search.toLowerCase()) || 
                              project.buyerId?.name.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'open': return 'bg-green-100 text-green-700';
            case 'assigned': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">All Projects</h1>
                    <p className="text-zinc-500 text-sm">Monitor project details, assignments, and budgets.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search projects or buyers..." 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                     <select 
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="All">All Status</option>
                        <option value="open">Open</option>
                        <option value="assigned">Assigned</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Project</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Parties</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-200">
                             {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">Loading projects...</td>
                                </tr>
                            ) : filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-10 text-center text-zinc-500">No projects found.</td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => (
                                    <tr key={project._id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-3">
                                                <div className="shrink-0 p-2 bg-zinc-100 rounded text-zinc-500">
                                                    <FolderOpen size={20} />
                                                </div>
                                                <div>
                                                    <span className="block text-sm font-bold text-zinc-900 line-clamp-1" title={project.title}>
                                                        {project.title}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 block mt-1 line-clamp-1">{project.description}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx("px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize query", getStatusColor(project.status))}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1" title="Created At">
                                                    <Clock size={14} />
                                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {/* Could add task count here if populated */}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-zinc-500">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1" title="Buyer">
                                                    <User size={14} className="text-blue-500" />
                                                    <span className="font-medium text-zinc-700">{project.buyerId?.name || 'Unknown'}</span>
                                                </div>
                                                {project.assignedSolverId && (
                                                    <div className="flex items-center gap-1" title="Solver">
                                                        <CheckCircle size={14} className="text-green-500" />
                                                        <span className="font-medium text-zinc-700">{project.assignedSolverId.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-zinc-900">
                                            ${project.budget?.toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
