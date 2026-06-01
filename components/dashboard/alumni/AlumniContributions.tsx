'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import {
   Building2,
   Heart,
   IndianRupee,
   CheckCircle2,
   Construction,
   PlayCircle,
   Search,
   Globe,
   Loader2,
   Lock,
   ArrowUpRight,
   School as SchoolIcon,
   ChevronRight,
   Info
} from 'lucide-react';

declare global {
   interface Window {
      Razorpay: any;
   }
}

export default function AlumniContributions() {
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'construction' | 'aid'>('construction');
   const [searchTerm, setSearchTerm] = useState('');

   // Payment Modal State
   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
   const [selectedItem, setSelectedItem] = useState<any>(null);
   const [paymentAmount, setPaymentAmount] = useState('');
   const [isPaying, setIsPaying] = useState(false);
   const [userData, setUserData] = useState<any>(null);

   useEffect(() => {
      fetchNeeds();
      fetch('/api/auth/me').then(res => res.json()).then(d => setUserData(d));
   }, []);

   const fetchNeeds = async () => {
      setLoading(true);
      try {
         const res = await fetch('/api/alumni/needs');
         const d = await res.json();
         setData(d);
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   };

   const handlePayment = async () => {
      if (!paymentAmount || parseFloat(paymentAmount) <= 0) return alert('Enter a valid amount');

      setIsPaying(true);
      try {
         const orderRes = await fetch('/api/payment/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               amount: parseFloat(paymentAmount),
               type: selectedItem.type,
               referenceId: selectedItem.id,
               schoolId: selectedItem.schoolId
            })
         });
         const order = await orderRes.json();

         const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RXNuiBfUb7KG4A',
            amount: order.amount,
            currency: order.currency,
            name: "Madni Education Trust",
            description: `Support - ${selectedItem.title}`,
            order_id: order.id,
            handler: async function (response: any) {
               const verifyRes = await fetch('/api/payment/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     ...response,
                     amount: parseFloat(paymentAmount),
                     type: selectedItem.type,
                     referenceId: selectedItem.id,
                     schoolId: selectedItem.schoolId,
                     donorName: userData?.name,
                     donorEmail: userData?.email,
                     donorPhone: userData?.phoneNo
                  })
               });

               if (verifyRes.ok) {
                  alert('Transfer Successful! Your institutional support has been recorded.');
                  setIsPaymentModalOpen(false);
                  fetchNeeds();
               } else {
                  alert('Verification failed.');
               }
            },
            prefill: {
               name: userData?.name,
               email: userData?.email,
               contact: userData?.phoneNo
            },
            theme: { color: "#2563eb" } // Updated to blue-600
         };

         const rzp = new window.Razorpay(options);
         rzp.open();

      } catch (err) {
         console.error(err);
      } finally {
         setIsPaying(false);
      }
   };

   const filteredExpenses = data?.expenses?.filter((e: any) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.schoolName.toLowerCase().includes(searchTerm.toLowerCase())
   );

   const filteredAid = data?.financialAid?.filter((a: any) =>
      a.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.standardName.toLowerCase().includes(searchTerm.toLowerCase())
   );

   if (loading) return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
         <Loader2 className="animate-spin text-blue-600" size={40} />
         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Aggregating Institutional Needs...</p>
      </div>
   );

   return (
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
         <Script src="https://checkout.razorpay.com/v1/checkout.js" />

         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-slate-100/50">
            <div className="space-y-1">
               <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
                  <Heart className="mr-3 text-blue-600" size={28} />
                  Give Back & Donations
               </h2>
               <p className="text-xs text-slate-500 font-medium ml-1">Support Madni Education by funding active projects or sponsoring a student's future.</p>
            </div>

            <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm">
               <button
                  onClick={() => setActiveTab('construction')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'construction' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Sponsor a Project
               </button>
               <button
                  onClick={() => setActiveTab('aid')}
                  className={`px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === 'aid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
               >
                  Sponsor a Student
               </button>
            </div>
         </div>

         {/* Search */}
         <div className="relative group w-full max-w-2xl mx-auto">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
               type="text"
               placeholder="Search schools, standards, or projects..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-14 pr-6 py-4 bg-white/50 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white shadow-sm transition-all text-slate-800 placeholder:text-slate-400"
            />
         </div>

         {/* Content */}
         {activeTab === 'construction' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {filteredExpenses?.map((exp: any) => (
                  <div key={exp.id} className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xl shadow-slate-900/5 hover:scale-[1.02] transition-all duration-300 overflow-hidden group">
                     <div className="aspect-video relative bg-slate-100 overflow-hidden">
                        {exp.mediaUrl ? (
                           <img src={exp.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Construction size={48} />
                           </div>
                        )}
                        <div className="absolute top-4 left-4">
                           <span className="bg-blue-600/90 backdrop-blur text-white px-4 py-1.5 rounded-full text-[10px] font-bold shadow-sm">
                              {exp.schoolName}
                           </span>
                        </div>
                     </div>
                     <div className="p-8 space-y-6 relative">
                        {/* Background Glow */}
                        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none"></div>

                        <div>
                           <h4 className="text-xl font-bold text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">{exp.title}</h4>
                           <p className="text-xs text-slate-500 font-medium mt-2 line-clamp-2 leading-relaxed">{exp.description}</p>
                        </div>

                        <div className="space-y-2.5">
                           <div className="flex justify-between items-end text-[11px] font-semibold">
                              <span className="text-slate-500">Funding Level</span>
                              <span className="text-blue-600">₹{parseFloat(exp.paidAmount).toLocaleString()} / ₹{parseFloat(exp.estimatedCost).toLocaleString()}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden">
                              <div
                                 className="h-full bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-1000"
                                 style={{ width: `${(exp.paidAmount / exp.estimatedCost) * 100}%` }}
                              ></div>
                           </div>
                        </div>

                        <button
                           onClick={() => {
                              setSelectedItem({ ...exp, type: 'CONSTRUCTION', title: exp.title, amountNeeded: exp.estimatedCost - exp.paidAmount });
                              setPaymentAmount((exp.estimatedCost - exp.paidAmount).toString());
                              setIsPaymentModalOpen(true);
                           }}
                           className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all flex justify-center items-center gap-2"
                        >
                           Donate Now
                           <ArrowUpRight size={14} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="space-y-16">
               {Array.from(new Set(filteredAid?.map((a: any) => a.schoolName))).map((schoolName: any) => (
                  <div key={schoolName} className="space-y-6">
                     <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                           <SchoolIcon size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">{schoolName}</h3>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAid?.filter((a: any) => a.schoolName === schoolName).map((std: any) => (
                           <div key={std.standardId} className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xl shadow-slate-900/5 p-8 space-y-6 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[40px] rounded-full pointer-events-none"></div>

                              <div className="flex justify-between items-start">
                                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Building2 size={24} />
                                 </div>
                                 <span className="bg-white/80 text-slate-500 border border-slate-200/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">Standard {std.standardName}</span>
                              </div>

                              <div>
                                 <h4 className="text-lg font-bold text-slate-800 tracking-tight">Standard {std.standardName} Aid</h4>
                                 <p className="text-xs font-semibold text-slate-500 mt-1">Annual Fee: ₹{parseFloat(std.fees).toLocaleString()}</p>
                              </div>

                              <div className="space-y-3 pt-2">
                                 {/* Zakat */}
                                 {std.zakatCount > 0 && (
                                    <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 group hover:bg-indigo-50 hover:border-indigo-200 transition-all cursor-pointer shadow-sm"
                                       onClick={() => {
                                          const needed = (std.fees * std.zakatCount) - std.zakatPaid;
                                          setSelectedItem({ ...std, id: std.standardId, type: 'ZAKAT', title: `Zakat Aid - ${std.standardName}`, amountNeeded: needed });
                                          setPaymentAmount(needed.toString());
                                          setIsPaymentModalOpen(true);
                                       }}
                                    >
                                       <div>
                                          <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Zakat Needy</p>
                                          <p className="text-sm font-bold text-slate-800">{std.zakatCount} Students</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[9px] font-semibold text-slate-400 uppercase">Remaining</p>
                                          <p className="text-sm font-bold text-indigo-600">₹{((std.fees * std.zakatCount) - std.zakatPaid).toLocaleString()}</p>
                                       </div>
                                    </div>
                                 )}

                                 {/* Sadka */}
                                 {std.sadkaCount > 0 && (
                                    <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100/50 group hover:bg-amber-50 hover:border-amber-200 transition-all cursor-pointer shadow-sm"
                                       onClick={() => {
                                          const needed = (std.fees * std.sadkaCount) - std.sadkaPaid;
                                          setSelectedItem({ ...std, id: std.standardId, type: 'SADKA', title: `Sadka Aid - ${std.standardName}`, amountNeeded: needed });
                                          setPaymentAmount(needed.toString());
                                          setIsPaymentModalOpen(true);
                                       }}
                                    >
                                       <div>
                                          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Sadka Needy</p>
                                          <p className="text-sm font-bold text-slate-800">{std.sadkaCount} Students</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[9px] font-semibold text-slate-400 uppercase">Remaining</p>
                                          <p className="text-sm font-bold text-amber-600">₹{((std.fees * std.sadkaCount) - std.sadkaPaid).toLocaleString()}</p>
                                       </div>
                                    </div>
                                 )}

                                 {/* Lillah */}
                                 {std.lillahCount > 0 && (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50 group hover:bg-emerald-50 hover:border-emerald-200 transition-all cursor-pointer shadow-sm"
                                       onClick={() => {
                                          const needed = (std.fees * std.lillahCount) - std.lillahPaid;
                                          setSelectedItem({ ...std, id: std.standardId, type: 'LILLAH', title: `Lillah Aid - ${std.standardName}`, amountNeeded: needed });
                                          setPaymentAmount(needed.toString());
                                          setIsPaymentModalOpen(true);
                                       }}
                                    >
                                       <div>
                                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Lillah Needy</p>
                                          <p className="text-sm font-bold text-slate-800">{std.lillahCount} Students</p>
                                       </div>
                                       <div className="text-right">
                                          <p className="text-[9px] font-semibold text-slate-400 uppercase">Remaining</p>
                                          <p className="text-sm font-bold text-emerald-600">₹{((std.fees * std.lillahCount) - std.lillahPaid).toLocaleString()}</p>
                                       </div>
                                    </div>
                                 )}

                                 <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 mt-2">
                                    <div>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Class Strength</p>
                                       <p className="text-xs font-semibold text-slate-600 mt-0.5">{std.totalStudentsCount || 0} Total Students</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Batch</p>
                                       <p className="text-xs font-semibold text-slate-600 mt-0.5">2026-2027</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Payment Modal */}
         {isPaymentModalOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
               <div className="bg-white/95 backdrop-blur-md w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-white/60 space-y-8 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                  <div className="space-y-1 relative">
                     <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Give Back & Donations</h3>
                     <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">{selectedItem?.title}</p>
                  </div>

                  <div className="space-y-6 relative">
                     <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1.5 block">Donation Amount (₹)</label>
                        <div className="relative group/input">
                           <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-500 transition-colors" />
                           <input
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl font-bold text-slate-800 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-inner"
                              placeholder="Enter amount to donate"
                           />
                        </div>
                     </div>

                     <div className="flex flex-col gap-3">
                        <button
                           disabled={isPaying || !paymentAmount}
                           onClick={handlePayment}
                           className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                           {isPaying ? (
                              <>
                                 <Loader2 size={18} className="animate-spin" />
                                 <span>Processing Donation...</span>
                              </>
                           ) : (
                              <>
                                 <Heart size={18} />
                                 <span>Donate ₹{paymentAmount || '0'} Securely</span>
                              </>
                           )}
                        </button>
                        <button onClick={() => setIsPaymentModalOpen(false)} className="py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-2xl transition-colors">
                           Cancel Transfer
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
