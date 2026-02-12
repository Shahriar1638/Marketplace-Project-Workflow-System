"use client";
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ApplyPage() { 
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [estimatedModules, setEstimatedModules] = useState(1);
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [sharePhone, setSharePhone] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const requestData = {
            projectId: id,
            estimatedModules,
            description,
            deadline,
            phoneNumber: sharePhone ? phoneNumber : null
        };

        try {
            const res = await fetch('/api/solver/projects/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            if (res.ok) {
                setMessage('Application submitted successfully!');
                setTimeout(() => router.push('/solver'), 1500);
            } else {
                const data = await res.json();
                setMessage(data.message || 'Failed to submit application.');
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
            <h1 className="text-3xl font-bold mb-6">Submit Proposal</h1>
            
            {message && (
                <div className={`p-4 mb-4 border text-center font-bold ${message.includes('success') ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 border border-black p-8 bg-white">
                <div>
                    <label className="block text-sm font-bold mb-2">Estimated Modules</label>
                    <p className="text-xs text-gray-500 mb-2">How many milestones or modules do you expect to break this project into?</p>
                    <input 
                        type="number" 
                        min="1"
                        required
                        className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                        value={estimatedModules}
                        onChange={(e) => setEstimatedModules(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Proposal Description</label>
                    <p className="text-xs text-gray-500 mb-2">Explain how you plan to solve this problem.</p>
                    <textarea 
                        required
                        rows="5"
                        className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold mb-2">Expected Completion Date</label>
                    <input 
                        type="date" 
                        required
                        className="w-full border border-black p-3 focus:outline-none focus:ring-1 focus:ring-black"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                    />
                </div>

                <div className="bg-gray-50 p-4 border border-gray-200">
                    <label className="flex items-center space-x-2 cursor-pointer mb-2">
                        <input 
                            type="checkbox" 
                            checked={sharePhone}
                            onChange={(e) => setSharePhone(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-black"
                        />
                        <span className="font-bold text-sm">Share my phone number with the Buyer</span>
                    </label>
                    
                    {sharePhone && (
                        <input 
                            type="tel" 
                            placeholder="+1 (555) 000-0000"
                            className="w-full border border-black p-3 mt-2 focus:outline-none focus:ring-1 focus:ring-black"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 bg-black text-white py-3 font-bold hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Application'}
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
