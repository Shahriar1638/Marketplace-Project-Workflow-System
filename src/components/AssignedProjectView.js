"use client";
import { useState } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';

export default function AssignedProjectView({ project, onRefresh }) {
    const [loadingAction, setLoadingAction] = useState(false);

    if (!project.assignmentDetails) {
        return <div className="p-4 bg-yellow-100 border border-yellow-200">Assignment details missing.</div>;
    }

    const { estimatedModules, estimatedDeadlineForEntireProject } = project.assignmentDetails;
    const totalTasks = project.tasks.length;
    const acceptedTasks = project.tasks.filter(t => t.status === 'accepted').length;
    const submittedTasks = project.tasks.filter(t => t.status === 'submitted').length;
    const rejectedTasks = project.tasks.filter(t => t.status === 'rejected').length;
    const pendingTasks = project.tasks.filter(t => t.status === 'pending').length;
    const denominator = Math.max(estimatedModules, totalTasks) || 1;
    const progress = Math.min(100, Math.round((acceptedTasks / denominator) * 100));
    const submittedPercent = Math.min(100 - progress, Math.round((submittedTasks / denominator) * 100));
    const rejectedPercent = Math.min(100 - progress - submittedPercent, Math.round((rejectedTasks / denominator) * 100));
    const remainingModules = Math.max(0, denominator - acceptedTasks);

    const handleReview = async (taskId, action) => {
        let feedback = '';
        
        if (action === 'reject') {
            const { value: text } = await Swal.fire({
                title: 'Reject Submission',
                input: 'textarea',
                inputLabel: 'Reason for rejection',
                inputPlaceholder: 'Please provide a feedback or reason...',
                inputValidator: (value) => {
                    if (!value) {
                    return 'You need to write something!'
                    }
                },
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Reject'
            });

            if (!text) return;
            feedback = text;
        } else {
            const result = await Swal.fire({
                title: 'Approve Submission?',
                text: "This task will be marked as complete.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Approve!'
            });

            if (!result.isConfirmed) return;
        }
        
        setLoadingAction(true);
        try {
            const res = await fetch(`/api/buyer/projects/${project._id}/tasks/${taskId}/review`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, feedback }), 
            });

            if (res.ok) {
                await Swal.fire(
                    action === 'approve' ? 'Approved!' : 'Rejected!',
                    `Task has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
                    'success'
                );
                if (onRefresh) onRefresh();
                else window.location.reload();
            } else {
                Swal.fire(
                    'Error',
                    'Failed to update task status.',
                    'error'
                );
            }
        } catch (error) {
            console.error(error);
            Swal.fire(
                'Error',
                'An error occurred.',
                'error'
            );
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

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-4 border border-green-200 text-center rounded-lg">
                        <span className="block text-3xl font-bold text-green-700">{acceptedTasks}</span>
                        <span className="text-sm text-green-600">Accepted</span>
                    </div>
                    <div className="bg-yellow-50 p-4 border border-yellow-200 text-center rounded-lg">
                        <span className="block text-3xl font-bold text-yellow-700">{submittedTasks}</span>
                        <span className="text-sm text-yellow-600">Awaiting Review</span>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200 text-center rounded-lg">
                         <span className="block text-3xl font-bold">{remainingModules}</span>
                         <span className="text-sm text-gray-600">Remaining</span>
                    </div>
                    <div className="bg-gray-50 p-4 border border-gray-200 text-center rounded-lg">
                        <span className="block text-3xl font-bold">{estimatedDeadlineForEntireProject || 'N/A'}</span>
                        <span className="text-sm text-gray-600">Target Deadline</span>
                    </div>
                </div>

                {/* Segmented Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 flex overflow-hidden">
                    {progress > 0 && (
                        <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${progress}%` }} title={`${acceptedTasks} accepted`}></div>
                    )}
                    {submittedPercent > 0 && (
                        <div className="bg-yellow-400 h-4 transition-all duration-500" style={{ width: `${submittedPercent}%` }} title={`${submittedTasks} submitted`}></div>
                    )}
                    {rejectedPercent > 0 && (
                        <div className="bg-red-400 h-4 transition-all duration-500" style={{ width: `${rejectedPercent}%` }} title={`${rejectedTasks} rejected`}></div>
                    )}
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex gap-4">
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block"></span> Accepted</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block"></span> Submitted</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-red-400 rounded-full inline-block"></span> Rejected</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-gray-200 rounded-full inline-block"></span> Remaining</span>
                    </div>
                    <span className="font-bold">{acceptedTasks} of {denominator} modules accepted ({progress}%)</span>
                </div>
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
