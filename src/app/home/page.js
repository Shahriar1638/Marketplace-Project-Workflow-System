/* eslint-disable react/no-unescaped-entities */
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from 'next/image';
import { Loader2, LogOut, Clock, ArrowRight } from 'lucide-react';
import UserDashboard from "@/components/UserDashboard";
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Middleware handles auth check, but we still want to auto-redirect 
    // logged-in users to their specific dashboards if they land here.
    if (status === "authenticated" && session) {
        if (session.user.role === 'Buyer') router.push('/buyer');
        else if (session.user.role === 'Problem Solver') router.push('/solver');
        else if (session.user.role === 'Admin') router.push('/admin');
    }
  }, [status, router, session]);
  
  const isRedirecting = status === "authenticated" && session?.user?.role !== 'User';
  
  if (status === "loading" || isRedirecting) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                <div className="w-20 h-20 relative flex items-center justify-center mb-6">
                    <Image src="/logo.png" alt="FlowDesk" fill className="object-contain" priority />
                </div>
                <Loader2 className="animate-spin text-zinc-900" size={48} />
                <p className="text-zinc-400 font-medium mt-4 text-sm animate-pulse">Initializing Workspace...</p>
            </div>
        </div>
    );
  }
  if (status === "unauthenticated") return null;

  if (session && session.user.role === 'User') {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
             {/* Vibrant Navbar */}
             <nav className="bg-white px-6 py-4 sticky top-0 z-50 border-b border-gray-100 shadow-sm">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-default">
                        <div className="w-10 h-10 relative flex items-center justify-center bg-black rounded-lg shadow-lg group-hover:scale-105 transition-transform duration-300">
                            <Image src="/logo.png" alt="FlowDesk" fill className="object-contain p-1.5 invert brightness-0 grayscale-0" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-gray-900">FlowDesk</span>
                    </div>
                    <div className="flex items-center gap-6">
                         <div className="hidden md:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signed in as</span>
                            <span className="text-sm font-bold text-gray-900">{session.user.email}</span>
                         </div>
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-gray-100 hover:bg-black hover:text-white rounded-full transition-all duration-300"
                        >
                            <LogOut size={14} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="flex-1 p-6 flex flex-col items-center">
                <div className="w-full max-w-5xl space-y-8">
                    
                    {/* Hero / Alert Section */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-8 md:p-12 shadow-2xl shadow-indigo-200 text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner border border-white/10">
                                <Clock size={40} className="text-white" />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-white">Verification Pending</h1>
                                <p className="text-indigo-100 text-lg max-w-2xl font-medium leading-relaxed">
                                    Your account is currently under review. While you have standard <span className="font-bold text-white border-b border-white/30">User</span> access, 
                                    advanced features for Buyers and Solvers will be unlocked upon admin approval.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden ring-1 ring-gray-100"
                    >
                        <div className="border-b border-gray-100 px-8 py-5 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Current Status
                            </h3>
                            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                                Refresh Status <ArrowRight size={12} />
                            </button>
                        </div>
                        <div className="p-1">
                             <UserDashboard />
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    );
  }

  return null;
}
