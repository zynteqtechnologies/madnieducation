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
  ChevronRight
} from 'lucide-react';

interface CareerPost {
  id: string;
  type: 'JOB' | 'INTERNSHIP';
  companyName: string;
  companyLink: string | null;
  role: string;
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
    relation: '',
    description: ''
  });
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
        setFormData({ type: 'JOB', companyName: '', companyLink: '', role: '', relation: '', description: '' });
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
        return <span className="flex items-center text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-widest"><CheckCircle2 size={12} className="mr-1" /> Approved</span>;
      case 'REJECTED':
        return <span className="flex items-center text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100 uppercase tracking-widest"><XCircle size={12} className="mr-1" /> Rejected</span>;
      default:
        return <span className="flex items-center text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 uppercase tracking-widest"><Clock size={12} className="mr-1" /> Pending</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professional Opportunities</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Empower your fellow alumni and students</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
          >
            <Plus size={18} className="mr-2" /> Share Opportunity
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
             <h3 className="text-lg font-black text-slate-900">New Posting</h3>
             <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Fill in the company and role details</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Opportunity Type</label>
                   <select 
                     value={formData.type}
                     onChange={e => setFormData({...formData, type: e.target.value})}
                     className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white text-sm font-bold transition-all appearance-none cursor-pointer"
                   >
                      <option value="JOB">Full-Time Job</option>
                      <option value="INTERNSHIP">Internship</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Designation / Role</label>
                   <input 
                     type="text" 
                     required
                     placeholder="e.g. Senior Developer"
                     value={formData.role}
                     onChange={e => setFormData({...formData, role: e.target.value})}
                     className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white text-sm font-bold transition-all"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                   <input 
                     type="text" 
                     required
                     placeholder="Company name..."
                     value={formData.companyName}
                     onChange={e => setFormData({...formData, companyName: e.target.value})}
                     className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white text-sm font-bold transition-all"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Website Link</label>
                   <input 
                     type="url" 
                     placeholder="https://..."
                     value={formData.companyLink}
                     onChange={e => setFormData({...formData, companyLink: e.target.value})}
                     className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white text-sm font-bold transition-all"
                   />
                </div>
             </div>
             
             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Relation / Referral Link</label>
                <input 
                  type="text" 
                  placeholder="How can you help? (e.g. Can refer directly, HR contact...)"
                  value={formData.relation}
                  onChange={e => setFormData({...formData, relation: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white text-sm font-bold transition-all"
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role Description / Requirements</label>
                <textarea 
                  rows={4}
                  placeholder="Key responsibilities and requirements..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-orange-500/5 focus:bg-white text-sm font-bold transition-all resize-none"
                />
             </div>

             <div className="flex justify-end space-x-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-8 py-3 bg-slate-100 text-slate-500 rounded-md font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex items-center px-10 py-3 bg-orange-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Briefcase size={16} className="mr-2" />}
                  Submit Posting
                </button>
             </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm">
             <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
             <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Accessing Career Hub...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase size={40} />
             </div>
             <h3 className="text-xl font-black text-slate-900">No active postings</h3>
             <p className="text-slate-400 text-sm font-medium mt-2">Share your first job or internship opportunity today!</p>
          </div>
        ) : posts.map(post => (
          <div key={post.id} className="bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
             <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                   <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-md flex items-center justify-center ${post.type === 'JOB' ? 'bg-orange-50 text-orange-600' : 'bg-indigo-50 text-indigo-600'}`}>
                         {post.type === 'JOB' ? <Briefcase size={22} /> : <Building2 size={22} />}
                      </div>
                      <div>
                         <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">{post.role}</h4>
                         <p className="text-sm font-bold text-slate-500 flex items-center mt-1">
                            {post.companyName}
                            {post.companyLink && (
                               <a href={post.companyLink} target="_blank" rel="noopener noreferrer" className="ml-2 text-slate-300 hover:text-orange-400 transition-colors">
                                  <ExternalLink size={14} />
                               </a>
                            )}
                         </p>
                      </div>
                   </div>
                   {getStatusBadge(post.status)}
                </div>

                <div className="space-y-4">
                   <div className="flex items-start space-x-3 bg-slate-50/80 p-4 rounded-md border border-slate-100">
                      <Info size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-xs font-bold text-slate-600 leading-relaxed italic">"{post.relation || 'No referral details provided'}"</p>
                   </div>

                   {post.description && (
                      <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">{post.description}</p>
                   )}

                   <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                         <Clock size={12} className="mr-1.5" />
                         Posted {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                      <button className="flex items-center text-[11px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest">
                         Details <ChevronRight size={14} className="ml-1" />
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
