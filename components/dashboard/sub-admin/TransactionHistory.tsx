'use client';

import React, { useState, useEffect } from 'react';
import Pagination from '../../ui/Pagination';
import { 
  History, 
  IndianRupee, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  CheckCircle2, 
  User,
  Mail,
  Loader2,
  Calendar
} from 'lucide-react';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t => 
    t.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedTransactions = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const stats = {
    total: transactions.reduce((acc, t) => acc + parseFloat(t.amount), 0),
    count: transactions.length,
    construction: transactions.filter(t => t.type === 'CONSTRUCTION').reduce((acc, t) => acc + parseFloat(t.amount), 0),
    aid: transactions.filter(t => ['ZAKAT', 'SADKA', 'LILLAH'].includes(t.type)).reduce((acc, t) => acc + parseFloat(t.amount), 0),
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-1 bg-white p-8 rounded-md border border-slate-100 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-md flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
               <History size={24} />
            </div>
            <div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight">Ledger</h3>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Trail</p>
            </div>
         </div>

         <div className="bg-slate-900 p-8 rounded-md shadow-xl space-y-2 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Total Contributions</p>
            <p className="text-3xl font-black text-white tracking-tighter">₹{stats.total.toLocaleString('en-IN')}</p>
            <div className="flex items-center space-x-2 pt-2 text-[8px] font-black uppercase text-emerald-500 tracking-widest">
               <ArrowUpRight size={10} />
               <span>{stats.count} Transactions Verified</span>
            </div>
         </div>

         <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Construction Funds</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{stats.construction.toLocaleString('en-IN')}</p>
            <div className="h-1.5 w-full bg-slate-50 rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-indigo-500" style={{ width: stats.total > 0 ? `${(stats.construction / stats.total) * 100}%` : '0%' }}></div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Aid Funds</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">₹{stats.aid.toLocaleString('en-IN')}</p>
            <div className="h-1.5 w-full bg-slate-50 rounded-full mt-3 overflow-hidden">
               <div className="h-full bg-emerald-500" style={{ width: stats.total > 0 ? `${(stats.aid / stats.total) * 100}%` : '0%' }}></div>
            </div>
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-md border border-slate-100 shadow-sm">
         <div className="relative group w-full md:w-96">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by alumni, type, or serial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-md text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
         </div>
         <button onClick={fetchTransactions} className="p-4 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-md transition-all">
            <Loader2 className={loading ? 'animate-spin' : ''} size={18} />
         </button>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
               <thead>
                  <tr className="border-b border-slate-50">
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Allocation</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumni Metadata</th>
                     <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settlement</th>
                  </tr>
               </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                         <tr>
                            <td colSpan={4} className="py-20 text-center">
                               <Loader2 className="animate-spin mx-auto text-emerald-600" size={32} />
                            </td>
                         </tr>
                      ) : paginatedTransactions.length === 0 ? (
                         <tr>
                            <td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">No contributions indexed.</td>
                         </tr>
                      ) : paginatedTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-8">
                          <p className="text-xs font-black text-slate-900 uppercase">{t.razorpayPaymentId}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center mt-1">
                             <Calendar size={10} className="mr-1" />
                             {new Date(t.createdAt).toLocaleDateString()}
                          </p>
                       </td>
                       <td className="px-10 py-8">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${t.type === 'CONSTRUCTION' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                             {t.type}
                          </span>
                       </td>
                       <td className="px-10 py-8">
                          <p className="text-xs font-black text-slate-900 flex items-center"><User size={12} className="mr-1.5" />{t.donorName}</p>
                          <p className="text-[10px] font-bold text-slate-400 italic flex items-center"><Mail size={10} className="mr-1.5" />{t.donorEmail}</p>
                       </td>
                       <td className="px-10 py-8 text-right">
                          <p className="text-lg font-black text-slate-900 tracking-tighter">₹{Math.round(parseFloat(t.amount)).toLocaleString('en-IN')}</p>
                          <span className="text-[8px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Settled</span>
                       </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
       </div>

       {/* Pagination Container */}
       <div className="mt-4">
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
