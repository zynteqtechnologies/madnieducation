'use client';

import React, { useState, useEffect } from 'react';
import { 
  School, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail, 
  Hash, 
  Calendar, 
  Layers,
  X,
  Loader2,
  ShieldCheck,
  ChevronRight,
  MoreVertical
} from 'lucide-react';

interface Trust {
  id: string;
  trustName: string;
}

interface SchoolData {
  id: string;
  schoolName: string;
  currentStudentsNo: number;
  address: string | null;
  phoneNo: string | null;
  email: string | null;
  medium: string | null;
  schoolDiseNo: string | null;
  isHaveRTE: boolean;
  sscIndexNo: string | null;
  hscIndexNo: string | null;
  establishYear: number | null;
  totalStandards: number | null;
  trustId: string;
  trustName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function SchoolManagement() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [trusts, setTrusts] = useState<Trust[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    schoolName: '',
    currentStudentsNo: '',
    address: '',
    phoneNo: '',
    email: '',
    medium: 'English',
    schoolDiseNo: '',
    isHaveRTE: false,
    sscIndexNo: '',
    hscIndexNo: '',
    establishYear: '',
    totalStandards: '',
    trustId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schoolsRes, trustsRes] = await Promise.all([
        fetch('/api/admin/schools'),
        fetch('/api/admin/trusts')
      ]);
      const schoolsData = await schoolsRes.json();
      const trustsData = await trustsRes.json();
      
      if (schoolsRes.ok) setSchools(schoolsData);
      if (trustsRes.ok) setTrusts(trustsData);
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

    const payload = {
      ...formData,
      id: editingSchool?.id,
      currentStudentsNo: parseInt(formData.currentStudentsNo) || 0,
      establishYear: formData.establishYear ? parseInt(formData.establishYear) : null,
      totalStandards: formData.totalStandards ? parseInt(formData.totalStandards) : null,
    };

    try {
      const res = await fetch('/api/admin/schools', {
        method: editingSchool ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingSchool(null);
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Sync failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this school record?')) return;
    try {
      const res = await fetch('/api/admin/schools', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Action aborted.');
    }
  };

  const handleEdit = (school: SchoolData) => {
    setEditingSchool(school);
    setFormData({
      schoolName: school.schoolName,
      currentStudentsNo: school.currentStudentsNo.toString(),
      address: school.address || '',
      phoneNo: school.phoneNo || '',
      email: school.email || '',
      medium: school.medium || 'English',
      schoolDiseNo: school.schoolDiseNo || '',
      isHaveRTE: school.isHaveRTE,
      sscIndexNo: school.sscIndexNo || '',
      hscIndexNo: school.hscIndexNo || '',
      establishYear: school.establishYear?.toString() || '',
      totalStandards: school.totalStandards?.toString() || '',
      trustId: school.trustId,
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      schoolName: '',
      currentStudentsNo: '',
      address: '',
      phoneNo: '',
      email: '',
      medium: 'English',
      schoolDiseNo: '',
      isHaveRTE: false,
      sscIndexNo: '',
      hscIndexNo: '',
      establishYear: '',
      totalStandards: '',
      trustId: trusts.length > 0 ? trusts[0].id : '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Institutional Registry</h2>
          <p className="text-sm text-slate-500 mt-1">Manage and audit institutional units.</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(true); setEditingSchool(null); resetForm(); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 transition font-semibold text-sm shadow-sm flex items-center"
        >
          <Plus size={18} className="mr-2" />
          <span>Register School</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center space-x-3 text-rose-700 text-sm">
           <ShieldCheck size={18} />
           <p>{error}</p>
        </div>
      )}

      {/* Simple List View */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">School Name</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Governed By</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Resource Stats</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && !schools.length ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-xs font-medium uppercase tracking-widest animate-pulse">Scanning Registry...</td></tr>
              ) : schools.length === 0 ? (
                <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">No units localized.</td></tr>
              ) : (
                schools.map(school => (
                  <tr key={school.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                       <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                             <School size={20} />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-slate-900 leading-tight">{school.schoolName}</p>
                             <p className="text-[10px] text-slate-500 mt-0.5 tracking-tight uppercase">DISE: {school.schoolDiseNo || 'NO-REF'}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <span className="text-xs font-semibold text-slate-600 flex items-center">
                          <Building2 size={14} className="mr-2 text-slate-300" /> {school.trustName || 'Floating'}
                       </span>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center space-x-4">
                          <div className="text-[10px] font-bold text-slate-400 flex items-center">
                             <Users size={14} className="mr-1.5" /> {school.currentStudentsNo} Students
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 flex items-center">
                             <Layers size={14} className="mr-1.5" /> {school.totalStandards} Standards
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEdit(school)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={16} /></button>
                          <button onClick={() => handleDelete(school.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-md shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-900">{editingSchool ? 'Update School Profile' : 'Register New School'}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Governing Trust</label>
                    <select required value={formData.trustId} onChange={e => setFormData({ ...formData, trustId: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm font-semibold text-indigo-600">
                      <option value="">Select Trust</option>
                      {trusts.map(t => <option key={t.id} value={t.id}>{t.trustName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">School Name</label>
                    <input type="text" required value={formData.schoolName} onChange={e => setFormData({ ...formData, schoolName: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 text-sm transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">DISE No</label>
                    <input type="text" value={formData.schoolDiseNo} onChange={e => setFormData({ ...formData, schoolDiseNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Medium</label>
                    <select value={formData.medium} onChange={e => setFormData({ ...formData, medium: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none">
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Marathi">Marathi</option>
                      <option value="Gujarati">Gujarati</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Est. Year</label>
                    <input type="number" value={formData.establishYear} onChange={e => setFormData({ ...formData, establishYear: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md border border-slate-100">
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SSC Index</label>
                      <input type="text" value={formData.sscIndexNo} onChange={e => setFormData({ ...formData, sscIndexNo: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HSC Index</label>
                      <input type="text" value={formData.hscIndexNo} onChange={e => setFormData({ ...formData, hscIndexNo: e.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-xs font-semibold" />
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Strength (Students)</label>
                    <input type="number" value={formData.currentStudentsNo} onChange={e => setFormData({ ...formData, currentStudentsNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Total Standards</label>
                    <input type="number" value={formData.totalStandards} onChange={e => setFormData({ ...formData, totalStandards: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                  </div>
                  <div className="flex items-center pt-6 px-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" checked={formData.isHaveRTE} onChange={e => setFormData({ ...formData, isHaveRTE: e.target.checked })} className="w-4 h-4 rounded text-indigo-600 accent-indigo-600" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">RTE Active</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Address</label>
                    <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm resize-none h-20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Phone</label>
                    <input type="text" value={formData.phoneNo} onChange={e => setFormData({ ...formData, phoneNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                  </div>
                </div>

                <div className="flex space-x-3 pt-6">
                   <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-md font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                   <button type="submit" disabled={loading} className="flex-[2] py-3 bg-indigo-600 text-white rounded-md font-bold text-sm tracking-tight shadow-md hover:bg-indigo-700 transition-all">
                     {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : <span>{editingSchool ? 'Apply Changes' : 'Complete Registration'}</span>}
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
