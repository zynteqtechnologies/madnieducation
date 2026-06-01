'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AlumniContributions from '@/components/dashboard/alumni/AlumniContributions';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, School, Heart, Activity, Briefcase, Handshake, GraduationCap, Calendar, Sparkles, Megaphone, ArrowUpRight, Award, MessageSquare, Target, Flame } from 'lucide-react';
import AlumniCareerHub from '@/components/dashboard/alumni/AlumniCareerHub';
import AlumniMentorshipHub from '@/components/dashboard/alumni/AlumniMentorshipHub';
import AlumniProfile from '@/components/dashboard/alumni/AlumniProfile';
import AlumniDirectory from '@/components/dashboard/alumni/AlumniDirectory';
import AlumniAchievementHub from '@/components/dashboard/alumni/AlumniAchievementHub';
import AlumniBlogHub from '@/components/dashboard/alumni/AlumniBlogHub';
import AlumniDonationHistory from '@/components/dashboard/alumni/AlumniDonationHistory';

export default function AlumniDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any>(null);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/alumni/stats');
      const d = await res.json();
      if (res.ok) setData(d);
    } catch (err) { }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* Left & Middle Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Banner */}
              <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2rem] shadow-xl shadow-slate-900/5 border border-white/60 relative overflow-hidden group">
                <div className="absolute top-[10%] right-[5%] w-56 h-56 bg-blue-500/10 blur-[90px] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold mb-4 border border-blue-500/10">
                    <Sparkles size={12} className="animate-pulse" />
                    <span>Madni Alumni Hub</span>
                  </span>
                  <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight mb-2">Shape the Future of Madni.</h2>
                  <p className="text-slate-600 font-medium max-w-lg mb-6 leading-relaxed">Your continued support drives our community forward. Explore career networking, mentorship, and giving back below.</p>

                  {/* Banner Quick Info */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50/80 border border-blue-100/80 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                      <GraduationCap size={14} />
                      Batch of {data?.alumni?.batchYear || 'N/A'}
                    </span>
                    <span className="text-xs font-bold text-slate-600 bg-white/80 border border-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Award size={14} className="text-amber-500" />
                      {data?.stats?.totalPosts || 0} Contributions Made
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Quick Action Modules */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveTab('Careers')}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/80 hover:border-blue-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Briefcase className="group-hover:scale-110 transition-transform" size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-1">
                    Careers
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">Post jobs and referrals to support current students and alumni.</p>
                </button>

                <button
                  onClick={() => setActiveTab('Mentorship')}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/80 hover:border-blue-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Handshake className="group-hover:scale-110 transition-transform" size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-1">
                    Mentorship
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">Guide and offer mentorship pathways to ambitious students.</p>
                </button>

                <button
                  onClick={() => setActiveTab('Give Back')}
                  className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/80 hover:border-blue-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 text-left group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Heart className="group-hover:scale-110 transition-transform" size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-1">
                    Give Back
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">Sponsor infrastructure and help develop institutional facilities.</p>
                </button>
              </div>

              {/* Action Cards (Moved from Right Column for Balance) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Impact Snapshot Widget */}
                <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border border-white/80 shadow-md relative group flex flex-col">
                  <div className="absolute top-6 right-6 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Target size={20} className="text-blue-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-500 tracking-wider mb-2">
                    Donated till now
                  </h3>
                  <div className="flex flex-col flex-grow justify-center mt-2 mb-5">
                    <span className="text-4xl font-extrabold text-slate-800 tracking-tight">₹{data?.stats?.totalDonated?.toLocaleString() || 0}</span>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Thank you for making a difference.</p>
                  </div>

                  <button onClick={() => setActiveTab('My Impact')} className="mt-auto w-full bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:text-blue-700 text-slate-700 transition-all rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 group-hover:shadow-sm">
                    View details
                    <ArrowUpRight size={14} />
                  </button>
                </div>

                {/* Urgent Cause Spotlight Widget */}
                {data?.urgentCause && (
                  <div className="bg-white/85 backdrop-blur-md p-6 rounded-2xl border-2 border-rose-100 shadow-md relative">
                    <div className="absolute -top-3 left-6 bg-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm shadow-rose-500/20">
                      <Flame size={12} className="animate-pulse" />
                      Urgent Need
                    </div>
                    <h3 className="text-base font-bold text-slate-800 mt-2 mb-2 leading-tight">
                      {data.urgentCause.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">
                      {data.urgentCause.description || 'Support this urgent campus initiative to help our students succeed.'}
                    </p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-slate-500">Funded</span>
                        <span className="text-rose-600">{Math.round((Number(data.urgentCause.paidAmount || 0) / Number(data.urgentCause.estimatedCost || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-rose-500 h-full rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (Number(data.urgentCause.paidAmount || 0) / Number(data.urgentCause.estimatedCost || 1)) * 100)}%` }}></div>
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('Give Back')} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5">
                      <Heart size={14} />
                      Fund this Project
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column (1/3 width) */}
            <div className="space-y-8">

              {/* Announcements Feed */}
              <div className="bg-white/85 backdrop-blur-md p-6 rounded-[2rem] border border-white/80 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Megaphone size={18} className="text-blue-600" />
                    <span>Campus News</span>
                  </h3>
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></span>
                </div>

                <div className="space-y-5">
                  <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100/50 hover:bg-blue-50/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar size={13} className="text-blue-600" />
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">July 15, 2026</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Annual Grand Alumni Meetup</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">Join us at the main campus to reconnect with peers and mentor upcoming graduates.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">May 20, 2026</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Inauguration of New STEM Lab</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">Built with the support of Alumni contributions. Over 500+ students started STEM learning.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar size={13} className="text-slate-500" />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">April 10, 2026</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">Mentorship Enrollment Open</h4>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">Alumni can now register as mentors to guide seniors for final year projects.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Give Back':
        return <AlumniContributions />;
      case 'My Impact':
        return <AlumniDonationHistory />;
      case 'Careers':
        return <AlumniCareerHub />;
      case 'Mentorship':
        return <AlumniMentorshipHub />;
      case 'Achievements':
        return <AlumniAchievementHub />;
      case 'Blogs':
        return <AlumniBlogHub />;
      case 'Find Alumni':
        return <AlumniDirectory />;
      case 'Profile':
        return <AlumniProfile />;
      default:
        return <div>Section Under Development</div>;
    }
  };

  return (
    <DashboardLayout
      title="Alumni portal"
      role="ALUMNI"
      activeItem={activeTab}
      onNavigate={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
