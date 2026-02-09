"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from 'next/link';

export default function ProjectDetailsPage() {
    const params = useParams();
    const id = params.id;
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/solver/projects/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                }
            } catch (error) {
                console.error("Failed to fetch project", error);
            } finally {
                setLoading(false);
            }
        };
        if(id) fetchProject();
    }, [id]);

    if(loading) return <div className="p-8">Loading details...</div>;
    if(!project) return <div className="p-8">Project not found</div>;

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto">
             <Link href="/solver" className="text-sm underline mb-6 block">← Back to Dashboard</Link>
             
             <div className="border border-black p-8 bg-white">
                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{project.title}</h1>
                    <span className="bg-black text-white px-4 py-2 font-bold text-lg rounded-none">
                        ${project.budget}
                    </span>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold text-lg mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {project.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <h3 className="font-bold mb-2">Tech Stack</h3>
                        <div className="flex flex-wrap gap-2">
                             {project.techStack?.map((t, idx) => (
                                 <span key={idx} className="bg-gray-100 px-3 py-1 text-sm border border-gray-300">
                                     {t}
                                 </span>
                             ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Details</h3>
                        <p className="text-sm"><span className="font-semibold">Buyer:</span> {project.buyerId?.name || 'Unknown'}</p>
                        <p className="text-sm"><span className="font-semibold">Posted:</span> {new Date(project.createdAt).toLocaleDateString()}</p>
                         <p className="text-sm"><span className="font-semibold">Deadline:</span> {project.deadline || 'Flexible'}</p>
                    </div>
                </div>

                <div className="border-t pt-8 flex justify-end">
                    <Link href={`/solver/projects/${id}/apply`} className="bg-black text-white px-8 py-3 font-bold hover:bg-gray-800 transition">
                        Apply Now
                    </Link>
                </div>
             </div>
        </div>
    );
}
