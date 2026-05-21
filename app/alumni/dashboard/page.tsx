'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import AlumniContributions from '@/components/dashboard/alumni/AlumniContributions';
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Globe, Activity, Briefcase, UserCheck, GraduationCap } from 'lucide-react';
import AlumniCareerHub from '@/components/dashboard/alumni/AlumniCareerHub';
import AlumniMentorshipHub from '@/components/dashboard/alumni/AlumniMentorshipHub';
import AlumniProfile from '@/components/dashboard/alumni/AlumniProfile';

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
     } catch (err) {}
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-amber-50/60 via-orange-50/50 to-amber-100/40 p-8 rounded-[2rem] shadow-xl shadow-amber-950/5 border border-amber-100/80 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, {data?.alumni?.name || 'Alumni'}!</h2>
              <p className="text-slate-600 mb-8 font-medium">Keep your legacy alive and stay connected with your institutional network.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Institutional Presence</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                       <span className="text-sm font-semibold text-slate-500">Alumni Identity</span>
                       <span className="text-sm font-bold text-slate-800">{data?.alumni?.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                       <span className="text-sm font-semibold text-slate-500">Graduation Year</span>
                       <span className="text-sm font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Class of {data?.alumni?.batchYear}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                       <span className="text-sm font-semibold text-slate-500">Interaction Stats</span>
                       <span className="text-sm font-bold text-slate-800">{data?.stats?.totalPosts || 0} Contributions</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-orange-500/20">
                      <GraduationCap size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Proud Graduate</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Class of {data?.alumni?.batchYear}</p>
                </div>
              </div>
            </div>

             {/* Quick Actions for Alumni */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <button 
                 onClick={() => setActiveTab('Careers')} 
                 className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 text-left group"
               >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <Briefcase className="group-hover:scale-110 transition-transform" size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Careers</h4>
                  <p className="text-xs text-slate-500 mt-1">Post jobs and referrals for students.</p>
               </button>
               <button 
                 onClick={() => setActiveTab('Mentorship')} 
                 className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 text-left group"
               >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <UserCheck className="group-hover:scale-110 transition-transform" size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Mentorship</h4>
                  <p className="text-xs text-slate-500 mt-1">Offer guidance to the next generation.</p>
               </button>
               <button 
                 onClick={() => setActiveTab('Schools')} 
                 className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-amber-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 text-left group"
               >
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                    <Globe className="group-hover:scale-110 transition-transform" size={22} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Schools</h4>
                  <p className="text-xs text-slate-500 mt-1">Contribute to school infrastructure.</p>
               </button>
            </div>
          </div>
        );
      case 'Schools':
        return <AlumniContributions />;
      case 'Careers':
        return <AlumniCareerHub />;
      case 'Mentorship':
        return <AlumniMentorshipHub />;
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
