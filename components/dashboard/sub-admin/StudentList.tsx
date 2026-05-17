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
  batchYear: string | null;
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
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header & Controls Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-md border border-slate-200 shadow-sm mb-8">
         <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Student Registry</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Institutional database for student records</p>
         </div>

         <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative group">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#67C090] transition-colors" size={14} />
               <input 
                 type="text" 
                 placeholder="Search students..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="pl-9 pr-4 py-2 bg-slate-100/80 border border-slate-200/60 rounded-xl outline-none focus:ring-4 focus:ring-[#AAFFC7]/30 focus:bg-white text-xs font-bold transition-all w-48 focus:w-56"
               />
            </div>

            {/* Standard Filter */}
            <div className="relative group">
               <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <select 
                 value={selectedStandardId}
                 onChange={(e) => setSelectedStandardId(e.target.value)}
                 className="pl-9 pr-8 py-2 bg-slate-100/80 border border-slate-200/60 rounded-xl outline-none focus:ring-4 focus:ring-[#AAFFC7]/30 focus:bg-white text-xs font-bold appearance-none cursor-pointer transition-all"
               >
                  <option value="">All Standards</option>
                  {standards.map(std => (
                    <option key={std.id} value={std.id}>{std.standardName} {std.division ? `(${std.division})` : ''}</option>
                  ))}
               </select>
            </div>

            <button className="p-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-500 hover:text-[#215B63] transition-all shadow-sm">
               <Download size={15} />
            </button>
         </div>
      </div>

      {/* Registry Table - Redesigned for Professional Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
         {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
               <Loader2 className="animate-spin text-emerald-600 mb-4" size={32} />
               <p className="text-xs font-bold text-slate-400">Accessing Registry...</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full table-fixed min-w-[1000px]">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[30%]">Student identity</th>
                      <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[20%]">Standard / Grade</th>
                      <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[20%]">Batch</th>
                      <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left w-[20%]">Contact details</th>
                      <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-right w-[10%] pr-8">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {paginatedStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/40 transition-all group align-middle">
                           <td className="px-6 py-5">
                              <div className="flex items-center space-x-3.5">
                                 <div className="w-10 h-10 rounded-xl bg-slate-100/50 border border-slate-200/60 flex items-center justify-center font-bold text-emerald-600 group-hover:bg-emerald-50 transition-all">
                                    {s.name[0]}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-[13px] font-bold text-slate-700 leading-snug group-hover:text-emerald-600 transition-colors">{s.name}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 font-medium italic">Code: {s.studentCode || 'N/A'}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="space-y-1">
                                 <p className="text-[12px] font-bold text-slate-600">{s.standardName || s.currentClass || 'General'}</p>
                                 <p className="text-[10px] text-slate-400 font-bold opacity-70">Div: {s.division || s.section || 'N/A'}</p>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div>
                                 <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                    {s.batchYear || 'TBD'}
                                 </span>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <div className="space-y-1.5 text-[11px] font-bold text-slate-500">
                                 <p className="text-slate-700">{s.contactNo || 'SECURE'}</p>
                                 <p className="text-[10px] opacity-60 italic">{s.gender || 'UNDEFINED'}</p>
                              </div>
                           </td>
                           <td className="px-6 py-5 text-right pr-8">
                              <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100">
                                 <button 
                                   onClick={() => { setSelectedStudent(s); setIsModalOpen(true); }}
                                   className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
                                   title="View Transcript"
                                 >
                                    <Eye size={15} />
                                 </button>
                                 <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-lg transition-all" title="Archive Record">
                                    <Trash2 size={15} />
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
