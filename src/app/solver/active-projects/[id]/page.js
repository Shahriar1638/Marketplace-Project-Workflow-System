"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { uploadFile } from "@/lib/appwrite";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ActiveProjectWorkspace() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for creating new milestone
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newDeadline, setNewDeadline] = useState('');
    const [creatingTask, setCreatingTask] = useState(false);

    // State for submitting a task
    const [selectedTask, setSelectedTask] = useState(null); // The task object being submitted
    const [submissionNote, setSubmissionNote] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    const [message, setMessage] = useState('');

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

    useEffect(() => {
        if(id) fetchProject();
    }, [id]);

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this milestone?")) return;
        
        try {
            const res = await fetch(`/api/solver/projects/${id}/tasks/${taskId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                setMessage("Milestone deleted.");
                fetchProject();
            } else {
                setMessage("Failed to delete milestone.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error deleting milestone.");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setCreatingTask(true);
        setMessage('');

        try {
            const res = await fetch(`/api/solver/projects/${id}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    title: newTitle, 
                    description: newDesc,
                    deadline: newDeadline
                }),
            });

            if (res.ok) {
                setMessage("Milestone created!");
                setNewTitle('');
                setNewDesc('');
                setNewDeadline('');
                fetchProject();
            } else {
                setMessage("Failed to create milestone.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error creating milestone.");
        } finally {
            setCreatingTask(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmitTask = async (e) => {
        e.preventDefault();
        if (!selectedTask) return;
        
        setUploading(true);
        setMessage('');

        try {
            let zipUrl = '';
            if (file) {
                const uploadedUrl = await uploadFile(file);
                zipUrl = uploadedUrl.toString();
            } else {
                alert("Please select a file.");
                setUploading(false);
                return;
            }

            const res = await fetch(`/api/solver/projects/${id}/tasks/${selectedTask._id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    note: submissionNote, 
                    zipUrl 
                }),
            });

            if (res.ok) {
                setMessage("Task submitted successfully!");
                setSelectedTask(null);
                setSubmissionNote('');
                setFile(null);
                fetchProject();
            } else {
                setMessage("Failed to submit task.");
            }

        } catch (error) {
            console.error("Submission error:", error);
            setMessage("Error during submission: " + error.message);
        } finally {
            setUploading(false);
        }
    };


    if (loading) return <div className="p-8">Loading workspace...</div>;
    if (!project) return <div className="p-8">Project not found</div>;

    const pendingTasks = project.tasks.filter(t => t.status === 'pending');
    const completedTasks = project.tasks.filter(t => t.status !== 'pending');

    return (
        <div className="min-h-screen p-8 max-w-6xl mx-auto">
            <Link href="/solver/active-projects" className="text-sm underline mb-4 block">← Back to Active Projects</Link>
            
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                     <h1 className="text-3xl font-bold">{project.title}</h1>
                     <p className="text-gray-600">{project.description}</p>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-gray-500">Deadline</div>
                    <div className="text-xl font-bold">{project.assignmentDetails?.estimatedDeadlineForEntireProject}</div>
                </div>
            </div>

            {message && (
                <div className={`p-4 mb-6 border text-center font-bold ${message.includes('successfully') || message.includes('created') ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* LEFT COLUMN: Planning & Creating */}
                <div className="space-y-8">
                    {/* Create Milestone Form */}
                    <div className="border border-black p-6 bg-white">
                        <h2 className="text-xl font-bold mb-4">Add New Milestone</h2>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Milestone Title</label>
                                <input 
                                    required
                                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                                    placeholder="e.g. Database Schema Design"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Description</label>
                                <textarea 
                                    required
                                    rows="2"
                                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                                    placeholder="Brief details..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Deadline</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full p-2 border border-gray-300 focus:border-black outline-none"
                                    value={newDeadline}
                                    onChange={e => setNewDeadline(e.target.value)}
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={creatingTask}
                                className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {creatingTask ? 'Adding...' : 'Add Plan'}
                            </button>
                        </form>
                    </div>

                    {/* Pending Milestones List */}
                    <div className="border border-black p-6 bg-gray-50">
                        <h2 className="text-xl font-bold mb-4">Pending Milestones</h2>
                        {pendingTasks.length === 0 ? (
                            <p className="text-gray-500 italic">No pending milestones. Add one above.</p>
                        ) : (
                            <div className="space-y-4">
                                {pendingTasks.map(task => (
                                    <div key={task._id} className="bg-white p-4 border border-gray-200 shadow-sm flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold">{task.title}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                                            <p className="text-xs text-red-600 font-bold mt-1">Due: {task.deadline || 'No Deadline'}</p>
                                            {task.status === 'rejected' && task.feedback && (
                                                <p className="text-xs text-red-600 mt-2 p-2 bg-red-50 border border-red-200">
                                                    <span className="font-bold">Feedback:</span> {task.feedback}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="px-3 py-1 border border-red-500 text-red-600 text-sm font-bold hover:bg-red-50"
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                onClick={() => setSelectedTask(task)}
                                                className="px-3 py-1 bg-black text-white text-sm font-bold hover:bg-gray-800"
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Submission Modal (if selected) & History */}
                <div className="space-y-8">
                    
                    {/* Submission History */}
                    <div className="border border-black p-6 bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Completed Milestones</h2>
                            <span className="text-sm font-bold">{completedTasks.length} Done</span>
                        </div>
                        
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                             {completedTasks.length === 0 ? (
                                <p className="text-center text-gray-400 italic">No completed work yet.</p>
                            ) : (
                                completedTasks.slice().reverse().map(task => (
                                    <div key={task._id} className="bg-gray-50 p-4 border border-gray-200">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-black">{task.title}</h4>
                                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase
                                                ${task.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">{task.submission?.note}</p>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                                            <span className="text-xs text-gray-400">Submitted: {task.submission?.submittedAt}</span>
                                            {task.submission?.zipUrl && (
                                                <a 
                                                    href={task.submission.zipUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 text-xs underline font-bold"
                                                >
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBMISSION MODAL */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-8 max-w-md w-full border border-black shadow-2xl relative">
                        <button 
                            onClick={() => setSelectedTask(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold"
                        >
                            ✕
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-2">Submit Work</h2>
                        <h3 className="text-lg text-gray-600 mb-6 font-medium">{selectedTask.title}</h3>

                        <form onSubmit={handleSubmitTask} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Upload ZIP File</label>
                                <input 
                                    type="file" 
                                    required
                                    className="w-full p-2 border border-black bg-gray-50"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Submission Note</label>
                                <textarea 
                                    required
                                    rows="3"
                                    className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    placeholder="Describe what you built..."
                                    value={submissionNote}
                                    onChange={e => setSubmissionNote(e.target.value)}
                                />
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition disabled:opacity-50 mt-4"
                            >
                                {uploading ? 'Uploading & Submitting...' : 'Confirm Submission'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
