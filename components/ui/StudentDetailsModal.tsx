'use client';

import React, { useState, useEffect } from 'react';
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

  const formatDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-2xl relative z-10 flex flex-col md:flex-row border border-slate-100 animate-in zoom-in-95 duration-300">
        
        {/* Left Panel: Profile Summary */}
        <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-100 flex flex-col items-center shrink-0">
           <div className="w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center text-white text-4xl font-black mb-6 shadow-xl shadow-emerald-200">
              {formData.name?.[0]}
           </div>
           <h3 className="text-xl font-black text-slate-900 text-center leading-tight mb-2">{formData.name}</h3>
           <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6">Institutional Registry</p>
           
           <div className="w-full space-y-3 mt-4">
              <div className="px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Student Code</p>
                 <p className="text-sm font-bold text-slate-700">{formData.studentCode || 'UNASSIGNED'}</p>
              </div>
              <div className="px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Grade</p>
                 <p className="text-sm font-bold text-slate-700">{formData.standardName || 'GENERAL'}</p>
              </div>
           </div>

           <button 
             onClick={onClose}
             className="mt-auto w-full py-4 bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-300 transition-all flex items-center justify-center"
           >
              <X size={16} className="mr-2" /> Cancel
           </button>
        </div>

        {/* Right Panel: Scrollable Form */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight">Modify Student Profile</h4>
              
              <button 
                onClick={handleSubmit} 
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center"
                disabled={saving || success}
              >
                 {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                 Save Changes
              </button>
           </div>

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
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{section.title}</h5>
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
                                 className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
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
                                 className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none resize-none"
                               />
                            ) : field.type === 'checkbox' ? (
                               <div className="flex items-center space-x-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                                  <input 
                                    type="checkbox"
                                    name={field.name}
                                    checked={formData[field.name] || false}
                                    onChange={handleChange}
                                    className="w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span className="text-sm font-bold text-slate-700">Yes, verified</span>
                               </div>
                            ) : (
                               <input 
                                 type={field.type}
                                 name={field.name}
                                 value={field.type === 'date' ? formatDateForInput(formData[field.name]) : (formData[field.name] || '')}
                                 onChange={handleChange}
                                 className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                               />
                            )}
                         </div>
                      ))}
                   </div>
                </div>
              ))}
           </form>
        </div>

      </div>
    </div>
  );
}
