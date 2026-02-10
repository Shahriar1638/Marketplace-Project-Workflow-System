"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function BuyerExplore() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Reusing the public 'open projects' endpoint
                const res = await fetch('/api/solver/projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Explore Projects</h1>
                    <p className="text-gray-500 mt-1">Discover what others are building in the marketplace.</p>
                </div>
                
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search projects..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading marketplace...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">No projects found matching your search.</p>
                        </div>
                    ) : (
                        filteredProjects.map((project, index) => (
                            <motion.div
                                key={project._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col h-full"
                            >
                                <div className="mb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                                            {project.status}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(project.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2" title={project.title}>
                                        {project.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.techStack?.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                        {project.techStack?.length > 3 && (
                                            <span className="text-xs text-gray-400 self-center">+{project.techStack.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-linear-to-tr from-blue-400 to-indigo-500 block"></div>
                                        <span className="text-xs font-bold text-gray-700 truncate max-w-25">
                                            {project.buyerId?.name || 'Unknown Buyer'}
                                        </span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        ${project.budget?.toLocaleString()}
                                    </span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
