'use client';

import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Plus, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  Link as LinkIcon,
  Info,
  Loader2,
  ChevronRight,
  Tags
} from 'lucide-react';

const PROFESSIONAL_CATEGORIES = [
  "Engineering & Tech",
  "Business & Finance",
  "Healthcare & Medicine",
  "Arts & Design",
  "Law & Public Policy",
  "Education & Academics",
  "Sales & Marketing",
  "General / Other"
];

interface CareerPost {
  id: string;
  type: 'JOB' | 'INTERNSHIP';
  companyName: string;
  companyLink: string | null;
  role: string;
  category: string | null;
  relation: string | null;
  description: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function AlumniCareerHub() {
  const [posts, setPosts] = useState<CareerPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'JOB',
    companyName: '',
    companyLink: '',
    role: '',
    category: 'Engineering & Tech',
    relation: '',
    description: ''
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/alumni/career');
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (err) {
      console.error('Failed to fetch career posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/alumni/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ type: 'JOB', companyName: '', companyLink: '', role: '', category: 'Engineering & Tech', relation: '', description: '' });
        fetchPosts();
      }
    } catch (err) {
      console.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100/60 uppercase tracking-wider shadow-sm"><CheckCircle2 size={12} className="mr-1.5" /> Approved</span>;
      case 'REJECTED':
        return <span className="flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100/60 uppercase tracking-wider shadow-sm"><XCircle size={12} className="mr-1.5" /> Rejected</span>;
      default:
        return <span className="flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100/60 uppercase tracking-wider shadow-sm"><Clock size={12} className="mr-1.5" /> Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100/50">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
             <Briefcase className="mr-3 text-blue-600" size={28} />
             Professional Opportunities
          </h2>
          <p className="text-xs text-slate-500 font-medium ml-1">Empower your fellow alumni and students</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={16} className="mr-2" /> Share Opportunity
          </button>
        )}
      </div>

      {/* Filter Chips */}
      {!showForm && (
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${selectedCategory === 'All' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent' : 'bg-white/60 text-slate-600 border-white hover:bg-white'}`}
          >
            All Opportunities
          </button>
          {PROFESSIONAL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm border ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent' : 'bg-white/60 text-slate-600 border-white hover:bg-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-xl shadow-slate-900/5 overflow-hidden animate-in zoom-in-95 duration-300 relative">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 blur-[60px] rounded-full pointer-events-none"></div>
          
          <div className="p-8 md:p-10 border-b border-white/40 bg-white/30">
             <h3 className="text-xl font-bold text-slate-900">New Posting</h3>
             <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Fill in the company and role details</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Opportunity Type</label>
                   <select 
                     value={formData.type}
                     onChange={e => setFormData({...formData, type: e.target.value})}
                     className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 transition-all appearance-none cursor-pointer"
                   >
                      <option value="JOB">Full-Time Job</option>
                      <option value="INTERNSHIP">Internship</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Designation / Role</label>
                   <input 
                     type="text" 
                     required
                     placeholder="e.g. Senior Developer"
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Company Name</label>
                   <input 
                     type="text" 
                     required
                     placeholder="Company name..."
                     value={formData.companyName}
                     onChange={e => setFormData({...formData, companyName: e.target.value})}
                     className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Company Website Link</label>
                   <input 
                     type="url" 
                     placeholder="https://..."
                     value={formData.companyLink}
                     onChange={e => setFormData({...formData, companyLink: e.target.value})}
                     className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Profession Category</label>
                   <select 
                     value={formData.category}
                     onChange={e => setFormData({...formData, category: e.target.value})}
                     className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 transition-all appearance-none cursor-pointer"
                   >
                      {PROFESSIONAL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                   </select>
                </div>
             </div>
             
             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Your Relation / Referral Link</label>
                <input 
                  type="text" 
                  placeholder="How can you help? (e.g. Can refer directly, HR contact...)"
                  value={formData.relation}
                  onChange={e => setFormData({...formData, relation: e.target.value})}
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all"
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Role Description / Requirements</label>
                <textarea 
                  rows={4}
                  placeholder="Key responsibilities and requirements..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white text-sm font-bold text-slate-800 placeholder:text-slate-400 transition-all resize-none"
                />
             </div>

             <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-slate-100/50">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3.5 bg-white/60 text-slate-600 border border-slate-200/60 rounded-2xl font-bold text-xs hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center justify-center px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Briefcase size={16} className="mr-2" />}
                  Submit Posting
                </button>
             </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="lg:col-span-2 py-32 flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm">
             <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Accessing Career Hub...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="lg:col-span-2 py-32 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm">
             <div className="w-24 h-24 bg-white border border-slate-100 text-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Briefcase size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900">No active postings</h3>
             <p className="text-slate-500 text-sm font-medium mt-2">Share your first job or internship opportunity today!</p>
          </div>
        ) : posts.filter(post => selectedCategory === 'All' || post.category === selectedCategory).length === 0 ? (
          <div className="lg:col-span-2 py-32 text-center bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-sm">
             <div className="w-24 h-24 bg-white border border-slate-100 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Tags size={40} />
             </div>
             <h3 className="text-xl font-bold text-slate-900">No postings in this category</h3>
             <p className="text-slate-500 text-sm font-medium mt-2">Try selecting a different filter.</p>
          </div>
        ) : posts.filter(post => selectedCategory === 'All' || post.category === selectedCategory).map(post => (
          <div key={post.id} className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xl shadow-slate-900/5 hover:scale-[1.02] transition-all duration-300 overflow-hidden group relative">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none transition-all group-hover:bg-blue-500/10"></div>
             
             <div className="p-8 relative z-10">
                <div className="flex items-start justify-between mb-8">
                   <div className="flex items-center space-x-5">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${post.type === 'JOB' ? 'bg-blue-50 text-blue-600 border border-blue-100/50' : 'bg-indigo-50 text-indigo-600 border border-indigo-100/50'}`}>
                         {post.type === 'JOB' ? <Briefcase size={24} /> : <Building2 size={24} />}
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{post.role}</h4>
                         <p className="text-sm font-semibold text-slate-500 flex items-center mt-1">
                            {post.companyName}
                            {post.companyLink && (
                               <a href={post.companyLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-400 hover:text-blue-500 transition-colors">
                                  <ExternalLink size={14} />
                               </a>
                            )}
                         </p>
                         {post.category && (
                            <span className="inline-block mt-2 px-2.5 py-1 bg-white/80 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider shadow-sm">
                               {post.category}
                            </span>
                          )}
                      </div>
                   </div>
                   {getStatusBadge(post.status)}
                </div>

                <div className="space-y-5">
                   {post.relation && (
                     <div className="flex items-start space-x-3 bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm">
                        <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed italic">"{post.relation}"</p>
                     </div>
                   )}

                   {post.description && (
                      <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3 pl-1">{post.description}</p>
                   )}

                   <div className="pt-6 mt-4 border-t border-slate-100/50 flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                         <Clock size={14} className="mr-1.5" />
                         Posted {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                         <ChevronRight size={16} />
                      </button>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

    </div>
  );
}
