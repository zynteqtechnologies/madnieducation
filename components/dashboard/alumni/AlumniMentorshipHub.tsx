'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Calendar,
  Info,
  Loader2,
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface MentorshipPost {
  id: string;
  title: string;
  description: string;
  targetStudent: string | null;
  availability: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export default function AlumniMentorshipHub() {
  const [posts, setPosts] = useState<MentorshipPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetStudent: '',
    availability: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/alumni/mentorship');
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (err) {
      console.error('Failed to fetch mentorship posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/alumni/mentorship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', targetStudent: '', availability: '' });
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
        return <span className="flex items-center text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 uppercase tracking-widest"><Clock size={12} className="mr-1" /> Pending review</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mentorship Dashboard</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Guide the next generation of students</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
          >
            <Plus size={18} className="mr-2" /> Offer Mentorship
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-lg font-black text-slate-900">Program Design</h3>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Define your mentorship goals and availability</p>
          </div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mentorship Title / Expertise Area</label>
              <input
                type="text"
                required
                placeholder="e.g. Career Guidance for Engineers"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                placeholder="What will you teach? What can students expect..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Mentees / Eligibility</label>
                <input
                  type="text"
                  placeholder="e.g. Standard 10 Students with math interest..."
                  value={formData.targetStudent}
                  onChange={e => setFormData({ ...formData, targetStudent: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visit / Session Availability</label>
                <input
                  type="text"
                  placeholder="e.g. Weekends, Monthly visits..."
                  value={formData.availability}
                  onChange={e => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                />
              </div>
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
                className="flex items-center px-10 py-3 bg-indigo-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <UserCheck size={16} className="mr-2" />}
                Submit Offer
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Accessing Mentorship Hub...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900">No active offers</h3>
            <p className="text-slate-400 text-sm font-medium mt-2">Become a beacon of light for students today.</p>
          </div>
        ) : posts.map(post => (
          <div key={post.id} className="bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-md flex items-center justify-center bg-indigo-50 text-indigo-600">
                    <UserCheck size={22} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{post.title}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mt-1">
                      Mentorship Program
                    </p>
                  </div>
                </div>
                {getStatusBadge(post.status)}
              </div>

              <div className="space-y-4">
                <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">{post.description}</p>

                <div className="grid grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-md border border-slate-100">
                  <div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Group</div>
                    <p className="text-[10px] font-bold text-slate-700">{post.targetStudent || 'General'}</p>
                  </div>
                  <div>
                    <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Availability</div>
                    <p className="text-[10px] font-bold text-slate-700">{post.availability || 'TBD'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <Calendar size={12} className="mr-1.5" />
                    Offered on {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <button className="flex items-center text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                    Manage <ChevronRight size={14} className="ml-1" />
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
