"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function AssignedProjectView({ project }) {
    const [loadingAction, setLoadingAction] = useState(false);

    if (!project.assignmentDetails) {
        return <div className="p-4 bg-yellow-100 border border-yellow-200">Assignment details missing.</div>;
    }

    const { estimatedModules, estimatedDeadlineForEntireProject } = project.assignmentDetails;
    const completedTasks = project.tasks.filter(t => t.status === 'accepted').length;
    const remainingTasks = Math.max(0, estimatedModules - completedTasks);
    // Progress based on ACCEPTED tasks
    const progress = Math.min(100, Math.round((completedTasks / estimatedModules) * 100)) || 0;

    const handleReview = async (taskId, action) => {
        let feedback = '';
        if (action === 'reject') {
            feedback = prompt("Please provide a reason for rejection (required):");
            if (!feedback) return; // Cancelled or empty
        } else {
            if (!confirm(`Are you sure you want to ${action} this submission?`)) return;
        }
        
        setLoadingAction(true);
        try {
            const res = await fetch(`/api/buyer/projects/${project._id}/tasks/${taskId}/review`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, feedback }), 
            });

            if (res.ok) {
                alert(`Task ${action}d successfully!`);
                window.location.reload();
            } else {
                alert('Failed to update task status.');
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Project Progress</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 font-bold rounded text-sm uppercase">
                        Current Status: In Progress
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 border border-gray-200 text-center">
                        <span className="block text-3xl font-bold">{completedTasks} / {estimatedModules}</span>
                        <span className="text-sm text-gray-600">Modules Accepted</span>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200 text-center">
                         <span className="block text-3xl font-bold">{remainingTasks}</span>
                         <span className="text-sm text-gray-600">Modules Remaining</span>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200 text-center">
                        <span className="block text-3xl font-bold">{estimatedDeadlineForEntireProject || 'N/A'}</span>
                        <span className="text-sm text-gray-600">Target Deadline</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                    <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-right text-sm font-bold">{progress}% Completed</p>
            </div>

            <div className="border border-black p-6 bg-white">
                <h2 className="text-xl font-bold mb-4">Module Submissions Log</h2>
                
                {project.tasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300">
                        No modules created yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-100 border-b">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Module Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Submission Note</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Submitted Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Files</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-bold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.tasks.map((task) => (
                                    <tr key={task._id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{task.title}</td>
                                        <td className="py-3 px-4 text-sm text-gray-600 truncate max-w-xs">{task.submission?.note || '-'}</td>
                                        <td className="py-3 px-4 text-sm">{task.submission?.submittedAt || '-'}</td>
                                        <td className="py-3 px-4 text-sm">
                                            {task.submission?.zipUrl ? (
                                                <a href={task.submission.zipUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline text-xs">Download</a>
                                            ) : '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase
                                                ${task.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                                  task.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' : 
                                                  task.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {task.status === 'submitted' && (
                                                <div className="flex gap-2">
                                                    <button 
                                                        onClick={() => handleReview(task._id, 'approve')}
                                                        disabled={loadingAction}
                                                        className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded hover:bg-green-600 disabled:opacity-50"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReview(task._id, 'reject')}
                                                        disabled={loadingAction}
                                                        className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded hover:bg-red-600 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
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
        </div>
    );
}
