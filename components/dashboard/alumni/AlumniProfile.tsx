'use client';

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Briefcase, 
  Globe, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  FileText,
  ExternalLink
} from 'lucide-react';
import Image from 'next/image';

export default function AlumniProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    batchYear: '',
    currentTitle: '',
    currentBio: '',
    workLink: '',
    linkedIn: '',
    profilePic: ''
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/alumni/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        if (data.profilePic) setPreviewImage(data.profilePic);
      }
    } catch (err) {
      console.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewImage(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('currentTitle', profile.currentTitle || '');
    formData.append('currentBio', profile.currentBio || '');
    formData.append('workLink', profile.workLink || '');
    formData.append('linkedIn', profile.linkedIn || '');
    formData.append('existingProfilePic', profile.profilePic || '');
    if (file) formData.append('profilePic', file);

    try {
      const res = await fetch('/api/alumni/profile', {
        method: 'PATCH',
        body: formData
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setMessage({ type: 'success', text: 'Professional profile synchronized successfully!' });
      } else {
        const err = await res.json();
        setMessage({ type: 'error', text: err.error || 'Synchronization failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Network transition error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-amber-500" size={48} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Querying Identity Records...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professional Identity</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Manage your global institutional presence</p>
        </div>
        {message && (
          <div className={`px-4 py-2 rounded-md flex items-center space-x-2 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
            {message.type === 'success' ? <CheckCircle2 size={14} /> : <Save size={14} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{message.text}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left: Avatar Upload */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-md border border-slate-100 shadow-sm flex flex-col items-center text-center">
             <div className="relative group cursor-pointer w-40 h-40 mb-6">
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 rounded-md transition-all flex items-center justify-center z-10">
                   <Camera className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                </div>
                <div className="w-40 h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-md overflow-hidden relative">
                   {previewImage ? (
                     <Image src={previewImage} alt="Profile" fill className="object-cover" />
                   ) : (
                     <div className="flex items-center justify-center h-full">
                        <User size={64} className="text-slate-200" />
                     </div>
                   )}
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                />
             </div>
             <h4 className="text-sm font-black text-slate-900 tracking-tight">{profile.name}</h4>
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Class of {profile.batchYear}</p>
          </div>

          <div className="bg-amber-50 p-6 rounded-md border border-amber-100">
             <h5 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">Institutional Verification</h5>
             <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                Some identity details (Email, Graduation Batch) are institutionally locked. Contact your school sub-admin for modifications.
             </p>
          </div>
        </div>

        {/* Right: Form Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-md border border-slate-100 shadow-sm space-y-8">
             
             {/* Read Only Email */}
             <div className="space-y-1.5 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                   <Mail size={12} className="mr-2" /> Authorized Email
                </label>
                <div className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md text-sm font-bold text-slate-500 cursor-not-allowed">
                   {profile.email}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                      <Briefcase size={12} className="mr-2" /> Current Designation
                   </label>
                   <input 
                     type="text" 
                     placeholder="e.g. Senior Software Engineer"
                     value={profile.currentTitle || ''}
                     onChange={(e) => setProfile({...profile, currentTitle: e.target.value})}
                     className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-amber-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                      <ExternalLink size={12} className="mr-2" /> LinkedIn Authority
                   </label>
                   <input 
                     type="url" 
                     placeholder="linkedin.com/in/username"
                     value={profile.linkedIn || ''}
                     onChange={(e) => setProfile({...profile, linkedIn: e.target.value})}
                     className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-amber-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                   />
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                   <Globe size={12} className="mr-2" /> Portfolio / Workspace Link
                </label>
                <input 
                  type="url" 
                  placeholder="https://yourportfolio.com"
                  value={profile.workLink || ''}
                  onChange={(e) => setProfile({...profile, workLink: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-amber-500/5 focus:bg-white text-sm font-bold transition-all outline-none"
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 flex items-center">
                   <FileText size={12} className="mr-2" /> Professional Bio
                </label>
                <textarea 
                  rows={4}
                  placeholder="Tell the community about your professional journey and current focus areas..."
                  value={profile.currentBio || ''}
                  onChange={(e) => setProfile({...profile, currentBio: e.target.value})}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-md focus:ring-4 focus:ring-amber-500/5 focus:bg-white text-sm font-bold transition-all outline-none resize-none"
                />
             </div>

             <div className="pt-6 border-t border-slate-50">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full md:w-auto px-10 py-4 bg-slate-900 text-white rounded-md text-[11px] font-black uppercase tracking-[0.2em] hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                   {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                   <span>{saving ? 'Synchronizing Profile...' : 'Save Professional Identity'}</span>
                </button>
             </div>

          </div>
        </div>
      </form>

    </div>
  );
}
