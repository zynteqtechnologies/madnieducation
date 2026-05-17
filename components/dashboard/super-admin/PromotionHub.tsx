'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  ChevronRight,
  Search,
  ArrowRightCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
  Filter,
  CheckSquare,
  Square,
  Send,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface School { id: string; schoolName: string; }
interface Standard { id: string; standardName: string; division: string; schoolId: string; }
interface Student { id: string; name: string; studentCode: string; standardId: string; currentClass: string; }
interface AcademicYear { id: string; label: string; isActive: boolean; }

interface PromotionHubProps {
  schoolId?: string;
  isAdmin?: boolean;
}

export default function PromotionHub({ schoolId: propSchoolId, isAdmin = false }: PromotionHubProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  const [selectedSchool, setSelectedSchool] = useState(propSchoolId || '');
  const [selectedStandard, setSelectedStandard] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  const [targetStandard, setTargetStandard] = useState('');
  const [targetYear, setTargetYear] = useState('');

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchInitialData();
    if (!isAdmin) {
      fetchStandards('local');
      setSelectedSchool('local');
    }
  }, []);

  const fetchInitialData = async () => {
    try {
      const schoolsUrl = isAdmin ? '/api/admin/schools' : null;
      const yearsUrl = isAdmin
        ? `/api/superadmin/academic-years${propSchoolId ? `?schoolId=${propSchoolId}` : ''}`
        : '/api/subadmin/academic-years';

      const resData = await Promise.all([
        schoolsUrl ? fetch(schoolsUrl).then(r => r.json()) : Promise.resolve([]),
        fetch(yearsUrl).then(r => r.json())
      ]);

      setSchools(resData[0]);
      const years = resData[1];
      setAcademicYears(years);
      const activeYear = years.find((y: any) => y.isActive);
      if (activeYear) setSelectedYear(activeYear.id);
    } catch (err) {
      console.error('Failed to fetch initial data');
    }
  };

  useEffect(() => {
    if (selectedSchool) {
      fetchStandards(selectedSchool);
    }
  }, [selectedSchool]);

  const fetchStandards = async (schoolId: string) => {
    try {
      const url = isAdmin
        ? `/api/superadmin/standards?schoolId=${schoolId}`
        : `/api/subadmin/standards`;
      const res = await fetch(url);
      setStandards(await res.json());
    } catch (err) {
      console.error('Failed to fetch standards');
    }
  };

  const loadStudents = async () => {
    if (!selectedStandard) return;
    setIsLoading(true);
    try {
      const url = isAdmin
        ? `/api/superadmin/students?standardId=${selectedStandard}`
        : `/api/subadmin/students?standardId=${selectedStandard}`;
      const res = await fetch(url);
      setStudents(await res.json());
      setSelectedStudents([]);
    } catch (err) {
      console.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromote = async (status: 'PROMOTED' | 'REPEATING' | 'DROPPED') => {
    if (selectedStudents.length === 0) return;
    if (status !== 'DROPPED' && (!targetStandard || !targetYear)) {
      alert('Please select target standard and year');
      return;
    }

    setIsPromoting(true);
    try {
      const url = isAdmin ? '/api/superadmin/promotions' : '/api/subadmin/promotions';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentIds: selectedStudents,
          targetStandardId: targetStandard || selectedStandard,
          academicYearId: targetYear || selectedYear,
          status,
          currentAcademicYearId: selectedYear,
          schoolId: propSchoolId
        })
      });

      if (res.ok) {
        alert('Promotion processed successfully');
        loadStudents();
      } else {
        alert('Promotion failed');
      }
    } catch (err) {
      console.error('Promotion error:', err);
    } finally {
      setIsPromoting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Premium Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-md border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Promotion Hub</h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Academic promotions & grades rollover</p>
        </div>
        <div className="flex items-center space-x-2.5 bg-slate-100 px-4 py-2 rounded-md border border-slate-200/50">
          <Sparkles size={14} className="text-[#67C090]" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Promotion Registry Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-[#1A3D63] flex items-center">
              <Filter size={14} className="mr-2" /> Source context
            </h3>

            <div className="space-y-5">
              {isAdmin && !propSchoolId && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 ml-1">Select school</label>
                  <select
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-[#1A3D63]/10 transition-all bg-slate-50 focus:bg-white"
                  >
                    <option value="">Choose school...</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.schoolName}</option>)}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 ml-1">Source standard</label>
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-[#1A3D63]/10 transition-all bg-slate-50 focus:bg-white"
                  disabled={!selectedSchool}
                >
                  <option value="">Choose standard...</option>
                  {standards.map(s => <option key={s.id} value={s.id}>{s.standardName} - {s.division}</option>)}
                </select>
              </div>

              <button
                onClick={loadStudents}
                disabled={!selectedStandard || isLoading}
                className="w-full bg-[#1A3D63] text-white font-bold text-[11px] py-3.5 rounded-2xl hover:bg-[#0A1931] transition-all disabled:opacity-50 shadow-lg shadow-[#1A3D63]/10"
              >
                {isLoading ? <Loader2 className="animate-spin mx-auto" size={16} /> : 'Load students'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowRightCircle size={14} className="mr-2" /> Target context
            </h3>

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 ml-1">Target standard</label>
                <select
                  value={targetStandard}
                  onChange={(e) => setTargetStandard(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all bg-emerald-50/10 focus:bg-white"
                >
                  <option value="">Next standard...</option>
                  {standards.map(s => <option key={s.id} value={s.id}>{s.standardName} - {s.division}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 ml-1">Next academic year</label>
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all bg-emerald-50/10 focus:bg-white"
                >
                  <option value="">Next year...</option>
                  {academicYears.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1A3D63] transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search students by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-[#1A3D63]/5 focus:bg-white outline-none transition-all text-[13px] font-bold text-slate-700"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleSelectAll}
                  className="px-5 py-3 text-[11px] font-bold text-slate-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all flex items-center shadow-sm"
                >
                  {selectedStudents.length === students.length && students.length > 0 ? (
                    <CheckSquare size={16} className="mr-2 text-[#1A3D63]" />
                  ) : (
                    <Square size={16} className="mr-2 text-slate-300" />
                  )}
                  Select all
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
                <span className="text-[10px] font-bold text-[#1A3D63] bg-[#1A3D63]/5 border border-[#1A3D63]/10 px-4 py-2 rounded-full">
                  {selectedStudents.length} selected
                </span>
              </div>
            </div>

            <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
              <table className="w-full table-fixed">
                <thead className="sticky top-0 bg-white border-b border-slate-100 z-10 shadow-sm shadow-slate-100/50">
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 w-16"></th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left">Student name</th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left">Identifier</th>
                    <th className="px-6 py-4 text-[11px] font-semibold text-slate-400 text-left">Current class</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                        No students loaded. Select a source context and click "Load Students".
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className={`group hover:bg-slate-50 transition-all cursor-pointer align-middle ${selectedStudents.includes(student.id) ? 'bg-[#1A3D63]/5' : ''}`}
                        onClick={() => toggleStudent(student.id)}
                      >
                        <td className="px-6 py-4">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                            selectedStudents.includes(student.id) 
                              ? 'bg-[#1A3D63] border-[#1A3D63] text-white' 
                              : 'bg-white border-slate-200 group-hover:border-slate-300'
                          }`}>
                            {selectedStudents.includes(student.id) && <CheckSquare size={14} />}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-[13px] font-bold text-slate-700 group-hover:text-[#1A3D63] transition-colors">{student.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-slate-400 font-mono tracking-tight">{student.studentCode}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-white text-slate-500 border border-slate-200 text-[9px] font-bold rounded-lg shadow-sm">
                            {student.currentClass}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-end gap-4 shadow-inner">
              <button
                onClick={() => handlePromote('DROPPED')}
                disabled={selectedStudents.length === 0 || isPromoting}
                className="px-6 py-3 bg-white text-slate-600 border border-slate-200 font-bold text-[11px] rounded-2xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center shadow-sm"
              >
                <XCircle size={16} className="mr-2" /> Mark Dropped
              </button>

              <button
                onClick={() => handlePromote('REPEATING')}
                disabled={selectedStudents.length === 0 || isPromoting}
                className="px-6 py-3 bg-white text-slate-600 border border-slate-200 font-bold text-[11px] rounded-2xl hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100 transition-all flex items-center shadow-sm"
              >
                <RotateCcw size={16} className="mr-2" /> Repeat Class
              </button>

              <button
                onClick={() => handlePromote('PROMOTED')}
                disabled={selectedStudents.length === 0 || isPromoting}
                className="px-8 py-3 bg-emerald-600 text-white font-bold text-[11px] rounded-2xl hover:bg-emerald-700 transition-all flex items-center shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
              >
                {isPromoting ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle2 size={16} className="mr-2" />}
                Promote Selected
              </button>
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-[2rem] border border-amber-100 p-8 flex items-start space-x-5 shadow-sm">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-amber-100">
              <AlertTriangle className="text-amber-600" size={24} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 mb-1">Safety check</h4>
              <p className="text-[13px] text-amber-800/70 leading-relaxed font-medium">
                Promoting students will create a <span className="font-bold text-amber-900">Historical Enrollment Record</span> for the current year. Ensure accuracy of data before processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
