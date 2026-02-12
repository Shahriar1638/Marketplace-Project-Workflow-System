/* eslint-disable react/no-unescaped-entities */
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from 'next/image';
import { Loader2, LogOut, ShieldCheck, Mail, AlertTriangle } from 'lucide-react';
import UserDashboard from "@/components/UserDashboard";
import { motion } from 'framer-motion';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
        if (session.user.role === 'Buyer') router.push('/buyer');
        else if (session.user.role === 'Problem Solver') router.push('/solver');
        else if (session.user.role === 'Admin') router.push('/admin');
    }
  }, [status, router, session]);
  
  const isRedirecting = status === "authenticated" && session?.user?.role !== 'User';
  
  if (status === "loading" || isRedirecting) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50">
            <div className="flex flex-col items-center">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 relative flex items-center justify-center mb-6 bg-white rounded-3xl shadow-xl p-4"
                >
                    <Image src="/logo.png" alt="FlowDesk" fill className="object-contain p-2" priority />
                </motion.div>
                <Loader2 className="animate-spin text-emerald-600" size={40} />
                <p className="text-zinc-500 font-bold mt-4 text-sm animate-pulse tracking-wide uppercase">Initializing Workspace...</p>
            </div>
        </div>
    );
  }
  if (status === "unauthenticated") return null;

  if (session && session.user.role === 'User') {
    return (
        <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white font-sans text-zinc-900">
             {/* Modern Navbar */}
             <nav className="bg-white/80 backdrop-blur-md border-b border-zinc-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 relative flex items-center justify-center bg-black rounded-xl shadow-lg ring-2 ring-zinc-100">
                            <Image src="/logo.png" alt="FlowDesk" fill className="object-contain p-1.5" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-zinc-900">Flow<span className="text-emerald-500">Desk</span></span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200">
                            <div className="w-6 h-6 rounded-full bg-linear-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white text-[10px] font-bold">
                                {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                            </div>
                            <span className="text-xs font-bold text-zinc-600 truncate max-w-37.5">{session.user.email}</span>
                        </div>
                        
                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="group flex items-center gap-2 px-4 py-2 text-xs font-bold bg-white border border-zinc-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all shadow-xs hover:shadow-md"
                        >
                            <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                >
                    {/* Sidebar / Status Card */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl shadow-zinc-200/50 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                             
                             <div className="relative z-10">
                                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                                    <ShieldCheck size={32} />
                                </div>
                                <h2 className="text-2xl font-extrabold text-zinc-900 mb-3">Verification Pending</h2>
                                <p className="text-zinc-500 leading-relaxed text-sm mb-6">
                                    Your account currently has the standard <span className="font-bold text-zinc-900">User</span> role. 
                                    To unlock the full potential of FlowDesk as a Buyer or Problem Solver, please wait for admin approval.
                                </p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-sm">
                                        <AlertTriangle size={18} className="text-amber-500 shrink-0" />
                                        <span className="text-zinc-600 font-bold">Limited Access</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-sm">
                                        <Mail size={18} className="text-blue-500 shrink-0" />
                                        <span className="text-zinc-600 font-bold">Check your email for updates</span>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Quick Tips or Info */}
                        <div className="bg-emerald-600 text-white rounded-3xl p-8 shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                             <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none"></div>
                             <h3 className="text-xl font-bold mb-2 relative z-10">Did you know?</h3>
                             <p className="text-emerald-100 text-sm relative z-10 opacity-90">
                                 FlowDesk handles millions of dollars in project value every year. Once verified, you'll be part of an elite network.
                             </p>
                        </div>
                    </div>

                    {/* Main Request Form Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 overflow-hidden">
                             <div className="h-2 bg-linear-to-r from-emerald-400 via-blue-500 to-purple-600"></div>
                             <div className="p-1">
                                <UserDashboard />
                             </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
  }

  return null;
}
