'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar,
  User as UserIcon,
  Phone,
  Hash,
  X,
  Loader2,
  ShieldCheck,
  MoreVertical,
  ChevronRight
} from 'lucide-react';

interface Trust {
  id: string;
  trustName: string;
  registrationNo: string;
  establishmentYear: number | null;
  presidentName: string | null;
  presidentNo: string | null;
  trusteesName: string[];
  trusteesNo: string[];
  createdAt: string;
  updatedAt: string;
}

export default function TrustManagement() {
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTrust, setEditingTrust] = useState<Trust | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    trustName: '',
    registrationNo: '',
    establishmentYear: '',
    presidentName: '',
    presidentNo: '',
    trusteesName: '', 
    trusteesNo: '', 
  });

  useEffect(() => {
    fetchTrusts();
  }, []);

  const fetchTrusts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/trusts');
      const data = await res.json();
      if (res.ok) setTrusts(data);
      else setError(data.error);
    } catch (err) {
      setError('Communication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      ...formData,
      id: editingTrust?.id,
      establishmentYear: formData.establishmentYear ? parseInt(formData.establishmentYear) : null,
      trusteesName: formData.trusteesName.split(',').map(s => s.trim()).filter(Boolean),
      trusteesNo: formData.trusteesNo.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/admin/trusts', {
        method: editingTrust ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingTrust(null);
        resetForm();
        fetchTrusts();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this trust?')) return;
    try {
      const res = await fetch('/api/admin/trusts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchTrusts();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleEdit = (trust: Trust) => {
    setEditingTrust(trust);
    setFormData({
      trustName: trust.trustName,
      registrationNo: trust.registrationNo,
      establishmentYear: trust.establishmentYear?.toString() || '',
      presidentName: trust.presidentName || '',
      presidentNo: trust.presidentNo || '',
      trusteesName: trust.trusteesName.join(', '),
      trusteesNo: trust.trusteesNo.join(', '),
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      trustName: '',
      registrationNo: '',
      establishmentYear: '',
      presidentName: '',
      presidentNo: '',
      trusteesName: '',
      trusteesNo: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Trust Organizations</h2>
          <p className="text-sm text-slate-500 mt-1">Manage institutional trusts and governing bodies.</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(true); setEditingTrust(null); resetForm(); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 transition font-semibold text-sm shadow-sm flex items-center"
        >
          <Plus size={18} className="mr-2" />
          <span>New Trust</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex items-center space-x-3 text-rose-700 text-sm">
           <ShieldCheck size={18} />
           <p>{error}</p>
        </div>
      )}

      {/* Trust Cards - Simple & Sober */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && !trusts.length ? (
           <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-slate-400" size={32} />
              <p className="text-slate-400 text-xs font-medium">Loading trusts...</p>
           </div>
        ) : trusts.length === 0 ? (
           <div className="col-span-full py-20 bg-white border border-slate-200 rounded-md text-center text-slate-400 font-medium text-sm">
              No trusts registered.
           </div>
        ) : (
          trusts.map(trust => (
            <div key={trust.id} className="bg-white rounded-md border border-slate-200 shadow-sm p-6 hover:border-indigo-200 transition-all group">
               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Building2 size={24} />
                     </div>
                     <div>
                        <h4 className="text-base font-bold text-slate-900">{trust.trustName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                           <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">REG: {trust.registrationNo}</span>
                           {trust.establishmentYear && <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-50 rounded border border-slate-100">EST: {trust.establishmentYear}</span>}
                        </div>
                     </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleEdit(trust)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"><Edit3 size={16} /></button>
                     <button onClick={() => handleDelete(trust.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"><Trash2 size={16} /></button>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-md">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">President</p>
                     <p className="text-sm font-semibold text-slate-800">{trust.presidentName || 'N/A'}</p>
                     <p className="text-xs text-slate-500 mt-0.5">{trust.presidentNo || 'No contact'}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Governance</p>
                     <p className="text-sm font-semibold text-slate-800">{trust.trusteesName.length} Trustees</p>
                     <p className="text-xs text-slate-400 mt-0.5">{trust.trusteesName.slice(0, 2).join(', ')}</p>
                  </div>
               </div>

               <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[10px] font-medium text-slate-400">Record ID: {trust.id.slice(0,8)}</span>
                  <button onClick={() => handleEdit(trust)} className="text-indigo-600 text-[11px] font-bold flex items-center hover:underline">
                     Update Identity <ChevronRight size={14} className="ml-1" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Simple Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-md shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-900">{editingTrust ? 'Update Trust Record' : 'Register New Trust'}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Trust Name</label>
                    <input type="text" required value={formData.trustName} onChange={e => setFormData({ ...formData, trustName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-sm transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Registration No</label>
                    <input type="text" required value={formData.registrationNo} onChange={e => setFormData({ ...formData, registrationNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-sm transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Est. Year</label>
                    <input type="number" value={formData.establishmentYear} onChange={e => setFormData({ ...formData, establishmentYear: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-sm transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">President Name</label>
                    <input type="text" value={formData.presidentName} onChange={e => setFormData({ ...formData, presidentName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">President Contact</label>
                    <input type="text" value={formData.presidentNo} onChange={e => setFormData({ ...formData, presidentNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Trustees Names (Comma separated)</label>
                  <textarea value={formData.trusteesName} onChange={e => setFormData({ ...formData, trusteesName: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm resize-none h-24" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Trustees Contacts (Comma separated)</label>
                  <textarea value={formData.trusteesNo} onChange={e => setFormData({ ...formData, trusteesNo: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm resize-none h-24" />
                </div>
                
                <div className="flex space-x-3 pt-6">
                   <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-md font-bold text-sm tracking-tight hover:bg-slate-200 transition-all">Cancel</button>
                   <button type="submit" disabled={loading} className="flex-[2] py-3 bg-indigo-600 text-white rounded-md font-bold text-sm tracking-tight shadow-md hover:bg-indigo-700 transition-all">
                     {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : <span>{editingTrust ? 'Apply Changes' : 'Complete Registration'}</span>}
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
