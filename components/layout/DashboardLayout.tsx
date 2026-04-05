'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Settings,
  User,
  ChevronDown,
  LayoutDashboard,
  Building2,
  School,
  Users,
  GraduationCap,
  Moon,
  Sun,
  Shield,
  Activity,
  Layers,
  FileUp,
  Heart,
  Construction,
  History,
  Globe,
  Briefcase,
  UserCheck
} from 'lucide-react';

interface DashboardLayoutProps {
  title: string;
  role: 'SUPER_ADMIN' | 'SUB_ADMIN' | 'ALUMNI';
  activeItem?: string;
  onNavigate?: (item: string) => void;
  children: React.ReactNode;
}

export default function DashboardLayout({ title, role, activeItem: externalActiveItem, onNavigate, children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [internalActiveItem, setInternalActiveItem] = useState('Dashboard');
  const activeItem = externalActiveItem || internalActiveItem;
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (!data.error) setUserData(data);
    }).catch(() => { });
  }, []);

  const handleNavigate = (item: string) => {
    if (onNavigate) onNavigate(item);
    else setInternalActiveItem(item);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const handleLogout = () => {
    document.cookie = `${role === 'ALUMNI' ? 'alumni_token' : 'admin_session'}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    router.push(`/${role.toLowerCase().replace('_', '')}/login`);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, role: ['SUPER_ADMIN', 'SUB_ADMIN', 'ALUMNI'] },
    { name: 'Profile', icon: <User size={18} />, role: ['ALUMNI'] },
    { name: 'Support Schools', icon: <Globe size={18} />, role: ['ALUMNI'] },
    { name: 'Trusts', icon: <Building2 size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Schools', icon: <School size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Standards', icon: <Layers size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Admissions', icon: <FileUp size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Costs', icon: <Construction size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Students', icon: <Users size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Financial Aid', icon: <Heart size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Donations', icon: <History size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Career Hub', icon: <Briefcase size={18} />, role: ['ALUMNI'] },
    { name: 'Mentorship', icon: <UserCheck size={18} />, role: ['ALUMNI'] },
    { name: 'Alumni Requests', icon: <GraduationCap size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Subadmins', icon: <Users size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Alumnis', icon: <GraduationCap size={18} />, role: ['SUPER_ADMIN', 'SUB_ADMIN'] },
    { name: 'Activity', icon: <Activity size={18} />, role: ['SUPER_ADMIN', 'SUB_ADMIN'] },
  ].filter(item => item.role.includes(role));

  const getLayoutColors = () => {
    switch (role) {
      case 'SUB_ADMIN': return {
        sidebar: 'bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900',
        active: 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20',
        hover: 'hover:bg-white/10 text-emerald-100',
        logoBg: 'bg-emerald-600/20'
      };
      case 'ALUMNI': return {
        sidebar: 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-900',
        active: 'bg-amber-500 text-white shadow-lg shadow-amber-900/20',
        hover: 'hover:bg-white/10 text-amber-100',
        logoBg: 'bg-amber-600/20'
      };
      default: return {
        sidebar: 'bg-slate-900',
        active: 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20',
        hover: 'hover:bg-white/5 text-slate-400',
        logoBg: 'bg-white/5'
      };
    }
  };

  const colors = getLayoutColors();

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-inter antialiased overflow-x-hidden">

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Clean & Sober */}
      <aside className={`fixed top-0 left-0 h-full z-[60] ${colors.sidebar} transition-all duration-500 ease-in-out 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${isSidebarOpen ? 'w-64' : 'lg:w-20 w-64'} flex flex-col shadow-xl`}>

        {/* Simple Logo Section */}
        <div className={`h-16 flex items-center border-b border-white/5 transition-all duration-300 ${isSidebarOpen ? 'px-6' : 'px-4'}`}>
          <div className="flex items-center space-x-3">
            <div className={`relative w-12 h-12 flex items-center justify-center shrink-0 rounded-md ${colors.logoBg}`}>
              <Image src="/madni-logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            {isSidebarOpen && (
              <span className="text-white font-bold tracking-tight text-sm">MadniEducation</span>
            )}
          </div>
        </div>

        {/* Menu Items - Small Text */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigate(item.name)}
              className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 ${activeItem === item.name
                  ? colors.active
                  : `${colors.hover} hover:text-white`
                }`}
            >
              <div className="flex-shrink-0">
                {item.icon}
              </div>
              {isSidebarOpen && (
                <span className="ml-3 text-[13px] font-medium tracking-tight whitespace-nowrap">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-md text-slate-400 hover:text-white hover:bg-rose-600/10 hover:text-rose-400 transition-all group">
            <LogOut size={18} />
            {isSidebarOpen && <span className="ml-3 text-[13px] font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} 
        min-h-screen flex flex-col w-full`}>

        {/* Topbar - Simple & Sober */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center px-4 md:px-6 justify-between shadow-sm">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors hidden lg:block"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-sm md:text-base font-semibold text-slate-800 tracking-tight truncate max-w-[150px] md:max-w-none">{title}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-slate-100 border border-slate-200 rounded-md pl-10 pr-4 py-1.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-all" />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1"></div>

            {/* Simple Profile */}
            <div className="flex items-center space-x-3 cursor-pointer group px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shadow-sm transition-all ${role === 'SUB_ADMIN' ? 'bg-emerald-600 text-white' : role === 'ALUMNI' ? 'bg-orange-600 text-white' : 'bg-indigo-600 text-white'}`}>
                {userData?.name ? userData.name[0] : role[0]}
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center space-x-1.5">
                  <p className="text-xs font-black text-slate-800 leading-tight truncate max-w-[120px]">
                    {userData?.name || 'Administrator'}
                  </p>
                  {userData?.schoolName && (
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border border-emerald-100">
                      {userData.schoolName}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  {userData?.role?.replace('_', ' ') || role.replace('_', ' ')}
                </p>
              </div>
              <ChevronDown size={14} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>
          </div>
        </header>

        {/* Content Body - Clean Workspace */}
        <section className="p-4 md:p-8 flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
