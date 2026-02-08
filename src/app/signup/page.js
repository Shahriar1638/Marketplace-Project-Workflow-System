"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'User', // Default role
  });

  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Signup successful! Redirecting to login...');
        setTimeout(() => {
            window.location.href = "/login";
        }, 1500);
      } else {
        setMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md border border-black p-8">
        {message && (
          <div className="mb-4 p-2 bg-gray-100 border border-black text-center text-sm font-bold">
            {message}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Full Name</label>
            <input
              type="text"
              className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>


          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isSolver"
              className="w-4 h-4 text-black border-black rounded focus:ring-black"
              checked={formData.role === 'Problem Solver'}
              onChange={(e) => setFormData({...formData, role: e.target.checked ? 'Problem Solver' : 'User'})}
            />
            <label htmlFor="isSolver" className="text-sm font-bold">Do you want to become a problem solver?</label>
          </div>

          {formData.role === 'Problem Solver' && (
            <div className="space-y-4 border-l-2 border-black pl-4 mt-2">
              <div>
                <label className="block text-sm font-bold mb-2">Bio</label>
                <textarea
                  className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  rows="3"
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Skills (comma separated)</label>
                <input
                  type="text"
                  className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData.skills || ''}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  placeholder="e.g. React, Node.js, Python"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phone No</label>
                <input
                  type="tel"
                  className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">GitHub Link</label>
                <input
                  type="url"
                  className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                  value={formData.github || ''}
                  onChange={(e) => setFormData({...formData, github: e.target.value})}
                  placeholder="https://github.com/username"
                  required
                />
              </div>
            </div>
          )}

          
          <button 
            type="submit"
            className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition"
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>Already have an account? <Link href="/login" className="underline font-bold">Log in</Link></p>
        </div>
        <div className="mt-4 text-center">
            <Link href="/" className="text-sm underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
