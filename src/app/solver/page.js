"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SolverDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return <div className="p-8 text-center">Please log in.</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Solver Dashboard</h1>
      <p className="mb-8 text-gray-600">Welcome, {session.user.name}. What would you like to do today?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Marketplace (All Projects) */}
        <Link href="/solver/market" className="group block p-8 border border-black hover:bg-black hover:text-white transition h-64 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Marketplace</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-400">Browse all available projects</p>
        </Link>

        {/* My Requests */}
        <Link href="/solver/my-requests" className="group block p-8 border border-black hover:bg-black hover:text-white transition h-64 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">My Requests</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-400">Projects I have applied to</p>
        </Link>

        {/* Assigned Projects */}
        <Link href="/solver/active-projects" className="group block p-8 border border-black hover:bg-black hover:text-white transition h-64 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Assigned Projects</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-400">Projects being worked on</p>
        </Link>
        
        {/* Profile */}
        <Link href="/solver/profile" className="group block p-8 border border-black hover:bg-black hover:text-white transition h-64 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="text-xl font-bold mb-2">My Profile</h2>
            <p className="text-sm text-gray-500 group-hover:text-gray-400">View and edit profile</p>
        </Link>

      </div>
    </div>
  );
}
