/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Clock, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import Swal from 'sweetalert2';

export default function MyRequests() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRequest, setEditingRequest] = useState(null); // { projectId, requestId, description, estimatedModules, deadline }
  const [saveLoading, setSaveLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/solver/my-requests');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
        fetchRequests();
    }
  }, [session]);

  const handleEditClick = (project, myRequest) => {
      setEditingRequest({
          projectId: project._id,
          requestId: myRequest._id,
          description: myRequest.description,
          estimatedModules: myRequest.estimatedModules,
          deadline: myRequest.deadline
      });
      setMessage('');
  };

  const handleSaveEdit = async (e) => {
      e.preventDefault();
      setSaveLoading(true);
      setMessage('');

      try {
          const res = await fetch('/api/solver/my-requests/edit', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(editingRequest),
          });

          if (res.ok) {
              Swal.fire({
                  title: 'Updated!',
                  text: 'Your proposal has been successfully updated.',
                  icon: 'success',
                  timer: 2000,
                  showConfirmButton: false
              });
              fetchRequests();
              setEditingRequest(null);
          } else {
              const err = await res.json();
              Swal.fire('Error', err.message, 'error');
          }
      } catch (error) {
          console.error(error);
          Swal.fire('Error', 'Failed to update proposal.', 'error');
      } finally {
          setSaveLoading(false);
      }
  };


  if (loading) return (
      <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin text-emerald-600 rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Header */}
      <div className="relative bg-zinc-900 overflow-hidden mb-12 py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
                My <span className="text-emerald-500">Applications</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-zinc-400">
                Track status updates and manage your active proposals.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {message && (
             <div className={`p-4 mb-6 rounded-lg text-center font-bold sticky top-4 z-10 shadow-lg animate-fade-in-down ${message.includes('Success') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {message}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
            {projects.map((project, index) => {
                const myRequest = project.requests.find(r => r.solverId === session?.user?.id);
                const status = myRequest ? myRequest.status : 'Unknown';
                const requestsCount = project.requests ? project.requests.length : 0;
                const isAssignedToOther = project.status === 'assigned' && project.assignedSolverId !== session.user.id;
                const canEdit = !isAssignedToOther && status !== 'accepted'; 

                return (
                    <motion.div 
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: index * 0.1 }}
                        className="group bg-white rounded-2xl shadow-sm border border-zinc-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col h-full relative overflow-hidden"
                    >
                        {/* Status Strip */}
                        <div className={`h-1.5 w-full absolute top-0 left-0 
                            ${status === 'pending' ? 'bg-amber-400' : 
                              status === 'accepted' ? 'bg-emerald-500' : 
                              'bg-red-500'}`} 
                        />

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5
                                        ${status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 
                                          status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                                          'bg-red-50 text-red-700 border border-red-100'}`}>
                                         {status === 'pending' && <Clock size={12} />}
                                         {status === 'accepted' && <CheckCircle size={12} />}
                                         {status === 'rejected' && <X size={12} />}
                                         {status}
                                </span>
                                <span className="text-xs text-zinc-400 font-medium flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(project.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-zinc-900 line-clamp-2 mb-3 group-hover:text-emerald-700 transition-colors" title={project.title}>
                                {project.title}
                            </h3>
                            
                            <div className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-2 mb-2 text-zinc-800 font-bold text-sm">
                                    <FileText size={14} className="text-emerald-500" />
                                    Your Proposal
                                </div>
                                <p className="text-zinc-600 text-sm italic line-clamp-3 mb-3 leading-relaxed">
                                    "{myRequest?.description}"
                                </p>
                                <div className="flex items-center justify-between text-xs font-bold text-zinc-500 pt-3 border-t border-zinc-200">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                        {myRequest?.estimatedModules} Modules
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                        Due {myRequest?.deadline}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100">
                                <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                                    <User size={14} />
                                    {requestsCount} Applicant{requestsCount !== 1 ? 's' : ''}
                                </div>
                                
                                {canEdit && (
                                    <button 
                                        onClick={() => handleEditClick(project, myRequest)}
                                        className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors flex items-center gap-1 shadow-sm hover:shadow-md"
                                    >
                                        Edit
                                    </button>
                                )}
                                
                                {!canEdit && isAssignedToOther && (
                                    <span className="text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded border border-red-100 flex items-center gap-1">
                                        <AlertTriangle size={12} /> Closed
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
            </AnimatePresence>

            {projects.length === 0 && (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-300 shadow-sm">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="text-zinc-400" size={32} />
                    </div>
                    <p className="text-xl font-bold text-zinc-900 mb-2">No applications yet</p>
                    <p className="text-zinc-500 max-w-sm mx-auto mb-6">
                        You haven't submitted any proposals. Browse the marketplace to find your next project.
                    </p>
                    <Link href="/solver/market" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-black hover:bg-zinc-800 transition shadow-lg">
                        Browse Market
                    </Link>
                </div>
            )}
        </div>
      </div>

       {/* Edit Modal */}
       {editingRequest && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-zinc-100"
                >
                    <button 
                        onClick={() => setEditingRequest(null)}
                        className="absolute top-6 right-6 text-zinc-400 hover:text-black transition-colors"
                    >
                        <X size={24} />
                    </button>
                    
                    <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-zinc-900">Edit Proposal</h2>
                        <p className="text-zinc-500 text-sm mt-1">Update your application details below.</p>
                    </div>
                    
                    <form onSubmit={handleSaveEdit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">Cover Letter</label>
                            <textarea 
                                required
                                rows="4"
                                className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium text-sm resize-none"
                                value={editingRequest.description}
                                onChange={e => setEditingRequest({...editingRequest, description: e.target.value})}
                                placeholder="Describe why you are the best fit..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">Est. Modules</label>
                                <div className="relative">
                                    <input 
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-sm"
                                        value={editingRequest.estimatedModules}
                                        onChange={e => setEditingRequest({...editingRequest, estimatedModules: e.target.value})}
                                    />
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                                        <FileText size={16} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-700 mb-1.5 uppercase tracking-wide">Deadline</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-bold text-sm text-zinc-600"
                                    value={editingRequest.deadline}
                                    onChange={e => setEditingRequest({...editingRequest, deadline: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-6 flex justify-end gap-3 border-t border-zinc-100 mt-6">
                            <button 
                                type="button"
                                onClick={() => setEditingRequest(null)}
                                className="px-5 py-2.5 text-zinc-600 font-bold hover:bg-zinc-50 rounded-xl transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={saveLoading}
                                className="px-6 py-2.5 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:transform-none transform active:scale-95 text-sm"
                            >
                                {saveLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}

    </div>
  );
}
