'use client';

import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  IndianRupee, 
  Users, 
  ShieldCheck, 
  Loader2, 
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Banknote,
  School
} from 'lucide-react';

interface AnalyticsData {
  id: string;
  standardName: string;
  division: string | null;
  fees: string | number;
  total_needy: string | number;
  zakat_count: string | number;
  lillah_count: string | number;
  sadka_count: string | number;
  rte_count: string | number;
  zakat_amount: number;
  lillah_amount: number;
  sadka_amount: number;
  total_needy_amount: number;
}

export default function NeedyAnalytics() {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/analytics/needy');
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        setError('Failed to load financial aid analytics.');
      }
    } catch (err) {
      setError('Network synchronization error.');
    } finally {
      setLoading(false);
    }
  };

  const totals = data.reduce((acc, curr) => ({
    needy: acc.needy + Number(curr.total_needy),
    zakat: acc.zakat + Number(curr.zakat_count),
    lillah: acc.lillah + Number(curr.lillah_count),
    sadka: acc.sadka + Number(curr.sadka_count),
    rte: acc.rte + Number(curr.rte_count),
    amount: acc.amount + curr.total_needy_amount
  }), { needy: 0, zakat: 0, lillah: 0, sadka: 0, rte: 0, amount: 0 });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Global Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Aid Analytics</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Support & Sponsorship Summary</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Total Needy', value: totals.needy, icon: <Heart size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
             { label: 'RTE Students', value: totals.rte, icon: <ShieldCheck size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'Total Spons.', value: totals.zakat + totals.lillah + totals.sadka, icon: <Users size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
             { label: 'Remaining Budget', value: `₹${(totals.amount / 100000).toFixed(2)}L`, icon: <TrendingUp size={16} />, color: 'text-amber-600', bg: 'bg-amber-50' },
           ].map((stat, i) => (
             <div key={i} className="bg-white px-6 py-4 rounded-md border border-slate-100 shadow-sm flex items-center space-x-3">
                <div className={`${stat.bg} ${stat.color} p-2.5 rounded-xl`}>{stat.icon}</div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                   <p className="text-sm font-black text-slate-900">{stat.value}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-emerald-600" size={48} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Analyzing Student Registry...</p>
        </div>
      ) : error ? (
        <div className="py-20 bg-rose-50 border border-rose-100 rounded-md text-center p-10 max-w-md mx-auto">
           <AlertCircle size={48} className="mx-auto text-rose-300 mb-6" />
           <h3 className="text-lg font-black text-rose-900 mb-2">Analysis Failed</h3>
           <p className="text-rose-600 font-medium text-sm">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="py-32 text-center bg-white rounded-md border border-dashed border-slate-200">
           <HelpCircle size={48} className="mx-auto text-slate-200 mb-4" />
           <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active standards for analysis.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {data.map((std) => (
              <div key={std.id} className="bg-white rounded-md border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group overflow-hidden">
                 {/* Card Header */}
                 <div className="p-8 border-b border-slate-50 relative">
                    <div className="flex items-center justify-between mb-2">
                       <div className="w-12 h-12 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                          <School size={24} />
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Standard Fee</p>
                          <p className="text-sm font-black text-slate-900">₹{parseFloat(std.fees as string).toLocaleString('en-IN')}</p>
                       </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{std.standardName} {std.division ? `(${std.division})` : ''}</h3>
                 </div>

                 {/* Metrics Section: High Impact Financial Data */}
                 <div className="p-8 space-y-6">
                    
                    {/* Aid Categories Breakdown */}
                    <div className="space-y-4">
                       {[
                         { label: 'Zakat Fund', count: std.zakat_count, amount: std.zakat_amount, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100' },
                         { label: 'Lillah Fund', count: std.lillah_count, amount: std.lillah_amount, color: 'text-teal-600', bg: 'bg-teal-50/50', border: 'border-teal-100' },
                         { label: 'Sadka Fund', count: std.sadka_count, amount: std.sadka_amount, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' }
                       ].map((spons, i) => (
                         <div key={i} className={`${spons.bg} ${spons.border} border rounded-md p-6 flex items-center justify-between group/item hover:bg-white hover:shadow-xl hover:shadow-slate-200 transition-all duration-300`}>
                            <div className="space-y-1">
                               <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${spons.color}`}>{spons.label}</p>
                               <div className="flex items-baseline space-x-2">
                                  <span className="text-2xl font-black text-slate-900 tracking-tight">₹{spons.amount.toLocaleString('en-IN')}</span>
                                  <span className="text-[10px] font-bold text-slate-400">Remaining</span>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-xl font-black text-slate-900 leading-none">{spons.count}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Recipients</p>
                            </div>
                         </div>
                       ))}
                    </div>

                    {/* Secondary Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between border border-slate-100">
                          <div className="space-y-0.5">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Needy</p>
                             <p className="text-lg font-black text-rose-600">{std.total_needy}</p>
                          </div>
                          <Heart size={18} className="text-rose-200" />
                       </div>
                       <div className="bg-slate-50 rounded-2xl p-5 flex items-center justify-between border border-slate-100">
                          <div className="space-y-0.5">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">RTE</p>
                             <p className="text-lg font-black text-emerald-600">{std.rte_count}</p>
                          </div>
                          <ShieldCheck size={18} className="text-emerald-200" />
                       </div>
                    </div>
                 </div>

                 {/* Card Footer: Absolute Total */}
                 <div className="px-8 py-8 bg-slate-950 text-white relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
                    <div className="flex items-center justify-between relative z-10">
                       <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] mb-1">Standard Budget Allocation</p>
                          <div className="flex items-baseline space-x-2">
                             <span className="text-3xl font-black text-emerald-400 tracking-tighter italic">₹{std.total_needy_amount.toLocaleString('en-IN')}</span>
                             <span className="text-[10px] font-black text-white/20 uppercase">Remaining Required</span>
                          </div>
                       </div>
                       <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center bg-white/5">
                          <Banknote size={24} className="text-emerald-400" />
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

    </div>
  );
}
