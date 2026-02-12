 
"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function MyProjectsPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [titleFilter, setTitleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [techFilter, setTechFilter] = useState('');
    
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

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <Link href="/buyer/create-project" className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition">
                    + New Project
                </Link>
            </div>
            <div className="bg-gray-50 p-4 border border-gray-200 mb-6 flex flex-wrap gap-4">
                <div className="flex-1 min-w-50">
                    <label className="block text-xs font-bold mb-1">Search Title</label>
                    <input 
                        className="w-full p-2 border border-black" 
                        placeholder="Project Title..." 
                        value={titleFilter}
                        onChange={e => setTitleFilter(e.target.value)}
                    />
                </div>
                <div>
                     <label className="block text-xs font-bold mb-1">Status</label>
                     <select 
                        className="p-2 border border-black min-w-37.5"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                     >
                         <option value="All">All Status</option>
                         <option value="open">Open</option>
                         <option value="assigned">Assigned</option>
                         <option value="completed">Completed</option>
                     </select>
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Tech Stack</label>
                    <input 
                        className="p-2 border border-black" 
                        placeholder="e.g. React" 
                        value={techFilter}
                        onChange={e => setTechFilter(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Sort By</label>
                    <select 
                        className="p-2 border border-black min-w-37.5"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                    >
                        <option value="date">Publish Date</option>
                        <option value="title">Title</option>
                        <option value="requests">Request Count</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto border border-black">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100 border-b border-black">
                        <tr>
                            <th className="text-left py-3 px-4 font-bold text-sm">Project Title</th>
                            <th className="text-left py-3 px-4 font-bold text-sm">Publish Date</th>
                            <th className="text-left py-3 px-4 font-bold text-sm">Tech Stack</th>
                            <th className="text-left py-3 px-4 font-bold text-sm">Status / Assigned</th>
                            <th className="text-left py-3 px-4 font-bold text-sm">Requests</th>
                            <th className="text-left py-3 px-4 font-bold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map((project) => (
                            <tr key={project._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-4 font-medium">{project.title}</td>
                                <td className="py-3 px-4 text-sm text-gray-600">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex flex-wrap gap-1">
                                        {project.techStack?.slice(0, 2).map((t, i) => (
                                            <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded">{t}</span>
                                        ))}
                                        {project.techStack?.length > 2 && <span className="text-xs text-gray-500">...</span>}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                     <span className={`px-2 py-1 text-xs font-bold rounded uppercase 
                                        ${project.status === 'open' ? 'bg-green-100 text-green-800' :
                                          project.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                          'bg-gray-100 text-gray-800'}`}>
                                        {project.status}
                                    </span>
                                    {project.assignedSolverId && (
                                        <div className="text-xs mt-1 text-gray-600 font-bold">
                                            Solver: {project.assignedSolverId.name}
                                        </div>
                                    )}
                                </td>
                                <td className="py-3 px-4 font-bold text-center">
                                    {project.requests?.length || 0}
                                </td>
                                <td className="py-3 px-4">
                                    <Link href={`/buyer/projects/${project._id}`} className="text-sm font-bold underline hover:text-gray-600">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}

                        {filteredProjects.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500">
                                    No projects found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
