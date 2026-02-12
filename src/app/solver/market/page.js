"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Search, Filter, Calendar, Code, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketPlace() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [techFilter, setTechFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/solver/projects');
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

  const filteredProjects = projects
    .filter(project => {
        if (!techFilter) return true;
        const search = techFilter.toLowerCase();
        const inStack = project.techStack?.some(tech => tech.toLowerCase().includes(search));
        const inTitle = project.title.toLowerCase().includes(search);
        return inStack || inTitle;
    })
    .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="spinner text-emerald-600"></div>
      </div>
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Section */}
      <div className="relative bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 px-8 py-16 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                Explore <span className="text-emerald-500">Opportunities</span>
            </h1>
            <p className="text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Browse curated projects, apply with your expertise, and start building the future today.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Filter & Sort Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="w-full md:w-1/2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search by tech stack or keyword..."
                    className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
                    value={techFilter}
                    onChange={(e) => setTechFilter(e.target.value)}
                />
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-3">
                <Filter size={20} className="text-zinc-400" />
                <select 
                    className="px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-medium cursor-pointer"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
                <motion.div 
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group bg-white rounded-2xl p-6 border border-zinc-200 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <ArrowRight className="text-emerald-500 -rotate-45" />
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 mb-3 bg-zinc-50 w-fit px-3 py-1 rounded-full">
                             <Calendar size={12} />
                             {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors" title={project.title}>
                            {project.title}
                        </h3>
                        <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    {/* Tech Stack Tags */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                            {project.techStack.slice(0, 3).map((tech, i) => (
                                <span key={i} className="text-[11px] font-bold text-zinc-600 bg-zinc-50 border border-zinc-100 px-2 py-1 rounded-md flex items-center gap-1">
                                    <Code size={10} className="text-emerald-500" />
                                    {tech}
                                </span>
                            ))}
                            {project.techStack.length > 3 && (
                                <span className="text-[11px] font-bold text-zinc-400 self-center">+{project.techStack.length - 3}</span>
                            )}
                        </div>
                    )}

                    <div className="pt-4 border-t border-zinc-100 flex justify-between items-center mt-auto">
                        <div className="flex items-center gap-1 text-zinc-900 font-bold text-lg">
                            <DollarSign size={18} className="text-emerald-600" />
                            {project.budget}
                        </div>
                        <Link 
                            href={`/solver/projects/${project._id}`} 
                            className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 group-hover:scale-105"
                        >
                            View Details
                        </Link>
                    </div>
                </motion.div>
            ))}

            {filteredProjects.length === 0 && (
                <div className="col-span-full py-20 text-center bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
                    <p className="text-xl font-bold text-zinc-400 mb-2">No open projects found</p>
                    <p className="text-zinc-500">Try adjusting your filters or check back later for new opportunities.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
