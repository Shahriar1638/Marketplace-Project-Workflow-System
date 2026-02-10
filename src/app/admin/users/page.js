"use client";
import { useState, useEffect } from "react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [roleFilter, setRoleFilter] = useState('All');
    const [requestFilter, setRequestFilter] = useState('All');
    const [loading, setLoading] = useState(true);

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
        try {
            const res = await fetch('/api/admin/users/update-role', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole, action }),
            });
            if (res.ok) {
                fetchUsers(); // Refresh list
            }
        } catch (error) {
            console.error("Failed to update role", error);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        // Filter for requests: 'Pending Requests' checks for status === 'pending'
        const matchesRequest = requestFilter === 'All' || 
                               (requestFilter === 'Pending Requests' && user.requestStatus?.status === 'pending');
        return matchesRole && matchesRequest;
    });

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Users</h1>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <select 
                    className="p-2 border border-black"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="All">All Roles</option>
                    <option value="User">User</option>
                    <option value="Buyer">Buyer</option>
                    <option value="Problem Solver">Problem Solver</option>
                    <option value="Admin">Admin</option>
                </select>

                <select 
                    className="p-2 border border-black"
                    value={requestFilter}
                    onChange={(e) => setRequestFilter(e.target.value)}
                >
                    <option value="All">All Request Status</option>
                    <option value="Pending Requests">Pending Role Requests</option>
                </select>
            </div>

            {/* User List */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Current Role</th>
                            <th className="text-left py-3 px-4 font-semibold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{user.name}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold 
                                        ${user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                                          user.role === 'Buyer' ? 'bg-blue-100 text-blue-800' : 
                                          user.role === 'Problem Solver' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4">
                                    {user.requestStatus?.requestedRole === 'Buyer' || user.requestStatus?.requestedRole === 'Problem Solver'? (
                                        <div className="flex flex-col gap-2">
                                            <span className="text-sm font-bold text-gray-700">
                                                Requesting to become {user.requestStatus.requestedRole}
                                            </span>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleRoleUpdate(user._id, user.requestStatus.requestedRole, 'approve')}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleRoleUpdate(user._id, null, 'reject')}
                                                    className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs text-center">No actions needed</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
