'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TrustManagement from '@/components/dashboard/super-admin/TrustManagement';
import SchoolManagement from '@/components/dashboard/super-admin/SchoolManagement';
import SubAdminManagement from '@/components/dashboard/super-admin/SubAdminManagement';
import { 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  MoreVertical,
  Building2,
  School,
  GraduationCap,
  Loader2,
  ArrowUpRight,
  Activity,
  History,
  Info,
  X
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function SuperAdminDashboard() {
  const [activeView, setActiveView] = useState('Dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeUserTab, setActiveUserTab] = useState('All Users');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'ALUMNI' });
  const [systemStats, setSystemStats] = useState({ totalUsers: 0, activeTrusts: 0, totalSchools: 0, alumniBase: 0 });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (res.ok) setSystemStats(data);
    } catch (err) {}
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) setUsers(data);
      else setError(data.error);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ email: '', password: '', name: '', role: 'ALUMNI' });
        setShowAddForm(false);
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert('Action failed.');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) fetchUsers();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  const stats = [
    { label: 'Total Users', value: systemStats.totalUsers, icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Trusts', value: systemStats.activeTrusts, icon: <Building2 size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Schools', value: systemStats.totalSchools, icon: <School size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Alumni Base', value: systemStats.alumniBase, icon: <GraduationCap size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Simple Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-md shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
               <div className={`p-3 rounded-md ${stat.bg} ${stat.color}`}>
                 {stat.icon}
               </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Recent Users Table */}
         <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-lg font-bold text-slate-800">System Activity</h3>
               <button onClick={() => setActiveView('Subadmins')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">See all</button>
            </div>
            
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">User Details</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                       <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {loading ? (
                        <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm">Loading activity...</td></tr>
                     ) : users.slice(0, 5).map(user => (
                       <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                             <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">{user.name[0]}</div>
                                <div>
                                   <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                                   <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">{user.role}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="w-2 h-2 rounded-full bg-emerald-500 ml-auto mr-4"></div>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
               </div>
            </div>
         </div>

         {/* Quick Actions */}
         <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 px-2">Operations</h3>
            <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm space-y-4">
               <p className="text-sm text-slate-500">Quickly add new entities to the system.</p>
               <div className="space-y-2">
                  <button onClick={() => setActiveView('Trusts')} className="w-full flex items-center justify-center py-3 bg-indigo-600 text-white rounded-md text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm">
                     <Plus size={18} className="mr-2" /> Add New Trust
                  </button>
                  <button onClick={() => setActiveView('Schools')} className="w-full flex items-center justify-center py-3 bg-white text-slate-700 border border-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                     <Plus size={18} className="mr-2" /> Register School
                  </button>
               </div>
            </div>

            <div className="bg-white p-6 rounded-md border border-slate-200 shadow-sm">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Infrastructure Status</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-600 font-medium">Database Link</span>
                     <span className="text-emerald-600 font-bold">Stable</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-slate-600 font-medium">Auth System</span>
                     <span className="text-emerald-600 font-bold">Online</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Identity Management</h2>
            <p className="text-sm text-slate-500 mt-1">Manage system user accounts and roles.</p>
         </div>
         <button onClick={() => setShowAddForm(true)} className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-bold text-sm tracking-tight hover:bg-indigo-700 transition-all shadow-sm flex items-center">
            <Plus size={18} className="mr-2" /> Create Identity
         </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-md">
               {['All Users', 'SUPER_ADMIN', 'SUB_ADMIN', 'ALUMNI'].map(t => (
                  <button key={t} onClick={() => setActiveUserTab(t)} className={`px-4 py-2 rounded-md text-[11px] font-bold tracking-tight uppercase transition-all ${activeUserTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t.replace('_', ' ')}</button>
               ))}
             </div>
             <div className="relative w-full max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search identities..." className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2 text-sm outline-none focus:bg-white transition-all" />
             </div>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                     <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Name & Email</th>
                     <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role Authority</th>
                     <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Established Date</th>
                     <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {users.filter(u => activeUserTab === 'All Users' || u.role === activeUserTab).map(u => (
                     <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-6 py-4">
                           <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 border border-slate-200">{u.name[0]}</div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{u.name}</p>
                                 <p className="text-xs text-slate-500">{u.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-[11px] font-bold px-2 py-1 bg-slate-50 text-slate-600 rounded border border-slate-200 uppercase tracking-tight">{u.role}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button onClick={() => handleDeleteUser(u.id)} className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Super Admin Dashboard" 
      role="SUPER_ADMIN" 
      activeItem={activeView} 
      onNavigate={setActiveView}
    >
      <div className="space-y-6">
         {activeView === 'Dashboard' && renderOverview()}
         {activeView === 'Trusts' && <TrustManagement />}
         {activeView === 'Schools' && <SchoolManagement />}
         {activeView === 'Subadmins' && <SubAdminManagement />}
         {(activeView === 'Alumnis' || activeView === 'Activity') && renderUsers()}
      </div>
      
      {/* Create User Modal - Simple */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-md rounded-md shadow-2xl p-6 md:p-8 border border-slate-200 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Create New Identity</h3>
                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-5">
                 <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Identity Name</label>
                    <input type="text" required placeholder="Full name..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white text-sm transition-all" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Communication Link (Email)</label>
                    <input type="email" required placeholder="name@domain.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white text-sm transition-all" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Password Key</label>
                    <input type="password" required placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white text-sm transition-all" />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">Role Designation</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none text-sm transition-all">
                       <option value="SUPER_ADMIN">Super Admin Authority</option>
                       <option value="SUB_ADMIN">Sub Admin Officer</option>
                       <option value="ALUMNI">Alumni Identity</option>
                    </select>
                 </div>
                 <div className="flex space-x-3 pt-4">
                    <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-md font-bold text-sm tracking-tight hover:bg-slate-200 transition-all">Cancel</button>
                    <button type="submit" className="flex-[2] bg-indigo-600 text-white rounded-md py-3 font-bold text-sm tracking-tight shadow-md shadow-indigo-100 hover:bg-indigo-700 transition-all">Add User Account</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </DashboardLayout>
  );
}
