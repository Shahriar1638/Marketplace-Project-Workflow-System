"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AssignedProjectView from "@/components/AssignedProjectView";
import UnassignedProjectView from "@/components/UnassignedProjectView";

export default function BuyerProjectDetailsPage() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await fetch(`/api/buyer/projects/${id}`);
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

    if(loading) return <div className="p-8">Loading...</div>;
    if(!project) return <div className="p-8">Project not found</div>;

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
             <div className="mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                <p className="text-gray-600">{project.description}</p>
             </div>

             {/* Conditional View Rendering */}
             {project.status === 'assigned' ? (
                 <AssignedProjectView project={project} />
             ) : (
                 <UnassignedProjectView project={project} />
             )}
        </div>
    );
}
