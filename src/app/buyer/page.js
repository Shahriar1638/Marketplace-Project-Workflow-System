"use client";
import Link from 'next/link';

export default function BuyerDashboard() {
  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Buyer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Create Project Card */}
        <Link href="/buyer/create-project" className="group block p-8 border border-black hover:bg-black hover:text-white transition h-64 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">Create New Project</h2>
            <p className="text-gray-600 group-hover:text-gray-300">Post a new project and find talent.</p>
        </Link>

        {/* View My Projects Card */}
        <Link href="/buyer/my-projects" className="group block p-8 border border-black hover:bg-black hover:text-white transition h-64 flex flex-col justify-center items-center text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold mb-2">My Projects</h2>
            <p className="text-gray-600 group-hover:text-gray-300">Manage your active projects and requests.</p>
        </Link>
      </div>
    </div>
  );
}
