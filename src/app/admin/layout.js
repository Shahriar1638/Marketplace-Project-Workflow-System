"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Users, FolderOpen, LogOut, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PageTransition from '@/components/PageTransition';
import { useState } from 'react';
import Image from 'next/image';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-zinc-900 text-white z-50 p-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 relative flex items-center justify-center">
                <Image src="/logo.png" alt="FlowDesk" fill className="object-contain" />
            </div>
            <h1 className="text-xl font-black tracking-tight">
              <span className="text-indigo-500">Flow</span><span className="text-white">Desk</span>
            </h1>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-zinc-800 rounded transition">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 bg-zinc-900 text-white p-6 shadow-xl z-40 w-64 flex flex-col justify-between transition-transform duration-300 md:relative md:translate-x-0 pt-20 md:pt-6",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div>
          {/* Logo - Hidden on mobile as it's in header */}
          <div className="hidden md:flex mb-10 items-center gap-3 px-2">
            <div className="w-8 h-8 relative flex items-center justify-center">
                <Image src="/logo.png" alt="FlowDesk" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              <span className="text-indigo-500">Flow</span><span className="text-white">Desk</span>
            </h1>
            <span className="text-[10px] font-bold text-indigo-200 bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-500/30 uppercase tracking-widest self-end mb-1">
              Admin
            </span>
          </div>
          
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={twMerge(
                    "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative overflow-hidden",
                    isActive 
                      ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/20" 
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  )}
                >
                  <Icon size={20} className={clsx("transition-transform group-hover:scale-110", isActive && "text-white")} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full opacity-20" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800">
            <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 px-4 py-3 w-full text-left text-zinc-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors group"
            >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span>Sign Out</span>
            </button>
            <div className="mt-6 text-xs text-zinc-600 text-center">
                v1.0.0 • Admin Console
            </div>
        </div>
      </aside>

      {/* Overlay background for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto md:ml-0 transition-all duration-300 pt-16 md:pt-0 bg-slate-50 w-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <PageTransition>
                {children}
            </PageTransition>
        </div>
      </main>
    </div>
  );
}
