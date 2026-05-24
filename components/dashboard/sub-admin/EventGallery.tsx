'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays,
  Plus,
  Image as ImageIcon,
  Video,
  Trash2,
  Loader2,
  X,
  PlayCircle
} from 'lucide-react';
import Image from 'next/image';

interface Media {
  id: string;
  mediaType: 'IMAGE' | 'VIDEO';
  url: string;
  fileId?: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  media: Media[];
}

interface EventGalleryProps {
  schoolId: string;
}

export default function EventGallery({ schoolId }: EventGalleryProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isYoutubeModalOpen, setIsYoutubeModalOpen] = useState(false);
  
  // Form state
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [isAddingMedia, setIsAddingMedia] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/subadmin/events');
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch events', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch('/api/subadmin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          description: newEventDesc,
          date: newEventDate
        })
      });
      if (res.ok) {
        const newEvent = await res.json();
        setEvents([newEvent, ...events]);
        setIsEventModalOpen(false);
        setNewEventTitle('');
        setNewEventDesc('');
        setNewEventDate('');
      }
    } catch (error) {
      alert('Failed to create event');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entire event and all its media?')) return;
    try {
      await fetch(`/api/subadmin/events?id=${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to delete event');
    }
  };

  const handleDeleteMedia = async (eventId: string, mediaId: string) => {
    if (!confirm('Delete this media?')) return;
    try {
      await fetch(`/api/subadmin/events/media?id=${mediaId}`, { method: 'DELETE' });
      setEvents(events.map(e => {
        if (e.id === eventId) {
          return { ...e, media: e.media.filter(m => m.id !== mediaId) };
        }
        return e;
      }));
    } catch (error) {
      console.error('Failed to delete media');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, eventId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input
    e.target.value = '';
    
    setIsAddingMedia(true);
    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('mediaType', 'IMAGE');
    formData.append('file', file);

    try {
      const res = await fetch('/api/subadmin/events/media', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const newMedia = await res.json();
        setEvents(events.map(ev => {
          if (ev.id === eventId) {
            return { ...ev, media: [newMedia, ...ev.media] };
          }
          return ev;
        }));
      } else {
        alert('Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsAddingMedia(false);
    }
  };

  const handleAddYoutube = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEventId || !youtubeUrl) return;
    
    setIsAddingMedia(true);
    const formData = new FormData();
    formData.append('eventId', activeEventId);
    formData.append('mediaType', 'VIDEO');
    formData.append('url', youtubeUrl);

    try {
      const res = await fetch('/api/subadmin/events/media', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const newMedia = await res.json();
        setEvents(events.map(ev => {
          if (ev.id === activeEventId) {
            return { ...ev, media: [newMedia, ...ev.media] };
          }
          return ev;
        }));
        setIsYoutubeModalOpen(false);
        setYoutubeUrl('');
      } else {
        alert('Failed to add video');
      }
    } catch (error) {
      alert('Failed to add video');
    } finally {
      setIsAddingMedia(false);
    }
  };

  const getYoutubeVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#dac48b]" size={32} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3 rounded-md border border-slate-200 shadow-sm shrink-0">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Event Gallery</h2>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Manage school events, photos, and videos</p>
        </div>
        <button
          onClick={() => setIsEventModalOpen(true)}
          className="flex items-center px-4 py-1.5 bg-[#18181b] text-white rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-all shadow-sm"
        >
          <Plus size={14} className="mr-2" />
          Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#efebe1] border border-[#e4dcd1] text-[#8b7355] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CalendarDays size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Events Yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">Create an event to start uploading photos and YouTube videos to your school's gallery.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4 bg-slate-50/50">
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-slate-900">{event.title}</h2>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                      {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  {event.description && <p className="text-sm text-slate-500 mt-2">{event.description}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={(e) => handleImageUpload(e, event.id)}
                      disabled={isAddingMedia}
                    />
                    <button className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all pointer-events-none">
                      <ImageIcon size={14} className="mr-2 text-[#dac48b]" />
                      Upload Photo
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setActiveEventId(event.id);
                      setIsYoutubeModalOpen(true);
                    }}
                    disabled={isAddingMedia}
                    className="flex items-center px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
                  >
                    <Video size={14} className="mr-2 text-red-500" />
                    Add Video
                  </button>

                  <div className="w-px h-6 bg-slate-200 mx-2"></div>

                  <button 
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {event.media.length === 0 ? (
                  <p className="text-sm text-slate-400 italic text-center py-8">No media uploaded yet for this event.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {event.media.map(item => (
                      <div key={item.id} className="relative group aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        {item.mediaType === 'IMAGE' ? (
                          <Image src={item.url} alt="Event photo" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full relative">
                            <Image 
                              src={`https://img.youtube.com/vi/${getYoutubeVideoId(item.url)}/maxresdefault.jpg`} 
                              alt="Video thumbnail" 
                              fill 
                              className="object-cover" 
                              unoptimized
                              onError={(e) => {
                                // Fallback to lower quality if maxres doesn't exist
                                e.currentTarget.src = `https://img.youtube.com/vi/${getYoutubeVideoId(item.url)}/hqdefault.jpg`;
                              }}
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                              <PlayCircle size={32} className="text-white drop-shadow-md" />
                            </div>
                          </div>
                        )}
                        
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => handleDeleteMedia(event.id, item.id)}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEventModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create New Event</h3>
              <button onClick={() => setIsEventModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Event Title</label>
                <input
                  required
                  type="text"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#dac48b]/20 focus:border-[#dac48b] transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g. Annual Sports Day"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Date</label>
                <input
                  required
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#dac48b]/20 focus:border-[#dac48b] transition-all bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">Description (Optional)</label>
                <textarea
                  value={newEventDesc}
                  onChange={(e) => setNewEventDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#dac48b]/20 focus:border-[#dac48b] transition-all bg-slate-50 focus:bg-white resize-none"
                  rows={3}
                  placeholder="A brief description of the event..."
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#18181b] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-black transition-all disabled:opacity-50"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add YouTube Modal */}
      {isYoutubeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsYoutubeModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Add YouTube Video</h3>
              <button onClick={() => setIsYoutubeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddYoutube} className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1">YouTube Video URL</label>
                <input
                  required
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all bg-slate-50 focus:bg-white"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAddingMedia}
                  className="w-full flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isAddingMedia ? <Loader2 size={16} className="animate-spin" /> : 'Add Video Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
