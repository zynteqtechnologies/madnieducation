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
    <div className="lg:h-full lg:overflow-hidden flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Moderation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3 rounded-md border border-slate-200 shadow-sm shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Alumni Interactions</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Review alumni contributions and mentorship offers</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-md">
           <button 
             onClick={() => setActiveTab('job')}
             className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'job' ? 'bg-[#18181b] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <Briefcase size={14} className="mr-2 inline" /> Opportunities
           </button>
           <button 
             onClick={() => setActiveTab('mentorship')}
             className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${activeTab === 'mentorship' ? 'bg-[#18181b] text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
              <UserCheck size={14} className="mr-2 inline" /> Mentorships
           </button>
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
           <p className="text-slate-400 text-sm font-medium mt-1">No pending {activeTab} offers to review.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
          <div className="grid grid-cols-1 gap-3 pb-4">
            {currentList.map((item) => (
              <div key={item.id} className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden group">
                 <div className="flex flex-col lg:flex-row">
                    {/* Left Identity Column */}
                    <div className="lg:w-72 p-6 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100">
                       <div className="flex items-center space-x-3 mb-6">
                          <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center font-bold text-[#dac48b] shadow-sm">
                             {item.alumniName[0]}
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

                    {/* Right Content Column */}
                    <div className="flex-1 p-6">
                       <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                          <div>
                             <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${activeTab === 'job' ? 'bg-amber-50 text-[#a98f4a] border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                   {activeTab === 'job' ? (item.type || 'Opportunity') : 'Mentorship Offer'}
                                </span>
                             </div>
                             <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                {activeTab === 'job' ? `${item.role} @ ${item.companyName}` : item.title}
                             </h3>
                          </div>
                          
                          {item.status === 'PENDING' ? (
                            <div className="flex items-center space-x-2">
                               <button 
                                 onClick={() => handleUpdateStatus(item.id, activeTab, 'REJECTED')}
                                 className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition-all"
                                 title="Reject"
                               >
                                  <XCircle size={16} />
                               </button>
                               <button 
                                 onClick={() => handleUpdateStatus(item.id, activeTab, 'APPROVED')}
                                 className="flex items-center px-4 py-2 bg-[#18181b] text-white rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm hover:bg-black transition-all"
                               >
                                  <CheckCircle2 size={14} className="mr-2" /> Approve Post
                               </button>
                            </div>
                          ) : (
                            <div className={`flex items-center px-3 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border ${item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                               {item.status === 'APPROVED' ? <CheckCircle2 size={12} className="mr-1.5"/> : <XCircle size={12} className="mr-1.5"/>}
                               {item.status}
                            </div>
                          )}
                       </div>

                       <div className="space-y-4">
                          <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-md border border-slate-100">
                             {item.description}
                          </p>
                          
                          {activeTab === 'job' && item.relation && (
                             <div className="flex items-start space-x-3">
                                <Info size={14} className="text-[#dac48b] mt-0.5 shrink-0" />
                                <div className="space-y-0.5">
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Alumni Relation / Referral</p>
                                   <p className="text-xs font-semibold text-slate-700">{item.relation}</p>
                                </div>
                             </div>
                          )}

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
