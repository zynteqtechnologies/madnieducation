'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StandardManagement from '@/components/dashboard/sub-admin/StandardManagement';
import StudentImport from '@/components/dashboard/sub-admin/StudentImport';
import StudentList from '@/components/dashboard/sub-admin/StudentList';
import NeedyAnalytics from '@/components/dashboard/sub-admin/NeedyAnalytics';
import CostManagement from '@/components/dashboard/sub-admin/CostManagement';
import AlumniManagement from '@/components/dashboard/super-admin/AlumniManagement';
import TransactionHistory from '@/components/dashboard/sub-admin/TransactionHistory';
import AlumniInteractionManager from '@/components/dashboard/sub-admin/AlumniInteractionManager';
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function SubAdminDashboard() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [stats, setStats] = useState<any>(null);

  React.useEffect(() => {
     fetchStats();
  }, []);

  const fetchStats = async () => {
     try {
        const res = await fetch('/api/subadmin/stats');
        const data = await res.json();
        if (res.ok) setStats(data);
     } catch (err) {}
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'Dashboard':
        return <OverviewTab stats={stats} />;
      case 'Standards':
        return <StandardManagement />;
      case 'Admissions':
        return <StudentImport />;
      case 'Costs':
        return <CostManagement />;
      case 'Students':
        return <StudentList />;
      case 'Financial Aid':
        return <NeedyAnalytics />;
      case 'Donations':
        return <TransactionHistory />;
      case 'Alumni Requests':
        return <AlumniInteractionManager />;
      case 'Alumnis':
        return <AlumniManagement />;
      case 'Activity':
        return (
          <div className="py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
            <Activity size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">System Activity</h3>
            <p className="text-slate-400 text-sm font-medium">Tracking administrative logs and student synchronizations...</p>
          </div>
        );
      default:
        return <OverviewTab stats={stats} />;
    }
  };

  return (
    <DashboardLayout
      title="School Administration"
      role="SUB_ADMIN"
      activeItem={activeItem}
      onNavigate={setActiveItem}
    >
      {renderContent()}
    </DashboardLayout>
  );
}

function OverviewTab({ stats }: { stats: any }) {
  const collectionRate = stats?.totalFeesPotential > 0 
    ? Math.round((stats.totalFeesPaid / stats.totalFeesPotential) * 100) 
    : 0;

  const displayStats = [
    { label: 'Total Students', value: stats?.totalStudents || 0, icon: <Users size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Standards', value: stats?.activeStandards || 0, icon: <BookOpen size={20} />, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Recent Enrollments', value: stats?.recentEnrollments || 0, icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Fee Potential', value: `₹${((stats?.totalFeesPotential || 0) / 100000).toFixed(2)}L`, icon: <TrendingUp size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Institutional Command Center</p>
        </div>
        <div className="flex items-center space-x-3 bg-white px-5 py-3 rounded-md shadow-sm border border-slate-100">
          <Calendar size={16} className="text-emerald-600" />
          <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Academic Session 2026-27</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-md border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500 group">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
               {stat.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Quick Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-md border border-slate-100 shadow-sm p-6 md:p-10">
          <h4 className="text-lg font-black text-slate-900 mb-8 flex items-center">
            <CheckCircle2 size={22} className="mr-3 text-emerald-600" />
            Recent Admissions
          </h4>
          <div className="space-y-6">
            {stats?.recentAdmissions?.length > 0 ? stats.recentAdmissions.map((student: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-4 rounded-md transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                    {student.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{student.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{student.studentCode}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-tighter">Registered</span>
              </div>
            )) : (
              <div className="py-10 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">No recent admissions</div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 rounded-md shadow-2xl p-6 md:p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <h4 className="text-lg font-black mb-8 flex items-center relative z-10">
            <Activity size={22} className="mr-3 text-emerald-400" />
            Performance Tracking
          </h4>
          <p className="text-white/60 text-sm font-medium leading-relaxed mb-8 relative z-10">
            The performance analytics module is currently processing institutional data. Detailed reports will be available once the student registry is fully synchronized.
          </p>
          <div className="relative z-10 h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-emerald-500 animate-pulse"></div>
          </div>
          <p className="mt-4 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] relative z-10">Syncing Registry: 68% Complete</p>
        </div>
      </div>

    </div>
  );
}
