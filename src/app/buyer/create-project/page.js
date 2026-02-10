"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ArrowLeft, Save } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <button 
          onClick={() => router.back()} 
          className="flex items-center text-gray-500 hover:text-black mb-4 transition-colors font-medium text-sm"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Post a New Project</h1>
        <p className="text-lg text-slate-600 mt-2">Describe your project requirements to attract the best solvers.</p>
      </div>
      
      {message && (
          <div className={`p-4 mb-6 rounded-lg text-center font-bold border ${message.includes('success') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {message}
          </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
            <input 
                type="text" 
                required
                placeholder="e.g. E-commerce Website Redesign"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
                required
                rows="5"
                placeholder="Provide detailed requirements, goals, and any specific preferences..."
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
        </div>

        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tech Stack / Tools <span className="text-gray-400 font-normal">(Comma separated)</span></label>
            <input 
                type="text" 
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
                placeholder="e.g. React, Node.js, MongoDB, AWS"
                value={formData.techStack}
                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Budget ($)</label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input 
                        type="number" 
                        required
                        min="1"
                        className="w-full pl-8 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-bold text-slate-900"
                        value={formData.budget}
                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Expected Deadline</label>
                <input 
                    type="date" 
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-900"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                />
            </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex gap-4">
            <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-lg font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-black text-white rounded-lg py-3 font-bold hover:bg-gray-800 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:transform-none shadow-lg flex items-center justify-center gap-2"
            >
                {loading ? 'Posting...' : (
                    <>
                        <Save size={18} />
                        Post Project
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
}
