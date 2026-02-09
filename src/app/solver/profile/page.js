"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function SolverProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: '', // String input for comma separation
        phone: '',
        github: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/solver/profile');
                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        email: data.email,
                        bio: data.profile?.bio || '',
                        skills: data.profile?.skills?.join(', ') || '',
                        phone: data.profile?.phone || '',
                        github: data.profile?.github || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        // Process skills string to array
        const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);

        try {
            const res = await fetch('/api/solver/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bio: formData.bio,
                    skills: skillsArray,
                    phone: formData.phone,
                    github: formData.github
                }),
            });

            if (res.ok) {
                setMessage('Profile updated successfully!');
            } else {
                setMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="min-h-screen p-8 max-w-2xl mx-auto">
            <Link href="/solver" className="text-sm underline mb-6 block">← Back to Dashboard</Link>
            
            <h1 className="text-3xl font-bold mb-8">Manage Profile</h1>

            {message && (
                <div className={`p-4 mb-6 border text-center font-bold ${message.includes('success') ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="border border-black p-8 bg-white space-y-6">
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">Name</label>
                        <input 
                            disabled 
                            value={formData.name} 
                            className="w-full p-2 border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Email</label>
                        <input 
                            disabled 
                            value={formData.email} 
                            className="w-full p-2 border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Bio / Intro</label>
                    <textarea 
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="Tell buyers about your expertise..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-1">Skills (comma separated)</label>
                    <input 
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                        placeholder="React, Node.js, Python..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-1">GitHub URL</label>
                        <input 
                            name="github"
                            value={formData.github}
                            onChange={handleChange}
                            className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="https://github.com/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Phone Number</label>
                        <input 
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border border-black focus:outline-none focus:ring-1 focus:ring-black"
                            placeholder="+1 234 567 890"
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={saving}
                    className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
}
