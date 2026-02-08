"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function UserDashboard() {
  const { data: session } = useSession();
  const [view, setView] = useState('home'); // 'home', 'buyer-form', 'solver-form'
  const [message, setMessage] = useState('');
  
  // Solver Form State
  const [solverData, setSolverData] = useState({
    bio: '',
    skills: '',
    phone: '',
    github: ''
  });

  const handleRequest = async (role, data = null) => {
    setMessage('');
    try {
      const res = await fetch('/api/user/request-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            requestedRole: role,
            profileData: data 
        }),
      });
      
      if (res.ok) {
        setMessage(`Request to become a ${role} submitted successfully!`);
        setView('home');
      } else {
        setMessage('Failed to submit request.');
      }
    } catch (error) {
        console.error(error);
        setMessage('An error occurred.');
    }
  };

  if(!session) return null;

  return (
    <div className="w-full max-w-4xl p-6 border border-black mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4">Welcome, {session.user.name}!</h2>
      <p className="mb-8 text-gray-600">You are currently a standard User. Would you like to upgrade your capabilities?</p>

      {message && (
        <div className="mb-6 p-4 bg-gray-100 border border-black font-bold text-center">
            {message}
        </div>
      )}

      {view === 'home' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyer Option */}
            <div className="border border-black p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col justify-between h-48">
                <div>
                    <h3 className="text-xl font-bold mb-2">Become a Buyer</h3>
                    <p className="text-sm">Post projects, hire talent, and get work done.</p>
                </div>
                <button 
                    onClick={() => handleRequest('Buyer')}
                    className="mt-4 px-4 py-2 bg-black text-white font-bold w-full hover:bg-white hover:text-black border border-black transition"
                >
                    Request Buyer Access
                </button>
            </div>

            {/* Solver Option */}
            <div className="border border-black p-6 hover:bg-gray-50 transition cursor-pointer flex flex-col justify-between h-48">
                <div>
                    <h3 className="text-xl font-bold mb-2">Become a Problem Solver</h3>
                    <p className="text-sm">Find work, solve challenges, and earn money.</p>
                </div>
                <button 
                    onClick={() => setView('solver-form')}
                    className="mt-4 px-4 py-2 border border-black font-bold w-full hover:bg-black hover:text-white transition"
                >
                    Apply as Solver
                </button>
            </div>
        </div>
      )}

      {view === 'solver-form' && (
        <div className="border-t border-black pt-6 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xl font-bold mb-4">Problem Solver Application</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2">Bio / Introduction</label>
                    <textarea 
                        className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black" 
                        rows="3"
                        value={solverData.bio}
                        onChange={(e) => setSolverData({...solverData, bio: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Skills (comma separated)</label>
                    <input 
                        type="text" 
                        className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="e.g. React, Next.js, Python"
                        value={solverData.skills}
                        onChange={(e) => setSolverData({...solverData, skills: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2">Phone Number</label>
                        <input 
                            type="tel" 
                            className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                            value={solverData.phone}
                            onChange={(e) => setSolverData({...solverData, phone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">GitHub Profile</label>
                        <input 
                            type="url" 
                            className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="https://github.com/..."
                            value={solverData.github}
                            onChange={(e) => setSolverData({...solverData, github: e.target.value})}
                        />
                    </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                    <button 
                        onClick={() => handleRequest('Problem Solver', solverData)}
                        className="flex-1 bg-black text-white py-3 font-bold hover:bg-white hover:text-black border border-black transition"
                    >
                        Submit Application
                    </button>
                    <button 
                        onClick={() => setView('home')}
                        className="px-6 py-3 font-bold border border-black hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
