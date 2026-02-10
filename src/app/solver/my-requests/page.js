/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';

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
              setMessage("Success: Application updated.");
              fetchRequests(); // Refresh data
              setEditingRequest(null); // Close modal
          } else {
              const err = await res.json();
              setMessage("Error: " + err.message);
          }
      } catch (error) {
          console.error(error);
          setMessage("Error: Failed to update.");
      } finally {
          setSaveLoading(false);
      }
  };


  if (loading) return <div className="p-8 text-center">Loading requests...</div>;

  return (
    <div className="min-h-screen">
      <div className="bg-black text-white p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">My Requests</h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-300">
          Track and manage your applications.
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        
        {message && (
             <div className={`p-4 mb-6 border text-center font-bold sticky top-4 z-10 ${message.includes('Success') ? 'bg-green-100 border-green-500 text-green-800' : 'bg-red-100 border-red-500 text-red-800'}`}>
                {message}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
                // Find the specific request for this user
                const myRequest = project.requests.find(r => r.solverId === session?.user?.id);
                const status = myRequest ? myRequest.status : 'Unknown';
                const requestsCount = project.requests ? project.requests.length : 0;
                
                // Allow edit if project is NOT assigned to someone else
                // If project.status is 'open', it's editable. If 'assigned' and assignedSolverId !== me, not editable.
                // Assuming efficient way: if project.status === 'assigned' && project.assignedSolverId !== session.user.id -> blocked.
                const isAssignedToOther = project.status === 'assigned' && project.assignedSolverId !== session.user.id;
                const canEdit = !isAssignedToOther && status !== 'accepted'; 

                return (
                    <div key={project._id} className="border border-black p-6 bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 flex flex-col h-full relative">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4">
                             <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider
                                    ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      status === 'accepted' ? 'bg-green-100 text-green-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                     {status}
                            </span>
                        </div>

                        <div className="mb-4 pr-16">
                            <h3 className="text-xl font-bold line-clamp-2 mb-2" title={project.title}>{project.title}</h3>
                            <p className="text-xs text-gray-400 mb-4">Posted: {new Date(project.createdAt).toLocaleDateString()}</p>
                            
                            <div className="text-sm bg-gray-50 p-3 border border-gray-100 mb-4">
                                <p className="font-bold text-gray-700 mb-1">My Proposal:</p>
                                <p className="text-gray-600 line-clamp-3 mb-2 italic">"{myRequest?.description}"</p>
                                <div className="flex justify-between text-xs text-gray-500 font-bold">
                                    <span>Est. Modules: {myRequest?.estimatedModules}</span>
                                    <span>Deadline: {myRequest?.deadline}</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-bold">{requestsCount} Applicants</span>
                            
                            {canEdit && (
                                <button 
                                    onClick={() => handleEditClick(project, myRequest)}
                                    className="text-black underline font-bold hover:text-blue-600 transition"
                                >
                                    Edit Proposal
                                </button>
                            )}
                            
                            {!canEdit && isAssignedToOther && (
                                <span className="text-red-500 text-xs font-bold">Closed (Assigned)</span>
                            )}
                        </div>
                    </div>
                );
            })}

            {projects.length === 0 && (
                <div className="col-span-full text-center py-16 border border-dashed border-gray-300">
                    <p className="text-xl font-bold mb-2">No requests found.</p>
                    <p className="text-gray-500">
                        You haven't applied to any projects yet. 
                        <Link href="/solver/market" className="text-black underline ml-1 font-bold">Browse Market</Link>
                    </p>
                </div>
            )}
        </div>
      </div>

       {/* Edit Modal */}
       {editingRequest && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white p-8 max-w-lg w-full border border-black shadow-2xl relative">
                    <button 
                        onClick={() => setEditingRequest(null)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-black font-bold text-xl"
                    >
                        ✕
                    </button>
                    
                    <h2 className="text-2xl font-bold mb-6">Edit Proposal</h2>
                    
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">Proposal / Cover Letter</label>
                            <textarea 
                                required
                                rows="4"
                                className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                                value={editingRequest.description}
                                onChange={e => setEditingRequest({...editingRequest, description: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Est. Modules</label>
                                <input 
                                    type="number"
                                    required
                                    min="1"
                                    className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={editingRequest.estimatedModules}
                                    onChange={e => setEditingRequest({...editingRequest, estimatedModules: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Est. Deadline</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={editingRequest.deadline}
                                    onChange={e => setEditingRequest({...editingRequest, deadline: e.target.value})}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-4 flex justify-end gap-4">
                            <button 
                                type="button"
                                onClick={() => setEditingRequest(null)}
                                className="px-4 py-2 text-gray-500 font-bold hover:text-black"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={saveLoading}
                                className="px-6 py-2 bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50"
                            >
                                {saveLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}

    </div>
  );
}
