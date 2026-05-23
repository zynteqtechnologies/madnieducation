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
    <div className="lg:h-full lg:overflow-hidden flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0">
         <div className="bg-white px-4 py-3 rounded-md border border-slate-100 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-amber-50 rounded-md flex items-center justify-center text-[#dac48b] shrink-0">
               <PartyPopper size={18} />
            </div>
             <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1">Expense Registry</p>
                <p className="text-[10px] text-slate-400 font-medium italic">Institutional audit flow</p>
             </div>
         </div>

         <div className="bg-white px-4 py-3 rounded-md border border-slate-100 shadow-sm flex items-center space-x-3 group relative overflow-hidden">
            <div className="w-10 h-10 bg-slate-900 rounded-md flex items-center justify-center text-white shrink-0">
               <ArrowUpRight size={18} />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1">Calculated Exposure</p>
               <p className="text-sm font-bold text-slate-900 tracking-tight">₹{totalEstimated.toLocaleString('en-IN')}</p>
            </div>
         </div>

         <div className="bg-white px-4 py-3 rounded-md border border-slate-100 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 shrink-0">
               <IndianRupee size={18} />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1">Settled Amount</p>
               <p className="text-sm font-bold text-slate-900 tracking-tight">₹{totalPaid.toLocaleString('en-IN')}</p>
            </div>
         </div>

         <div className="bg-white px-4 py-3 rounded-md border border-slate-100 shadow-sm flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-50 rounded-md flex items-center justify-center text-rose-500 shrink-0">
               <Construction size={18} />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-none mb-1">Remaining Liquidity</p>
               <p className="text-sm font-bold text-slate-900 tracking-tight">₹{(totalEstimated - totalPaid).toLocaleString('en-IN')}</p>
            </div>
         </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-5 py-3 rounded-md border border-slate-200 shadow-sm shrink-0">
         <div className="relative group w-full sm:w-80">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#dac48b] transition-colors" />
            <input 
              type="text" 
              placeholder="Search expenses..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100/80 border border-slate-200/60 rounded-md outline-none focus:ring-2 focus:ring-[#dac48b]/20 focus:bg-white text-xs transition-all"
            />
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="flex items-center space-x-2 bg-[#18181b] text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-black transition-all active:scale-[0.98] shrink-0"
         >
           <Plus size={16} />
           <span>Post New Sync</span>
         </button>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-white rounded-md border border-slate-100 shadow-sm">
           <Loader2 className="animate-spin text-[#dac48b]" size={32} />
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Syncing Institutional Data...</p>
        </div>
      ) : (
      /* Expenses Table Container */
      <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="overflow-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse text-[11px] min-w-[800px]">
            <thead className="bg-slate-50 sticky top-0 z-20 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[#dac48b] font-bold uppercase tracking-wider">Expense Details</th>
                <th className="px-6 py-4 text-[#dac48b] font-bold uppercase tracking-wider text-center">Type</th>
                <th className="px-6 py-4 text-[#dac48b] font-bold uppercase tracking-wider">Financial Status</th>
                <th className="px-6 py-4 text-[#dac48b] font-bold uppercase tracking-wider text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-8 rounded bg-slate-100 overflow-hidden relative border border-slate-200/50 flex-shrink-0">
                        {exp.mediaUrl ? (
                          exp.mediaType === 'IMAGE' ? (
                            <img src={exp.mediaUrl} alt={exp.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                               <video src={exp.mediaUrl} className="w-full h-full object-cover opacity-60" muted playsInline />
                               <PlayCircle size={12} className="text-white absolute" />
                            </div>
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             {exp.type === 'CONSTRUCTION' ? <Construction size={16} /> : <PartyPopper size={16} />}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-700 leading-snug group-hover:text-black transition-colors truncate">{exp.title}</p>
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
                          className="w-full px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#dac48b]/20 focus:bg-white text-sm font-bold transition-all outline-none"
                        />
                     </div>
                     <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 ml-2">Type</label>
                        <select 
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                          className="w-full px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#dac48b]/20 focus:bg-white text-sm font-bold transition-all outline-none appearance-none"
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
                          className="w-full px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#dac48b]/20 focus:bg-white text-sm font-bold transition-all outline-none"
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
                          className="w-full px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#dac48b]/20 focus:bg-white text-sm font-bold transition-all outline-none"
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
                          className="w-full px-6 py-4 rounded-xl focus:ring-2 focus:ring-[#dac48b]/20 focus:bg-white text-sm font-bold transition-all outline-none resize-none"
                        />
                     </div>
                  </div>

                  <button 
                    disabled={submitting}
                    type="submit"
                    className="w-full bg-[#18181b] text-white py-4 rounded-xl font-bold text-[12px] shadow-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center space-x-3 uppercase tracking-widest"
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
