 
"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Github, Phone, Code, Save, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function SolverProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: '',
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
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Failed to load profile data!',
                });
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
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Your profile has been saved successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                setMessage('Profile updated successfully!');
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong while saving.',
                });
                setMessage('Failed to update profile.');
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please check your connection and try again.',
            });
            setMessage('An error occurred.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
         <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="animate-spin text-emerald-600 w-10 h-10" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden relative border border-zinc-100">
                
                {/* Header Background */}
                <div className="h-32 bg-zinc-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    
                    <Link href="/solver" className="absolute top-6 left-6 text-white/70 hover:text-white flex items-center gap-2 transition-colors font-bold text-sm bg-black/20 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                        <ArrowLeft size={16} /> Dashboard
                    </Link>
                </div>

                <div className="px-8 pb-8">
                    {/* Profile Picture / Avatar Area */}
                    <div className="relative -mt-12 mb-6 flex justify-between items-end">
                        <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                            <div className="w-full h-full bg-linear-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-3xl">
                                {formData.name.charAt(0)}
                            </div>
                        </div>
                        <div className="mb-2">
                             <h1 className="text-2xl font-extrabold text-zinc-900 leading-tight">{formData.name}</h1>
                             <p className="text-zinc-500 text-sm font-medium">{formData.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <label className="block text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wide items-center gap-1.5">
                                    <User size={12} /> Full Name
                                </label>
                                <input 
                                    disabled 
                                    value={formData.name} 
                                    className="w-full bg-transparent font-bold text-zinc-400 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                                <label className="text-xs font-bold text-zinc-500 mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                                    <Mail size={12} /> Email Address
                                </label>
                                <input 
                                    disabled 
                                    value={formData.email} 
                                    className="w-full bg-transparent font-bold text-zinc-400 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-700 mb-2 items-center gap-2">
                                    Professional Bio
                                    <span className="text-xs font-normal text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">Required</span>
                                </label>
                                <textarea 
                                    name="bio"
                                    rows="4"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    className="w-full p-4 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs resize-none text-zinc-700 leading-relaxed text-sm"
                                    placeholder="Describe your expertise, experience, and what makes you a great solver..."
                                />
                            </div>

                            <div>
                                <label className="text-sm font-bold text-zinc-700 mb-2 flex items-center gap-2">
                                    <Code size={16} className="text-emerald-600"/>
                                    Skills & Technologies
                                </label>
                                <div className="relative">
                                    <input 
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        className="w-full pl-4 pr-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs text-sm font-medium"
                                        placeholder="React, Node.js, Python, AWS..."
                                    />
                                    <p className="text-xs text-zinc-400 mt-2 ml-1">Separate skills with commas.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2 items-center gap-2">
                                        <Github size={16} className="text-zinc-800"/>
                                        GitHub Profile
                                    </label>
                                    <input 
                                        name="github"
                                        value={formData.github}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all shadow-xs text-sm font-medium placeholder-zinc-300"
                                        placeholder="https://github.com/username"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 mb-2 items-center gap-2">
                                        <Phone size={16} className="text-blue-600"/>
                                        Phone Number
                                    </label>
                                    <input 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs text-sm font-medium placeholder-zinc-300"
                                        placeholder="+1 234 567 890"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-zinc-100 flex items-center justify-end gap-4">
                            {message && (
                                <span className={`text-sm font-bold animate-fade-in ${message.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {message}
                                </span>
                            )}
                            <button 
                                type="submit" 
                                disabled={saving}
                                className="bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-lg hover:shadow-xl transform active:scale-95 disabled:opacity-70 disabled:transform-none flex items-center gap-2"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
