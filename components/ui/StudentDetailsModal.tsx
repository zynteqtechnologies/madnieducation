'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, 
  Save, 
  User, 
  BookOpen, 
  Phone, 
  Home, 
  CreditCard,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Standard {
  id: string;
  standardName: string;
  division: string | null;
}

interface StudentDetailsModalProps {
  student: any;
  standards: Standard[];
  onClose: () => void;
  onUpdate: () => void;
}

export default function StudentDetailsModal({ student, standards, onClose, onUpdate }: StudentDetailsModalProps) {
  const [formData, setFormData] = useState({ ...student });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [activeView, setActiveView] = useState<'profile' | 'timeline'>('profile');
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/subadmin/students/${student.id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) {
      console.error('Failed to load history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData((prev: any) => {
      const updated = { ...prev, [name]: finalValue };
      
      // Enforce exclusivity between Needy and RTE
      if (name === 'isUnderRTE' && finalValue === true) {
        updated.isNeedy = false;
      } else if (name === 'isNeedy' && finalValue === true) {
        updated.isUnderRTE = false;
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/subadmin/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onUpdate();
          onClose();
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Communication failed');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    {
      title: 'Identity & Selection',
      icon: <User size={18} />,
      fields: [
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'studentCode', label: 'Student Code', type: 'text' },
        { name: 'category', label: 'Category', type: 'text' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        { name: 'age', label: 'Current Age', type: 'number' },
      ]
    },
    {
      title: 'Academic Details',
      icon: <BookOpen size={18} />,
      fields: [
        { name: 'standardId', label: 'Institutional Standard', type: 'select', options: standards },
        { name: 'admissionDate', label: 'Admission Date', type: 'date' },
        { name: 'admissionType', label: 'Admission Type', type: 'text' },
        { name: 'grSrNo', label: 'GR / SR No.', type: 'text' },
        { name: 'currentClass', label: 'Excel: Class', type: 'text' },
        { name: 'section', label: 'Excel: Section', type: 'text' },
      ]
    },
    {
      title: 'Contact & Documentation',
      icon: <Phone size={18} />,
      fields: [
        { name: 'contactNo', label: 'Primary Contact', type: 'text' },
        { name: 'aadharNo', label: 'Aadhar Card', type: 'text' },
        { name: 'panNo', label: 'PAN Card', type: 'text' },
        { name: 'apaarId', label: 'APAAR ID', type: 'text' },
      ]
    },
    {
      title: 'Family & Guardians',
      icon: <Home size={18} />,
      fields: [
        { name: 'fatherName', label: 'Father Name', type: 'text' },
        { name: 'fatherNumber', label: 'Father Number', type: 'text' },
        { name: 'motherName', label: 'Mother Name', type: 'text' },
        { name: 'motherNumber', label: 'Mother Number', type: 'text' },
        { name: 'address', label: 'Residence Address', type: 'textarea' },
        { name: 'city', label: 'City', type: 'text' },
        { name: 'state', label: 'State', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
      ]
    },
    {
      title: 'Banking & Financial',
      icon: <CreditCard size={18} />,
      fields: [
        { name: 'accountHolderName', label: 'Account Holder', type: 'text' },
        { name: 'accountNumber', label: 'Account Number', type: 'text' },
        { name: 'bankName', label: 'Bank Name', type: 'text' },
        { name: 'ifscCode', label: 'IFSC Code', type: 'text' },
        { name: 'sponsorshipType', label: 'Sponsorship', type: 'text' },
        { name: 'isNeedy', label: 'Is Needy?', type: 'checkbox' },
        { name: 'isUnderRTE', label: 'Under RTE?', type: 'checkbox' },
      ]
    }
  ];

  const formatDateForInput = (dateStr: any) => {
    if (!dateStr) return '';
    try {
      // If it is a Date object, extract local components
      if (dateStr instanceof Date) {
        const year = dateStr.getFullYear();
        const month = String(dateStr.getMonth() + 1).padStart(2, '0');
        const day = String(dateStr.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

      // Convert to string safely
      const str = String(dateStr).trim();

      // If it is already in YYYY-MM-DD format, return as-is (standard Postgres date column)
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return str;
      }
      
      // If it is in DD-MM-YYYY format, convert to YYYY-MM-DD
      if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
        const [d, m, y] = str.split('-');
        return `${y}-${m}-${d}`;
      }

      const d = new Date(str);
      if (isNaN(d.getTime())) return '';
      
      // Local extraction to bypass timezone shift bugs
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  };

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-none shadow-2xl relative z-10 flex flex-col md:flex-row border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Left Panel: Profile Summary */}
        <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center shrink-0">
           <div className="w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black mb-6 shadow-xl shadow-emerald-200">
              {formData.name?.[0]}
           </div>
           <h3 className="text-xl font-black text-slate-900 text-center leading-tight mb-2">{formData.name}</h3>
           <p className="text-[11px] font-bold text-emerald-600 mb-6 font-mono tracking-tight">Institutional registry</p>
           
           <div className="w-full space-y-3 mt-4">
              <div className="px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">Student code</p>
                 <p className="text-sm font-bold text-slate-700">{formData.studentCode || 'UNASSIGNED'}</p>
              </div>
              <div className="px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-[10px] font-bold text-slate-400 mb-1">Current grade</p>
                 <p className="text-sm font-bold text-slate-700">{formData.standardName || 'GENERAL'}</p>
              </div>
           </div>

           <div className="w-full space-y-2 mt-8">
              <button
                type="button"
                onClick={() => setActiveView('profile')}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center space-x-2.5 ${activeView === 'profile' ? 'bg-[#215B63] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                 <User size={14} />
                 <span>Profile Details</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('timeline')}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center space-x-2.5 ${activeView === 'timeline' ? 'bg-[#215B63] text-white shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                 <BookOpen size={14} />
                 <span>Academic Timeline</span>
              </button>
           </div>

           <button 
             onClick={onClose}
             className="mt-auto w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all flex items-center justify-center border border-slate-200/50"
           >
              <X size={16} className="mr-2" /> Cancel
           </button>
        </div>

        {/* Right Panel: Scrollable Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                 {activeView === 'profile' ? 'Modify student profile' : 'Academic Journey Timeline'}
              </h4>
              
              {activeView === 'profile' && (
                <button 
                  onClick={handleSubmit} 
                  className="px-8 py-3 bg-[#215B63] hover:bg-[#124170] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#215B63]/10 transition-all disabled:opacity-50 flex items-center"
                  disabled={saving || success}
                >
                   {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                   Save Changes
                </button>
              )}
           </div>

           {activeView === 'profile' ? (
             <form className="flex-1 overflow-y-auto p-10 space-y-12 no-scrollbar scroll-smooth">
                {success && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center space-x-3 text-emerald-600 font-bold text-sm animate-in zoom-in duration-300">
                     <CheckCircle2 size={20} />
                     <p>Registry record synchronized successfully.</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center space-x-3 text-rose-600 font-bold text-sm animate-in zoom-in duration-300">
                     <AlertCircle size={20} />
                     <p>{error}</p>
                  </div>
                )}

                {sections.map((section, idx) => (
                  <div key={idx} className="space-y-6">
                     <div className="flex items-center space-x-3 py-2 border-b-2 border-slate-50">
                        <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">
                           {section.icon}
                        </div>
                        <h5 className="text-[10px] font-bold text-slate-400 tracking-wider transition-colors">{section.title}</h5>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {section.fields.map((field) => (
                           <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                              
                              {field.type === 'select' ? (
                                 <select 
                                   name={field.name}
                                   value={formData[field.name] || ''}
                                   onChange={handleChange}
                                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#AAFFC7]/30 focus:bg-white text-sm font-bold transition-all outline-none"
                                 >
                                    <option value="">Select...</option>
                                    {field.options && Array.isArray(field.options) ? (
                                      field.options.map((opt: any) => {
                                        if (typeof opt === 'string') {
                                          return <option key={opt} value={opt}>{opt}</option>;
                                        } else {
                                          return <option key={opt.id} value={opt.id}>{opt.standardName} ({opt.division})</option>;
                                        }
                                      })
                                    ) : null}
                                 </select>
                              ) : field.type === 'textarea' ? (
                                 <textarea 
                                   name={field.name}
                                   value={formData[field.name] || ''}
                                   onChange={handleChange}
                                   rows={3}
                                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#AAFFC7]/30 focus:bg-white text-sm font-bold transition-all outline-none resize-none"
                                 />
                              ) : field.type === 'checkbox' ? (
                                 <div className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                    <input 
                                      type="checkbox"
                                      name={field.name}
                                      checked={formData[field.name] || false}
                                      onChange={handleChange}
                                      className="w-5 h-5 rounded-md border-slate-300 text-[#215B63] focus:ring-[#215B63]"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Yes, verified</span>
                                 </div>
                              ) : (
                                 <input 
                                   type={field.type}
                                   name={field.name}
                                   value={field.type === 'date' ? formatDateForInput(formData[field.name]) : (formData[field.name] || '')}
                                   onChange={handleChange}
                                   className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-[#AAFFC7]/30 focus:bg-white text-sm font-bold transition-all outline-none"
                                 />
                              )}
                           </div>
                        ))}
                     </div>
                  </div>
                ))}
             </form>
           ) : (
             <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth animate-in slide-in-from-right duration-300">
                {loadingHistory ? (
                   <div className="py-20 flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-[#215B63] mb-4" size={32} />
                      <p className="text-xs font-bold text-slate-400">Accessing Historical Records...</p>
                   </div>
                ) : history.length === 0 ? (
                   <div className="py-20 text-center text-slate-400">
                      <BookOpen size={32} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-xs font-bold">No academic enrollment logs found for this student.</p>
                   </div>
                ) : (
                   <div className="relative border-l-2 border-slate-100 ml-4 pl-8 space-y-10">
                      {history.map((h) => (
                         <div key={h.id} className="relative">
                            {/* Pulse Timeline Point */}
                            <div className="absolute -left-[42px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-[#67C090] flex items-center justify-center shadow-sm">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#215B63]" />
                            </div>
                            
                            {/* Journey Card */}
                            <div className="bg-slate-50/50 p-6 rounded-xl border border-slate-200/60 shadow-sm hover:border-[#67C090]/50 transition-all">
                               <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Academic Session</span>
                                     <h5 className="text-sm font-black text-[#124170] mt-0.5">{h.academicYear}</h5>
                                  </div>
                                  <div className="flex flex-wrap items-center gap-2">
                                     <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${
                                        h.status === 'PROMOTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        h.status === 'ACTIVE' ? 'bg-[#AAFFC7]/40 text-[#215B63] border-[#67C090]/30' :
                                        h.status === 'REPEATING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                        'bg-rose-50 text-rose-600 border-rose-100'
                                     }`}>
                                        {h.status}
                                     </span>
                                  </div>
                               </div>
                               
                               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-100">
                                  <div>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Class / Grade</p>
                                     <p className="text-xs font-bold text-slate-700 mt-1">{h.standardName || 'General'}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Division</p>
                                     <p className="text-xs font-bold text-slate-700 mt-1">{h.division || 'N/A'}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status Tag</p>
                                     <p className="text-xs font-bold text-slate-700 mt-1">{h.status}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registration Log</p>
                                     <p className="text-[10px] font-bold text-slate-500 mt-1 font-mono">{new Date(h.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
           )}
        </div>

      </div>
    </div>,
    document.body
  );
}
