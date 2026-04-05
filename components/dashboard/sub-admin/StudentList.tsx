'use client';

import React, { useState, useEffect } from 'react';
import StudentDetailsModal from '../../ui/StudentDetailsModal';
import Pagination from '../../ui/Pagination';
import { 
  Users, 
  Search, 
  Filter, 
  BookOpen, 
  Download,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  studentCode: string | null;
  currentClass: string | null;
  section: string | null;
  standardName: string | null;
  division: string | null;
  contactNo: string | null;
  gender: string | null;
  admissionDate: string | null;
}

interface Standard {
  id: string;
  standardName: string;
  division: string | null;
}

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchStandards();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [selectedStandardId]);

  const fetchStandards = async () => {
    try {
      const res = await fetch('/api/subadmin/standards');
      if (res.ok) {
        const data = await res.json();
        setStandards(data);
      }
    } catch (err) {
      console.error('Failed to fetch standards');
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const url = selectedStandardId 
        ? `/api/subadmin/students?standardId=${selectedStandardId}` 
        : '/api/subadmin/students';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        setError('Failed to load students');
      }
    } catch (err) {
      setError('Network communication error');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.studentCode && s.studentCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStandardId]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
         <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Registry</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Manage Institutional Records</p>
         </div>

         <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search students..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 w-full md:min-w-[300px] text-sm font-bold shadow-sm transition-all"
               />
            </div>

            {/* Standard Filter */}
            <div className="relative group">
               <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <select 
                 value={selectedStandardId}
                 onChange={(e) => setSelectedStandardId(e.target.value)}
                 className="pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-200 text-sm font-bold shadow-sm transition-all appearance-none cursor-pointer"
               >
                  <option value="">All Standards</option>
                  {standards.map(std => (
                    <option key={std.id} value={std.id}>{std.standardName} {std.division ? `(${std.division})` : ''}</option>
                  ))}
               </select>
            </div>

            <button className="p-3 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm">
               <Download size={20} />
            </button>
         </div>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-md border border-slate-100 shadow-sm overflow-hidden">
         {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
               <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Registry...</p>
            </div>
         ) : error ? (
            <div className="py-20 flex flex-col items-center justify-center text-rose-500">
               <AlertCircle size={40} className="mb-4" />
               <p className="text-sm font-bold uppercase tracking-widest">{error}</p>
            </div>
         ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center">
               <Users size={48} className="mx-auto text-slate-200 mb-4" />
               <h3 className="text-lg font-bold text-slate-900">No records found</h3>
               <p className="text-slate-400 text-sm">Try adjusting your filters or search query.</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-slate-50/50">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Student Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Standard / Grade</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">Contact Details</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">Registry Tools</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {paginatedStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex items-center space-x-4">
                                 <div className="w-12 h-12 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-base shadow-inner group-hover:scale-110 transition-transform">
                                    {s.name[0]}
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-black text-slate-900 leading-tight">{s.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Code: {s.studentCode || 'N/A'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="flex items-center space-x-3">
                                 <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-black text-slate-800">{s.standardName || s.currentClass || 'General'}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Division: {s.division || s.section || 'General'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-5">
                              <div className="space-y-0.5">
                                 <p className="text-sm font-bold text-slate-700">{s.contactNo || 'No contact'}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.gender || 'Unknown'}</p>
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                 <button 
                                   onClick={() => { setSelectedStudent(s); setIsModalOpen(true); }}
                                   className="p-2.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-all"
                                 >
                                    <Eye size={18} />
                                 </button>
                                 <button className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all">
                                    <Trash2 size={18} />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>
      {/* Pagination Container */}
      <div className="mt-4">
         <Pagination 
           currentPage={currentPage} 
           totalPages={totalPages} 
           onPageChange={setCurrentPage} 
           accentColor="bg-emerald-600"
         />
      </div>

      {isModalOpen && selectedStudent && (
        <StudentDetailsModal 
          student={selectedStudent} 
          standards={standards} 
          onClose={() => { setIsModalOpen(false); setSelectedStudent(null); }}
          onUpdate={fetchStudents}
        />
      )}

    </div>
  );
}
