'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  X,
  Loader2,
  ChevronRight,
  IndianRupee,
  Activity
} from 'lucide-react';

interface Standard {
  id: string;
  standardName: string;
  division: string | null;
  fees: string | number;
  batchYear: string | null;
}

export default function StandardManagement() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStandard, setEditingStandard] = useState<Standard | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    standardName: '',
    division: '',
    fees: '',
    batchYear: '',
  });

  useEffect(() => {
    fetchStandards();
  }, []);

  const fetchStandards = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/subadmin/standards');
      const data = await res.json();
      if (res.ok) setStandards(data);
      else setError(data.error);
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/subadmin/standards', {
        method: editingStandard ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          fees: parseFloat(formData.fees) || 0,
          id: editingStandard?.id
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingStandard(null);
        resetForm();
        fetchStandards();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Network synchronization error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this academic standard?')) return;
    try {
      const res = await fetch('/api/subadmin/standards', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchStandards();
    } catch (err) {
      alert('Deletion sequence failed.');
    }
  };

  const handleEdit = (std: Standard) => {
    setEditingStandard(std);
    setFormData({
      standardName: std.standardName,
      division: std.division || '',
      fees: std.fees.toString(),
      batchYear: std.batchYear || '',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      standardName: '',
      division: '',
      fees: '',
      batchYear: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic Standards</h2>
          <p className="text-sm text-slate-500 mt-1 uppercase text-[10px] tracking-widest font-black">Grade Configuration & Fee Structure</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(true); setEditingStandard(null); resetForm(); }}
          className="bg-emerald-600 text-white px-6 py-3 rounded-md hover:bg-emerald-700 transition font-bold text-xs shadow-sm flex items-center active:scale-95 transition-all"
        >
          <Plus size={16} className="mr-2" />
          <span>Config Standard</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex items-center space-x-3 text-rose-700 text-xs font-semibold">
           <ShieldCheck size={16} />
           <p>{error}</p>
        </div>
      )}

      {/* Standards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading && !standards.length ? (
           <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Retrieving Configurations...</p>
           </div>
        ) : standards.length === 0 ? (
           <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-md text-center text-slate-400 font-bold text-xs uppercase tracking-widest italic">
              No academic standards localized.
           </div>
        ) : (
          standards.map(std => (
            <div key={std.id} className="bg-white rounded-md border border-slate-200 shadow-sm p-6 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 group">
               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                        <Layers size={22} />
                     </div>
                     <div>
                        <h4 className="text-base font-black text-slate-900 tracking-tight">{std.standardName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-100 uppercase tracking-tighter">DIV: {std.division || 'MAIN'}</span>
                           <span className="text-[10px] font-black text-emerald-600 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-100 uppercase tracking-tighter">{std.batchYear || 'NO BATCH'}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex space-x-1">
                     <button onClick={() => handleEdit(std)} className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"><Edit3 size={16} /></button>
                     <button onClick={() => handleDelete(std.id)} className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Trash2 size={16} /></button>
                  </div>
               </div>

               <div className="bg-slate-50/50 p-4 rounded-md border border-slate-50">
                  <div className="flex justify-between items-center">
                     <div className="space-y-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Base Tuition Fee</p>
                        <p className="text-base font-black text-slate-900 flex items-center truncate">
                           <IndianRupee size={14} className="mr-1 text-emerald-500" />
                           {parseFloat(std.fees as string).toLocaleString('en-IN')}
                        </p>
                     </div>
                     <Activity size={20} className="text-slate-100 group-hover:text-amber-400 transition-colors" />
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID-LINK: {std.id.slice(0,8)}</span>
                  <button onClick={() => handleEdit(std)} className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform">
                     Modify Config <ChevronRight size={14} className="ml-1" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Config Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-md shadow-2xl p-10 relative border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight">{editingStandard ? 'Update Grade Config' : 'Define Standard'}</h3>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Academic Control Center</p>
                </div>
                <button onClick={() => setShowAddForm(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Standard Identity (e.g., 10th)</label>
                  <input type="text" required value={formData.standardName} onChange={e => setFormData({ ...formData, standardName: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all" placeholder="Enter Grade" />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Divisions (e.g., A, B, C)</label>
                  <input type="text" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all" placeholder="Separated by commas" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tuition Fees (Annual)</label>
                  <div className="relative group">
                     <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                     <input type="number" required value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-black transition-all" placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Batch (e.g., 2024-25)</label>
                  <input type="text" value={formData.batchYear} onChange={e => setFormData({ ...formData, batchYear: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all" placeholder="Enter Batch Year" />
                </div>
                
                <div className="flex space-x-3 pt-6">
                   <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Abort</button>
                   <button type="submit" disabled={loading} className="flex-[2] py-4 bg-emerald-600 text-white rounded-md font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95">
                     {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : <span>{editingStandard ? 'Rewrite Config' : 'Authorize Standard'}</span>}
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
