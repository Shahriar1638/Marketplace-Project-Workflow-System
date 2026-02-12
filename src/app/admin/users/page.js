"use client";
import { useState, useEffect } from "react";
import { Search, CheckCircle, XCircle, Shield, User } from 'lucide-react';
import { clsx } from "clsx";
import Swal from 'sweetalert2';

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRoleUpdate = async (userId, newRole, action) => {
        const result = await Swal.fire({
            title: `Confirm ${action}?`,
            text: `Are you sure you want to ${action} this request?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: action === 'approve' ? '#10b981' : '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: `Yes, ${action} it!`
        });

        if (!result.isConfirmed) return;

        try {
            const res = await fetch('/api/admin/users/update-role', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole, action }),
            });
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: `User request has been ${action}d.`,
                    timer: 2000,
                    showConfirmButton: false
                });
                fetchUsers();
            } else {
                Swal.fire('Error', 'Failed to update role.', 'error');
            }
        } catch (error) {
            console.error("Failed to update role", error);
            Swal.fire('Error', 'An error occurred.', 'error');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                              user.email.toLowerCase().includes(search.toLowerCase());
        return matchesRole && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900">Manage Users</h1>
                    <p className="text-zinc-500 text-sm">Oversee user roles and approve permissions.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select 
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="All">All Roles</option>
                        <option value="user">User</option>
                        <option value="buyer">Buyer</option>
                        <option value="solver">Problem Solver</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-zinc-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-zinc-500">Loading users...</td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-zinc-500">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-zinc-900">{user.name}</div>
                                                    <div className="text-sm text-zinc-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={clsx(
                                                "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize",
                                                user.role === 'admin' ? "bg-purple-100 text-purple-800" :
                                                user.role === 'buyer' ? "bg-blue-100 text-blue-800" :
                                                user.role === 'solver' ? "bg-green-100 text-green-800" :
                                                "bg-gray-100 text-gray-800"
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                                            {/* Assuming 'active' if no explicit status field, or use createdAt */}
                                            Active
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {/* Role Request Actions */}
                                            {user.requestStatus?.status === 'pending' ? (
                                                 <div className="flex items-center justify-end gap-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                                    <span className="text-xs text-amber-800 font-bold mr-2">
                                                        Requested: {user.requestStatus.requestedRole}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleRoleUpdate(user._id, user.requestStatus.requestedRole, 'approve')}
                                                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 rounded transition"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRoleUpdate(user._id, null, 'reject')}
                                                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 rounded transition"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">No actions</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
