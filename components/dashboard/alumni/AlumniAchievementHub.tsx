'use strict';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ChevronRight, 
  Clock, 
  Calendar, 
  UserCheck, 
  Info, 
  Loader2, 
  GraduationCap,
  Trophy,
  Image as ImageIcon,
  Video,
  Star,
  FileText
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string | null;
  category: string | null;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const AlumniAchievementHub = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: '',
    mediaType: 'IMAGE' as 'IMAGE' | 'VIDEO',
    mediaUrl: '',
    file: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/alumni/achievements');
      const data = await response.json();
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('date', formData.date);
      form.append('category', formData.category);
      form.append('mediaType', formData.mediaType);
      
      if (formData.mediaType === 'IMAGE' && formData.file) {
        form.append('file', formData.file);
      } else if (formData.mediaType === 'VIDEO') {
        form.append('mediaUrl', formData.mediaUrl);
      }

      const response = await fetch('/api/alumni/achievements', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', description: '', date: '', category: '', mediaType: 'IMAGE', mediaUrl: '', file: null });
        fetchAchievements();
      }
    } catch (error) {
      console.error('Error reporting achievement:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Invalid</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">In Review</span>;
    }
  };

  const renderMedia = (achievement: Achievement) => {
    if (!achievement.mediaUrl) return null;

    if (achievement.mediaType === 'IMAGE') {
        return (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                <img src={achievement.mediaUrl} alt={achievement.title} className="object-cover w-full h-full" />
            </div>
        );
    } else if (achievement.mediaType === 'VIDEO') {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = achievement.mediaUrl.match(regExp);
        const videoId = (match && match[2].length === 11) ? match[2] : null;

        if (videoId) {
            return (
                <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            );
        }
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {selectedAchievement ? (
        <div className="animate-in slide-in-from-right duration-500">
          <button 
            onClick={() => setSelectedAchievement(null)}
            className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-8 hover:translate-x-[-4px] transition-transform"
          >
            ← Back to Achievement Hub
          </button>

          <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg shadow-orange-100">
                                <Trophy size={24} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedAchievement.title}</h3>
                        </div>
                        {getStatusBadge(selectedAchievement.status)}
                    </div>
                </div>
            </div>

            <div className="p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {renderMedia(selectedAchievement)}
                        
                        <div className="space-y-4">
                            <div className="flex items-center text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                <FileText size={16} className="mr-2" /> Achievement Particulars
                            </div>
                            <div className="text-base font-medium text-slate-600 leading-relaxed bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                {selectedAchievement.description}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Highlights</h4>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <Calendar size={12} className="mr-2" /> Ceremony Date
                                    </div>
                                    <p className="text-xs font-black text-slate-800 bg-orange-50 px-3 py-2 rounded-md">
                                        {selectedAchievement.date ? new Date(selectedAchievement.date).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <Star size={12} className="mr-2" /> Recognition Area
                                    </div>
                                    <p className="text-xs font-black text-slate-800 bg-indigo-50 px-3 py-2 rounded-md uppercase">
                                        {selectedAchievement.category || 'General'}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-100">
                                     <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                        <Clock size={12} className="mr-2" /> Documented On
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500">
                                        {new Date(selectedAchievement.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button
                onClick={() => setSelectedAchievement(null)}
                className="px-12 py-4 bg-orange-600 text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-orange-700 transition-all shadow-xl shadow-orange-100"
              >
                Return to History
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Success Wall</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Celebrate your milestones with the alma mater</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-3 bg-orange-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all"
              >
                <Plus size={18} className="mr-2" /> Share Success
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-900">Achievement Log</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Help us celebrate your growth</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Achievement Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Promoted to Senior Architect"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Context & Description</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us more about this milestone..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Recognition Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sector / Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Professional, Academic"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proof Type</label>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mediaType: 'IMAGE' })}
                            className={`flex-1 flex items-center justify-center p-3 rounded-md border text-xs font-black uppercase tracking-widest transition-all ${formData.mediaType === 'IMAGE' ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            <ImageIcon size={16} className="mr-2" /> Image
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mediaType: 'VIDEO' })}
                            className={`flex-1 flex items-center justify-center p-3 rounded-md border text-xs font-black uppercase tracking-widest transition-all ${formData.mediaType === 'VIDEO' ? 'bg-orange-600 text-white border-orange-600 shadow-lg shadow-orange-100' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            <Video size={16} className="mr-2" /> YouTube
                        </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                        {formData.mediaType === 'IMAGE' ? 'Upload Proof' : 'Reference Link'}
                    </label>
                    {formData.mediaType === 'IMAGE' ? (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                            className="w-full px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold focus:bg-white transition-all"
                        />
                    ) : (
                        <input
                            type="url"
                            placeholder="https://youtu.be/..."
                            value={formData.mediaUrl}
                            onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                        />
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-8 py-3 bg-slate-100 text-slate-500 rounded-md font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center px-10 py-3 bg-orange-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <Trophy size={16} className="mr-2" />}
                    Share achievement
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading success stories...</p>
              </div>
            ) : achievements.length === 0 ? (
              <div className="lg:col-span-2 py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Your wall is ready</h3>
                <p className="text-slate-400 text-sm font-medium mt-2">Document your milestones and inspire others.</p>
              </div>
            ) : achievements.map(achievement => (
              <div key={achievement.id} className="bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-md flex items-center justify-center bg-orange-50 text-orange-600">
                        <Trophy size={22} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors uppercase tracking-tight line-clamp-1">{achievement.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mt-1">
                          Success Record
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(achievement.status)}
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">{achievement.description}</p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <Star size={12} className="mr-1.5" />
                        {achievement.category || 'Legacy'}
                      </div>
                      <button 
                        onClick={() => setSelectedAchievement(achievement)}
                        className="flex items-center text-[11px] font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest"
                      >
                        Details <ChevronRight size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AlumniAchievementHub;
