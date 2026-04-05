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
  PlayCircle
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
    type: 'CONSTRUCTION',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null); // No preview for videos yet
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

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Institutional Cost Management</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Construction & Events Budget Tracking</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-md shadow-xl shadow-emerald-600/20 transition-all flex items-center space-x-2 active:scale-95"
        >
          <Plus size={18} />
          <span>Post New Sync</span>
        </button>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center space-y-4">
           <Loader2 className="animate-spin text-emerald-600" size={48} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Institutional Data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {expenses.map((exp) => (
             <div key={exp.id} className="bg-white rounded-md border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 group overflow-hidden">
                {/* Media Section */}
                <div className="aspect-video relative overflow-hidden bg-slate-100">
                   {exp.mediaUrl ? (
                      exp.mediaType === 'IMAGE' ? (
                        <img src={exp.mediaUrl} alt={exp.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 overflow-hidden relative">
                           <video src={exp.mediaUrl} className="w-full h-full object-cover opacity-60" muted autoPlay loop playsInline />
                           <PlayCircle size={48} className="text-white absolute z-10" />
                        </div>
                      )
                   ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-200">
                         {exp.type === 'CONSTRUCTION' ? <Construction size={48} /> : <PartyPopper size={48} />}
                      </div>
                   )}
                   <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg ${exp.type === 'CONSTRUCTION' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                         {exp.type}
                      </span>
                   </div>
                </div>

                {/* Info Section */}
                <div className="p-8 space-y-6">
                   <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">{exp.title}</h3>
                      <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{exp.description || 'No description provided for this institutional synchronization.'}</p>
                   </div>

                   <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-50">
                      <div className="flex items-center space-x-3">
                         <div className="bg-slate-50 p-2 rounded-md text-slate-400">
                            <Calendar size={14} />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Start Date</p>
                            <p className="text-[11px] font-bold text-slate-700">{exp.startDate ? new Date(exp.startDate).toLocaleDateString() : 'TBD'}</p>
                         </div>
                      </div>
                      <div className="flex items-center space-x-3">
                         <div className="bg-rose-50 p-2 rounded-md text-rose-600">
                            <IndianRupee size={14} />
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[8px] font-black text-rose-600 uppercase tracking-widest leading-none">Remaining Balance</p>
                            <p className="text-[11px] font-black text-slate-900 tracking-tighter">
                               ₹{(parseFloat(exp.estimatedCost as string) - parseFloat(exp.paidAmount as string || '0')).toLocaleString('en-IN')}
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Progress Bar */}
                   <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                         <span>Collection Progress</span>
                         <span className="text-emerald-600">
                           {Math.round((parseFloat(exp.paidAmount as string || '0') / parseFloat(exp.estimatedCost as string)) * 100)}%
                         </span>
                      </div>
                      <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-emerald-500 transition-all duration-1000" 
                           style={{ width: `${Math.min(100, Math.round((parseFloat(exp.paidAmount as string || '0') / parseFloat(exp.estimatedCost as string)) * 100))}%` }}
                         />
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Modal Tool */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Institutional Expense Creator</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initialize Construction/Event Tracking</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 p-2 rounded-full transition-all">
                    <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="p-10 overflow-y-auto space-y-8">
                 {error && (
                   <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-md flex items-center space-x-3 text-sm font-bold animate-in shake duration-500">
                      <AlertCircle size={18} />
                      <span>{error}</span>
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Title & Type */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Expense Title</label>
                       <input 
                         required
                         type="text" 
                         value={formData.title}
                         onChange={(e) => setFormData({...formData, title: e.target.value})}
                         placeholder="e.g., Computer Lab Extension"
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Type</label>
                       <select 
                         value={formData.type}
                         onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none appearance-none"
                       >
                          <option value="CONSTRUCTION">Construction</option>
                          <option value="EVENT">Event/Function</option>
                       </select>
                    </div>

                    {/* Start Date & Cost */}
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Start Date</label>
                       <input 
                         type="date" 
                         value={formData.startDate}
                         onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Estimated Cost (₹)</label>
                       <input 
                         required
                         type="number" 
                         value={formData.estimatedCost}
                         onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                         placeholder="Enter institutional budget"
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none uppercase tracking-tighter"
                       />
                    </div>

                    {/* Media Upload */}
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Visual Documentation (Img/Video)</label>
                       <div 
                         onClick={() => fileInputRef.current?.click()}
                         className="w-full h-40 border-2 border-dashed border-slate-100 rounded-md flex flex-col items-center justify-center space-y-3 cursor-pointer hover:border-emerald-200 hover:bg-emerald-50/30 transition-all overflow-hidden relative group"
                        >
                          {preview ? (
                             <img src={preview} className="absolute inset-0 w-full h-full object-cover" />
                          ) : selectedFile ? (
                             <>
                               <div className="bg-emerald-50 p-4 rounded-full text-emerald-600">
                                  {selectedFile.type.startsWith('video') ? <FileVideo size={24} /> : <ImageIcon size={24} />}
                               </div>
                               <p className="text-xs font-black text-slate-600 uppercase tracking-tighter whitespace-nowrap">{selectedFile.name}</p>
                             </>
                          ) : (
                             <>
                               <div className="bg-slate-50 shadow-inner p-4 rounded-full text-slate-400 group-hover:scale-110 transition-transform">
                                  <Upload size={24} />
                               </div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Institutional Media</p>
                             </>
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
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Expense Description</label>
                       <textarea 
                         rows={4}
                         value={formData.description}
                         onChange={(e) => setFormData({...formData, description: e.target.value})}
                         placeholder="Institutional notes and project scope..."
                         className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none resize-none"
                       />
                    </div>
                 </div>

                 <button 
                   disabled={submitting}
                   type="submit"
                   className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-5 rounded-md shadow-2xl shadow-emerald-600/20 transition-all flex items-center justify-center space-x-3 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                 >
                    {submitting ? (
                      <Loader2 className="animate-spin text-white/50" />
                    ) : (
                      <Plus className="group-hover:rotate-90 transition-transform" />
                    )}
                    <span className="uppercase tracking-[0.25em] text-xs">Sync Expense to Institutional Vault</span>
                 </button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
