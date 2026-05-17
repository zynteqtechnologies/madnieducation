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
  BookOpen,
  Image as ImageIcon,
  Video,
  Tags,
  FileText
} from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const AlumniBlogHub = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    mediaType: 'IMAGE' as 'IMAGE' | 'VIDEO',
    mediaUrl: '',
    file: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/alumni/blogs');
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
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
      form.append('content', formData.content);
      form.append('tags', formData.tags);
      form.append('mediaType', formData.mediaType);
      
      if (formData.mediaType === 'IMAGE' && formData.file) {
        form.append('file', formData.file);
      } else if (formData.mediaType === 'VIDEO') {
        form.append('mediaUrl', formData.mediaUrl);
      }

      const response = await fetch('/api/alumni/blogs', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        setShowForm(false);
        setFormData({ title: '', content: '', tags: '', mediaType: 'IMAGE', mediaUrl: '', file: null });
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100">Hidden</span>;
      default:
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">Reviewing</span>;
    }
  };

  const renderMedia = (blog: Blog) => {
    if (!blog.mediaUrl) return null;

    if (blog.mediaType === 'IMAGE') {
        return (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                <img src={blog.mediaUrl} alt={blog.title} className="object-cover w-full h-full" />
            </div>
        );
    } else if (blog.mediaType === 'VIDEO') {
        // Attempt to extract YouTube ID
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = blog.mediaUrl.match(regExp);
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
        } else {
            return (
                <div className="p-4 bg-slate-50 rounded-xl border border-dotted border-slate-300 flex items-center justify-center text-xs font-bold text-slate-400">
                    <Video size={16} className="mr-2" /> Invalid YouTube Link: {blog.mediaUrl}
                </div>
            )
        }
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {selectedBlog ? (
        <div className="animate-in slide-in-from-right duration-500">
          <button 
            onClick={() => setSelectedBlog(null)}
            className="flex items-center text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-8 hover:translate-x-[-4px] transition-transform"
          >
            ← Back to Blog Hub
          </button>

          <div className="bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedBlog.title}</h3>
                        </div>
                        {getStatusBadge(selectedBlog.status)}
                    </div>
                </div>
            </div>

            <div className="p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        {renderMedia(selectedBlog)}
                        
                        <div className="space-y-4">
                            <div className="flex items-center text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                                <FileText size={16} className="mr-2" /> Article Content
                            </div>
                            <div className="text-base font-medium text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                {selectedBlog.content}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">Metadata</h4>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                        <Calendar size={12} className="mr-2" /> Published
                                    </div>
                                    <p className="text-xs font-black text-slate-800 bg-indigo-50 px-3 py-2 rounded-md">
                                        {new Date(selectedBlog.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                                    <div className="space-y-2">
                                        <div className="flex items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <Tags size={12} className="mr-2" /> Tags
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBlog.tags.map((tag, i) => (
                                                <span key={i} className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-12 py-4 bg-indigo-600 text-white rounded-lg font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
              >
                Return to Listing
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Alumni Insights</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Share your wisdom and experiences</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
              >
                <Plus size={18} className="mr-2" /> Share Your Story
              </button>
            )}
          </div>

          {showForm && (
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-900">Compose Article</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Inspire the community with your words</p>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Article Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter a compelling title..."
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Write your article here..."
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tags (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. Life Advice, Career, Tech"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Media Type</label>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mediaType: 'IMAGE' })}
                            className={`flex-1 flex items-center justify-center p-3 rounded-md border text-xs font-black uppercase tracking-widest transition-all ${formData.mediaType === 'IMAGE' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            <ImageIcon size={16} className="mr-2" /> Image
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mediaType: 'VIDEO' })}
                            className={`flex-1 flex items-center justify-center p-3 rounded-md border text-xs font-black uppercase tracking-widest transition-all ${formData.mediaType === 'VIDEO' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            <Video size={16} className="mr-2" /> YouTube
                        </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    {formData.mediaType === 'IMAGE' ? 'Upload Illustration' : 'YouTube Link'}
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
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.mediaUrl}
                        onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-4 focus:ring-indigo-500/5 focus:bg-white text-sm font-bold transition-all"
                    />
                  )}
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
                    className="flex items-center px-10 py-3 bg-indigo-600 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="animate-spin mr-2" size={16} /> : <BookOpen size={16} className="mr-2" />}
                    Publish Article
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center bg-white rounded-md border border-slate-100 shadow-sm">
                <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading articles...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="lg:col-span-2 py-20 text-center bg-white rounded-md border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900">The page is empty</h3>
                <p className="text-slate-400 text-sm font-medium mt-2">Start writing your first insightful blog today.</p>
              </div>
            ) : blogs.map(blog => (
              <div key={blog.id} className="bg-white rounded-md border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-md flex items-center justify-center bg-indigo-50 text-indigo-600">
                        <BookOpen size={22} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{blog.title}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center mt-1">
                          Knowledge Pool
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(blog.status)}
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">{blog.content}</p>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        <Calendar size={12} className="mr-1.5" />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <button 
                        onClick={() => setSelectedBlog(blog)}
                        className="flex items-center text-[11px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                      >
                        Manage <ChevronRight size={14} className="ml-1" />
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

export default AlumniBlogHub;
