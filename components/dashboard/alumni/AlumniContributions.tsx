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
        theme: { color: "#059669" }
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
        <Loader2 className="animate-spin text-emerald-600" size={48} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregating Institutional Needs...</p>
     </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center">
               <Globe className="mr-3 text-orange-600" size={28} />
               Institutional Support Hub
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Direct endowment for infrastructure & academic aid</p>
         </div>

         <div className="flex bg-slate-100 p-1.5 rounded-md border border-slate-200">
            <button 
              onClick={() => setActiveTab('construction')}
              className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'construction' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
            >
               Projects
            </button>
            <button 
              onClick={() => setActiveTab('aid')}
              className={`px-8 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'aid' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}
            >
               Financial Aid
            </button>
         </div>
      </div>

      {/* Search */}
      <div className="relative group w-full max-w-2xl mx-auto">
         <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
         <input 
           type="text" 
           placeholder="Search schools, standards, or projects..."
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-md text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 shadow-sm transition-all"
         />
      </div>

      {/* Content */}
      {activeTab === 'construction' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredExpenses?.map((exp: any) => (
             <div key={exp.id} className="bg-white rounded-md border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
                <div className="aspect-video relative bg-slate-50">
                   {exp.mediaUrl ? (
                      <img src={exp.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                         <Construction size={48} />
                      </div>
                   )}
                   <div className="absolute top-6 left-6">
                      <span className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                         {exp.schoolName}
                      </span>
                   </div>
                </div>
                <div className="p-10 space-y-8">
                   <div>
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-orange-600 transition-colors">{exp.title}</h4>
                      <p className="text-sm text-slate-500 font-medium mt-3 line-clamp-2">{exp.description}</p>
                   </div>
                   
                   <div className="space-y-3">
                      <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-400">Funding Level</span>
                         <span className="text-orange-600">₹{parseFloat(exp.paidAmount).toLocaleString()} / ₹{parseFloat(exp.estimatedCost).toLocaleString()}</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                         <div 
                           className="h-full bg-orange-500 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all duration-1000" 
                           style={{ width: `${(exp.paidAmount / exp.estimatedCost) * 100}%` }}
                         ></div>
                      </div>
                   </div>

                   <button 
                     onClick={() => {
                        setSelectedItem({...exp, type: 'CONSTRUCTION', title: exp.title, amountNeeded: exp.estimatedCost - exp.paidAmount});
                        setPaymentAmount((exp.estimatedCost - exp.paidAmount).toString());
                        setIsPaymentModalOpen(true);
                     }}
                     className="w-full py-5 bg-slate-900 text-white rounded-md text-xs font-black uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                   >
                      Contribute Now
                   </button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="space-y-16">
           {Array.from(new Set(filteredAid?.map((a: any) => a.schoolName))).map((schoolName: any) => (
             <div key={schoolName} className="space-y-8">
                <div className="flex items-center space-x-6">
                   <div className="w-16 h-1 bg-orange-600 rounded-full"></div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">{schoolName}</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredAid?.filter((a: any) => a.schoolName === schoolName).map((std: any) => (
                     <div key={std.standardId} className="bg-white rounded-md border border-slate-100 shadow-sm p-10 space-y-8 hover:shadow-2xl transition-all duration-500">
                        <div className="flex justify-between items-start">
                           <div className="w-14 h-14 bg-orange-600 rounded-md flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                              <SchoolIcon size={28} />
                           </div>
                           <span className="bg-slate-50 text-slate-400 border border-slate-100 px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest">{std.standardName}</span>
                        </div>

                        <div>
                           <h4 className="text-xl font-black text-slate-900 tracking-tight">Standard {std.standardName}</h4>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Annual Fee: ₹{parseFloat(std.fees).toLocaleString()}</p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-slate-50">
                           {/* Zakat */}
                           {std.zakatCount > 0 && (
                             <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-md border border-indigo-100/50 group hover:bg-indigo-50 transition-all cursor-pointer"
                               onClick={() => {
                                 const needed = (std.fees * std.zakatCount) - std.zakatPaid;
                                 setSelectedItem({ ...std, id: std.standardId, type: 'ZAKAT', title: `Zakat Aid - ${std.standardName}`, amountNeeded: needed });
                                 setPaymentAmount(needed.toString());
                                 setIsPaymentModalOpen(true);
                               }}
                             >
                                <div>
                                   <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Zakat Needy</p>
                                   <p className="text-sm font-black text-slate-900">{std.zakatCount} Students</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">Remaining</p>
                                   <p className="text-base font-black text-indigo-600">₹{((std.fees * std.zakatCount) - std.zakatPaid).toLocaleString()}</p>
                                </div>
                             </div>
                           )}

                           {/* Sadka */}
                           {std.sadkaCount > 0 && (
                             <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-md border border-amber-100/50 group hover:bg-amber-50 transition-all cursor-pointer"
                               onClick={() => {
                                 const needed = (std.fees * std.sadkaCount) - std.sadkaPaid;
                                 setSelectedItem({ ...std, id: std.standardId, type: 'SADKA', title: `Sadka Aid - ${std.standardName}`, amountNeeded: needed });
                                 setPaymentAmount(needed.toString());
                                 setIsPaymentModalOpen(true);
                               }}
                             >
                                <div>
                                   <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Sadka Needy</p>
                                   <p className="text-sm font-black text-slate-900">{std.sadkaCount} Students</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">Remaining</p>
                                   <p className="text-base font-black text-amber-600">₹{((std.fees * std.sadkaCount) - std.sadkaPaid).toLocaleString()}</p>
                                </div>
                             </div>
                           )}

                           {/* Lillah */}
                           {std.lillahCount > 0 && (
                             <div className="flex items-center justify-between p-4 bg-orange-50/50 rounded-md border border-orange-100/50 group hover:bg-orange-50 transition-all cursor-pointer"
                               onClick={() => {
                                 const needed = (std.fees * std.lillahCount) - std.lillahPaid;
                                 setSelectedItem({ ...std, id: std.standardId, type: 'LILLAH', title: `Lillah Aid - ${std.standardName}`, amountNeeded: needed });
                                 setPaymentAmount(needed.toString());
                                 setIsPaymentModalOpen(true);
                               }}
                             >
                                <div>
                                   <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Lillah Needy</p>
                                   <p className="text-sm font-black text-slate-900">{std.lillahCount} Students</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">Remaining</p>
                                   <p className="text-base font-black text-orange-600">₹{((std.fees * std.lillahCount) - std.lillahPaid).toLocaleString()}</p>
                                </div>
                             </div>
                           )}

                           {/* RTE Info */}
                           {std.rteCount > 0 && (
                             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-md border border-slate-100 italic">
                                <div>
                                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RTE Enrollment</p>
                                   <p className="text-xs font-bold text-slate-500">{std.rteCount} Students Sponsored</p>
                                </div>
                                <Info size={14} className="text-slate-300" />
                             </div>
                           )}
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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/60 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-md shadow-2xl p-10 space-y-8">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Support Transfer</h3>
                 <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">{selectedItem?.title}</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Contribution Amount (₹)</label>
                    <div className="relative">
                       <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-600" size={20} />
                       <input 
                         type="number" 
                         value={paymentAmount}
                         onChange={(e) => setPaymentAmount(e.target.value)}
                         className="w-full pl-14 pr-6 py-5 bg-orange-50/30 border-2 border-orange-100 rounded-md text-3xl font-black text-orange-700 outline-none focus:bg-white focus:border-orange-500 transition-all tracking-tighter"
                       />
                    </div>
                 </div>

                 <div className="flex flex-col gap-4">
                    <button 
                      disabled={isPaying}
                      onClick={handlePayment}
                      className="w-full bg-orange-600 text-white font-black py-6 rounded-md text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                       {isPaying ? <Loader2 className="animate-spin mx-auto" /> : "Verify & Settle"}
                    </button>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
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
