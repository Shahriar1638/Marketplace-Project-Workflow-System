/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { uploadFile } from "@/lib/appwrite";
import Link from 'next/link';
import { ArrowLeft, Clock, Save, Trash2, Send, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { motion } from 'framer-motion';

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
    const [selectedTask, setSelectedTask] = useState(null);
    const [submissionNote, setSubmissionNote] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    const [message, setMessage] = useState('');

    // Fetch Project Function
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

    // Handlers
    const handleDeleteTask = async (taskId) => {
        if (!confirm("Are you sure you want to delete this milestone?")) return;
        try {
            const res = await fetch(`/api/solver/projects/${id}/tasks/${taskId}`, { method: 'DELETE' });
            if (res.ok) {
                setMessage("Milestone deleted.");
                fetchProject();
            } else {
                setMessage("Failed to delete milestone.");
            }
        } catch (error) {
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
                setMessage("Milestone created successfully!");
                setNewTitle('');
                setNewDesc('');
                setNewDeadline('');
                fetchProject();
            } else {
                setMessage("Failed to create milestone.");
            }
        } catch (error) {
            setMessage("Error creating milestone.");
        } finally {
            setCreatingTask(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-compressed', 'multipart/x-zip'];
            const isZip = validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.zip');
            if (!isZip) {
                alert("Only ZIP files are allowed.");
                e.target.value = null;
                setFile(null);
                return;
            }
            setFile(selectedFile);
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
                body: JSON.stringify({ note: submissionNote, zipUrl }),
            });

            if (res.ok) {
                setMessage("Task submitted successfully!");
                setSelectedTask(null); // Close modal
                setSubmissionNote('');
                setFile(null);
                fetchProject();
            } else {
                setMessage("Failed to submit task.");
            }
        } catch (error) {
            setMessage("Error during submission: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
             <div className="spinner text-emerald-600"></div>
        </div>
    );
    if (!project) return <div className="p-8 text-center text-red-500 font-bold">Project not found</div>;

    const pendingTasks = project.tasks.filter(t => t.status === 'pending');
    const historyTasks = project.tasks.filter(t => t.status !== 'pending');

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-6">
                <div>
                     <button 
                        onClick={() => router.back()} 
                        className="flex items-center text-gray-400 hover:text-emerald-600 mb-2 transition-colors text-sm font-bold"
                    >
                        <ArrowLeft size={16} className="mr-1" />
                        Back to Assignments
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900">{project.title}</h1>
                    <p className="text-gray-500 mt-1 max-w-2xl">{project.description}</p>
                </div>
                <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2 text-emerald-700 font-bold whitespace-nowrap shadow-sm">
                    <Clock size={16} />
                    <span>Project Due: {project.assignmentDetails?.estimatedDeadlineForEntireProject || 'No Date'}</span>
                </div>
            </div>

            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg text-center font-bold text-sm ${message.includes('successfully') || message.includes('created') || message.includes('deleted') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}
                >
                    {message}
                </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT COLUMN: Planning & Creating (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* 1. Add Milestone Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center gap-2 mb-6">
                             <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                <Save size={20} />
                             </div>
                             <h2 className="text-xl font-bold text-gray-900">Add New Milestone</h2>
                        </div>
                        
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Milestone Title</label>
                                    <input 
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                                        placeholder="e.g. Backend API Setup"
                                        value={newTitle}
                                        onChange={e => setNewTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Deadline</label>
                                    <input 
                                        type="date"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                                        value={newDeadline}
                                        onChange={e => setNewDeadline(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase">Description</label>
                                <textarea 
                                    required
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none"
                                    placeholder="Brief details regarding this task..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={creatingTask}
                                    className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
                                >
                                    {creatingTask ? "Adding..." : "Add to Plan"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Pending Milestones List */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                             <div className="w-2 h-6 bg-amber-400 rounded-full"></div>
                             Pending Tasks
                        </h2>
                        {pendingTasks.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 border border-dashed border-gray-300 rounded-2xl text-gray-400 font-medium">
                                No pending tasks. Plan your work above.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingTasks.map(task => (
                                    <motion.div 
                                        key={task._id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row justify-between gap-4"
                                    >
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-bold text-lg text-gray-800">{task.title}</h4>
                                                <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-1 rounded border border-amber-100">
                                                    Pending
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1 mb-2">{task.description}</p>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                <Clock size={12} />
                                                <span>Due: {task.deadline || 'No Deadline'}</span>
                                            </div>
                                            {task.status === 'rejected' && task.feedback && (
                                                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded text-xs text-red-700">
                                                    <span className="font-bold flex items-center gap-1 mb-1"><AlertCircle size={12}/> Feedback:</span> 
                                                    {task.feedback}
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex sm:flex-col gap-2 justify-center sm:border-l sm:pl-4 border-gray-100">
                                            <button 
                                                onClick={() => setSelectedTask(task)}
                                                className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-sm w-full"
                                            >
                                                <Send size={14} /> Submit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition flex items-center justify-center gap-1 w-full"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: History & Details (1/3 width) */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <CheckCircle size={20} className="text-emerald-500" />
                                Completed
                            </h2>
                            <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                {historyTasks.length} Done
                            </span>
                        </div>
                        
                        <div className="space-y-4 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                             {historyTasks.length === 0 ? (
                                <p className="text-center text-gray-400 text-sm py-4 italic">No completed tasks yet.</p>
                            ) : (
                                historyTasks.slice().reverse().map(task => (
                                    <div key={task._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{task.title}</h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border
                                                ${task.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 
                                                  task.status === 'submitted' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                  'bg-red-100 text-red-700 border-red-200'}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        {task.submission?.note && (
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-3 bg-white p-2 rounded border border-gray-100 italic">
                                                "{task.submission.note}"
                                            </p>
                                        )}
                                        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                            <span className="text-[10px] text-gray-400 font-bold">{task.submission?.submittedAt}</span>
                                            {task.submission?.zipUrl && (
                                                <a 
                                                    href={task.submission.zipUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-emerald-600 text-xs font-bold hover:underline"
                                                >
                                                    <Download size={12} /> Zip
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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-8 max-w-lg w-full rounded-2xl shadow-2xl relative overflow-hidden"
                    >
                         <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
                        <button 
                            onClick={() => setSelectedTask(null)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            ✕
                        </button>
                        
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Submit Work</h2>
                            <p className="text-gray-500 text-sm mt-1">Ready to deliver? Upload your files for <span className="font-bold text-gray-900">{selectedTask.title}</span></p>
                        </div>

                        <form onSubmit={handleSubmitTask} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase">Upload ZIP File</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                                    <input 
                                        type="file" 
                                        required
                                        accept=".zip"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleFileChange}
                                    />
                                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-full">
                                            <FileText size={20} />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">
                                            {file ? file.name : "Click to browse or drag file here"}
                                        </span>
                                        <span className="text-xs text-gray-400">Max size 50MB • ZIP only</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase">Submission Note</label>
                                <textarea 
                                    required
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none"
                                    placeholder="Describe your work, changes made, and any instructions for the buyer..."
                                    value={submissionNote}
                                    onChange={e => setSubmissionNote(e.target.value)}
                                />
                            </div>
                            
                            <div className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={uploading}
                                    className="w-full bg-black text-white py-4 font-bold rounded-xl hover:bg-gray-900 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="spinner text-white w-4 h-4"></div> Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} /> Confirm Submission
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
