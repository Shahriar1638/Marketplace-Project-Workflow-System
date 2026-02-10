"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-zinc-900">Dashboard Overview</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Users</h3>
          <p className="text-4xl font-bold text-zinc-900">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Total Projects</h3>
          <p className="text-4xl font-bold text-indigo-600">{stats.totalProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Active</h3>
          <p className="text-4xl font-bold text-green-600">{stats.activeProjects}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
          <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-2">Completed</h3>
          <p className="text-4xl font-bold text-blue-600">{stats.completedProjects}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold mb-6 text-zinc-800">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/admin/users" className="group block p-6 bg-white rounded-xl shadow-sm border border-zinc-100 hover:border-indigo-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
               👥
            </span>
            <span className="text-zinc-400 group-hover:text-indigo-600 transition-colors">↗</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">Manage Users</h3>
          <p className="text-sm text-zinc-500">View user details, update roles, and manage permissions.</p>
        </Link>

        <Link href="/admin/projects" className="group block p-6 bg-white rounded-xl shadow-sm border border-zinc-100 hover:border-indigo-200 hover:shadow-lg transition-all">
          <div className="flex items-center justify-between mb-4">
             <span className="p-3 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
               📂
            </span>
            <span className="text-zinc-400 group-hover:text-orange-600 transition-colors">↗</span>
          </div>
          <h3 className="text-lg font-bold text-zinc-900 mb-1">View All Projects</h3>
          <p className="text-sm text-zinc-500">Monitor project statuses, assignments, and progress.</p>
        </Link>
      </div>
    </div>
  );
}
