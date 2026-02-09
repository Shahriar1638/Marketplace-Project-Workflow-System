"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UnassignedProjectView({ project }) {
    const router = useRouter();
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);

    const handleAccept = async (request) => {
        if (!confirm(`Are you sure you want to hire ${request.solverId?.name}?`)) return;
        
        setLoadingAction(true);
        try {
            const res = await fetch(`/api/buyer/projects/${project._id}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    solverId: request.solverId._id,
                    estimatedModules: request.estimatedModules,
                    estimatedDeadline: request.deadline
                }),
            });

            if (res.ok) {
                alert('Project assigned successfully!');
                window.location.reload(); // Reload to switch to Assigned View
            } else {
                alert('Failed to assign project.');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred.');
        } finally {
            setLoadingAction(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="border border-black p-6 bg-white">
                <h2 className="text-xl font-bold mb-6">Received Proposals ({project.requests?.length || 0})</h2>
                
                {(!project.requests || project.requests.length === 0) ? (
                    <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300">
                        No proposals received yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Solver Name</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Email</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Est. Modules</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Deadline</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Skills</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.requests.map((req, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedRequest(req)}>
                                        <td className="py-3 px-4 font-medium text-blue-600 hover:underline">{req.solverId?.name || 'Unknown'}</td>
                                        <td className="py-3 px-4 text-sm">{req.solverId?.email}</td>
                                        <td className="py-3 px-4 text-sm text-center">{req.estimatedModules}</td>
                                        <td className="py-3 px-4 text-sm">{req.deadline}</td>
                                        <td className="py-3 px-4 text-xs">
                                            {req.solverId?.profile?.skills?.slice(0, 2).join(', ') || '-'}
                                        </td>
                                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                            <button 
                                                onClick={() => handleAccept(req)}
                                                disabled={loadingAction}
                                                className="bg-black text-white px-3 py-1 text-xs font-bold hover:bg-gray-800 transition disabled:opacity-50"
                                            >
                                                Accept
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="text-center mt-8">
                <Link href="/buyer/my-projects" className="text-sm underline hover:text-gray-600">
                    ← Back to Project List
                </Link>
            </div>

            {/* Modal for Description */}
            {selectedRequest && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedRequest(null)}>
                    <div className="bg-white p-6 max-w-lg w-full border border-black shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold mb-4">Proposal from {selectedRequest.solverId?.name}</h3>
                        
                        <div className="mb-4">
                            <h4 className="font-bold text-sm mb-1">Description / Pitch:</h4>
                            <p className="text-gray-700 text-sm whitespace-pre-wrap border p-3 bg-gray-50 h-40 overflow-y-auto">
                                {selectedRequest.description}
                            </p>
                        </div>

                        {selectedRequest.phoneNumber && (
                            <div className="mb-4">
                                <h4 className="font-bold text-sm mb-1">Contact Number:</h4>
                                <p className="text-blue-600 font-mono">{selectedRequest.phoneNumber}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                            <button 
                                onClick={() => setSelectedRequest(null)}
                                className="px-4 py-2 border border-black font-bold hover:bg-gray-100"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => handleAccept(selectedRequest)}
                                className="px-4 py-2 bg-black text-white font-bold hover:bg-gray-800"
                            >
                                Accept Proposal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
