"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Users, FolderOpen, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import PageTransition from '@/components/PageTransition';

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Projects', href: '/admin/projects', icon: FolderOpen },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-zinc-900 text-white p-6 shadow-xl z-50 flex flex-col justify-between transition-transform duration-300 transform md:translate-x-0 -translate-x-full md:relative">
        <div>
          <div className="mb-10 flex items-center gap-3 px-2">
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
                  className={twMerge(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
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

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden md:ml-0 transition-all duration-300">
        <div className="p-8 max-w-7xl mx-auto">
            <PageTransition>
                {children}
            </PageTransition>
        </div>
      </main>
    </div>
  );
}
