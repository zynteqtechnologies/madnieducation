'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileUp, 
  Table, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  Search,
  Filter,
  Save,
  Trash2,
  Edit2
} from 'lucide-react';

export interface Standard {
  id: string;
  standardName: string;
  division: string | null;
}

export default function StudentImport() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [standards, setStandards] = useState<Standard[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStandards();
  }, []);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!selectedStandardId) {
      setError('Please select a target Academic Standard first.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/subadmin/students/import', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setHeaders(data.headers);
        setPreviewData(data.students);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Communication failed. Check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (previewData.length === 0 || !selectedStandardId) return;
    setImporting(true);
    setError('');

    try {
      const res = await fetch('/api/subadmin/students/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          students: previewData,
          standardId: selectedStandardId
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setPreviewData([]);
        setFile(null);
        setSelectedStandardId('');
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError('Database synchronization failed.');
    } finally {
      setImporting(false);
    }
  };

  const handleRemoveRow = (index: number) => {
    setPreviewData(prev => prev.filter((_, i) => i !== index));
  };

  const handleCellChange = (rowIndex: number, header: string, value: string) => {
    const updated = [...previewData];
    updated[rowIndex][header] = value;
    setPreviewData(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Step 1: Upload Section */}
      {!previewData.length && !success && (
        <div className="max-w-xl mx-auto py-12">
          <div className="bg-white p-10 rounded-md border border-slate-200 shadow-sm text-center">
             <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-md flex items-center justify-center mx-auto mb-6">
                <FileUp size={40} />
             </div>
             <h3 className="text-2xl font-black text-slate-900 mb-2">Student Registry Import</h3>
             <p className="text-slate-500 text-sm font-medium mb-8">Select a standard and upload the corresponding Excel template.</p>
             
             <div className="space-y-4">
                <div className="text-left space-y-1 mb-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Academic Standard</label>
                   <select 
                     value={selectedStandardId} 
                     onChange={(e) => setSelectedStandardId(e.target.value)}
                     className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-emerald-500/5 focus:bg-white text-sm font-bold transition-all appearance-none cursor-pointer"
                   >
                     <option value="">Select Standard...</option>
                     {standards.map(std => (
                       <option key={std.id} value={std.id}>{std.standardName} {std.division ? `(${std.division})` : ''}</option>
                     ))}
                   </select>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-4 px-6 border-2 border-dashed border-slate-200 rounded-md hover:border-emerald-400 hover:bg-slate-50 transition-all flex flex-col items-center group"
                >
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-600">
                      {file ? file.name : 'Select Excel Document'}
                   </span>
                </button>
                
                {file && (
                   <button 
                    onClick={handleUpload}
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center space-x-2"
                   >
                     {loading ? <Loader2 className="animate-spin" size={18} /> : <><span>Analyze Registry</span><Table size={18}/></>}
                   </button>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Step 2: Preview & Edit Section */}
      {previewData.length > 0 && (
        <div className="space-y-6">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-100">
              <div>
                 <h2 className="text-xl font-bold text-slate-900">Registry Snapshot</h2>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Found {previewData.length} records in template</p>
              </div>
              <div className="flex space-x-3">
                 <button onClick={() => setPreviewData([])} className="px-6 py-3 bg-slate-100 text-slate-500 rounded-md font-bold text-xs uppercase tracking-tight hover:bg-slate-200 transition-all">Abort</button>
                 <button 
                  onClick={handleSave} 
                  disabled={importing}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center"
                 >
                    {importing ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                    Finalize Import
                 </button>
              </div>
           </div>

           {error && (
             <div className="p-4 bg-rose-50 border border-rose-100 rounded-md flex items-center space-x-3 text-rose-700 text-xs font-bold">
                <AlertCircle size={16} />
                <p>{error}</p>
             </div>
           )}

           <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto max-h-[600px] no-scrollbar">
                 <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                       <tr>
                          <th className="px-4 py-3 border-b border-slate-200 text-slate-400 font-black uppercase tracking-wider sticky left-0 bg-slate-50 z-20">Tools</th>
                          {headers.map((h, i) => (
                             <th key={i} className="px-4 py-3 border-b border-slate-200 text-slate-500 font-black uppercase tracking-wider min-w-[150px]">{h}</th>
                          ))}
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {previewData.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-4 py-3 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-100">
                                <button onClick={() => handleRemoveRow(rowIndex)} className="p-1.5 text-slate-300 hover:text-rose-600 transition-colors"><Trash2 size={14}/></button>
                             </td>
                             {headers.map((h, i) => (
                                <td key={i} className="px-4 py-2">
                                   <input 
                                     type="text" 
                                     value={row[h] || ''} 
                                     onChange={(e) => handleCellChange(rowIndex, h, e.target.value)}
                                     className="w-full bg-transparent border-none focus:ring-1 focus:ring-indigo-300 rounded-md py-1 px-2 font-semibold text-slate-700 outline-none hover:bg-slate-100 transition-all"
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

      {/* Success State */}
      {success && (
         <div className="max-w-md mx-auto py-20 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
               <CheckCircle2 size={56} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-2">Sync Complete</h3>
            <p className="text-slate-500 font-medium mb-10">All records have been successfully synchronized with the institutional registry.</p>
            <button onClick={() => setSuccess(false)} className="px-8 py-4 bg-emerald-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100">Return to Module</button>
         </div>
      )}

    </div>
  );
}
