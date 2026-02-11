/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, UserPlus, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User', // Default
    bio: '',
    skills: '',
    github: '',
    phone: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Account created! Redirecting...');
        setTimeout(() => {
            router.push("/");
        }, 1500);
      } else {
        setMessage(data.message || 'Something went wrong.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Left Side: Branding / Marketing */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 text-white p-12 flex-col justify-between relative overflow-hidden h-screen">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 p-6">
            <Link href="/" className="inline-block">
                <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-bold text-2xl shadow-xl mb-8">F</div>
            </Link>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Join the<br/>
              <span className="text-blue-500">Network.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed mb-8">
              Whether you have a vision to build or the skills to execute, FlowDesk is your platform.
            </p>

            <div className="space-y-4">
                <div className="flex items-center gap-4 text-zinc-300">
                    <div className="p-2 bg-zinc-800 rounded-lg"><Check size={20} className="text-emerald-500"/></div>
                    <span className="font-medium">Curated Projects</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                    <div className="p-2 bg-zinc-800 rounded-lg"><Check size={20} className="text-emerald-500"/></div>
                    <span className="font-medium">Secure Payments</span>
                </div>
                <div className="flex items-center gap-4 text-zinc-300">
                    <div className="p-2 bg-zinc-800 rounded-lg"><Check size={20} className="text-emerald-500"/></div>
                    <span className="font-medium">Expert Solvers</span>
                </div>
            </div>
        </div>

        <div className="relative z-10 mt-12 text-sm text-zinc-500 font-mono p-6">
            © {new Date().getFullYear()} FlowDesk Systems Inc.
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 bg-zinc-50 h-full min-h-screen overflow-y-auto">
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-lg bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-zinc-100 my-8"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-zinc-900">Create Account</h2>
                <p className="text-zinc-500 mt-2">Enter your details to get started.</p>
            </div>

            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className={`mb-6 p-3 rounded-lg text-sm font-bold flex items-center gap-2 ${message.includes('Redirecting') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${message.includes('Redirecting') ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {message}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium"
                        placeholder="name@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                {/* Role Switcher */}
                <div className="pt-2">
                    <label className="flex items-center gap-4 cursor-pointer group p-4 border border-zinc-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all bg-white">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                className="peer sr-only"
                                checked={formData.role === 'Problem Solver'}
                                onChange={(e) => setFormData({...formData, role: e.target.checked ? 'Problem Solver' : 'User'})}
                            />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </div>
                        <div className="flex-1">
                            <span className="block font-bold text-zinc-900 group-hover:text-emerald-700">Apply as a Solver</span>
                            <span className="text-xs text-zinc-500 group-hover:text-emerald-600">I want to solve projects and earn money.</span>
                        </div>
                    </label>
                </div>

                {/* Solver Fields */}
                 {formData.role === 'Problem Solver' && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-4 pt-2 overflow-hidden"
                    >
                        <div className="p-5 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-4">
                            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                Solver Profile
                            </h4>
                            
                            <div>
                                <label className="block text-xs font-bold text-emerald-800 mb-1.5">Professional Bio</label>
                                <textarea
                                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-shadow resize-none"
                                    rows="3"
                                    placeholder="Describe your expertise and experience..."
                                    value={formData.bio || ''}
                                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                    <label className="block text-xs font-bold text-emerald-800 mb-1.5">Top Skills</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-shadow"
                                        placeholder="e.g. React, Node.js"
                                        value={formData.skills || ''}
                                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-emerald-800 mb-1.5">GitHub URL</label>
                                    <input
                                        type="url"
                                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-shadow"
                                        placeholder="https://github.com/..."
                                        value={formData.github || ''}
                                        onChange={(e) => setFormData({...formData, github: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            
                             <div>
                                    <label className="block text-xs font-bold text-emerald-800 mb-1.5">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition-shadow"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        required
                                    />
                                </div>
                        </div>
                    </motion.div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3.5 font-bold rounded-xl hover:bg-zinc-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-2 shadow-lg mt-6"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                            Create Account <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
                <p className="text-zinc-500 text-sm">
                    Already have an account? <Link href="/" className="text-black font-bold hover:underline">Log in</Link>
                </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
