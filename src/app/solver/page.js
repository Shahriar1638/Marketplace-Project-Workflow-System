"use client";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Compass, ArrowRight, User, Calendar, Tag, DollarSign, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from "react";

export default function SolverDashboard() {
  const { data: session } = useSession();
  const [latestProjects, setLatestProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
        try {
            const res = await fetch('/api/solver/projects');
            if (res.ok) {
                const data = await res.json();
                setLatestProjects(data.slice(0, 8));
            }
        } catch (error) {
            console.error("Failed to load projects", error);
        } finally {
            setLoading(false);
        }
    };
    fetchLatest();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-linear-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-12 text-center"
      >
         <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
         <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 mb-4 tracking-tight">
                {getGreeting()}, {session?.user?.name || 'Solver'}!
            </h1>
            <p className="text-xl text-emerald-700 max-w-2xl mx-auto mb-8 font-medium">
                New opportunities await. Find your next challenge today.
            </p>
            <Link href="/solver/market" className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 hover:scale-105 transition-all">
                Browse All Projects <ArrowRight size={20} />
            </Link>
         </div>
      </motion.div>

      {/* Latest Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Tag className="text-emerald-600" /> Latest Opportunities
            </h2>
            <Link href="/solver/market" className="text-sm font-bold text-emerald-600 hover:underline flex items-center gap-1">
                View All <ArrowRight size={14} />
            </Link>
        </div>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestProjects.length > 0 ? (
                    latestProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col h-full group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide border border-emerald-100">
                                    {project.status === 'open' ? 'Open' : project.status}
                                </span>
                                <span className="text-gray-400 text-xs font-bold">
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
                                {project.title}
                            </h3>
                            
                            <p className="text-gray-500 text-sm mb-4 line-clamp-3 bg-gray-50 p-3 rounded-lg border border-gray-100 border-dashed">
                                {project.description}
                            </p>

                            <div className="mt-auto space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack?.slice(0, 2).map((tech, i) => (
                                        <span key={i} className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                    {project.techStack?.length > 2 && (
                                        <span className="text-xs font-medium text-gray-400 px-1 py-1">+More</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                                        <DollarSign size={16} />
                                        <span>{project.budget ? project.budget.toLocaleString() : 'N/A'}</span>
                                    </div>
                                    <Link 
                                        href={`/solver/market`}
                                        className="p-2 bg-black text-white rounded-full hover:bg-gray-800 transition shadow-md"
                                        title="View Details"
                                    >
                                        <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No recent projects found.
                    </div>
                )}
            </div>
        )}
      </div>

    </div>
  );
}
