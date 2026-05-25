'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Search, Award, GraduationCap, School, Calendar, Layers, ChevronRight, UserCircle } from 'lucide-react';
import Image from 'next/image';
import DashboardLayout from '@/components/layout/DashboardLayout';
interface SchoolData {
  id: string;
  schoolName: string;
}

interface StandardData {
  id: string;
  standardName: string;
}

interface AcademicYear {
  id: string;
  label: string;
  isActive: boolean;
}

interface Student {
  id: string;
  name: string;
  studentCode: string;
  percentage: string | number;
  rank: number;
}

export default function SuperAdminStudentsAnalytics() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [standards, setStandards] = useState<StandardData[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedStandard, setSelectedStandard] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingStandards, setLoadingStandards] = useState(false);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetch('/api/admin/schools').then(res => res.json()).then(data => {
      setSchools(data);
      setLoadingSchools(false);
    });

    fetch('/api/superadmin/academic-years').then(res => res.json()).then(data => {
      setAcademicYears(data);
      setLoadingYears(false);
      // Select current year by default if available
      const current = data.find((y: any) => y.isActive);
      if (current) setSelectedYear(current.id);
    });
  }, []);

  useEffect(() => {
    if (selectedSchool) {
      setLoadingStandards(true);
      fetch(`/api/superadmin/standards?schoolId=${selectedSchool}`).then(res => res.json()).then(data => {
        setStandards(data);
        setLoadingStandards(false);
      });
    } else {
      setStandards([]);
      setSelectedStandard('');
    }
  }, [selectedSchool]);

  useEffect(() => {
    if (selectedStandard && selectedYear) {
      setLoadingStudents(true);
      fetch(`/api/superadmin/students?standardId=${selectedStandard}&academicYearId=${selectedYear}`)
        .then(res => res.json())
        .then(data => {
          setStudents(Array.isArray(data) ? data : []);
          setLoadingStudents(false);
        })
        .catch(() => {
          setStudents([]);
          setLoadingStudents(false);
        });
    } else {
      setStudents([]);
    }
  }, [selectedStandard, selectedYear]);

  // Derive Toppers (Top 3)
  const sortedStudents = [...students].sort((a, b) => Number(b.percentage || 0) - Number(a.percentage || 0));
  const toppers = sortedStudents.slice(0, 3);
  const restStudents = sortedStudents.slice(3);

  return (
    <DashboardLayout title="Students Analytics" role="SUPER_ADMIN" activeItem="Students">
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center">
              <GraduationCap className="mr-3 text-[#3f72af]" size={28} />
              Students Analytics & Rankings
            </h1>
            <p className="text-slate-500 mt-1 ml-10">Monitor top performers and student lists across all schools</p>
          </div>
        </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* School Filter */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <School size={14} className="mr-1.5" /> Select School
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#3f72af] focus:ring-2 focus:ring-[#3f72af]/20 transition-all font-medium"
            value={selectedSchool}
            onChange={(e) => {
                setSelectedSchool(e.target.value);
                setSelectedStandard('');
            }}
            disabled={loadingSchools}
          >
            <option value="">-- Select a School --</option>
            {schools.map(s => <option key={s.id} value={s.id}>{s.schoolName}</option>)}
          </select>
        </div>

        {/* Batch Filter */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <Calendar size={14} className="mr-1.5" /> Academic Batch
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#3f72af] focus:ring-2 focus:ring-[#3f72af]/20 transition-all font-medium"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={loadingYears}
          >
            <option value="">-- Select Batch --</option>
            {academicYears.map(y => <option key={y.id} value={y.id}>{y.label}</option>)}
          </select>
        </div>

        {/* Standard Filter */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <Layers size={14} className="mr-1.5" /> Standard
          </label>
          <select 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 outline-none focus:border-[#3f72af] focus:ring-2 focus:ring-[#3f72af]/20 transition-all font-medium disabled:opacity-50"
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            disabled={!selectedSchool || loadingStandards}
          >
            <option value="">-- Select Standard --</option>
            {standards.map(s => <option key={s.id} value={s.id}>{s.standardName}</option>)}
          </select>
        </div>
      </div>

      {loadingStudents ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#3f72af]" />
          <p className="text-slate-500 font-medium">Analyzing student records...</p>
        </div>
      ) : (
        selectedStandard && selectedYear && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* TOPPERS PODIUM */}
            {toppers.length > 0 && (
              <div className="bg-gradient-to-br from-[#0b1525] via-[#16325c] to-[#3f72af] p-8 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Award size={200} />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Award className="mr-3 text-amber-400" /> Standard Toppers
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                  {toppers.map((topper, index) => {
                    const colors = [
                      'bg-gradient-to-b from-amber-200 to-amber-500 text-amber-900 border-amber-300 shadow-amber-500/50', // 1st
                      'bg-gradient-to-b from-slate-200 to-slate-400 text-slate-800 border-slate-300 shadow-slate-400/50', // 2nd
                      'bg-gradient-to-b from-orange-300 to-orange-600 text-orange-950 border-orange-400 shadow-orange-600/50' // 3rd
                    ];
                    return (
                      <div key={topper.id} className={`p-6 rounded-2xl shadow-lg border ${colors[index]} transform transition-all hover:-translate-y-2 flex flex-col items-center text-center`}>
                        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center mb-4 text-2xl font-black shadow-inner">
                          #{index + 1}
                        </div>
                        <h3 className="font-bold text-xl mb-1">{topper.name}</h3>
                        <p className="text-sm opacity-80 mb-4 font-semibold">{topper.studentCode}</p>
                        <div className="mt-auto px-4 py-2 bg-black/10 rounded-xl font-bold text-lg backdrop-blur-md w-full">
                          {topper.percentage}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FULL STUDENT LIST */}
            {students.length > 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">All Students in Standard</h3>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{students.length} Total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Code</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedStudents.map((student, index) => (
                        <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              index === 0 ? 'bg-amber-100 text-amber-700' :
                              index === 1 ? 'bg-slate-200 text-slate-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {index + 1}
                            </span>
                          </td>
                          <td className="p-4 font-medium text-slate-800 flex items-center">
                            <UserCircle className="text-slate-300 mr-3" size={24} />
                            {student.name}
                          </td>
                          <td className="p-4 text-slate-500 text-sm">{student.studentCode || 'N/A'}</td>
                          <td className="p-4 text-right">
                            <span className="inline-block px-3 py-1 bg-[#3f72af]/10 text-[#3f72af] rounded-lg font-bold">
                              {student.percentage}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
               <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <GraduationCap className="mx-auto text-slate-300 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-slate-700 mb-2">No Students Found</h3>
                  <p className="text-slate-500">There are no student records for this standard in the selected batch.</p>
               </div>
            )}
          </div>
        )
      )}
      </div>
    </DashboardLayout>
  );
}
