/* eslint-disable react/no-unescaped-entities */
"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import UserDashboard from "@/components/UserDashboard";

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
        <div className="min-h-screen bg-zinc-50 flex flex-col">
             {/* Navbar for User Role */}
             <nav className="bg-white border-b border-zinc-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 relative flex items-center justify-center">
                        <Image src="/logo.png" alt="FlowDesk" fill className="object-contain" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">FlowDesk</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-zinc-500 hidden md:inline">Logged in as {session.user.email}</span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="px-4 py-2 text-xs font-bold bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 rounded-lg transition shadow-sm"
                    >
                        Sign Out
                    </button>
                </div>
            </nav>

            <main className="flex-1 p-6 flex flex-col items-center">
                <div className="w-full max-w-4xl space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center">
                        <h2 className="text-xl font-bold text-blue-900 mb-2">Account Pending Verification</h2>
                        <p className="text-blue-700 max-w-lg mx-auto">
                            You currently have the standard "User" role. To participate as a Buyer or Solver, please upgrade your role or wait for admin approval.
                        </p>
                    </div>
                    
                    {/* Render the UserDashboard component explicitly */}
                    <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-1">
                        <UserDashboard />
                    </div>
                </div>
            </main>
        </div>
    );
  }

  return null;
}
