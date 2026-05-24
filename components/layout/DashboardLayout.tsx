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
  CalendarDays,
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
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
          'Events': 'events',
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
    { name: 'Events', icon: <CalendarDays size={18} />, role: ['SUPER_ADMIN', 'SUB_ADMIN'] },
  ].filter(item => item.role.includes(role));

  const getLayoutColors = () => {
    switch (role) {
      case 'SUB_ADMIN': return {
        sidebar: 'bg-gradient-to-br from-[#1b4a50] via-[#143d43] to-[#0d2a4a] text-white border-r border-[#215B63]/20 shadow-2xl',
        active: 'text-white',
        hover: 'hover:bg-white/5 text-slate-300 hover:text-[#AAFFC7]',
        logoBg: 'bg-[#AAFFC7]/15'
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

  const formatGreetingDate = () => {
    try {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      return new Date().toLocaleDateString('en-US', options);
    } catch (e) {
      return '';
    }
  };

  const colors = getLayoutColors();

  return (
    <div className={`min-h-screen ${role === 'SUPER_ADMIN'
      ? 'bg-gradient-to-br from-[#ebf2f7] via-[#f1f6fa] to-[#f7fbfd]'
      : role === 'SUB_ADMIN'
        ? 'bg-subadmin-gradient'
        : role === 'ALUMNI'
          ? 'bg-gradient-to-br from-[#faf8f5] via-[#f5f1ea] to-[#ede7db]'
          : 'bg-[#F1F5F9]'
      } ${role === 'SUB_ADMIN' ? 'subadmin-portal' : ''} text-slate-900 font-inter antialiased overflow-x-hidden`}>

      {role === 'SUB_ADMIN' ? (
        <div className="flex flex-col min-h-screen">
          {/* Horizontal Topbar */}
          <header className="sticky top-0 z-50 backdrop-blur-md px-6 py-4 flex items-center justify-between">
            {/* Logo Section (Left-aligned) */}
            <div className="flex items-center cursor-pointer" onClick={() => handleNavigate('Dashboard')}>
              <div className="relative w-18 h-18 flex items-center justify-center shrink-0">
                <Image src="/madni-logo.png" alt="Logo" fill className="object-contain p-1" priority />
              </div>
            </div>

            {/* Centered Navigation Tabs */}
            <nav className="hidden lg:flex items-center justify-center flex-1 mx-6">
              <div className="inline-flex items-center rounded-lg border border-[#E6DFD3]/70 bg-[#fff9] px-2 py-2 gap-2">
                {menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigate(item.name)}
                    className={`px-6 py-2.5 text-xs font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${activeItem === item.name
                      ? 'bg-[#18181b] text-white shadow-sm'
                      : 'text-slate-700 hover:bg-[#E4E0D5] hover:text-slate-900'
                      }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </nav>

            {/* Right Accessories */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 bg-white border border-[#E6DFD3] rounded-full text-slate-500 hover:text-slate-900 transition-colors shadow-sm lg:hidden"
              >
                <Menu size={16} />
              </button>

              {/* Notifications */}
              <button className="relative p-2.5 bg-white border border-[#E6DFD3] rounded-lg text-slate-500 hover:text-slate-900 transition-colors flex items-center justify-center">
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              <div className="h-6 w-px bg-[#E6DFD3] hidden md:block"></div>

              {/* Profile Info & Dropdown */}
              <div className="relative">
                <div
                  className="flex items-center space-x-3 cursor-pointer group"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#18181b] border border-[#E6DFD3] flex items-center justify-center text-white font-bold text-sm overflow-hidden transition-all group-hover:scale-105">
                    {userData?.name ? userData.name[0] : 'S'}
                  </div>
                  <div className="hidden md:block text-left">
                  </div>
                </div>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <>
                    {/* Backdrop to dismiss dropdown */}
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-48 bg-[#FAF7F0] border border-[#E6DFD3] rounded-2xl shadow-xl py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleNavigate('Profile');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-[#EFECE5] hover:text-slate-900 transition-colors flex items-center space-x-2"
                      >
                        <User size={14} className="text-slate-500" />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 border-t border-[#E6DFD3]/40"
                      >
                        <LogOut size={14} className="text-red-500" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
              {/* Drawer */}
              <div className="fixed inset-y-0 right-0 w-72 bg-[#FAF7F0] p-6 shadow-2xl flex flex-col justify-between border-l border-[#E6DFD3] animate-in slide-in-from-right duration-300">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-slate-900 text-sm">Navigation</span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500">
                      <X size={18} />
                    </button>
                  </div>
                  <nav className="flex flex-col space-y-2">
                    {menuItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigate(item.name)}
                        className={`w-full text-left px-5 py-3 rounded-full text-xs font-semibold transition-all ${activeItem === item.name
                          ? 'bg-[#18181b] text-white shadow-sm'
                          : 'bg-white/60 border border-[#E6DFD3]/30 text-slate-700 hover:bg-[#EFECE5]'
                          }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>
                </div>
                <button onClick={handleLogout} className="w-full flex items-center justify-center space-x-2 px-5 py-3 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-all">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <main className="flex-1 px-4 md:px-8 py-6 lg:py-4 flex flex-col w-full mx-auto">

            <div className="flex-1 w-full min-h-0 lg:overflow-hidden flex flex-col">
              {children}
            </div>
          </main>
        </div>
      ) : (
        <>
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
            <div className={`h-20 flex items-center transition-all duration-300 ease-in-out ${isSidebarOpen ? 'px-6' : 'px-4'} ${role === 'SUPER_ADMIN' ? '' : 'border-b border-white/5'} relative z-10`}>
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
            <nav className="flex-1 px-3 py-6 space-y-1 relative z-10">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.name)}
                  className={`w-full flex items-center px-4 py-3 rounded-md transition-all duration-200 relative group ${activeItem === item.name
                    ? colors.active
                    : `${colors.hover} hover:text-white`
                    }`}
                >
                  <div className="flex-shrink-0 relative z-10 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3">
                    {item.icon}
                  </div>
                  {isSidebarOpen && (
                    <span className="ml-3 text-[13px] font-medium tracking-tight whitespace-nowrap relative z-10 transition-transform duration-200 group-hover:translate-x-0.5">{item.name}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className={`p-4 mt-auto mb-2 relative z-10`}>
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
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={`transition-all duration-300 ease-in-out 
            ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'} 
            min-h-screen flex flex-col w-full`}>

            {/* Topbar - Simple & Sober */}
            <header className="sticky top-0 z-40 h-20 flex items-center px-4 md:px-6 justify-between transition-all bg-transparent border-b-0 shadow-none">
              <div className="flex items-center space-x-2 md:space-x-4">
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 transition-all hidden lg:flex items-center justify-center rounded-lg border border-slate-200 bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 shadow-sm"
                >
                  {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                <h2 className="text-lg md:text-xl font-bold text-[#0b1525]">{getHeaderTitle()}</h2>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative group hidden md:block">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className={`text-sm outline-none transition-all pl-9 pr-4 py-2 w-64 ${role === 'ALUMNI'
                      ? 'bg-[#FAF0E6]/80 hover:bg-[#FAF0E6] focus:bg-white border-0 rounded-xl focus:ring-1 focus:ring-amber-500/30 text-slate-700 placeholder-slate-400'
                      : 'bg-[#EBF2F7]/80 hover:bg-[#EBF2F7] focus:bg-white border-0 rounded-xl focus:ring-1 focus:ring-[#3f72af]/30 text-slate-700 placeholder-slate-400'
                      }`}
                  />
                </div>

                <button className="relative p-2 transition-colors text-slate-400 hover:text-amber-600">
                  <Bell size={20} />
                  <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white ${role === 'SUPER_ADMIN' ? 'bg-[#3f72af]' : 'bg-amber-500'
                    }`}></span>
                </button>

                <div className="h-6 w-px bg-slate-200/80 mx-1"></div>

                {/* Simple Profile */}
                {role === 'ALUMNI' ? (
                  <div className="w-9 h-9 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:bg-orange-700 transition-all">
                    {userData?.name ? userData.name[0] : 'A'}
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-[#0b1525] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer hover:bg-[#16325c] transition-all">
                    {userData?.name ? userData.name[0] : 'S'}
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
        </>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.9;
            box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.15), 0 8px 16px -4px rgba(103, 192, 144, 0.3);
          }
          50% {
            opacity: 1;
            box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.25), 0 12px 24px -2px rgba(103, 192, 144, 0.5);
          }
        }

        @keyframes scale-y-bar {
          0% {
            transform: scaleY(0.4);
            opacity: 0.5;
          }
          100% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }

        .animate-scale-y {
          animation: scale-y-bar 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .subadmin-sidebar-pattern {
          background-image: 
            radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(135deg, rgba(103, 192, 144, 0.03) 0%, transparent 50%, rgba(18, 65, 112, 0.05) 100%);
          background-size: 16px 16px, 100% 100%;
        }
      `}</style>
    </div>
  );
}
