"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';

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

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">My Active Projects</h1>
            
            <div className="grid gap-6">
                {projects.map((project) => {
                     const completed = project.tasks.length;
                     const total = project.assignmentDetails?.estimatedModules || 0;
                     const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                     return (
                        <div key={project._id} className="border border-black p-6 bg-white hover:shadow-md transition">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold">{project.title}</h3>
                                    <p className="text-gray-600 text-sm">Buyer: {project.buyerId?.name}</p>
                                </div>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold uppercase rounded">
                                    In Progress
                                </span>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between text-sm font-bold mb-1">
                                    <span>Progress</span>
                                    <span>{completed} / {total} Modules</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-sm font-bold text-gray-500">Deadline: {project.assignmentDetails?.estimatedDeadlineForEntireProject || 'N/A'}</span>
                                <Link 
                                    href={`/solver/active-projects/${project._id}`}
                                    className="px-4 py-2 bg-black text-white text-sm font-bold hover:bg-gray-800 transition"
                                >
                                    Work on Project →
                                </Link>
                            </div>
                        </div>
                     );
                })}

                {projects.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-gray-300">
                        <p className="text-gray-500">You have no active projects currently.</p>
                        <Link href="/solver" className="text-blue-600 underline mt-2 block">
                            Browse Open Projects
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
