/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Briefcase, User, Calendar, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ActiveProjects() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActiveProjects = async () => {
            try {
                const res = await fetch('/api/solver/active-projects');
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } catch (error) {
                console.error("Failed to fetch active projects", error);
            } finally {
                setLoading(false);
            }
        };
        if(session) fetchActiveProjects();
    }, [session]);

    if (loading) return (
        <div className="flex justify-center items-center py-20">
             <div className="spinner text-emerald-600"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Active Assignments</h1>
                <p className="text-gray-500 mt-2">Manage your ongoing work and submit deliverables.</p>
            </div>

            <div className="grid gap-6">
                {projects.map((project, index) => {
                     const totalTasks = project.tasks?.length || 0;
                     const estimatedModules = project.assignmentDetails?.estimatedModules || 0;
                     const acceptedTasks = project.tasks?.filter(t => t.status === 'accepted').length || 0;
                     const submittedTasks = project.tasks?.filter(t => t.status === 'submitted').length || 0;
                     const rejectedTasks = project.tasks?.filter(t => t.status === 'rejected').length || 0;
                     const denominator = Math.max(estimatedModules, totalTasks) || 1;
                     const acceptedPercent = Math.min(100, Math.round((acceptedTasks / denominator) * 100));
                     const submittedPercent = Math.min(100 - acceptedPercent, Math.round((submittedTasks / denominator) * 100));
                     const rejectedPercent = Math.min(100 - acceptedPercent - submittedPercent, Math.round((rejectedTasks / denominator) * 100));

                     return (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: Math.min(index * 0.1, 0.5) }}
                            className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <User size={14} />
                                                <span>{project.buyerId?.name || 'Unknown Buyer'}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                <span>Due: {project.assignmentDetails?.estimatedDeadlineForEntireProject || 'No Deadline'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full">
                                    In Progress
                                </span>
                            </div>

                            <div className="mb-8">
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-gray-700">Completion Status</span>
                                    <span className="text-emerald-600">
                                        {acceptedTasks} of {denominator} modules accepted ({acceptedPercent}%)
                                        {rejectedTasks > 0 && <span className="text-red-500 ml-2">· {rejectedTasks} rejected</span>}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                                    {acceptedPercent > 0 && (
                                        <div 
                                            className="bg-emerald-500 h-full transition-all duration-500 ease-out" 
                                            style={{ width: `${acceptedPercent}%` }}
                                        ></div>
                                    )}
                                    {submittedPercent > 0 && (
                                        <div 
                                            className="bg-yellow-400 h-full transition-all duration-500 ease-out" 
                                            style={{ width: `${submittedPercent}%` }}
                                        ></div>
                                    )}
                                    {rejectedPercent > 0 && (
                                        <div 
                                            className="bg-red-400 h-full transition-all duration-500 ease-out" 
                                            style={{ width: `${rejectedPercent}%` }}
                                        ></div>
                                    )}
                                </div>
                                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span> Accepted</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-yellow-400 rounded-full inline-block"></span> Submitted</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-400 rounded-full inline-block"></span> Rejected</span>
                                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-200 rounded-full inline-block"></span> Remaining</span>
                                </div>
                            </div>
                            
                            <div className="flex justify-end pt-6 border-t border-gray-100">
                                <Link 
                                    href={`/solver/active-projects/${project._id}`}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all hover:translate-x-1 shadow-md"
                                >
                                    Open Workspace <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                     );
                })}

                {projects.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                        <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm">
                            <Briefcase size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Assignments</h3>
                        <p className="text-gray-500 mb-6">You haven't been assigned to any projects yet.</p>
                        <Link href="/solver/market" className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                            Browse Market
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
