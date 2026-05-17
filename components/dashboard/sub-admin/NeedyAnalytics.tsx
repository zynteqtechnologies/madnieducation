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
  rte_count: string | number;
  zakat_amount: number;
  lillah_amount: number;
  zakat_paid: string | number;
  lillah_paid: string | number;
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
    rte: acc.rte + Number(curr.rte_count),
    amount: acc.amount + curr.total_needy_amount
  }), { needy: 0, zakat: 0, lillah: 0, rte: 0, amount: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Global Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Aid Analytics</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Support & Sponsorship Summary</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           {[
             { label: 'Total Needy', value: totals.needy, icon: <Heart size={16} />, color: 'text-rose-600', bg: 'bg-rose-50' },
             { label: 'RTE Students', value: totals.rte, icon: <ShieldCheck size={16} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
             { label: 'Total Spons.', value: totals.zakat + totals.lillah, icon: <Users size={16} />, color: 'text-teal-600', bg: 'bg-teal-50' },
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
        <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
           <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                 <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50/80 sticky left-0 z-20 border-r border-slate-200 backdrop-blur-sm">Grade Level</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Tuition Fee</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-slate-200 bg-amber-50/50 text-center" colSpan={3}>Zakat Fund Focus</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-slate-200 bg-teal-50/50 text-center" colSpan={3}>Lillah Fund Focus</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-slate-200 bg-rose-50/50 text-center">Other Metrics</th>
                       <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-slate-800 text-right bg-slate-900 text-slate-300">Total Deficit</th>
                    </tr>
                    <tr className="bg-slate-50/30 border-b border-slate-200">
                       <th className="px-6 py-2 sticky left-0 z-20 bg-slate-50/80 border-r border-slate-200 backdrop-blur-sm"></th>
                       <th className="px-6 py-2"></th>
                       <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-l border-slate-200 bg-amber-50/50 text-center">Recipients</th>
                       <th className="px-4 py-2 text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-amber-50/50 text-right">Collected</th>
                       <th className="px-4 py-2 text-[9px] font-bold text-rose-500 uppercase tracking-wider bg-amber-50/50 text-right">Remaining</th>
                       
                       <th className="px-4 py-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-l border-slate-200 bg-teal-50/50 text-center">Recipients</th>
                       <th className="px-4 py-2 text-[9px] font-bold text-emerald-600 uppercase tracking-wider bg-teal-50/50 text-right">Collected</th>
                       <th className="px-4 py-2 text-[9px] font-bold text-rose-500 uppercase tracking-wider bg-teal-50/50 text-right">Remaining</th>
                       
                       <th className="px-6 py-2 border-l border-slate-200 bg-rose-50/50"></th>
                       <th className="px-6 py-2 border-l border-slate-800 bg-slate-900"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.map((std) => {
                       const fees = parseFloat(std.fees as string) || 0;
                       const zakatPaid = parseFloat(std.zakat_paid as string) || 0;
                       const lillahPaid = parseFloat(std.lillah_paid as string) || 0;
                       return (
                         <tr key={std.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-100">
                               <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                     <School size={16} />
                                  </div>
                                  <div className="whitespace-nowrap">
                                     <p className="text-sm font-black text-slate-900">{std.standardName}</p>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{std.division || 'MAIN'} DIVISION</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <p className="text-sm font-black text-slate-700 tracking-tight">₹{fees.toLocaleString('en-IN')}</p>
                            </td>
                            
                            {/* Zakat Data */}
                            <td className="px-4 py-4 text-center border-l border-slate-100 bg-amber-50/20">
                               <span className="text-sm font-black text-slate-600">{std.zakat_count}</span>
                            </td>
                            <td className="px-4 py-4 text-right bg-amber-50/20">
                               <span className="text-xs font-bold text-emerald-600 tracking-tight">₹{zakatPaid.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="px-4 py-4 text-right bg-amber-50/20">
                               <span className="text-sm font-black text-rose-500 tracking-tight">₹{std.zakat_amount.toLocaleString('en-IN')}</span>
                            </td>

                            {/* Lillah Data */}
                            <td className="px-4 py-4 text-center border-l border-slate-100 bg-teal-50/20">
                               <span className="text-sm font-black text-slate-600">{std.lillah_count}</span>
                            </td>
                            <td className="px-4 py-4 text-right bg-teal-50/20">
                               <span className="text-xs font-bold text-emerald-600 tracking-tight">₹{lillahPaid.toLocaleString('en-IN')}</span>
                            </td>
                            <td className="px-4 py-4 text-right bg-teal-50/20">
                               <span className="text-sm font-black text-rose-500 tracking-tight">₹{std.lillah_amount.toLocaleString('en-IN')}</span>
                            </td>

                            {/* Other Metrics */}
                            <td className="px-6 py-4 border-l border-slate-100 text-center bg-rose-50/20">
                               <div className="flex items-center justify-center space-x-4">
                                  <div className="flex flex-col items-center" title="Total Needy Profiles">
                                     <Heart size={14} className="text-rose-400 mb-1" />
                                     <span className="text-[10px] font-black text-slate-600">{std.total_needy}</span>
                                  </div>
                                  <div className="flex flex-col items-center" title="RTE Profiles">
                                     <ShieldCheck size={14} className="text-emerald-400 mb-1" />
                                     <span className="text-[10px] font-black text-slate-600">{std.rte_count}</span>
                                  </div>
                               </div>
                            </td>

                            {/* Standard Budget Required */}
                            <td className="px-6 py-4 border-l border-slate-800 text-right bg-slate-950 text-white relative overflow-hidden group-hover:bg-slate-900 transition-colors">
                               <div className="absolute inset-0 bg-emerald-500/5"></div>
                               <span className="relative z-10 text-base font-black text-emerald-400 tracking-tighter w-full block">₹{std.total_needy_amount.toLocaleString('en-IN')}</span>
                            </td>
                         </tr>
                       );
                    })}
                 </tbody>
                 {/* Aggregates Footer */}
                 <tfoot className="bg-slate-50 border-t-4 border-slate-200">
                    <tr>
                       <td className="px-6 py-4 font-black text-slate-900 sticky left-0 z-20 bg-slate-50 border-r border-slate-200 uppercase tracking-widest text-[10px] whitespace-nowrap">Total Aggregates</td>
                       <td className="px-6 py-4 text-right"></td>
                       <td className="px-4 py-4 text-center font-black text-slate-700 bg-amber-50/50 border-l border-slate-200">{totals.zakat}</td>
                       <td className="px-4 py-4 text-right text-emerald-600 font-bold bg-amber-50/50">₹{data.reduce((acc, curr) => acc + (parseFloat(curr.zakat_paid as string)||0), 0).toLocaleString('en-IN')}</td>
                       <td className="px-4 py-4 text-right text-rose-600 font-black tracking-tight bg-amber-50/50">₹{data.reduce((acc, curr) => acc + curr.zakat_amount, 0).toLocaleString('en-IN')}</td>
                       
                       <td className="px-4 py-4 text-center font-black text-slate-700 border-l border-slate-200 bg-teal-50/50">{totals.lillah}</td>
                       <td className="px-4 py-4 text-right text-emerald-600 font-bold bg-teal-50/50">₹{data.reduce((acc, curr) => acc + (parseFloat(curr.lillah_paid as string)||0), 0).toLocaleString('en-IN')}</td>
                       <td className="px-4 py-4 text-right text-rose-600 font-black tracking-tight bg-teal-50/50">₹{data.reduce((acc, curr) => acc + curr.lillah_amount, 0).toLocaleString('en-IN')}</td>
                       
                       <td className="px-6 py-4 text-center font-black text-slate-500 border-l border-slate-200 bg-rose-50/50 text-[10px]">
                          <span className="mr-3">N: <b className="text-slate-800">{totals.needy}</b></span>
                          <span>RTE: <b className="text-slate-800">{totals.rte}</b></span>
                       </td>
                       <td className="px-6 py-4 text-right border-l border-slate-800 bg-slate-950">
                          <span className="text-xl font-black text-emerald-400 tracking-tighter">₹{totals.amount.toLocaleString('en-IN')}</span>
                       </td>
                    </tr>
                 </tfoot>
              </table>
           </div>
        </div>
      )}

    </div>
  );
}
