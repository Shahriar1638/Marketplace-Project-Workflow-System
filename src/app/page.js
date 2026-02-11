/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowRight, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Call NextAuth signIn
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      // Successful login
      router.push('/home'); // Auth wrapper will redirect to role page
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      
      {/* Left Side: Branding / Marketing */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10">
            <div className="flex items-center justify-center mb-8">
                 <Image src="/logo.png" alt="FlowDesk" width={80} height={80} className="object-contain" priority />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Build.<br/>
              Collaborate.<br/>
              <span className="text-emerald-500">Solve.</span>
            </h1>
            <p className="text-zinc-400 text-lg max-w-md leading-relaxed">
              FlowDesk connects visionary buyers with expert solvers. Manage projects, track milestones, and deliver excellence in one unified platform.
            </p>
        </div>

        <div className="relative z-10 mt-12 text-sm text-zinc-500 font-mono">
            © {new Date().getFullYear()} FlowDesk Systems Inc.
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-8 bg-zinc-50 relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
        
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl border border-zinc-100"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-zinc-900">Welcome back</h2>
                <p className="text-zinc-500 mt-2">Enter your credentials to access your account.</p>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-lg flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full inline-block shrink-0"></span>
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-bold text-zinc-700">Password</label>
                    </div>
                    <input
                        type="password"
                        required
                        className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all font-medium"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3.5 font-bold rounded-xl hover:bg-zinc-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-2 shadow-lg mt-4"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <div className="mt-8 pt-8 border-t border-zinc-100 text-center">
                <p className="text-zinc-500 text-sm">
                    Don't have an account? <Link href="/signup" className="text-black font-bold hover:underline">Sign up for free</Link>
                </p>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
