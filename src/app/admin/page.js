"use client";
import Link from 'next/link';

export default function AdminDashboardLayout() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/users" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Manage Users</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">View users, filter by role, and approve role requests.</p>
        </Link>
        <Link href="/admin/projects" className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">View Projects</h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">Monitor all projects and filter by status (Open, Assigned, Completed).</p>
        </Link>
      </div>
    </div>
  );
}
