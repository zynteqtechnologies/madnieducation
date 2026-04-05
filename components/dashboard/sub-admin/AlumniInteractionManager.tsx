'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Briefcase, 
  UserCheck, 
  Building2, 
  GraduationCap,
  ExternalLink,
  ChevronRight,
  Loader2,
  AlertCircle,
  Mail,
  Calendar,
  Info,
  Users
} from 'lucide-react';

interface Interaction {
  id: string;
  type?: 'JOB' | 'INTERNSHIP'; // For jobs
  title?: string; // For mentorship
  companyName?: string;
  role?: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  alumniName: string;
  alumniEmail: string;
  createdAt: string;
  interactionType: 'job' | 'mentorship';
}

export default function AlumniInteractionManager() {
  const [data, setData] = useState<{ jobs: any[], mentorships: any[] }>({ jobs: [], mentorships: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'job' | 'mentorship'>('job');

  useEffect(() => {
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const res = await fetch('/api/subadmin/alumni-interactions');
      const json = await res.json();
      if (res.ok) setData(json);
      else setError(json.error);
    } catch (err) {
      setError('Communication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, type: 'job' | 'mentorship', status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await fetch('/api/subadmin/alumni-interactions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, type, status }),
      });
      if (res.ok) fetchInteractions();
    } catch (err) {
      console.error('Update failed');
    }
  };

  const currentList = activeTab === 'job' ? data.jobs : data.mentorships;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Moderation</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Review alumni contributions and mentorship offers</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-md w-full md:w-auto">
           <button 
             onClick={() => setActiveTab('job')}
             className={`flex-1 md:flex-none flex items-center justify-center px-4 md:px-6 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'job' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <Briefcase size={14} className="mr-2" /> <span className="hidden xs:inline">Opportunities</span><span className="xs:hidden">Jobs</span>
           </button>
           <button 
             onClick={() => setActiveTab('mentorship')}
             className={`flex-1 md:flex-none flex items-center justify-center px-4 md:px-6 py-2.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'mentorship' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <UserCheck size={14} className="mr-2" /> <span className="hidden xs:inline">Mentorships</span><span className="xs:hidden">Mentees</span>
           </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm">
           <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
           <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Checking Moderation Queue...</p>
        </div>
      ) : error ? (
        <div className="py-20 flex flex-col items-center justify-center text-rose-500 bg-white rounded-md border border-slate-100 shadow-sm">
           <AlertCircle size={40} className="mb-4" />
           <p className="text-sm font-black uppercase tracking-widest">{error}</p>
        </div>
      ) : currentList.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
           <CheckCircle2 size={40} className="mx-auto text-slate-200 mb-4" />
           <h3 className="text-xl font-black text-slate-900">Queue is empty</h3>
           <p className="text-slate-400 text-sm font-medium mt-2">No pending {activeTab} offers to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {currentList.map((item) => (
            <div key={item.id} className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden group">
               <div className="flex flex-col lg:flex-row">
                  {/* Left Identity Column */}
                  <div className="lg:w-80 p-6 md:p-8 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100">
                     <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-md bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 shadow-sm">
                           {item.alumniName[0]}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900 leading-tight">{item.alumniName}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">Verified Alumni</p>
                        </div>
                     </div>
                     
                     <div className="space-y-4">
                        <div className="flex items-center text-xs font-bold text-slate-600 break-all">
                           <Mail size={14} className="mr-3 text-slate-400 shrink-0" />
                           {item.alumniEmail}
                        </div>
                        <div className="flex items-center text-xs font-bold text-slate-600">
                           <Calendar size={14} className="mr-3 text-slate-400 shrink-0" />
                           Submitted {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                  </div>

                  {/* Right Content Column */}
                  <div className="flex-1 p-6 md:p-8">
                     <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div>
                           <div className="flex items-center space-x-2 mb-2">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-widest ${activeTab === 'job' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                 {activeTab === 'job' ? (item.type || 'Opportunity') : 'Mentorship Offer'}
                              </span>
                           </div>
                           <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                              {activeTab === 'job' ? `${item.role} @ ${item.companyName}` : item.title}
                           </h3>
                        </div>
                        
                        {item.status === 'PENDING' ? (
                          <div className="flex items-center space-x-2">
                             <button 
                               onClick={() => handleUpdateStatus(item.id, activeTab, 'REJECTED')}
                               className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition-all"
                               title="Reject"
                             >
                                <XCircle size={18} />
                             </button>
                             <button 
                               onClick={() => handleUpdateStatus(item.id, activeTab, 'APPROVED')}
                               className="flex items-center px-6 py-2.5 bg-emerald-600 text-white rounded-md text-[11px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
                             >
                                <CheckCircle2 size={16} className="mr-2" /> Approve Post
                             </button>
                          </div>
                        ) : (
                          <div className={`flex items-center px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest border ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                             {item.status === 'APPROVED' ? <CheckCircle2 size={12} className="mr-2"/> : <XCircle size={12} className="mr-2"/>}
                             {item.status}
                          </div>
                        )}
                     </div>

                     <div className="space-y-6">
                        <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-md border border-slate-100">
                           {item.description}
                        </p>
                        
                        {activeTab === 'job' && item.relation && (
                           <div className="flex items-start space-x-3">
                              <Info size={16} className="text-slate-300 mt-0.5 shrink-0" />
                              <div className="space-y-0.5">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumni Relation / Referral</p>
                                 <p className="text-xs font-bold text-slate-700">{item.relation}</p>
                              </div>
                           </div>
                        )}

                        {activeTab === 'mentorship' && (
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex items-start space-x-3">
                                 <Users size={16} className="text-slate-300 mt-0.5 shrink-0" />
                                 <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Students</p>
                                    <p className="text-xs font-bold text-slate-700">{item.targetStudent || 'Not specified'}</p>
                                 </div>
                              </div>
                              <div className="flex items-start space-x-3">
                                 <Clock size={16} className="text-slate-300 mt-0.5 shrink-0" />
                                 <div className="space-y-0.5">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                                    <p className="text-xs font-bold text-slate-700">{item.availability || 'Not specified'}</p>
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
      )}

    </div>
  );
}
