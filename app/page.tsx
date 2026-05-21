'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, School, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-amber-50/30 flex flex-col justify-between text-slate-800 font-inter antialiased relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="w-full px-6 py-6 flex items-center justify-between border-b border-slate-200/50 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center p-1 border border-slate-200/60 shadow-sm">
            <Image src="/madni-logo.png" alt="Madni Logo" fill className="object-contain p-1" priority />
          </div>
          <span className="font-bold tracking-tight text-slate-800 text-base">MadniEducation</span>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200/60 shadow-sm">
          v1.0.0 Stable
        </span>
      </header>

      {/* Main Hub */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 relative z-10">
        <div className="text-center max-w-2xl mb-12 animate-in fade-in duration-700">
          <span className="px-3 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-full border border-blue-100 tracking-wider uppercase">
            Unified Educational Network
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 leading-tight">
            Select Portal to Proceed
          </h1>
          <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto leading-relaxed">
            Choose your administrative role or access the alumni hub to manage, view, and support institutional operations.
          </p>
        </div>

        {/* Portals Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl animate-in fade-in duration-1000">
          
          {/* Super Admin Card */}
          <Link href="/superadmin/login" className="group">
            <div className="h-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:scale-[1.02] transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all duration-300" />
              
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">Super Admin</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  System-wide configurations, register new trusts, provision institutions, manage system-level registries, and administrative logs.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-blue-600 group-hover:text-blue-700 transition-colors">
                <span>Access Command Center</span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Sub Admin Card */}
          <Link href="/subadmin/login" className="group">
            <div className="h-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/10 hover:scale-[1.02] transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-300" />
              
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  <School size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">School Admin</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Manage student directories, grade structures, costs, admissions, fee potentials, transaction collections, and direct alumni interactions.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 group-hover:text-emerald-700 transition-colors">
                <span>Enter Administration</span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Alumni Card */}
          <Link href="/alumni/login" className="group">
            <div className="h-full bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-[2rem] p-8 flex flex-col justify-between hover:bg-white hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 hover:scale-[1.02] transition-all duration-300 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all duration-300" />
              
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                  <GraduationCap size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">Alumni Portal</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Stay connected with the network, create mentorship offerings, post career/referral opportunities, and support institutional growth campaigns.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-amber-600 group-hover:text-amber-700 transition-colors">
                <span>Access Alumni Hub</span>
                <span className="transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </Link>

        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-400 border-t border-slate-200/50 relative z-10">
        © {new Date().getFullYear()} Madni Education Network. All rights reserved.
      </footer>

      {/* Tailwind global font import fallback */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
      `}</style>
    </div>
  );
}
