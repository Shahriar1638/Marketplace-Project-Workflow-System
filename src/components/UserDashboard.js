"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Briefcase, Code, CheckCircle, ArrowRight, X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserDashboard() {
  const { data: session } = useSession();
  const [view, setView] = useState('home');
  const [message, setMessage] = useState('');
  
  const [solverData, setSolverData] = useState({
    bio: '',
    skills: '',
    phone: '',
    github: ''
  });

  const handleRequest = async (role, data = null) => {
    setMessage('');
    try {
        const payload = { requestedRole: role };
        if (data) payload.profileData = data;
        
      const res = await fetch('/api/user/request-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const resData = await res.json();
      
      if (res.ok) {
        setMessage({ type: 'success', text: resData.message || `Request to become a ${role} submitted successfully!` });
        setView('home');
      } else {
        setMessage({ type: 'error', text: resData.message || 'Failed to submit request.' });
      }
    } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'An error occurred while submitting.' });
    }
  };

  if(!session) return null;

  return (
    <div className="w-full">
      <div className="text-center mb-10">
           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome, {session.user.name?.split(' ')[0]}!</h2>
           <p className="text-gray-500 mt-2 max-w-lg mx-auto">You are currently a standard User. Choose a path below to upgrade your capabilities and start working.</p>
      </div>
      
      {message && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`mb-8 p-4 rounded-xl font-bold flex items-center justify-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
        >
            {message.type === 'success' ? <CheckCircle size={20} /> : <X size={20} />}
            {message.text}
        </motion.div>
      )}

      {view === 'home' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Option */}
            <motion.div 
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col items-center text-center cursor-pointer overflow-hidden"
                onClick={() => handleRequest('Buyer')}
            >
                <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <Briefcase size={32} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Become a Buyer</h3>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed px-4">Post detailed projects, hire expert solvers, and manage workflows seamlessly.</p>
                </div>
                <div className="mt-8 w-full relative z-10">
                    <button className="w-full py-3 bg-black text-white font-bold rounded-xl group-hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center gap-2">
                        Request Access <ArrowRight size={16} />
                    </button>
                </div>
            </motion.div>

            {/* Solver Option */}
             <motion.div 
                whileHover={{ y: -5 }}
                className="group relative bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col items-center text-center cursor-pointer overflow-hidden"
                onClick={() => setView('solver-form')}
            >
                <div className="absolute inset-0 bg-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <Code size={32} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Become a Solver</h3>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed px-4">Browse challenges, submit innovative solutions, and earn competitive rewards.</p>
                </div>
                <div className="mt-8 w-full relative z-10">
                    <button className="w-full py-3 bg-white text-black border-2 border-gray-200 font-bold rounded-xl group-hover:border-emerald-500 group-hover:text-emerald-700 transition-colors flex items-center justify-center gap-2">
                        Apply Now <ArrowRight size={16} />
                    </button>
                </div>
            </motion.div>
        </div>
      )}

      {view === 'solver-form' && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
        >
            <div className="flex items-center gap-3 mb-6">
                 <button onClick={() => setView('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                 </button>
                 <h3 className="text-2xl font-bold text-gray-900">Solver Application</h3>
            </div>
            
            <div className="bg-white p-8 rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-500/5 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -mr-10 -mt-10"></div>
                
                <div className="relative z-10 space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Professional Bio</label>
                        <textarea 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium resize-none" 
                            rows="4"
                            placeholder="Tell us about your experience and expertise..."
                            value={solverData.bio}
                            onChange={(e) => setSolverData({...solverData, bio: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Top Skills</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                            placeholder="e.g. React, Node.js, Python, Design"
                            value={solverData.skills}
                            onChange={(e) => setSolverData({...solverData, skills: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <input 
                                type="tel" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="+1 (555) 000-0000"
                                value={solverData.phone}
                                onChange={(e) => setSolverData({...solverData, phone: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">GitHub URL</label>
                            <input 
                                type="url" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
                                placeholder="https://github.com/..."
                                value={solverData.github}
                                onChange={(e) => setSolverData({...solverData, github: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100 relative z-10">
                    <button 
                        onClick={() => handleRequest('Problem Solver', solverData)}
                        className="flex-1 bg-black text-white py-3.5 font-bold rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all transform active:scale-[0.98]"
                    >
                        Submit Application
                    </button>
                    <button 
                        onClick={() => setView('home')}
                        className="px-6 py-3.5 font-bold bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </motion.div>
      )}
    </div>
  );
}
