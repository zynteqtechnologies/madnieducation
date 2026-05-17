'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Layers,
  FileUp,
  CheckCircle2,
  Loader2,
  ArrowRight,
  AlertCircle,
  IndianRupee,
  Table,
  Save,
  Trash2,
  RefreshCcw
} from 'lucide-react';

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [createdStandardId, setCreatedStandardId] = useState('');

  // ---------- Step 1 State ----------
  const [formData, setFormData] = useState({ standardName: '', division: '', fees: '', batchYear: '' });
  const [academicYears, setAcademicYears] = useState<any[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState('');

  // ---------- Step 2 State ----------
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading2, setLoading2] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error2, setError2] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const res = await fetch('/api/subadmin/academic-years');
      if (res.ok) {
        setAcademicYears(await res.json());
      }
    } catch { }
  };

  // ---------- Step 1 Handlers ----------
  const handleCreateStandard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.standardName || !formData.batchYear || !formData.fees) {
      setError1('Please fill all required fields before proceeding');
      return;
    }
    setLoading1(true);
    setError1('');

    try {
      const res = await fetch('/api/subadmin/standards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        setCreatedStandardId(data.id);
        setStep(2);
      } else {
        setError1(data.error || 'Failed to create standard');
      }
    } catch (err) {
      setError1('Network error occurred while saving the configuration');
    } finally {
      setLoading1(false);
    }
  };

  // ---------- Step 2 Handlers ----------
  const handleUpload = async () => {
    if (!file) return;
    setLoading2(true);
    setError2('');

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch('/api/subadmin/students/import', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();

      if (res.ok) {
        setHeaders(data.headers);
        setPreviewData(data.students);
      } else {
        setError2(data.error);
      }
    } catch (err) {
      setError2('Communication failed. Check your network.');
    } finally {
      setLoading2(false);
    }
  };

  const handleSaveStudents = async () => {
    if (previewData.length === 0 || !createdStandardId) return;
    setImporting(true);
    setError2('');

    try {
      const res = await fetch('/api/subadmin/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          students: previewData,
          standardId: createdStandardId
        }),
      });

      if (res.ok) {
        setStep(3);
      } else {
        const data = await res.json();
        setError2(data.error);
      }
    } catch (err) {
      setError2('Database synchronization failed.');
    } finally {
      setImporting(false);
    }
  };

  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const updated = [...previewData];
    updated[rowIndex][header] = value;
    setPreviewData(updated);
  };

  // ---------- Render Helpers ----------
  const resetWizard = () => {
    setFormData({ standardName: '', division: '', fees: '', batchYear: '' });
    setCreatedStandardId('');
    setFile(null);
    setPreviewData([]);
    setStep(1);
  };

  return (
    <div className="mx-auto space-y-6 animate-in fade-in duration-500">

      {/* Premium Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-md border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
            Class Setup
          </h2>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Initialize new classes & student rosters securely</p>
        </div>
        <div className="flex items-center space-x-2.5 bg-slate-100 px-4 py-2 rounded-md border border-slate-200/50">
          <Sparkles size={14} className="text-[#67C090]" />
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Initialization Wizard Active</span>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="relative pt-6 pb-2">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -translate-y-1/2 rounded-full transition-all duration-700" style={{ width: step === 1 ? '16%' : step === 2 ? '50%' : '100%' }}></div>

        <div className="relative z-10 flex justify-between">
          {[
            { id: 1, title: 'Grade Config', icon: <Layers size={18} /> },
            { id: 2, title: 'Student Roster', icon: <FileUp size={18} /> },
            { id: 3, title: 'Finalization', icon: <CheckCircle2 size={18} /> }
          ].map((s) => (
            <div key={s.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-500 ${step >= s.id ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-white text-slate-300 border-2 border-slate-100'
                }`}>
                {s.icon}
              </div>
              <p className={`mt-3 text-[10px] font-black uppercase tracking-widest ${step >= s.id ? 'text-emerald-700' : 'text-slate-300'}`}>{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 md:p-10 relative overflow-hidden transition-all duration-500">

        {/* Step 1: Create Standard */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-8 duration-500 space-y-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800">Define Academic Configuration</h2>
              <p className="text-slate-500 mt-2 font-medium">Establish the parameters for this new class before importing students.</p>
            </div>

            {error1 && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center space-x-3 text-rose-700 text-xs font-bold text-center justify-center">
                <AlertCircle size={16} />
                <p>{error1}</p>
              </div>
            )}

            <form onSubmit={handleCreateStandard} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade Level (e.g., 10th)</label>
                  <input type="text" required value={formData.standardName} onChange={e => setFormData({ ...formData, standardName: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white text-sm font-bold transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Divisions (Optional)</label>
                  <input type="text" value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white text-sm font-bold transition-all" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Year</label>
                  <select
                    value={formData.batchYear}
                    onChange={e => setFormData({ ...formData, batchYear: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white text-sm font-bold transition-all"
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

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Tuition</label>
                  <div className="relative group">
                    <IndianRupee size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input type="number" required value={formData.fees} onChange={e => setFormData({ ...formData, fees: e.target.value })} className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/10 focus:bg-white text-sm font-black transition-all" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading1} className="w-full mt-6 py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 hover:shadow-emerald-600/40 transition-all flex items-center justify-center group active:scale-[0.98]">
                {loading1 ? <Loader2 className="animate-spin" size={20} /> : (
                  <>Proceed to Import Roster <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Roster Import */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 duration-500 space-y-8">
            {!previewData.length ? (
              <div className="text-center max-w-xl mx-auto py-8">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileUp size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-800">Upload Student Roster</h2>
                <p className="text-slate-500 mt-2 font-medium mb-10">You are uploading exactly into: <strong className="text-slate-800">{formData.standardName} {formData.division && `(${formData.division})`} - {formData.batchYear}</strong></p>

                {error2 && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center space-x-3 text-rose-700 text-xs font-bold mb-6 text-left">
                    <AlertCircle size={16} />
                    <p>{error2}</p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => { if (e.target.files) { setFile(e.target.files[0]); setError2(''); } }}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 border-2 border-dashed border-slate-300 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex flex-col items-center group"
                >
                  <span className="text-sm font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-widest">
                    {file ? file.name : 'Select Excel Document (.xlsx)'}
                  </span>
                </button>

                {file && (
                  <button
                    onClick={handleUpload}
                    disabled={loading2}
                    className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center"
                  >
                    {loading2 ? <Loader2 className="animate-spin" size={20} /> : <><span>Analyze Registry Data</span><Table size={18} className="ml-2" /></>}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <h4 className="font-black text-slate-900">Preview Layout</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{previewData.length} Valid Records Detected</p>
                  </div>
                  <div className="flex space-x-3 mt-4 md:mt-0">
                    <button onClick={() => { setPreviewData([]); setFile(null); }} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">Select Different File</button>
                    <button
                      onClick={handleSaveStudents}
                      disabled={importing}
                      className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center"
                    >
                      {importing ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save size={16} className="mr-2" />} Synchronize Registry
                    </button>
                  </div>
                </div>

                {error2 && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-center space-x-3 text-rose-700 text-xs font-bold">
                    <AlertCircle size={16} /> <p>{error2}</p>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="max-h-[500px] overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead className="bg-slate-100 sticky top-0 z-20">
                        <tr>
                          <th className="px-4 py-4 text-slate-500 font-black uppercase tracking-wider sticky left-0 bg-slate-100 z-30">Tools</th>
                          {headers.map((h, i) => (
                            <th key={i} className="px-4 py-4 text-slate-500 font-black uppercase tracking-wider min-w-[150px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 sticky left-0 bg-white border-r border-slate-100 z-10 w-12 text-center">
                              <button onClick={() => setPreviewData(prev => prev.filter((_, i) => i !== rowIndex))} className="text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                            </td>
                            {headers.map((h, i) => (
                              <td key={i} className="px-4 py-2">
                                <input
                                  type="text"
                                  value={row[h] || ''}
                                  onChange={(e) => handleCellChange(rowIndex, h, e.target.value)}
                                  className="w-full bg-transparent border-none focus:ring-2 focus:ring-emerald-500/20 rounded-md py-2 px-3 font-semibold text-slate-800 outline-none hover:bg-slate-50 transition-all"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 3 && (
          <div className="text-center py-16 animate-in zoom-in-95 duration-700">
            <div className="w-32 h-32 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
              <CheckCircle2 size={64} className="text-emerald-500 relative z-10" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Setup Finalized</h2>
            <p className="text-slate-500 font-medium mb-12 max-w-lg mx-auto leading-relaxed">
              Grade <strong className="text-slate-800">{formData.standardName} {formData.division && `(${formData.division})`}</strong> has been registered with its accompanying students seamlessly synchronised.
            </p>

            <button onClick={resetWizard} className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center mx-auto">
              <RefreshCcw size={16} className="mr-3" /> Initialize Another Class
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
