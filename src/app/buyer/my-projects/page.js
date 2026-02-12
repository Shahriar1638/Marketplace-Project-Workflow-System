/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Search, Filter, Plus, Calendar, Code, User, ArrowRight, Layers, Layout, List as ListIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MyProjectsPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titleFilter, setTitleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [techFilter, setTechFilter] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    
    // Sort logic moved to derived state to keep original data clean
    const [sortBy, setSortBy] = useState('date');
    
    useEffect(() => {
        const fetchMyProjects = async () => {
            try {
                const res = await fetch('/api/buyer/projects');
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
        if(session) fetchMyProjects();
    }, [session]);

    const filteredProjects = projects
        .filter(project => {
            const matchesTitle = project.title.toLowerCase().includes(titleFilter.toLowerCase());
            const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
            const matchesTech = !techFilter || project.techStack?.some(t => t.toLowerCase().includes(techFilter.toLowerCase()));
            
            return matchesTitle && matchesStatus && matchesTech;
        })
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else if (sortBy === 'title') {
                return a.title.localeCompare(b.title);
            } else if (sortBy === 'requests') {
                return (b.requests?.length || 0) - (a.requests?.length || 0);
            }
            return 0;
        });

    if (loading) return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Projects</h1>
                            <p className="text-gray-500 mt-1">Manage, track, and hire for your created projects.</p>
                        </div>
                        <Link 
                            href="/buyer/create-project" 
                            className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl font-bold border border-transparent hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            Create Project
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                        <div className="col-span-1 md:col-span-2 relative">
                             <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Search</label>
                             <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-sm"
                                    placeholder="Search by title..." 
                                    value={titleFilter}
                                    onChange={e => setTitleFilter(e.target.value)}
                                />
                             </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Status</label>
                             <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <select 
                                    className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-sm appearance-none cursor-pointer"
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                >
                                    <option value="All">All Projects</option>
                                    <option value="open">Open</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="completed">Completed</option>
                                </select>
                             </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1 uppercase tracking-wide">Sort By</label>
                             <select 
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-sm appearance-none cursor-pointer"
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                            >
                                <option value="date">Newest First</option>
                                <option value="title">Alphabetical</option>
                                <option value="requests">Most Applications</option>
                            </select>
                        </div>

                         {/* View Toggle (Hidden on mobile usually, but kept for logic) */}
                        <div className="flex bg-gray-100 p-1 rounded-xl w-fit md:w-auto h-10.5">
                            <button 
                                onClick={() => setViewMode('grid')}
                                className={`flex-1 px-3 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-white shadow-xs text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Layout size={18} />
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`flex-1 px-3 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-white shadow-xs text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <ListIcon size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Grid/List */}
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project, index) => (
                            <motion.div 
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col h-full relative"
                            >
                                <div className="flex justify-between items-start mb-4">
                                     <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1.5
                                        ${project.status === 'open' ? 'bg-green-100 text-green-700' :
                                          project.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                          'bg-gray-100 text-gray-700'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'open' ? 'bg-green-500' : project.status === 'assigned' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                                        {project.status}
                                    </span>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        <Layers size={16} />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 pr-2">{project.title}</h3>
                                
                                <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(project.createdAt).toLocaleDateString()}</span>
                                    {project.requests?.length > 0 && (
                                        <span className="flex items-center gap-1 font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                                            <User size={12} /> {project.requests.length} Requests
                                        </span>
                                    )}
                                </div>

                                <div className="mt-auto space-y-4">
                                    {/* Tech Stack Preview */}
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack?.slice(0, 3).map((t, i) => (
                                            <span key={i} className="text-[10px] font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-md">
                                                {t}
                                            </span>
                                        ))}
                                        {project.techStack?.length > 3 && <span className="text-[10px] text-gray-400 self-center">+{project.techStack.length - 3}</span>}
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        {project.assignedSolverId ? (
                                             <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                    {project.assignedSolverId.name?.[0].toUpperCase()}
                                                </div>
                                                <span className="text-xs font-bold text-gray-700">Assigned</span>
                                             </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No solver assigned</span>
                                        )}
                                        
                                        <Link 
                                            href={`/buyer/projects/${project._id}`}
                                            className="text-sm font-bold text-black flex items-center gap-1 hover:text-blue-600 transition-colors"
                                        >
                                            Manage <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                         <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Project Details</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applications</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProjects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{project.title}</div>
                                            <div className="text-xs text-gray-500 mt-1">Posted on {new Date(project.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider inline-flex items-center gap-1.5
                                                ${project.status === 'open' ? 'bg-green-100 text-green-700' :
                                                  project.status === 'assigned' ? 'bg-blue-100 text-blue-700' :
                                                  'bg-gray-100 text-gray-700'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${project.status === 'open' ? 'bg-green-500' : project.status === 'assigned' ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm font-medium text-gray-900">
                                                <User size={16} className="text-gray-400 mr-2" />
                                                {project.requests?.length || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {project.assignedSolverId ? (
                                                 <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                        {project.assignedSolverId.name?.[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-sm text-gray-700">{project.assignedSolverId.name}</span>
                                                 </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 italic">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <Link href={`/buyer/projects/${project._id}`} className="text-black hover:text-blue-600 font-bold underline">
                                                Manage
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                
                {filteredProjects.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                            <Layers size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No projects found</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Either you haven't created any projects yet, or no projects match your filters.</p>
                        <Link href="/buyer/create-project" className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition">
                            <Plus size={18} /> Create Your First Project
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
