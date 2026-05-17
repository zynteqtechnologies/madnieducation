'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Calendar, 
  IndianRupee, 
  Upload, 
  FileVideo, 
  Image as ImageIcon, 
  Plus, 
  X, 
  Loader2, 
  Trash2,
  AlertCircle,
  Construction,
  PartyPopper,
  PlayCircle,
  ArrowUpRight,
  Search
} from 'lucide-react';

interface Expense {
  id: string;
  title: string;
  description: string | null;
  type: 'CONSTRUCTION' | 'EVENT';
  startDate: string | null;
  estimatedCost: string | number;
  paidAmount: string | number;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | null;
  createdAt: string;
}

export default function CostManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'CONSTRUCTION' as 'CONSTRUCTION' | 'EVENT',
    startDate: '',
    estimatedCost: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/costs');
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (err) {
      setError('Failed to load institutional costs.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this institutional cost log?')) return;
    try {
      const res = await fetch(`/api/subadmin/costs?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('type', formData.type);
    form.append('startDate', formData.startDate);
    form.append('estimatedCost', formData.estimatedCost);
    if (selectedFile) {
      form.append('media', selectedFile);
    }

    try {
      const res = await fetch('/api/subadmin/costs', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        fetchExpenses();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to sync institutional expense.');
      }
    } catch (err) {
      setError('Network synchronization error.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'CONSTRUCTION',
      startDate: '',
      estimatedCost: '',
    });
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalEstimated = expenses.reduce((sum, exp) => sum + parseFloat(exp.estimatedCost as string || '0'), 0);
  const totalPaid = expenses.reduce((sum, exp) => sum + parseFloat(exp.paidAmount as string || '0'), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         <div className="md:col-span-1 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 bg-emerald-600/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110">
               <PartyPopper size={24} />
            </div>
             <div>
                <p className="text-[11px] font-bold text-slate-500 tracking-tight">Expense registry</p>
                <p className="text-[10px] text-slate-400 mt-1 italic font-medium">Institutional audit flow</p>
             </div>
         </div>

         <div className="bg-[#1A3D63] p-8 rounded-[2rem] shadow-xl shadow-[#1A3D63]/20 space-y-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <p className="text-[11px] font-bold text-white/60 tracking-tight">Calculated exposure</p>
            <p className="text-3xl font-bold text-white tracking-tight">₹{totalEstimated.toLocaleString('en-IN')}</p>
            <div className="flex items-center space-x-2 pt-2 text-[10px] font-bold text-emerald-400 tracking-tight">
               <ArrowUpRight size={12} />
               <span>{expenses.length} logs active</span>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
            <p className="text-[11px] font-bold text-slate-500 tracking-tight">Settled amount</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{totalPaid.toLocaleString('en-IN')}</p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-emerald-500 rounded-full" style={{ width: totalEstimated > 0 ? `${(totalPaid / totalEstimated) * 100}%` : '0%' }}></div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-3">
            <p className="text-[11px] font-bold text-slate-500 tracking-tight">Remaining liquidity</p>
            <p className="text-3xl font-bold text-slate-900 tracking-tight">₹{(totalEstimated - totalPaid).toLocaleString('en-IN')}</p>
            <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
               <div className="h-full bg-indigo-500 rounded-full" style={{ width: totalEstimated > 0 ? `${((totalEstimated - totalPaid) / totalEstimated) * 100}%` : '0%' }}></div>
            </div>
         </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
         <div className="relative group w-full md:w-96">
            <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search expenses..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-emerald-500/5 transition-all"
            />
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center space-x-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-[0.98]"
         >
           <Plus size={20} />
           <span>Post new sync</span>
         </button>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-emerald-600" size={48} />
           <p className="text-[10px] font-medium text-slate-400 italic tracking-[0.3em]">Syncing Institutional Data...</p>
        </div>
      ) : (
      /* Expenses Table - Transitioned to Professional Grid */
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[35%]">Expense</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[15%]">Type</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[35%]">Costs</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-right w-[15%] pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-10 rounded-lg bg-slate-100 overflow-hidden relative border border-slate-200/50 flex-shrink-0">
                        {exp.mediaUrl ? (
                          exp.mediaType === 'IMAGE' ? (
                            <img src={exp.mediaUrl} alt={exp.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                               <video src={exp.mediaUrl} className="w-full h-full object-cover opacity-60" muted playsInline />
                               <PlayCircle size={14} className="text-white absolute" />
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             {exp.type === 'CONSTRUCTION' ? <Construction size={18} /> : <PartyPopper size={18} />}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-slate-700 leading-snug group-hover:text-emerald-600 transition-colors truncate">{exp.title}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium flex items-center italic">
                          <Calendar size={12} className="mr-1.5 opacity-50" />
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'Unscheduled'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${exp.type === 'CONSTRUCTION' ? 'bg-amber-50 text-amber-700 border-amber-100/50' : 'bg-emerald-50 text-emerald-700 border-emerald-100/50'}`}>
                       {exp.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 font-medium">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                          <span>Progress: {Math.round((parseFloat(exp.paidAmount as string || '0') / parseFloat(exp.estimatedCost as string)) * 100)}%</span>
                          <span className="text-slate-900">₹{parseFloat(exp.estimatedCost as string).toLocaleString('en-IN')}</span>
                       </div>
                       <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full" 
                            style={{ width: `${Math.min(100, Math.round((parseFloat(exp.paidAmount as string || '0') / parseFloat(exp.estimatedCost as string)) * 100))}%` }}
                          />
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-right pr-8">
                    <div className="flex items-center justify-end space-x-2">
                       <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="View details">
                          <AlertCircle size={16} />
                       </button>
                       <button 
                         onClick={() => handleDelete(exp.id)}
                         className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Remove log">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Modal Tool */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 tracking-tight">Institutional expense creator</h3>
                     <p className="text-[11px] font-medium text-slate-500 mt-1">Initialize construction/event tracking</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 p-2 rounded-full transition-all">
                     <X size={20} />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8">
                  {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-xl flex items-center space-x-3 text-sm font-bold animate-in shake duration-500">
                       <AlertCircle size={18} />
                       <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Title & Type */}
                     <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Expense title</label>
                        <input 
                          required
                          type="text" 
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="e.g., Computer Lab Extension"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Type</label>
                        <select 
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none appearance-none"
                        >
                           <option value="CONSTRUCTION">Construction</option>
                           <option value="EVENT">Event/Function</option>
                        </select>
                     </div>

                     {/* Start Date & Cost */}
                     <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Start date</label>
                        <input 
                          type="date" 
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Estimated cost (₹)</label>
                        <input 
                          required
                          type="number" 
                          value={formData.estimatedCost}
                          onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                          placeholder="Enter institutional budget"
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                        />
                     </div>

                     {/* Media Upload */}
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Visual documentation (Img/Video)</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-40 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center space-y-3 cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all overflow-hidden relative group"
                         >
                           {preview ? (
                              <img src={preview} className="absolute inset-0 w-full h-full object-cover" />
                           ) : selectedFile ? (
                              <div className="flex flex-col items-center">
                                <p className="text-xs font-bold text-slate-600 truncate px-4">{selectedFile.name}</p>
                              </div>
                           ) : (
                              <div className="flex flex-col items-center">
                                 <Upload size={24} className="text-slate-300 mb-2" />
                                 <p className="text-[11px] font-bold text-slate-400">Select institutional media</p>
                              </div>
                           )}
                           <input 
                             type="file" 
                             ref={fileInputRef}
                             onChange={handleFileChange}
                             accept="image/*,video/*"
                             className="hidden" 
                           />
                        </div>
                     </div>

                     {/* Description */}
                     <div className="md:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Expense description</label>
                        <textarea 
                          rows={4}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Institutional notes..."
                          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none resize-none"
                        />
                     </div>
                  </div>

                  <button 
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-[12px] shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3"
                  >
                     {submitting ? (
                       <Loader2 className="animate-spin" size={18} />
                     ) : (
                       <Plus size={18} />
                     )}
                     <span>Authorize institutional expense</span>
                  </button>
               </form>
            </div>
        </div>
      )}

    </div>
  );
}
