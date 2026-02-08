"use client";
import { useState, useEffect } from "react";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
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
        if (statusFilter === 'All') return true;
        return project.status === statusFilter;
    });

    if (loading) return <div className="p-8">Loading projects...</div>;

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">All Projects</h1>
            </div>

            {/* Filter */}
            <div className="mb-6">
                <select 
                    className="p-2 border border-black"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="open">Open</option>
                    <option value="assigned">Assigned</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project._id} className="border border-black p-6 hover:shadow-lg transition bg-white">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold">{project.title}</h3>
                            <span className={`px-2 py-1 text-xs font-bold rounded capitalize
                                ${project.status === 'open' ? 'bg-green-100 text-green-800' :
                                  project.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                        
                        <div className="text-sm text-gray-500 border-t pt-4">
                            <p>Budget: ${project.budget || 'N/A'}</p>
                            <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
                
                {filteredProjects.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No projects found matching current filters.
                    </div>
                )}
            </div>
        </div>
    );
}
