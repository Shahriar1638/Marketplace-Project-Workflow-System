"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Home, Compass, FolderPlus, List, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import PageTransition from '@/components/PageTransition';

export default function BuyerLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/buyer', icon: Home },
    { name: 'Explore', href: '/buyer/explore', icon: Compass },
    { name: 'My Projects', href: '/buyer/my-projects', icon: List },
    { name: 'Create', href: '/buyer/create-project', icon: FolderPlus },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                
                {/* Logo Area */}
                <div className="flex items-center gap-1">
                    <h1 className="text-2xl font-black tracking-tight">
                        <span className="text-blue-600">Flow</span><span className="text-black">Desk</span>
                    </h1>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded ml-2 border border-blue-100 uppercase tracking-widest self-center">
                        Buyer
                    </span>
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
                                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                                    isActive 
                                        ? "bg-black text-white shadow-md" 
                                        : "text-gray-500 hover:bg-gray-100 hover:text-black"
                                )}
                            >
                                <Icon size={16} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                     {/* Mobile Menu Button (Hidden on Desktop) */}
                     {/* ... (simplified for now) ... */}

                     <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50"
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
        <PageTransition>
            {children}
        </PageTransition>
      </main>
    </div>
  );
}
