"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from 'next/link';

export default function MarketPlace() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [techFilter, setTechFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest', 'oldest'

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/solver/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = projects
    .filter(project => {
        if (!techFilter) return true;
        // Simple case-insensitive search in tech stack array or title/desc
        const search = techFilter.toLowerCase();
        const inStack = project.techStack?.some(tech => tech.toLowerCase().includes(search));
        const inTitle = project.title.toLowerCase().includes(search);
        return inStack || inTitle;
    })
    .sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  if (loading) return <div className="p-8 text-center">Loading opportunities...</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-black text-white p-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-300">
          Find your next challenge. Browse available projects and apply.
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        
        {/* Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gray-50 p-4 border border-gray-200">
            <div className="w-full md:w-1/2">
                <label className="block text-sm font-bold mb-1">Filter by Tech Stack / Keyword</label>
                <input 
                    type="text" 
                    placeholder="e.g. React, Python, API..."
                    className="w-full border border-black p-2 focus:outline-none focus:ring-1 focus:ring-black"
                    value={techFilter}
                    onChange={(e) => setTechFilter(e.target.value)}
                />
            </div>
            
            <div className="w-full md:w-auto">
                <label className="block text-sm font-bold mb-1">Sort By</label>
                <select 
                    className="border border-black p-2 w-full focus:outline-none focus:ring-1 focus:ring-black"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
                <div key={project._id} className="border border-black p-6 bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 flex flex-col h-full">
                    <div className="mb-4">
                        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600 mb-2 inline-block">
                             Posted {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <h3 className="text-xl font-bold line-clamp-2" title={project.title}>{project.title}</h3>
                        <p className="text-gray-600 mt-2 line-clamp-3 text-sm">{project.description}</p>
                    </div>

                    {/* Tech Stack Tags */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.techStack.slice(0, 3).map((tech, i) => (
                                <span key={i} className="text-xs border border-gray-300 px-2 py-0.5 rounded-full text-gray-600">
                                    {tech}
                                </span>
                            ))}
                            {project.techStack.length > 3 && (
                                <span className="text-xs text-gray-500 self-center">+{project.techStack.length - 3} more</span>
                            )}
                        </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                        <span className="font-bold text-lg">${project.budget}</span>
                        {/* Link to project details for applying */}
                        <Link href={`/solver/projects/${project._id}`} className="bg-black text-white px-4 py-2 text-sm font-bold hover:bg-gray-800 transition">
                            View Details
                        </Link>
                    </div>
                </div>
            ))}

            {filteredProjects.length === 0 && (
                <div className="col-span-full text-center py-16 border border-dashed border-gray-300">
                    <p className="text-xl font-bold mb-2">No open projects found.</p>
                    <p className="text-gray-500">Try adjusting your filters or check back later.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
