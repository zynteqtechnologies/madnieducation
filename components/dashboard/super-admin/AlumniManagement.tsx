'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  Mail, 
  Link2, 
  Plus, 
  Search, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  Key,
  Calendar,
  ExternalLink,
  ChevronRight,
  School
} from 'lucide-react';

interface EligibleStudent {
  id: string;
  name: string;
  studentCode: string;
  standardName: string;
  batchYear: string | null;
  gmailId?: string;
  linkedIn?: string;
}

interface Alumni {
  id: string;
  name: string;
  email: string;
  password: string;
  linkedIn: string | null;
  batchYear: string;
  studentId: string | null;
  createdAt: string;
}

export default function AlumniManagement() {
  const [activeTab, setActiveTab] = useState<'eligibility' | 'directory'>('eligibility');
  const [eligibleStudents, setEligibleStudents] = useState<EligibleStudent[]>([]);
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'eligibility') fetchEligible();
    else fetchAlumni();
  }, [activeTab]);

  const fetchEligible = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/alumni?type=eligible');
      if (res.ok) {
        const data = await res.json();
        setEligibleStudents(data.map((s: any) => ({ ...s, gmailId: '', linkedIn: '' })));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/alumni?type=directory');
      if (res.ok) {
        const data = await res.json();
        setAlumniList(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (student: EligibleStudent) => {
    if (!student.gmailId) {
       alert('Gmail ID is required for alumni authorization.');
       return;
    }
    setProcessingId(student.id);
    try {
      const res = await fetch('/api/subadmin/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: student.id,
          gmailId: student.gmailId,
          linkedIn: student.linkedIn,
          batchYear: student.batchYear || '2024-25'
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessData(data);
        fetchEligible();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAlumni = alumniList.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.batchYear.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Alumni Subsystem</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Graduation & Career Pipeline</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-md border border-slate-200 shadow-inner">
           <button 
             onClick={() => setActiveTab('eligibility')}
             className={`px-6 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'eligibility' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Graduation Eligibility
           </button>
           <button 
             onClick={() => setActiveTab('directory')}
             className={`px-6 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'directory' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
           >
              Alumni Directory
           </button>
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-emerald-600" size={48} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Analyzing Cohort Records...</p>
        </div>
      ) : activeTab === 'eligibility' ? (
        <div className="space-y-8">
           {/* Eligibility List */}
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {eligibleStudents.length === 0 ? (
                <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-md text-center">
                   <CheckCircle2 size={48} className="mx-auto text-emerald-100 mb-4" />
                   <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest leading-relaxed">No Standard 10 students identified for graduating transition.<br/>Check Standard Management for batch year configuration.</p>
                </div>
              ) : eligibleStudents.map((std, idx) => (
                <div key={std.id} className="bg-white rounded-md border border-slate-100 shadow-sm p-8 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 group">
                   <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center space-x-4">
                         <div className="w-14 h-14 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 font-black text-xl group-hover:scale-110 transition-transform">
                            {std.name[0]}
                         </div>
                         <div>
                            <h4 className="text-lg font-black text-slate-900 tracking-tight">{std.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                               <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-tighter">{std.studentCode}</span>
                               <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-tighter">Graduating Batch: {std.batchYear || 'TBD'}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center"><Mail size={10} className="mr-1.5" /> Gmail Account (Username)</label>
                         <input 
                           type="email" 
                           placeholder="student@gmail.com"
                           value={std.gmailId}
                           onChange={(e) => {
                             const newList = [...eligibleStudents];
                             newList[idx].gmailId = e.target.value;
                             setEligibleStudents(newList);
                           }}
                           className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                         />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center"><Link2 size={10} className="mr-1.5" /> LinkedIn Profile Link</label>
                         <input 
                           type="url" 
                           placeholder="linkedin.com/in/..."
                           value={std.linkedIn}
                           onChange={(e) => {
                             const newList = [...eligibleStudents];
                             newList[idx].linkedIn = e.target.value;
                             setEligibleStudents(newList);
                           }}
                           className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                         />
                      </div>
                   </div>

                   <button 
                     onClick={() => handleConvert(std)}
                     disabled={processingId === std.id}
                     className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-4 rounded-md text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-2 group/btn active:scale-95 disabled:opacity-50"
                   >
                      {processingId === std.id ? <Loader2 className="animate-spin text-white/30" size={16} /> : <GraduationCap size={16} className="group-hover/btn:scale-125 transition-transform" />}
                      <span>Authorize Institutional Alumni Status</span>
                   </button>
                </div>
              ))}
           </div>
        </div>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
           {/* Directory Search */}
           <div className="bg-white p-4 rounded-md border border-slate-100 shadow-sm flex items-center space-x-4 max-w-xl">
              <Search className="text-slate-400 ml-4" size={20} />
              <input 
                type="text" 
                placeholder="Search institutional alumni by name, batch, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300"
              />
           </div>

           {/* Directory Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredAlumni.length === 0 ? (
                <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-md text-center text-slate-300 font-black uppercase text-xs tracking-widest">
                   No alumni records found for this institution.
                </div>
              ) : filteredAlumni.map((a) => (
                <div key={a.id} className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden group">
                   <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                      <div className="w-12 h-12 rounded-md bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform">
                         <GraduationCap size={24} />
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Batch Year</p>
                         <p className="text-xs font-black text-slate-900">{a.batchYear}</p>
                      </div>
                   </div>
                   <div className="p-8 space-y-6">
                      <div>
                         <h4 className="text-lg font-black text-slate-900 tracking-tight">{a.name}</h4>
                         <div className="flex items-center space-x-2 mt-2">
                             <Mail size={12} className="text-slate-300" />
                             <span className="text-[11px] font-bold text-slate-500">{a.email}</span>
                         </div>
                      </div>

                      <div className="flex items-center justify-between bg-emerald-50/50 px-5 py-4 rounded-md border border-emerald-100/50">
                         <div className="flex items-center space-x-3">
                            <Key size={14} className="text-emerald-600" />
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Access Key</span>
                         </div>
                         <span className="text-xs font-black text-slate-900 tracking-wider mono">{a.password}</span>
                      </div>

                      {a.linkedIn ? (
                        <a 
                          href={a.linkedIn} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-full flex items-center justify-center space-x-2 py-3.5 bg-slate-800 text-white rounded-md text-[10px] font-black uppercase tracking-widest hover:bg-[#0077b5] transition-all"
                        >
                           <Link2 size={14} />
                           <span>View Profile</span>
                           <ExternalLink size={12} className="opacity-40" />
                        </a>
                      ) : (
                        <div className="w-full py-3.5 border border-dashed border-slate-200 text-slate-300 rounded-md text-[9px] font-black uppercase tracking-widest text-center">
                           No LinkedIn Profile
                        </div>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6 animate-in zoom-in duration-300">
           <div className="bg-white w-full max-w-md rounded-md shadow-2xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[60px] rounded-full"></div>
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-md flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                 <ShieldCheck size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Auth Record Synchronized</h3>
              <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">
                 Institutional alumni status has been authorized for <b>{successData.name}</b>. Share these credentials via official channels.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="bg-slate-50 p-6 rounded-md border border-slate-100 text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center"><Mail size={12} className="mr-2" /> Email</p>
                    <p className="text-xs font-black text-slate-900 truncate">{successData.email}</p>
                 </div>
                 <div className="bg-emerald-50 p-6 rounded-md border border-emerald-100 text-left">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center"><Key size={12} className="mr-2" /> Password</p>
                    <p className="text-sm font-black text-slate-900 tracking-widest">{successData.password}</p>
                 </div>
              </div>

              <button 
                onClick={() => setSuccessData(null)}
                className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-md text-xs uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95"
              >
                 ACKNOWLEDGE & CLOSE
              </button>
           </div>
        </div>
      )}

    </div>
  );
}
