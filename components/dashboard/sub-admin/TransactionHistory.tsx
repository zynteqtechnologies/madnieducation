'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Loader2, 
  Calendar, 
  User, 
  Mail, 
  ArrowUpRight 
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

interface Transaction {
  id: string;
  amount: string;
  donorName: string;
  donorEmail: string | null;
  razorpayPaymentId: string | null;
  type: string;
  createdAt: string;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [stats, setStats] = useState({
    total: 0,
    count: 0,
    construction: 0,
    aid: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/transactions');
      if (res.ok) {
        const data = await res.json();
        setTransactions(data);
        
        const construction = data
          .filter((t: Transaction) => t.type === 'CONSTRUCTION')
          .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);
          
        const aid = data
          .filter((t: Transaction) => t.type === 'FINANCIAL_AID')
          .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0);
          
        setStats({
          total: data.reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount), 0),
          count: data.length,
          construction,
          aid
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.razorpayPaymentId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Premium Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-md border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Donations Ledger</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Verified Audit Trail & Ledger</p>
        </div>
        <div className="flex items-center space-x-2.5 bg-slate-100 px-4 py-2 rounded-md border border-slate-200/50">
          <History size={14} className="text-[#67C090]" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Financial Registry Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="md:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110">
               <History size={24} />
            </div>
             <div>
                <p className="text-[11px] font-bold text-slate-500 tracking-tight">Financial ledger</p>
                <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Verified audit trail</p>
             </div>
         </div>

         <div className="bg-[#1A3D63] p-8 rounded-[2rem] shadow-xl shadow-[#1A3D63]/20 space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-[11px] font-bold text-white/60 tracking-tight">Total contributions</p>
            <p className="text-3xl font-bold text-white tracking-tight">₹{stats.total.toLocaleString('en-IN')}</p>
            <div className="flex items-center space-x-2 pt-2 text-[10px] font-bold text-emerald-400 tracking-tight">
               <ArrowUpRight size={12} />
               <span>{stats.count} transactions verified</span>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
            <p className="text-[11px] font-bold text-slate-500 tracking-tight">Construction funds</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{stats.construction.toLocaleString('en-IN')}</p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-indigo-500 rounded-full" style={{ width: stats.total > 0 ? `${(stats.construction / stats.total) * 100}%` : '0%' }}></div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
            <p className="text-[11px] font-bold text-slate-500 tracking-tight">Financial aid funds</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{stats.aid.toLocaleString('en-IN')}</p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-emerald-500 rounded-full" style={{ width: stats.total > 0 ? `${(stats.aid / stats.total) * 100}%` : '0%' }}></div>
            </div>
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-md border border-slate-200 shadow-sm">
         <div className="relative group w-full md:w-96">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#67C090] transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by alumni, type, or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-6 py-2.5 bg-slate-100/80 border border-slate-200/60 rounded-xl text-xs font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#AAFFC7]/30 transition-all"
            />
         </div>
         <button onClick={fetchTransactions} className="p-2.5 bg-slate-100 text-slate-400 hover:text-[#67C090] rounded-xl border border-slate-200 transition-all">
            <Loader2 className={loading ? 'animate-spin' : ''} size={16} />
         </button>
      </div>

      {/* Ledger Table - Transitioned to Professional Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
         <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[1000px]">
               <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                     <th className="px-10 py-5 text-[11px] font-semibold text-slate-400 text-left w-[30%]">Transaction</th>
                     <th className="px-10 py-5 text-[11px] font-semibold text-slate-400 text-left w-[20%]">Category</th>
                     <th className="px-10 py-5 text-[11px] font-semibold text-slate-400 text-left w-[35%]">Donor</th>
                     <th className="px-10 py-5 text-[11px] font-semibold text-slate-400 text-right w-[15%] pr-14">Payment</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                     <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin text-emerald-600 mx-auto" size={32} /></td></tr>
                  ) : paginatedTransactions.length === 0 ? (
                     <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-medium italic text-sm">No contributions indexed in registry.</td></tr>
                  ) : (
                    paginatedTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                        <td className="px-10 py-8">
                           <p className="text-[13px] font-bold text-slate-700 tracking-tight">{t.razorpayPaymentId}</p>
                           <p className="text-[10px] text-slate-400 mt-1.5 flex items-center font-medium italic">
                              <Calendar size={12} className="mr-1.5 text-slate-300" />
                              {new Date(t.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                           </p>
                        </td>
                        <td className="px-10 py-8">
                           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${t.type === 'CONSTRUCTION' ? 'bg-indigo-50 text-indigo-700 border-indigo-100/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100/50'}`}>
                              {t.type}
                           </span>
                        </td>
                        <td className="px-10 py-8">
                           <div className="space-y-1.5">
                              <p className="text-[13px] font-bold text-slate-700 flex items-center group-hover:text-emerald-600 transition-colors">
                                 <User size={14} className="mr-2 text-slate-300" />
                                 {t.donorName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium italic flex items-center ml-5">
                                 <Mail size={12} className="mr-1.5 text-slate-300" />
                                 {t.donorEmail}
                              </p>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right pr-14">
                           <div className="space-y-1.5">
                              <p className="text-lg font-bold text-slate-900 tracking-tight">₹{Math.round(parseFloat(t.amount)).toLocaleString('en-IN')}</p>
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100/50">Settled</span>
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Pagination Container */}
      <div className="mt-8 flex justify-end">
         <Pagination 
           currentPage={currentPage} 
           totalPages={totalPages} 
           onPageChange={setCurrentPage} 
           accentColor="bg-emerald-600"
         />
      </div>
    </div>
  );
}
