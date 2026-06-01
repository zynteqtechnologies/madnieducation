'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  GraduationCap,
  Building2,
  User,
  Globe,
  Mail,
  ExternalLink,
  Loader2,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import Image from 'next/image';

interface AlumniMember {
  id: string;
  name: string;
  email: string;
  batchYear: string | null;
  linkedIn: string | null;
  profilePic: string | null;
  currentTitle: string | null;
  currentBio: string | null;
  workLink: string | null;
  schoolName: string | null;
}

export default function AlumniDirectory() {
  const [alumniList, setAlumniList] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [selectedMember, setSelectedMember] = useState<AlumniMember | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const res = await fetch('/api/alumni/directory');
      if (res.ok) {
        const data = await res.json();
        setAlumniList(data);
      }
    } catch (err) {
      console.error('Failed to load alumni directory');
    } finally {
      setLoading(false);
    }
  };

  // Get unique batch years and schools for filter dropdowns
  const batchYears = ['All', ...Array.from(new Set(alumniList.map(a => a.batchYear).filter(Boolean)))].sort((a, b) => b!.localeCompare(a!));
  const schools = ['All', ...Array.from(new Set(alumniList.map(a => a.schoolName).filter(Boolean)))].sort((a, b) => a!.localeCompare(b!));

  // Filter alumni based on search query and batch year
  const filteredAlumni = alumniList.filter(alumni => {
    const matchesSearch =
      alumni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alumni.currentTitle && alumni.currentTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alumni.schoolName && alumni.schoolName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (alumni.currentBio && alumni.currentBio.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBatch = selectedBatch === 'All' || alumni.batchYear === selectedBatch;
    const matchesSchool = selectedSchool === 'All' || alumni.schoolName === selectedSchool;

    return matchesSearch && matchesBatch && matchesSchool;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginatedAlumni = filteredAlumni.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Opening Alumni Register...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header & Filter Card */}
      <div className="bg-white/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/60 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-blue-600" size={24} />
            <span>Alumni Directory</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Search and connect with fellow Madni graduates</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            <input
              type="text"
              placeholder="Search by name, title, school..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-10 pr-4 py-2.5 bg-white/50 border border-slate-200/80 hover:bg-white focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 text-xs font-semibold text-slate-800 w-60"
            />
          </div>

          {/* Batch Year Select */}
          <select
            value={selectedBatch}
            onChange={(e) => { setSelectedBatch(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-white/50 border border-slate-200/80 hover:bg-white focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="All">All Batches</option>
            {batchYears.filter(b => b !== 'All').map(year => (
              <option key={year} value={year!}>Class of {year}</option>
            ))}
          </select>

          {/* School Select */}
          <select
            value={selectedSchool}
            onChange={(e) => { setSelectedSchool(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-white/50 border border-slate-200/80 hover:bg-white focus:bg-white focus:border-blue-500 rounded-2xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/10 text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="All">All Schools</option>
            {schools.filter(s => s !== 'All').map(school => (
              <option key={school} value={school!}>{school}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAlumni.map((member) => (
            <div
              key={member.id}
              className="bg-white/60 backdrop-blur-xl p-7 rounded-[2.5rem] border border-white/80 shadow-xl shadow-blue-900/5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/5 blur-[50px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-blue-400/15"></div>
              
              <div className="space-y-5 relative z-10">
                {/* Profile Pic & Basic info row */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-full overflow-hidden relative shadow-md ring-4 ring-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-500">
                    {member.profilePic ? (
                      <Image src={member.profilePic} alt={member.name} fill className="object-cover" />
                    ) : (
                      <User size={26} className="text-slate-300" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors tracking-tight truncate">{member.name}</h3>
                    <p className="text-[10px] font-bold text-blue-700 bg-blue-50/80 border border-blue-100/80 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mt-1.5 shadow-sm">
                      <GraduationCap size={12} />
                      <span>Batch of {member.batchYear || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Academic School & Designation details */}
                <div className="bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100/60 space-y-2.5">
                  <div className="flex items-center text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    <Building2 size={13} className="mr-2 text-slate-400 shrink-0" />
                    <span className="truncate">{member.schoolName || 'Madni High School'}</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-700 font-bold">
                    <Briefcase size={13} className="mr-2 text-blue-400 shrink-0" />
                    <span className="truncate">{member.currentTitle || 'Graduate'}</span>
                  </div>
                </div>

                {/* Professional Biography */}
                {member.currentBio ? (
                  <p className="text-[13px] text-slate-600 leading-relaxed font-medium line-clamp-3 italic px-1">
                    "{member.currentBio}"
                  </p>
                ) : (
                  <p className="text-[13px] text-slate-400 leading-relaxed font-medium italic px-1">
                    No bio description provided.
                  </p>
                )}
              </div>

              {/* Action buttons & External links */}
              <div className="flex items-center justify-between border-t border-slate-100/80 mt-6 pt-5 relative z-10">
                <div className="flex items-center space-x-2">
                  {member.linkedIn && (
                    <a
                      href={member.linkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 text-slate-400 hover:text-[#0a66c2] flex items-center justify-center transition-all shadow-sm hover:shadow"
                      title="LinkedIn Profile"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  )}
                  {member.workLink && (
                    <a
                      href={member.workLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl bg-white hover:bg-blue-50 border border-slate-200/60 hover:border-blue-200 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-all shadow-sm hover:shadow"
                      title="Personal Website"
                    >
                      <Globe size={16} />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => setSelectedMember(member)}
                  className="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md hover:shadow-blue-500/25 active:scale-95 group/btn"
                >
                  <span>Connect</span>
                  <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 pt-4">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/60 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                Previous
              </button>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white/40 px-3 py-1.5 rounded-lg border border-slate-200/50">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/60 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white/40 backdrop-blur-md p-16 rounded-[2rem] border border-white/60 shadow-xl shadow-slate-900/5 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-slate-100/80 rounded-full flex items-center justify-center text-slate-400 shadow-inner">
            <Search size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Alumni Found</h3>
            <p className="text-xs text-slate-500 font-medium max-w-sm">We couldn't find any graduates matching "{searchQuery}" in our records.</p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setSelectedBatch('All'); setSelectedSchool('All'); setCurrentPage(1); }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Connection Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedMember(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-2xl max-w-md w-full animate-in zoom-in-95 duration-200 text-center space-y-6">

            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Profile Pic inside modal */}
            <div className="w-24 h-24 bg-slate-100 border-2 border-slate-200 rounded-full overflow-hidden relative mx-auto shadow-inner flex items-center justify-center">
              {selectedMember.profilePic ? (
                <Image src={selectedMember.profilePic} alt={selectedMember.name} fill className="object-cover" />
              ) : (
                <User size={40} className="text-slate-300" />
              )}
            </div>

            {/* Name & Title */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{selectedMember.name}</h3>
              <p className="text-xs text-slate-500 font-bold">{selectedMember.currentTitle || 'Graduate'}</p>
              <p className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100/50 px-2.5 py-0.5 rounded-full inline-block mt-2">
                Class of {selectedMember.batchYear || 'N/A'}
              </p>
            </div>

            {/* Bio info */}
            {selectedMember.currentBio && (
              <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 border border-slate-100 p-4 rounded-2xl italic">
                "{selectedMember.currentBio}"
              </p>
            )}

            {/* Contact details */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connect Workspace</p>

              <div className="flex flex-col gap-2">
                {/* Email Address Link */}
                <a
                  href={`mailto:${selectedMember.email}`}
                  className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-2xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400" />
                    <span>Send Email</span>
                  </span>
                  <ExternalLink size={12} className="text-slate-400" />
                </a>

                {/* LinkedIn Link */}
                {selectedMember.linkedIn && (
                  <a
                    href={selectedMember.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-2xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 fill-[#0a66c2]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn Profile</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                )}

                {/* Personal Website */}
                {selectedMember.workLink && (
                  <a
                    href={selectedMember.workLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 rounded-2xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Globe size={14} className="text-slate-400" />
                      <span>Portfolio Website</span>
                    </span>
                    <ExternalLink size={12} className="text-slate-400" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

// X Icon definition for simple close button
function X({ size, className }: { size?: number, className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 24}
      height={size || 24}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
