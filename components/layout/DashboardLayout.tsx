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
  History,
  Globe,
  Briefcase,
  UserCheck,
  Sparkles,
  Wallet,
  Calendar,
  ArrowUpCircle
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
  const [greeting, setGreeting] = useState('Welcome back');
  const activeItem = externalActiveItem || internalActiveItem;
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (!data.error) setUserData(data);
    }).catch(() => { });

    const hr = new Date().getHours();
    if (hr < 12) setGreeting('Good morning');
    else if (hr < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const getHeaderTitle = () => {
    if (activeItem === 'Dashboard') {
      const name = userData?.name ? userData.name.split(' ')[0] : (role === 'SUPER_ADMIN' ? 'Admin' : role === 'SUB_ADMIN' ? 'Officer' : 'Alumni');
      return `${greeting}, ${name} 👋`;
    }
    return activeItem || title;
  };

  const handleNavigate = (item: string) => {
    if (onNavigate) {
      onNavigate(item);
    } else {
      setInternalActiveItem(item);
      const rolePath = role.toLowerCase().replace('_', '');
      if (item === 'Dashboard') {
        router.push(`/${rolePath}/dashboard`);
      } else {
        const routeMap: Record<string, string> = {
          'Subadmins': 'subadmin',
          'Schools': 'school',
          'Trusts': 'trust',
          'Academic Years': 'academic-year',
          'Alumni': 'alumni',
          'Profile': 'profile',
          'Careers': 'careers',
          'Mentorship': 'mentorship',
          'Academic': 'academic',
          'Accounts': 'accounts',
          'Donations': 'donations',
          'Students': 'students',
          'Promotion': 'promotion',
          'Activity': 'activity',
          'Class Setup': 'class-setup'
        };
        const path = routeMap[item];
        if (path) {
          router.push(`/${rolePath}/${path}`);
        }
      }
    }
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const handleLogout = () => {
    document.cookie = `${role === 'ALUMNI' ? 'alumni_token' : 'admin_session'}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    router.push(`/${role.toLowerCase().replace('_', '')}/login`);
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, role: ['SUPER_ADMIN', 'SUB_ADMIN', 'ALUMNI'] },
    { name: 'Profile', icon: <User size={18} />, role: ['ALUMNI'] },
    { name: 'Schools', icon: <Globe size={18} />, role: ['ALUMNI'] },
    { name: 'Trusts', icon: <Building2 size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Schools', icon: <School size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Class Setup', icon: <Sparkles size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Academic', icon: <Layers size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Accounts', icon: <Wallet size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Donations', icon: <History size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Students', icon: <Users size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Careers', icon: <Briefcase size={18} />, role: ['ALUMNI'] },
    { name: 'Mentorship', icon: <UserCheck size={18} />, role: ['ALUMNI'] },
    { name: 'Alumni', icon: <GraduationCap size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Subadmins', icon: <Users size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Academic Years', icon: <Calendar size={18} />, role: ['SUPER_ADMIN'] },
    { name: 'Promotion', icon: <ArrowUpCircle size={18} />, role: ['SUB_ADMIN'] },
    { name: 'Activity', icon: <Activity size={18} />, role: ['SUPER_ADMIN', 'SUB_ADMIN'] },
  ].filter(item => item.role.includes(role));

  const getLayoutColors = () => {
    switch (role) {
      case 'SUB_ADMIN': return {
        sidebar: 'bg-gradient-to-br from-[#215B63] via-[#1b4d54] to-[#124170] text-white border-r border-[#215B63]/25 shadow-xl',
        active: 'bg-[#67C090] text-white shadow-lg shadow-[#67C090]/25',
        hover: 'hover:bg-white/10 text-[#AAFFC7]',
        logoBg: 'bg-[#AAFFC7]/20'
      };
      case 'ALUMNI': return {
        sidebar: 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-900 rounded-r-[32px] border-r-0',
        active: 'bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-900/20',
        hover: 'hover:bg-white/10 text-amber-100 hover:text-white',
        logoBg: 'bg-amber-600/20'
      };
      default: return {
        sidebar: 'bg-[#0b1525] rounded-r-[32px] border-r-0',
        active: 'bg-[#3f72af]/85 text-white rounded-xl shadow-md shadow-[#3f72af]/10',
        hover: 'hover:bg-white/10 text-slate-300 hover:text-white',
        logoBg: 'bg-white/10'
      };
    }
  };

  const colors = getLayoutColors();

  return (
    <div className={`min-h-screen ${role === 'SUPER_ADMIN'
        ? 'bg-gradient-to-br from-[#ebf2f7] via-[#f1f6fa] to-[#f7fbfd]'
        : role === 'SUB_ADMIN'
          ? 'bg-[#F4F6F5]'
          : role === 'ALUMNI'
            ? 'bg-gradient-to-br from-[#faf8f5] via-[#f5f1ea] to-[#ede7db]'
            : 'bg-[#F1F5F9]'
      } text-slate-900 font-inter antialiased overflow-x-hidden`}>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Clean & Sober */}
      <aside className={`fixed top-0 left-0 h-full z-[60] ${colors.sidebar} transition-all duration-300 ease-in-out 
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
        ${isSidebarOpen ? 'w-64' : 'lg:w-20 w-64'} flex flex-col shadow-xl`}>

        {/* Simple Logo Section */}
        <div className={`h-20 flex items-center transition-all duration-300 ease-in-out ${isSidebarOpen ? 'px-6' : 'px-4'} ${role === 'SUPER_ADMIN' ? '' : 'border-b border-white/5'
          }`}>
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
              className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 relative ${activeItem === item.name
                ? colors.active
                : `${colors.hover} hover:text-white`
                }`}
            >
              {role === 'SUB_ADMIN' && activeItem === item.name && (
                <>
                  {/* Outer Water Wave Layer 1 */}
                  <span className="absolute -inset-[3px] border-2 border-[#AAFFC7]/60 animate-wave-1 pointer-events-none z-0"></span>
                  {/* Outer Water Wave Layer 2 */}
                  <span className="absolute -inset-[5px] border border-[#67C090]/40 animate-wave-2 pointer-events-none z-0"></span>
                </>
              )}
              <div className="flex-shrink-0 relative z-10">
                {item.icon}
              </div>
              {isSidebarOpen && (
                <span className="ml-3 text-[13px] font-medium tracking-tight whitespace-nowrap relative z-10">{item.name}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`p-4 ${(role === 'SUPER_ADMIN' || role === 'ALUMNI') ? 'mt-auto mb-2' : 'border-t border-white/5'}`}>
          {(role === 'SUPER_ADMIN' || role === 'ALUMNI') ? (
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center space-x-3">
                <div className={`w-9 h-9 rounded-full ${role === 'ALUMNI' ? 'bg-amber-600' : 'bg-black'} border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {userData?.name ? userData.name[0] : (role === 'ALUMNI' ? 'A' : 'S')}
                </div>
                {isSidebarOpen && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-[13px] font-medium"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                )}
              </div>
              {!isSidebarOpen && (
                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-lg ${role === 'ALUMNI' ? 'bg-amber-950/40' : 'bg-black/40'} text-slate-400 hover:text-white transition-colors`}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          ) : (
            <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 rounded-md text-slate-400 hover:text-white hover:bg-rose-600/10 hover:text-rose-400 transition-all group">
              <LogOut size={18} />
              {isSidebarOpen && <span className="ml-3 text-[13px] font-medium">Logout</span>}
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ease-in-out 
        ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} 
        min-h-screen flex flex-col w-full`}>

        {/* Topbar - Simple & Sober */}
        <header className={`sticky top-0 z-40 h-20 flex items-center px-4 md:px-6 justify-between transition-all ${(role === 'SUPER_ADMIN' || role === 'ALUMNI')
            ? 'bg-transparent border-b-0 shadow-none'
            : 'bg-white border-b border-slate-200 shadow-sm'
          }`}>
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 transition-all hidden lg:flex items-center justify-center rounded-lg ${(role === 'SUPER_ADMIN' || role === 'ALUMNI')
                  ? 'border border-slate-200 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <h2 className={`font-semibold tracking-tight truncate max-w-[150px] md:max-w-none ${(role === 'SUPER_ADMIN' || role === 'ALUMNI')
                ? 'text-lg md:text-xl font-bold text-[#0b1525]'
                : 'text-sm md:text-base text-slate-800'
              }`}>{getHeaderTitle()}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative group hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className={`text-sm outline-none transition-all pl-9 pr-4 py-2 w-64 ${(role === 'SUPER_ADMIN' || role === 'ALUMNI')
                    ? role === 'ALUMNI'
                      ? 'bg-[#FAF0E6]/80 hover:bg-[#FAF0E6] focus:bg-white border-0 rounded-xl focus:ring-1 focus:ring-amber-500/30 text-slate-700 placeholder-slate-400'
                      : 'bg-[#EBF2F7]/80 hover:bg-[#EBF2F7] focus:bg-white border-0 rounded-xl focus:ring-1 focus:ring-[#3f72af]/30 text-slate-700 placeholder-slate-400'
                    : `bg-slate-100 border border-slate-200 rounded-md focus:bg-white focus:ring-1 ${role === 'SUB_ADMIN'
                      ? 'focus:ring-[#67C090] focus:border-[#67C090]'
                      : 'focus:ring-indigo-500'
                    }`
                  }`}
              />
            </div>

            <button className={`relative p-2 transition-colors ${(role === 'SUPER_ADMIN' || role === 'ALUMNI') ? 'text-slate-400 hover:text-amber-600' : 'text-slate-400 hover:text-slate-600'
              }`}>
              <Bell size={20} />
              <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white ${role === 'SUPER_ADMIN'
                  ? 'bg-[#3f72af]'
                  : role === 'ALUMNI'
                    ? 'bg-amber-500'
                    : role === 'SUB_ADMIN'
                      ? 'bg-[#67C090]'
                      : 'bg-indigo-500'
                }`}></span>
            </button>

            <div className="h-6 w-px bg-slate-200/80 mx-1"></div>

            {/* Simple Profile */}
            {(role === 'SUPER_ADMIN' || role === 'ALUMNI') ? (
              role === 'ALUMNI' ? (
                <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:bg-orange-700 transition-all">
                  {userData?.name ? userData.name[0] : 'A'}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-lg bg-[#0b1525] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:bg-[#16325c] transition-all">
                  {userData?.name ? userData.name[0] : 'S'}
                </div>
              )
            ) : (
              <div className="flex items-center space-x-3 cursor-pointer group px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-black text-xs shadow-sm transition-all ${role === 'SUB_ADMIN' ? 'bg-[#215B63] text-white' : 'bg-indigo-600 text-white'
                  }`}>
                  {userData?.name ? userData.name[0] : role[0]}
                </div>
                <div className="hidden lg:block">
                  <div className="flex items-center space-x-1.5">
                    <p className="text-xs font-black text-slate-800 leading-tight truncate max-w-[120px]">
                      {userData?.name || 'Administrator'}
                    </p>
                    {userData?.schoolName && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter border ${role === 'SUB_ADMIN'
                        ? 'bg-[#AAFFC7]/30 text-[#215B63] border-[#67C090]/20'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                        {userData.schoolName}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                    {userData?.role?.replace('_', ' ') || role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            )}
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

        @keyframes water-wave-1 {
          0% {
            border-radius: 8px;
            transform: scale(1) rotate(0deg);
          }
          33% {
            border-radius: 14px 6px 14px 8px / 12px 8px 14px 6px;
            transform: scale(1.02) rotate(1deg);
          }
          66% {
            border-radius: 6px 14px 8px 12px / 8px 14px 6px 12px;
            transform: scale(0.98) rotate(-1deg);
          }
          100% {
            border-radius: 8px;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes water-wave-2 {
          0% {
            border-radius: 8px;
            transform: scale(1) rotate(0deg);
          }
          50% {
            border-radius: 14px 8px 6px 12px / 10px 6px 14px 10px;
            transform: scale(1.03) rotate(-2deg);
          }
          100% {
            border-radius: 8px;
            transform: scale(1) rotate(0deg);
          }
        }

        .animate-wave-1 {
          animation: water-wave-1 4s infinite ease-in-out;
        }

        .animate-wave-2 {
          animation: water-wave-2 6s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
