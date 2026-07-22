'use client';

import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  Star,
  Trophy,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';

type ModerationTab = 'job' | 'mentorship' | 'blog' | 'achievement';
type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Interaction {
  id: string;
  type?: 'JOB' | 'INTERNSHIP';
  title?: string;
  companyName?: string;
  role?: string;
  description?: string;
  content?: string;
  category?: string | null;
  targetStudent?: string | null;
  availability?: string | null;
  status: ModerationStatus;
  isFeatured?: boolean;
  alumniName: string;
  alumniEmail: string;
  createdAt: string;
}

interface ModerationData {
  jobs: Interaction[];
  mentorships: Interaction[];
  blogs: Interaction[];
  achievements: Interaction[];
}

const tabs: Array<{ id: ModerationTab; label: string; icon: React.ReactNode }> = [
  { id: 'job', label: 'Opportunities', icon: <Briefcase size={14} className="mr-2 inline" /> },
  { id: 'mentorship', label: 'Mentorships', icon: <UserCheck size={14} className="mr-2 inline" /> },
  { id: 'blog', label: 'Stories', icon: <BookOpen size={14} className="mr-2 inline" /> },
  { id: 'achievement', label: 'Achievements', icon: <Trophy size={14} className="mr-2 inline" /> },
];

export default function AlumniInteractionManager() {
  const [data, setData] = useState<ModerationData>({ jobs: [], mentorships: [], blogs: [], achievements: [] });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<ModerationTab>('job');

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const res = await fetch('/api/subadmin/alumni-interactions');
      const json = await res.json();
      if (res.ok) setData({
        jobs: Array.isArray(json.jobs) ? json.jobs : [],
        mentorships: Array.isArray(json.mentorships) ? json.mentorships : [],
        blogs: Array.isArray(json.blogs) ? json.blogs : [],
        achievements: Array.isArray(json.achievements) ? json.achievements : [],
      });
      else setError(json.error || 'Unable to load moderation queue');
    } catch {
      setError('Communication failed');
    } finally {
      setLoading(false);
    }
  };

  const patchInteraction = async (
    id: string,
    type: ModerationTab,
    payload: { status?: ModerationStatus; isFeatured?: boolean },
  ) => {
    setUpdatingId(id);

    try {
      const res = await fetch('/api/subadmin/alumni-interactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, ...payload }),
      });

      if (res.ok) fetchInteractions();
      else {
        const json = await res.json();
        setError(json.error || 'Update failed');
      }
    } catch {
      setError('Update failed');
    } finally {
      setUpdatingId('');
    }
  };

  const currentList = activeTab === 'job'
    ? data.jobs
    : activeTab === 'mentorship'
      ? data.mentorships
      : activeTab === 'blog'
        ? data.blogs
        : data.achievements;

  const getTitle = (item: Interaction) => {
    if (activeTab === 'job') return `${item.role || 'Opportunity'} @ ${item.companyName || 'Organization'}`;
    return item.title || 'Untitled submission';
  };

  const getDescription = (item: Interaction) => {
    if (activeTab === 'blog') return item.content || '';
    return item.description || '';
  };

  const getTypeLabel = (item: Interaction) => {
    if (activeTab === 'job') return item.type || 'Opportunity';
    if (activeTab === 'mentorship') return 'Mentorship Offer';
    if (activeTab === 'blog') return 'Alumni Story';
    return item.category || 'Achievement';
  };

  const isFeatureCapable = activeTab === 'blog' || activeTab === 'achievement';

  return (
    <div className="lg:h-full lg:overflow-hidden flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-white px-5 py-3 rounded-md border border-slate-200 shadow-sm shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Alumni Interactions</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Review alumni posts, stories, achievements, and offers</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-md overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#18181b] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm">
          <Loader2 className="animate-spin text-[#dac48b] mb-4" size={32} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Checking Moderation Queue...</p>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-rose-500 bg-white rounded-md border border-slate-100 shadow-sm">
          <AlertCircle size={32} className="mb-4 text-rose-300" />
          <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
        </div>
      ) : currentList.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm py-20">
          <CheckCircle2 size={40} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">Queue is empty</h3>
          <p className="text-slate-400 text-sm font-medium mt-1">No {activeTab} submissions to review.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-3 pb-4">
            {currentList.map((item) => (
              <div key={item.id} className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden group">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-72 p-6 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[#dac48b] shadow-sm">
                        {item.alumniName?.[0] || 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-tight">{item.alumniName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wide">Verified Alumni</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-xs font-medium text-slate-600 break-all">
                        <Mail size={13} className="mr-3 text-slate-400 shrink-0" />
                        {item.alumniEmail}
                      </div>
                      <div className="flex items-center text-xs font-medium text-slate-600">
                        <Calendar size={13} className="mr-3 text-slate-400 shrink-0" />
                        Submitted {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${activeTab === 'achievement' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-[#a98f4a] border-amber-100'}`}>
                            {getTypeLabel(item)}
                          </span>
                          {item.isFeatured && (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider bg-[#18181b] text-white border-[#18181b]">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{getTitle(item)}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'PENDING' ? (
                          <>
                            <button
                              onClick={() => patchInteraction(item.id, activeTab, { status: 'REJECTED' })}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition-all"
                              title="Reject"
                              disabled={updatingId === item.id}
                            >
                              <XCircle size={16} />
                            </button>
                            <button
                              onClick={() => patchInteraction(item.id, activeTab, { status: 'APPROVED' })}
                              className="flex items-center px-4 py-2 bg-[#18181b] text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm hover:bg-black transition-all disabled:opacity-50"
                              disabled={updatingId === item.id}
                            >
                              <CheckCircle2 size={14} className="mr-2" /> Approve Post
                            </button>
                          </>
                        ) : (
                          <div className={`flex items-center px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {item.status === 'APPROVED' ? <CheckCircle2 size={12} className="mr-1.5" /> : <XCircle size={12} className="mr-1.5" />}
                            {item.status}
                          </div>
                        )}

                        {isFeatureCapable && item.status === 'APPROVED' && (
                          <button
                            onClick={() => patchInteraction(item.id, activeTab, { isFeatured: !item.isFeatured })}
                            className={`flex items-center px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all ${item.isFeatured ? 'bg-[#18181b] text-white border-[#18181b]' : 'bg-white text-slate-500 border-slate-200 hover:text-[#a98f4a] hover:border-[#dac48b]'}`}
                            title={item.isFeatured ? 'Remove featured status' : 'Feature this submission'}
                            disabled={updatingId === item.id}
                          >
                            <Star size={13} className="mr-1.5" fill={item.isFeatured ? 'currentColor' : 'none'} />
                            {item.isFeatured ? 'Featured' : 'Feature'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-100">
                        {getDescription(item)}
                      </p>

                      {activeTab === 'mentorship' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start space-x-3">
                            <Users size={14} className="text-[#dac48b] mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Students</p>
                              <p className="text-xs font-semibold text-slate-700">{item.targetStudent || 'Not specified'}</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Clock size={14} className="text-[#dac48b] mt-0.5 shrink-0" />
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Availability</p>
                              <p className="text-xs font-semibold text-slate-700">{item.availability || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
