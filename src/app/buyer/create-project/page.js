"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreateProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    budget: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage('Project created successfully!');
        setTimeout(() => router.push('/buyer/my-projects'), 1000);
      } else {
        setMessage('Failed to create project.');
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      
      {message && (
          <div className="p-4 mb-4 bg-gray-100 border border-black text-center font-bold">
              {message}
          </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-bold mb-2">Project Title</label>
            <input 
                type="text" 
                required
                className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
        </div>

        <div>
            <label className="block text-sm font-bold mb-2">Description</label>
            <textarea 
                required
                rows="5"
                className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
        </div>

        <div>
            <label className="block text-sm font-bold mb-2">Tech Stack / Tools (comma separated)</label>
            <input 
                type="text" 
                className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="e.g. React, Node.js, MongoDB"
                value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
            />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-bold mb-2">Budget ($)</label>
                <input 
                    type="number" 
                    required
                    className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                />
            </div>
            {/* Optional deadline for the whole project, distinct from task deadlines */}
            <div>
                <label className="block text-sm font-bold mb-2">Expected Deadline</label>
                <input 
                    type="date" 
                    className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
            </div>
        </div>

        <div className="flex gap-4 pt-4">
            <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-black text-white py-3 font-bold hover:bg-gray-800 transition disabled:opacity-50"
            >
                {loading ? 'Posting...' : 'Post Project'}
            </button>
            <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-black font-bold hover:bg-gray-100 transition"
            >
                Cancel
            </button>
        </div>
      </form>
    </div>
  );
}
