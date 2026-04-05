'use client';

import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  School as SchoolIcon, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Lock,
  X,
  Loader2,
  ChevronRight,
  Briefcase,
  Activity
} from 'lucide-react';

interface School {
  id: string;
  schoolName: string;
}

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  phoneNo: string | null;
  address: string | null;
  relation: string | null;
  schoolId: string | null;
  schoolName?: string;
}

export default function SubAdminManagement() {
  const [subadmins, setSubadmins] = useState<SubAdmin[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubAdmin, setEditingSubAdmin] = useState<SubAdmin | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    address: '',
    relation: '',
    schoolId: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subsRes, schoolsRes] = await Promise.all([
        fetch('/api/admin/subadmins'),
        fetch('/api/admin/schools')
      ]);
      const subsData = await subsRes.json();
      const schoolsData = await schoolsRes.json();
      
      if (subsRes.ok) setSubadmins(subsData);
      if (schoolsRes.ok) setSchools(schoolsData);
    } catch (err) {
      setError('Failed to sync officers.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/subadmins', {
        method: editingSubAdmin ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editingSubAdmin?.id
        }),
      });

      if (res.ok) {
        setShowAddForm(false);
        setEditingSubAdmin(null);
        resetForm();
        fetchData();
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Communication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('De-provision this officer?')) return;
    try {
      const res = await fetch('/api/admin/subadmins', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const handleEdit = (sub: SubAdmin) => {
    setEditingSubAdmin(sub);
    setFormData({
      name: sub.name,
      email: sub.email,
      password: '', // Don't show password
      phoneNo: sub.phoneNo || '',
      address: sub.address || '',
      relation: sub.relation || '',
      schoolId: sub.schoolId || '',
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phoneNo: '',
      address: '',
      relation: '',
      schoolId: '',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Administrative Officers</h2>
          <p className="text-sm text-slate-500 mt-1">Manage sub-admin access and unit assignments.</p>
        </div>
        <button 
          onClick={() => { setShowAddForm(true); setEditingSubAdmin(null); resetForm(); }}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-md hover:bg-indigo-700 transition font-semibold text-sm shadow-sm flex items-center"
        >
          <Plus size={18} className="mr-2" />
          <span>Provision Officer</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex items-center space-x-3 text-rose-700 text-sm">
           <ShieldCheck size={18} />
           <p>{error}</p>
        </div>
      )}

      {/* Officers Grid - Clean & Sober */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading && !subadmins.length ? (
           <div className="col-span-full py-20 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="animate-spin text-slate-400" size={32} />
              <p className="text-slate-400 text-xs font-medium">Loading officers...</p>
           </div>
        ) : subadmins.length === 0 ? (
           <div className="col-span-full py-20 bg-white border border-slate-200 rounded-md text-center text-slate-400 font-medium text-sm">
              No administrative officers provisioned.
           </div>
        ) : (
          subadmins.map(sub => (
            <div key={sub.id} className="bg-white rounded-md border border-slate-200 shadow-sm p-6 hover:border-indigo-200 transition-all group">
               <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 rounded-md bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <UserIcon size={24} />
                     </div>
                     <div>
                        <h4 className="text-base font-bold text-slate-900">{sub.name}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{sub.email}</p>
                     </div>
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleEdit(sub)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit3 size={16} /></button>
                     <button onClick={() => handleDelete(sub.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                  </div>
               </div>

               <div className="space-y-4 bg-slate-50 p-4 rounded-md">
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-400 font-bold uppercase tracking-wider">Assigned Unit</span>
                     <span className="text-slate-800 font-bold flex items-center truncate max-w-[150px]">
                        <SchoolIcon size={14} className="mr-2 text-slate-300" /> {sub.schoolName || 'Floating'}
                     </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="text-slate-400 font-bold uppercase tracking-wider">Designation</span>
                     <span className="text-slate-800 font-bold flex items-center">
                        <Briefcase size={14} className="mr-2 text-slate-300" /> {sub.relation || 'Administrator'}
                     </span>
                  </div>
               </div>

               <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center">
                     <Phone size={14} className="mr-2 text-slate-300" /> {sub.phoneNo || 'SECURE'}
                  </div>
                  <button onClick={() => handleEdit(sub)} className="text-indigo-600 font-bold flex items-center hover:underline">
                     Update Access <ChevronRight size={14} className="ml-1" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>

      {/* Simple Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-xl rounded-md shadow-2xl p-8 relative overflow-y-auto max-h-[90vh] no-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-900">{editingSubAdmin ? 'Update Officer Credentials' : 'Provision New Officer'}</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Official Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{editingSubAdmin ? 'New Password' : 'Password'}</label>
                    <input type="password" required={!editingSubAdmin} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-500 text-sm" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Contact Number</label>
                    <input type="text" value={formData.phoneNo} onChange={e => setFormData({ ...formData, phoneNo: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-md border border-slate-100">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider ml-1">Unit Assignment</label>
                    <select required value={formData.schoolId} onChange={e => setFormData({ ...formData, schoolId: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md text-xs font-bold text-indigo-600 outline-none">
                      <option value="">Select Command School</option>
                      {schools.map(s => <option key={s.id} value={s.id}>{s.schoolName}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider ml-1">Designation</label>
                    <input type="text" value={formData.relation} onChange={e => setFormData({ ...formData, relation: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-md text-xs font-bold" placeholder="Principal / Trustee" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Residential/Office Address</label>
                   <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm resize-none h-20" />
                </div>
                
                <div className="flex space-x-3 pt-6">
                   <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-md font-bold text-sm hover:bg-slate-200 transition-all">Cancel</button>
                   <button type="submit" disabled={loading} className="flex-[2] py-3 bg-indigo-600 text-white rounded-md font-bold text-sm tracking-tight shadow-md hover:bg-indigo-700 transition-all">
                     {loading ? <Loader2 className="animate-spin mx-auto" size={18} /> : <span>{editingSubAdmin ? 'Update Officer' : 'Provision Officer'}</span>}
                   </button>
                </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
