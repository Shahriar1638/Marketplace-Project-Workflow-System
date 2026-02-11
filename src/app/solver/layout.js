"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Compass, FolderMinus, FolderCheck, User, LogOut, Home } from 'lucide-react';
import Image from 'next/image';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function SolverLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/solver', icon: Home },
    { name: 'Explore Projects', href: '/solver/market', icon: Compass },
    { name: 'My Requests', href: '/solver/my-requests', icon: FolderMinus },
    { name: 'Assigned', href: '/solver/active-projects', icon: FolderCheck },
    { name: 'Manage Profile', href: '/solver/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                
                {/* Logo Area */}
                <div className="flex items-center gap-2">
                    <Link href="/solver" className="flex items-center gap-2">
                        <div className="w-8 h-8 relative flex items-center justify-center">
                            <Image src="/logo.png" alt="FlowDesk" fill className="object-contain" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">FlowDesk</span>
                    </Link>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded ml-2 uppercase tracking-wider border border-emerald-100">Solver</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 group relative overflow-hidden",
                                    isActive 
                                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-200/50" 
                                        : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-700"
                                )}
                            >
                                <Icon size={18} className={clsx("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-gray-400 group-hover:text-emerald-600")} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                     <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Sign Out"
                     >
                        <LogOut size={20} />
                     </button>
                </div>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
      </main>
    </div>
  );
}
