'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AlumniContributions from '@/components/dashboard/alumni/AlumniContributions';
import React, { useEffect, useState } from 'react';
import { Heart, Briefcase, Handshake, GraduationCap, Calendar, Sparkles, Megaphone, ArrowUpRight, Award, Target, Flame, Users, Trophy, UserSearch } from 'lucide-react';
import AlumniCareerHub from '@/components/dashboard/alumni/AlumniCareerHub';
import AlumniMentorshipHub from '@/components/dashboard/alumni/AlumniMentorshipHub';
import AlumniProfile from '@/components/dashboard/alumni/AlumniProfile';
import AlumniDirectory from '@/components/dashboard/alumni/AlumniDirectory';
import AlumniAchievementHub from '@/components/dashboard/alumni/AlumniAchievementHub';
import AlumniBlogHub from '@/components/dashboard/alumni/AlumniBlogHub';
import AlumniDonationHistory from '@/components/dashboard/alumni/AlumniDonationHistory';
import AlumniCommunityFeed from '@/components/dashboard/alumni/AlumniCommunityFeed';
import AlumniMyPostsHub from '@/components/dashboard/alumni/AlumniMyPostsHub';

import { useRouter, useSearchParams } from 'next/navigation';

interface NewsUpdate {
  id: string;
  title: string;
  description: string;
  category: string;
  publishDate: string | null;
  imageUrl: string | null;
  createdAt: string;
  schoolName: string;
}

const TAB_MAP: Record<string, string> = {
  'dashboard': 'Dashboard',
  'feed': 'Community Feed',
  'my-posts': 'My Posts',
  'find-alumni': 'Find Alumni',
  'give-back': 'Give Back',
  'impact': 'My Impact',
  'profile': 'Profile',
};

const REVERSE_TAB_MAP: Record<string, string> = {
  'Dashboard': 'dashboard',
  'Community Feed': 'feed',
  'My Posts': 'my-posts',
  'Find Alumni': 'find-alumni',
  'Give Back': 'give-back',
  'My Impact': 'impact',
  'Profile': 'profile',
};

export default function AlumniDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [data, setData] = useState<any>(null);
  const [updates, setUpdates] = useState<NewsUpdate[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TAB_MAP[tabParam]) {
      setActiveTab(TAB_MAP[tabParam]);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    fetchUpdates();
  }, []);

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    const slug = REVERSE_TAB_MAP[newTab] || 'dashboard';
    router.push(`/alumni/dashboard?tab=${slug}`, { scroll: false });
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/alumni/stats');
      const d = await res.json();
      if (res.ok) setData(d);
    } catch { }
  };

  const fetchUpdates = async () => {
    try {
      const res = await fetch('/api/alumni/news-updates');
      const d = await res.json();
      if (res.ok) setUpdates(Array.isArray(d.updates) ? d.updates : []);
    } catch {
      setUpdates([]);
    } finally {
      setUpdatesLoading(false);
    }
  };

  const formatUpdateDate = (update: NewsUpdate) => {
    const date = update.publishDate || update.createdAt;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* Left & Middle Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Banner (Compact & Sleek) */}
              <div className="bg-white/40 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-900/5 border border-white/60 relative overflow-hidden group">
                <div className="absolute top-[10%] right-[5%] w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full group-hover:scale-110 transition-transform duration-1000"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[11px] font-bold border border-blue-500/10">
                      <Sparkles size={11} className="animate-pulse" />
                      <span>Madni Alumni Hub</span>
                    </span>
                    
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50/80 border border-blue-100/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <GraduationCap size={13} />
                        Batch of {data?.alumni?.batchYear || 'N/A'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 bg-white/80 border border-white px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Award size={13} className="text-amber-500" />
                        {data?.stats?.totalPosts || 0} Contributions Made
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mb-1">Shape the Future of Madni.</h2>
                  <p className="text-slate-600 text-xs font-medium max-w-xl leading-relaxed">Your continued support drives our community forward. Explore career networking, mentorship, and giving back.</p>
                </div>
              </div>

              {/* 📊 Network Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-slate-800 leading-none block">{data?.stats?.totalAlumni || 142}</span>
                    <span className="text-[11px] text-slate-500 font-medium">Alumni Network</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-slate-800 leading-none block">{data?.stats?.activeJobs || 18}</span>
                    <span className="text-[11px] text-slate-500 font-medium">Active Jobs</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Handshake size={20} />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-slate-800 leading-none block">{data?.stats?.totalMentors || 24}</span>
                    <span className="text-[11px] text-slate-500 font-medium">Student Mentors</span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Heart size={20} />
                  </div>
                  <div>
                    <span className="text-lg font-extrabold text-slate-800 leading-none block">₹{data?.stats?.totalDonated?.toLocaleString() || 0}</span>
                    <span className="text-[11px] text-slate-500 font-medium">My Donated</span>
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

              {/* Alumni Spotlight Card */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white backdrop-blur-md p-6 rounded-[2rem] border border-amber-200/80 shadow-md relative overflow-hidden group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-amber-500 text-white uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Trophy size={12} />
                    Alumni Spotlight
                  </span>
                  <span className="text-xs font-bold text-amber-700">Featured</span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  {data?.spotlight?.profilePic ? (
                    <img src={data.spotlight.profilePic} alt={data.spotlight.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-300 shadow-md" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-black text-xl flex items-center justify-center border-2 border-amber-300 shadow-md">
                      {data?.spotlight?.name ? data.spotlight.name.charAt(0) : 'M'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{data?.spotlight?.name || 'Top Alumni Mentor'}</h4>
                    <p className="text-xs text-slate-600 font-medium">{data?.spotlight?.currentTitle || 'Software Engineer & Mentor'}</p>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-md mt-1 inline-block">
                      Batch of {data?.spotlight?.batchYear || '2019'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                  Recognized for outstanding mentorship & career guidance to Madni Trust students this academic session.
                </p>

                <button onClick={() => handleTabChange('Find Alumni')} className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer">
                  <UserSearch size={14} />
                  Connect in Directory
                </button>
              </div>

              {/* Announcements Feed */}
              <div className="bg-white/85 backdrop-blur-md p-6 rounded-[2rem] border border-white/80 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Megaphone size={18} className="text-blue-600" />
                    <span>Campus News</span>
                  </h3>
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping"></span>
                </div>

                <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1 scrollbar-none [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {updatesLoading ? (
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Loading updates...</p>
                    </div>
                  ) : updates.length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-50/50 border border-slate-100">
                      <p className="text-xs font-bold text-slate-700">No campus updates yet</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">Updates from your school will appear here once published.</p>
                    </div>
                  ) : (
                    updates.map((update, index) => (
                      <div key={update.id} className={`p-4 rounded-xl border transition-colors group ${index === 0 ? 'bg-blue-50/30 border-blue-100/50 hover:bg-blue-50/50' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50/80'}`}>
	                        <div className="mb-3 aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 border border-white/70 flex items-center justify-center">
	                          {update.imageUrl ? (
	                            <img src={update.imageUrl} alt={update.title} className="h-full w-full object-cover" />
	                          ) : (
	                            <Megaphone size={22} className="text-blue-300" />
	                          )}
	                        </div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Calendar size={13} className={index === 0 ? 'text-blue-600' : 'text-slate-500'} />
                          <span className={`text-[10px] font-bold uppercase tracking-wide ${index === 0 ? 'text-blue-600' : 'text-slate-500'}`}>{formatUpdateDate(update)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-slate-500 uppercase tracking-wider border border-slate-100">{update.category}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/80 text-slate-500 uppercase tracking-wider border border-slate-100">{update.schoolName}</span>
                        </div>
                        <h4 className={`text-xs font-bold text-slate-800 transition-colors ${index === 0 ? 'group-hover:text-blue-700' : 'group-hover:text-blue-600'}`}>{update.title}</h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed line-clamp-3">{update.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Community Feed':
        return <AlumniCommunityFeed />;
      case 'My Posts':
        return <AlumniMyPostsHub />;
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
      onNavigate={handleTabChange}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
