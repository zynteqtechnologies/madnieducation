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
  password?: string;
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
    <div className="space-y-6 animate-in fade-in duration-500">



      <div className="flex bg-slate-100/50 p-1 rounded-xl w-full md:w-auto">
        <button
          onClick={() => setActiveTab('eligibility')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'eligibility' ? 'bg-white text-[#1A3D63] shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Eligibility
        </button>
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'directory' ? 'bg-white text-[#1A3D63] shadow-sm border border-slate-200/50' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Directory
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="animate-spin text-emerald-600" size={32} strokeWidth={1.5} />
          <p className="text-[11px] font-bold text-slate-400">Analyzing cohort records...</p>
        </div>
      ) : activeTab === 'eligibility' ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-2">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[30%]">Student</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[20%] text-center">Gmail ID</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[25%]">Profile link</th>
                  <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-right w-[25%] pr-8">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {eligibleStudents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      <CheckCircle2 size={32} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-xs font-bold">No students identified for graduating transition.</p>
                    </td>
                  </tr>
                ) : eligibleStudents.map((std, idx) => (
                  <tr key={std.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm border border-emerald-100">
                          {std.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-slate-700 leading-snug">{std.name}</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-400">{std.studentCode}</span>
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">Batch {std.batchYear || 'TBD'}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm">
                      <input
                        type="email"
                        placeholder="Gmail username"
                        value={std.gmailId}
                        onChange={(e) => {
                          const newList = [...eligibleStudents];
                          newList[idx].gmailId = e.target.value;
                          setEligibleStudents(newList);
                        }}
                        className="w-full px-3 py-2 bg-slate-100/50 border border-slate-200/60 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-[12px] font-bold transition-all outline-none"
                      />
                    </td>
                    <td className="px-6 py-6">
                      <div className="relative">
                        <Link2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                          type="url"
                          placeholder="LinkedIn profile profile url"
                          value={std.linkedIn}
                          onChange={(e) => {
                            const newList = [...eligibleStudents];
                            newList[idx].linkedIn = e.target.value;
                            setEligibleStudents(newList);
                          }}
                          className="w-full pl-9 pr-3 py-2 bg-slate-100/50 border border-slate-200/60 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:bg-white text-[12px] font-bold transition-all outline-none"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right pr-8 relative">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleConvert(std)}
                          disabled={processingId === std.id}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1A3D63] hover:bg-[#0A1931] text-white rounded-xl text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                        >
                          {processingId === std.id ? <Loader2 size={14} className="animate-spin" /> : <GraduationCap size={14} />}
                          <span>Authorize</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          {/* Directory Search */}
          <div className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 max-w-xl">
            <Search className="text-slate-300" size={18} />
            <input
              type="text"
              placeholder="Search by name, year, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold text-slate-700 placeholder:text-slate-300"
            />
          </div>

          {/* Directory Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[35%]">Alumni identity</th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-center w-[15%] text-center">Batch</th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[25%]">Secured access</th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-right w-[25%] pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAlumni.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic">
                        No alumni records found for this cohort.
                      </td>
                    </tr>
                  ) : filteredAlumni.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3.5">
                          <div className="w-10 h-10 rounded-xl bg-slate-100/50 border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all overflow-hidden relative shadow-sm">
                            <GraduationCap size={18} strokeWidth={1.5} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-slate-700 leading-tight group-hover:text-emerald-600 transition-colors">{a.name}</p>
                            <p className="text-[10px] text-slate-400 mt-1 font-medium italic">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="text-[13px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/50">
                          {a.batchYear}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Key size={12} className="opacity-40" />
                          <span className="text-[11px] font-bold tracking-widest bg-slate-50 px-2 py-1 rounded-md border border-slate-200/50">••••••••</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right pr-8">
                        <div className="flex items-center justify-end space-x-2">
                          {a.linkedIn ? (
                            <a
                              href={a.linkedIn}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-[#0077b5] transition-all shadow-sm"
                            >
                              <ExternalLink size={12} />
                              <span>Profile</span>
                            </a>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-300 italic">No social link</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-6 animate-in zoom-in duration-300 text-center">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-sm">
              <ShieldCheck size={32} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Account authorized</h3>
            <p className="text-slate-500 text-[12px] font-medium mb-8 leading-relaxed">
              Alumni access has been provisioned for <span className="text-[#1A3D63] font-bold">{successData.name}</span>.
            </p>

            <div className="space-y-3 mb-10 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 mb-1">Authorization email</p>
                <p className="text-[12px] font-bold text-slate-700 truncate">{successData.email}</p>
              </div>
              <div className="bg-[#1A3D63]/5 p-4 rounded-2xl border border-[#1A3D63]/10">
                <p className="text-[9px] font-bold text-[#1A3D63] mb-1">Primary access key</p>
                <p className="text-[13px] font-bold text-[#1A3D63] tracking-widest">{successData.password}</p>
              </div>
            </div>

            <button
              onClick={() => setSuccessData(null)}
              className="w-full bg-[#1A3D63] hover:bg-[#0A1931] text-white font-bold py-4 rounded-2xl text-[12px] transition-all active:scale-95"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
