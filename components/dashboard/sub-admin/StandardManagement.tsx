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

interface AcademicYear {
  id: string;
  label: string;
  statusTag: string;
}

export default function StandardManagement() {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
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
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await fetch('/api/subadmin/academic-years');
      const data = await res.json();
      if (res.ok) setAcademicYears(data);
    } catch (err) {
      console.error(err);
    }
  };

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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100 mb-8">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Academic standards</h2>
          <p className="text-xs text-slate-500 font-medium tracking-tight">Grade configuration and institutional fee structures</p>
        </div>
        <button
          onClick={() => { setShowAddForm(true); setEditingStandard(null); resetForm(); }}
          className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition font-bold text-[12px] shadow-lg shadow-emerald-600/10 flex items-center w-fit"
        >
          <Plus size={18} className="mr-2" />
          <span>Add standard</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex items-center space-x-3 text-rose-700 text-xs font-semibold">
          <ShieldCheck size={16} />
          <p>{error}</p>
        </div>
      )}

      {/* Standards List - Transitioned to Professional Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[35%]">Grade</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[25%]">Fees</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[30%]">Batch</th>
                <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-right w-[10%] pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && !standards.length ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="animate-spin text-emerald-600 mx-auto" size={24} /></td></tr>
              ) : standards.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm italic">No academic standards localized.</td></tr>
              ) : (
                standards.map(std => (
                  <tr key={std.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100/50 border border-slate-200/60 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                          <Layers size={18} strokeWidth={1.5} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-bold text-slate-700 leading-snug">{std.standardName}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Div: {std.division || 'Main'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center space-x-1 font-bold text-slate-700">
                          <IndianRupee size={14} className="text-emerald-500" />
                          <span className="text-[14px]">{parseFloat(std.fees as string).toLocaleString('en-IN')}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-lg border border-emerald-100/50">
                          {std.batchYear || 'Floating'}
                       </span>
                    </td>
                    <td className="px-6 py-5 text-right pr-8">
                       <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                        <button onClick={() => handleEdit(std)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all" title="Modify Context">
                          <Edit3 size={15} />
                        </button>
                        <button onClick={() => handleDelete(std.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all" title="Delete Policy">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-10 relative border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{editingStandard ? 'Update grade context' : 'Define standard'}</h3>
                <p className="text-slate-400 text-xs font-medium mt-1">Institutional academic control center</p>
              </div>
              <button onClick={() => setShowAddForm(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Standard identity (e.g., 10th)</label>
                <input type="text" required value={formData.standardName} onChange={e => setFormData({ ...formData, standardName: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all" placeholder="Enter Grade" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Assigned divisions (e.g., A, B, C)</label>
                <input type="text" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all" placeholder="Separated by commas" />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Tuition fees (Annual)</label>
                <div className="relative group">
                  <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input type="number" required value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} className="w-full pl-12 pr-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all" placeholder="0.00" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 ml-1">Academic batch (e.g., 2024-25)</label>
                <select
                  value={formData.batchYear}
                  onChange={e => setFormData({ ...formData, batchYear: e.target.value })}
                  className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all"
                  required
                >
                  <option value="">Select an Academic Year</option>
                  {academicYears.map(year => (
                    <option key={year.id} value={year.label}>
                      {year.label} {year.statusTag ? `(${year.statusTag})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-6">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-xl font-bold text-[11px] hover:bg-slate-100 transition-all">Abort</button>
                <button type="submit" disabled={loading} className="flex-[2] py-4 bg-emerald-600 text-white rounded-xl font-bold text-[11px] shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-95">
                  {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : <span>{editingStandard ? 'Update policy' : 'Authorize standard'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
