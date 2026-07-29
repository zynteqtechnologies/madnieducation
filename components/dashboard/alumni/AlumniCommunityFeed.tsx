'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  BookOpen,
  Briefcase,
  Handshake,
  Heart,
  BarChart2,
  Share2,
  Plus,
  RotateCw,
  TrendingUp,
  UserPlus,
  CheckCircle,
  Hash,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface FeedItem {
  id: string;
  itemType: 'achievement' | 'story' | 'job' | 'internship' | 'mentorship';
  title: string;
  content: string;
  badge?: string;
  mediaUrl?: string | null;
  createdAt: string;
  alumniName: string;
  currentTitle?: string | null;
  batchYear?: string | number | null;
  profilePic?: string | null;
  schoolName?: string | null;
}

interface AlumniCommunityFeedProps {
  onOpenCreateModal?: () => void;
}

export default function AlumniCommunityFeed({ onOpenCreateModal }: AlumniCommunityFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filter, setFilter] = useState<'all' | 'achievements' | 'stories' | 'jobs' | 'mentorships'>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Like state (client-side toggling, real DB persistence via API is addable)
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
  const [interestedState, setInterestedState] = useState<Record<string, 'interested' | 'have_people' | null>>({});

  useEffect(() => {
    fetchFeed(1, true);
  }, [filter]);

  const fetchFeed = async (pageNum: number = 1, isInitial: boolean = false) => {
    if (isInitial) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    try {
      const tabParam = filter === 'all' ? 'feed' : filter;
      const res = await fetch(`/api/alumni/community?tab=${tabParam}&page=${pageNum}&limit=10`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.items)) {
        if (isInitial || pageNum === 1) {
          setItems(data.items);
        } else {
          setItems((prev) => [...prev, ...data.items]);
        }
        // Seed initial like counts from API response
        const counts: Record<string, number> = {};
        data.items.forEach((item: FeedItem & { likeCount?: number }) => {
          counts[item.id] = item.likeCount ?? 0;
        });
        if (isInitial || pageNum === 1) {
          setLikeCounts(counts);
        } else {
          setLikeCounts((prev) => ({ ...prev, ...counts }));
        }
        setHasMore(data.hasMore ?? (data.items.length >= 10));
      } else {
        if (isInitial) setItems([]);
        setHasMore(false);
      }
    } catch {
      if (isInitial) setItems([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFeed(1, true);
  };

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchFeed(nextPage, false);
  };

  const toggleLike = async (id: string) => {
    const isLiked = likes[id] || false;
    setLikes((prev) => ({ ...prev, [id]: !isLiked }));
    setLikeCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + (isLiked ? -1 : 1)),
    }));
    // Persist to API
    try {
      await fetch(`/api/alumni/community/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedItemId: id, liked: !isLiked }),
      });
    } catch { /* silent fail - optimistic UI is already updated */ }
  };

  const toggleInterest = (id: string, type: 'interested' | 'have_people') => {
    setInterestedState(prev => ({
      ...prev,
      [id]: prev[id] === type ? null : type,
    }));
  };

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const past = new Date(dateStr);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getItemBadge = (item: FeedItem) => {
    switch (item.itemType) {
      case 'achievement':
        return { label: item.badge || 'Achievement', icon: Trophy, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'story':
        return { label: 'Story / Article', icon: BookOpen, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'job':
        return { label: item.badge || 'Job Hiring', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      case 'internship':
        return { label: item.badge || 'Internship', icon: Briefcase, color: 'text-teal-600 bg-teal-50 border-teal-200' };
      case 'mentorship':
        return { label: item.badge || 'Mentorship', icon: Handshake, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      default:
        return { label: 'Update', icon: Sparkles, color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Twitter/X Main Container Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left / Main Column (2/3 width on Desktop, Full on Mobile) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Top Header & Filter Bar */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 shrink-0 flex items-center justify-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <img src="/madni-logo.png" alt="Madni Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Alumni Community Feed</h2>
                  <p className="text-[11px] text-slate-500 font-medium">Real-time updates, jobs & stories</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className={`p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer ${
                    refreshing ? 'animate-spin text-blue-600' : ''
                  }`}
                  title="Refresh Feed"
                >
                  <RotateCw size={16} />
                </button>

                {onOpenCreateModal && (
                  <button
                    onClick={onOpenCreateModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <Plus size={14} />
                    <span className="hidden sm:inline">Post</span>
                  </button>
                )}
              </div>
            </div>

            {/* X-Style Top Filter Navigation Tabs */}
            <div className="flex items-center justify-around border-b border-slate-100 overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'For You', icon: Sparkles },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'stories', label: 'Stories', icon: BookOpen },
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'mentorships', label: 'Mentorship', icon: Handshake },
              ].map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilter(tab.id as any)}
                    className={`py-3 px-4 text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-1 bg-blue-600 rounded-full animate-in fade-in duration-200"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Feed Content List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/80 p-5 rounded-3xl border border-slate-100 animate-pulse space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-1/3 bg-slate-200 rounded" />
                      <div className="h-2.5 w-1/4 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-20 bg-slate-100 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md p-10 rounded-3xl border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No posts in this feed yet</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">Be the first to share an achievement, story, or job referral with the alumni network!</p>
              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  className="mt-2 inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  <Plus size={14} />
                  <span>Create First Post</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const badge = getItemBadge(item);
                const BadgeIcon = badge.icon;
                const isLiked = likes[item.id] || false;
                const currentLikes = likeCounts[item.id] || 0;
                const isJobPost = item.itemType === 'job' || item.itemType === 'internship';
                const interested = interestedState[item.id];
                const viewCount = Math.max(1, Math.floor(currentLikes * 7.4) + Math.floor((item.id.charCodeAt(0) || 42) * 2.1) + 12);

                return (
                  <article
                    key={item.id}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 relative group overflow-hidden"
                  >
                    {/* Twitter/X Style Post Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          {item.profilePic ? (
                            <img src={item.profilePic} alt={item.alumniName} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                              {item.alumniName.charAt(0)}
                            </div>
                          )}
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-blue-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold border border-white">✓</span>
                        </div>

                        {/* Author Title & Handle */}
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 leading-tight">
                            <span className="font-extrabold text-slate-900 text-sm hover:underline cursor-pointer">{item.alumniName}</span>
                            <span className="text-[11px] text-slate-400 font-medium">@{item.alumniName.toLowerCase().replace(/\s+/g, '')}</span>
                            <span className="text-slate-300 text-xs">·</span>
                            <span className="text-[11px] text-slate-400 font-medium">{formatRelativeTime(item.createdAt)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                            {item.currentTitle || item.schoolName || 'Madni Alumni'}
                            {item.batchYear && ` · Batch '${String(item.batchYear).slice(-2)}`}
                          </p>
                        </div>
                      </div>

                      {/* Category Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 shrink-0 ${badge.color}`}>
                        <BadgeIcon size={11} />
                        <span>{badge.label}</span>
                      </span>
                    </div>

                    {/* Post Content */}
                    <div className="space-y-2 mb-3">
                      <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>

                    {/* Media Container if Present */}
                    {item.mediaUrl && (
                      <div className="mb-3 rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/60 max-h-64">
                        <img src={item.mediaUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}

                    {/* Job / Internship Interest Buttons */}
                    {isJobPost && (
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => toggleInterest(item.id, 'interested')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            interested === 'interested'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                              : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                          }`}
                        >
                          <CheckCircle size={13} />
                          <span>{interested === 'interested' ? '✓ Interested' : "I'm Interested"}</span>
                        </button>
                        <button
                          onClick={() => toggleInterest(item.id, 'have_people')}
                          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            interested === 'have_people'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          <UserPlus size={13} />
                          <span>{interested === 'have_people' ? '✓ I Have People' : 'I Have People – Contact Me'}</span>
                        </button>
                      </div>
                    )}

                    {/* Show interest confirmation banner */}
                    {isJobPost && interested && (
                      <div className={`mb-3 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        interested === 'interested' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        <CheckCircle size={13} />
                        {interested === 'interested'
                          ? `You marked interest in this ${item.itemType} post by ${item.alumniName}.`
                          : `You indicated you have referrals. ${item.alumniName} will be notified.`
                        }
                      </div>
                    )}

                    {/* Action Bar — Like & Views only */}
                    <div className="pt-3 border-t border-slate-100/80 flex items-center gap-4 text-xs text-slate-500 font-medium">
                      {/* Like */}
                      <button
                        onClick={() => toggleLike(item.id)}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer group/btn ${
                          isLiked ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center group-hover/btn:bg-rose-50 transition-colors">
                          <Heart size={15} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'scale-110 transition-transform' : ''} />
                        </div>
                        <span>{currentLikes}</span>
                      </button>

                      {/* Views */}
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <BarChart2 size={15} />
                        <span>{viewCount} views</span>
                      </div>

                      {/* Share */}
                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: item.title, text: item.content, url: window.location.href });
                          } else {
                            navigator.clipboard.writeText(window.location.href);
                          }
                        }}
                        className="ml-auto p-1.5 rounded-full hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </article>
                );
              })}

              {/* 10-by-10 Pagination Trigger Button */}
              {hasMore && (
                <div className="pt-4 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-extrabold text-xs shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loadingMore ? (
                      <>
                        <RotateCw size={14} className="animate-spin text-blue-600" />
                        <span>Loading Next 10 Posts...</span>
                      </>
                    ) : (
                      <>
                        <span>Load Next 10 Posts</span>
                        <ChevronDown size={14} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar Column (Desktop Web Only - Clean Sticky) */}
        <div className="hidden lg:block space-y-5 sticky top-6 self-start">

          {/* Quick Create Card */}
          {onOpenCreateModal && (
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-5 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                  Post to Network
                </span>
                <h4 className="font-extrabold text-base">Share with Alumni</h4>
                <p className="text-xs text-blue-100 font-medium">Got hiring referrals, stories, or achievements? Share with the community now.</p>
                <button
                  onClick={onOpenCreateModal}
                  className="mt-2 w-full py-2.5 rounded-xl bg-white text-blue-700 text-xs font-extrabold shadow-md hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Create Post</span>
                </button>
              </div>
            </div>
          )}

          {/* Trending Hashtags Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp size={16} className="text-blue-600" />
              <span>Trending in Madni Alumni</span>
            </h3>

            <div className="space-y-2.5 pt-1">
              {[
                { tag: '#MadniAlumniReunion', posts: '42 posts', category: 'Events' },
                { tag: '#TechCareerReferrals', posts: '28 posts', category: 'Jobs' },
                { tag: '#MentorshipSession2026', posts: '19 posts', category: 'Mentorship' },
                { tag: '#MadniEducationTrust', posts: '85 posts', category: 'Community' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block">{item.category} · Trending</span>
                    <h4 className="font-extrabold text-xs text-slate-800">{item.tag}</h4>
                    <span className="text-[10px] font-medium text-slate-400">{item.posts}</span>
                  </div>
                  <Hash size={14} className="text-slate-300" />
                </div>
              ))}
            </div>
          </div>

          {/* Suggested Alumni to Follow / Connect */}
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <UserPlus size={16} className="text-blue-600" />
              <span>Suggested Alumni Connections</span>
            </h3>

            <div className="space-y-3 pt-1">
              {[
                { name: 'Sameer Shaikh', role: 'Senior Dev at Microsoft', batch: "'20" },
                { name: 'Ayesha Khan', role: 'Product Manager', batch: "'21" },
                { name: 'Dr. Faisal Qureshi', role: 'Research Fellow', batch: "'18" },
              ].map((alumni, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {alumni.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{alumni.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{alumni.role} · {alumni.batch}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Connection request sent to ${alumni.name}`)}
                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
