/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useSession } from "next-auth/react";

export default function MyProjectsPage() {
    const { data: session } = useSession();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Projects</h1>
                <Link href="/buyer/create-project" className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 transition">
                    + New Project
                </Link>
            </div>

            <div className="grid gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="border border-black p-6 bg-white hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                             <h3 className="text-xl font-bold">{project.title}</h3>
                             <span className={`px-3 py-1 text-xs font-bold rounded uppercase tracking-wide
                                ${project.status === 'open' ? 'bg-green-100 text-green-800' :
                                  project.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-gray-600 mb-4">{project.description}</p>
                        
                        <div className="flex justify-between items-center text-sm font-bold border-t pt-4">
                            <span>Budget: ${project.budget}</span>
                            <span>Requests: {project.requests?.length || 0}</span>
                            <Link href={`/buyer/projects/${project._id}`} className="text-blue-600 hover:underline">
                                Manage Project →
                            </Link>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300">
                        You haven't posted any projects yet.
                    </div>
                )}
            </div>
        </div>
    );
}
