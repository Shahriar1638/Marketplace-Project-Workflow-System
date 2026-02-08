/* eslint-disable react/no-unescaped-entities */
"use client";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Call NextAuth signIn
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError('Invalid email or password');
    } else {
      // Successful login
      router.push('/home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md border border-black p-8">
        {error && (
          <div className="mb-4 p-2 bg-red-100 border border-red-500 text-red-700 text-center text-sm font-bold">
            {error}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
          
          <button 
            type="submit"
            className="w-full bg-black text-white py-3 font-bold hover:bg-gray-800 transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p>Don't have an account? <Link href="/signup" className="underline font-bold">Sign up</Link></p>
        </div>
        <div className="mt-4 text-center">
            <Link href="/" className="text-sm underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
