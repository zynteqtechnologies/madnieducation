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
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-xl shadow-md border border-amber-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back, {data?.alumni?.name || 'Alumni'}!</h2>
              <p className="text-gray-600 mb-8 font-medium">Keep your legacy alive and stay connected with your institutional network.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Institutional Presence</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                       <span className="text-sm font-bold text-slate-600">Alumni Identity</span>
                       <span className="text-sm font-black text-slate-900">{data?.alumni?.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                       <span className="text-sm font-bold text-slate-600">Graduation Year</span>
                       <span className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full">{data?.alumni?.batchYear}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                       <span className="text-sm font-bold text-slate-600">Interaction Stats</span>
                       <span className="text-sm font-black text-slate-900">{data?.stats?.totalPosts || 0} Contributions</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 bg-amber-50 text-amber-600 rounded-md border border-amber-100 flex items-center justify-center mb-6 shadow-xl shadow-amber-500/5">
                      <GraduationCap size={48} />
                  </div>
                  <h3 className="text-lg font-black text-gray-800 mb-1">Proud Graduate</h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Class of {data?.alumni?.batchYear}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions for Alumni */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <button onClick={() => setActiveTab('Career Hub')} className="bg-white p-6 rounded-md border border-slate-200 hover:border-amber-500 transition-all text-left group">
                  <Briefcase className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                  <h4 className="font-bold text-slate-900">Career Hub</h4>
                  <p className="text-xs text-slate-500 mt-1">Post jobs and referrals for students.</p>
               </button>
               <button onClick={() => setActiveTab('Mentorship')} className="bg-white p-6 rounded-md border border-slate-200 hover:border-amber-500 transition-all text-left group">
                  <UserCheck className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                  <h4 className="font-bold text-slate-900">Mentorship</h4>
                  <p className="text-xs text-slate-500 mt-1">Offer guidance to the next generation.</p>
               </button>
               <button onClick={() => setActiveTab('Support Schools')} className="bg-white p-6 rounded-md border border-slate-200 hover:border-amber-500 transition-all text-left group">
                  <Globe className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={24} />
                  <h4 className="font-bold text-slate-900">Support Schools</h4>
                  <p className="text-xs text-slate-500 mt-1">Contribute to school infrastructure.</p>
               </button>
            </div>
          </div>
        );
      case 'Support Schools':
        return <AlumniContributions />;
      case 'Career Hub':
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
      title="Madni Education Alumni Portal" 
      role="ALUMNI"
      activeItem={activeTab}
      onNavigate={setActiveTab}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
