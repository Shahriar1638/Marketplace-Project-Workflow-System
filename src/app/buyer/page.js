/* eslint-disable react/no-unescaped-entities */
"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Plus, Compass, List } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BuyerHome() {
  const { data: session } = useSession();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-16 bg-linear-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative z-10">
            <h1 className="text-5xl font-extrabold text-blue-900 tracking-tight mb-4">
            {getGreeting()}, {session?.user?.name || 'Buyer'}!
            </h1>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto mb-8">
            Ready to bring your next idea to life? Post a project and connect with top talent today.
            </p>
            <div className="flex justify-center gap-4">
                <Link href="/buyer/create-project" className="px-8 py-3 bg-black text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-transform hover:scale-105 flex items-center gap-2">
                    <Plus size={20} />
                    Create New Project
                </Link>
                <Link href="/buyer/my-projects" className="px-8 py-3 bg-white text-black font-bold border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <List size={20} />
                    My Projects
                </Link>
            </div>
        </div>
      </motion.div>
      
    </div>
  );
}
