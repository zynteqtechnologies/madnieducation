'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export default function AlumniLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: activeTab === 'email' ? email : phone, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(data.redirectTo);
      } else {
        setError(data.error || 'The credentials you entered are incorrect.');
      }
    } catch (err) {
      setError('System encountered a connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex min-h-screen items-center justify-between bg-gradient-to-br from-[#eff6ff] via-[#f5f3ff] to-white overflow-hidden font-inter transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

      {/* 3D Glassy Ribbon SVG Background */}
      <svg className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[70%] z-0 pointer-events-none" viewBox="0 0 1200 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-50 450 C 200 350, 400 550, 700 400 C 1000 250, 1100 300, 1300 200" stroke="url(#ribbon-grad)" strokeWidth="140" strokeLinecap="round" opacity="0.22" filter="blur(50px)" />
        <path d="M-50 450 C 200 350, 400 550, 700 400 C 1000 250, 1100 300, 1300 200" stroke="url(#ribbon-grad-2)" strokeWidth="70" strokeLinecap="round" opacity="0.3" filter="blur(12px)" />
        <defs>
          <linearGradient id="ribbon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="40%" stopColor="#6366f1" />
            <stop offset="80%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="ribbon-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Left: Logo */}
      <div className="absolute top-8 left-12 flex items-center space-x-2 z-10 cursor-pointer">
        <div className="relative flex items-center justify-center">
          <Image src="/madni-logo.png" alt="Logo" width={58} height={58} className="object-contain" priority />
        </div>
        <span className="font-outfit font-bold tracking-tight text-slate-800 text-sm">MadniEducation</span>
      </div>

      {/* Left side: Visual Branding Elements */}
      <div className="hidden lg:flex w-1/2 min-h-screen relative flex-col justify-center px-16 select-none z-10">

        {/* Floating Chat Bubbles (from Image 1) */}
        <div className="space-y-2.5 mb-12">
          <div className="bg-slate-200/50 border border-slate-300/20 backdrop-blur-md rounded-2xl px-4 py-2.5 text-[11px] font-semibold text-slate-500 max-w-max shadow-sm animate-pulse" style={{ animationDuration: '3s' }}>
            Hi there, alumni.
          </div>
          <div className="bg-white/85 border border-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 text-[11px] font-semibold text-slate-700 max-w-max shadow-sm ml-6 animate-pulse" style={{ animationDuration: '4s' }}>
            Welcome back to the portal.
          </div>
          <div className="bg-white/85 border border-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 text-[11px] font-semibold text-slate-700 max-w-max shadow-sm ml-12">
            Reconnecting with classmates?
          </div>
          <div className="bg-white/85 border border-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 text-[11px] font-semibold text-slate-700 max-w-max shadow-sm ml-16">
            I'll need to verify your identity first, though.
          </div>
        </div>

        {/* Brand Text (styled like "THE navos FUTURE") */}
        <div className="space-y-1 ml-4">
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase">THE</p>
          <div className="flex items-baseline space-x-2">
            <span className="text-6xl font-outfit font-black text-slate-900 tracking-tight">alumni</span>
            <span className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">NETWORK</p>
        </div>

        {/* Bottom Left Accessories (from Image 2) */}
        <div className="absolute bottom-8 left-16 flex items-center space-x-8 text-xs text-slate-400 font-bold">
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </div>

      {/* Right side: High-fidelity Login Card */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 sm:p-12 z-10">
        <div className="w-full max-w-[440px] bg-white/85 border border-white/80 backdrop-blur-2xl p-8 md:p-10 rounded-[32px] shadow-[0_20px_60px_rgba(30,41,59,0.06)] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Card Title */}
          <div>
            <h2 className="text-xl font-outfit font-bold text-slate-900 tracking-tight">Sign In to Account</h2>
          </div>

          {/* Form Tabs (from Image 1) */}
          <div className="flex border-b border-slate-100 pb-1 space-x-6">
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`text-xs font-bold pb-2.5 transition-all relative ${activeTab === 'email' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Email Login
              {activeTab === 'email' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-200"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('phone')}
              className={`text-xs font-bold pb-2.5 transition-all relative ${activeTab === 'phone' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Phone Login
              {activeTab === 'phone' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full animate-in fade-in duration-200"></div>
              )}
            </button>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-2.5 text-rose-700 text-xs animate-in fade-in duration-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
              <p className="font-semibold leading-normal">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {activeTab === 'email' ? (
              /* Email Input */
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-100 focus:border-blue-500 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/5 text-slate-800 text-xs font-semibold placeholder:text-slate-300"
                  placeholder="alumni@madnieducation.com"
                />
              </div>
            ) : (
              /* Phone Input */
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-100 focus:border-blue-500 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/5 text-slate-800 text-xs font-semibold placeholder:text-slate-300"
                  placeholder="15602226456"
                />
              </div>
            )}

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-11 py-3.5 bg-slate-50/50 hover:bg-slate-50 focus:bg-white border border-slate-100 focus:border-blue-500 rounded-xl outline-none transition-all duration-300 focus:ring-4 focus:ring-blue-500/5 text-slate-800 text-xs font-semibold placeholder:text-slate-300"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Agreement Terms Checkbox (from Image 1) */}
            <div className="flex items-start space-x-2 pt-2 px-1">
              <input
                type="checkbox"
                required
                id="terms"
                className="w-3.5 h-3.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600 mt-0.5"
              />
              <label htmlFor="terms" className="text-[10px] text-slate-400 font-semibold cursor-pointer select-none">
                I have read and agree to the <a href="#" className="text-blue-600 hover:underline">User Agreement</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin text-white" size={16} />
                  <span>Logging in...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Text */}
          <div className="pt-2 text-center text-xs text-slate-400">
            <span>Forgot password? </span>
            <a href="#" className="text-blue-600 font-bold hover:underline">Reset</a>
          </div>

        </div>
      </div>
    </div>
  );
}
