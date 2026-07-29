'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Sparkles,
  Trophy,
  BookOpen,
  Briefcase,
  Handshake,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Trash2,
  Edit3,
  ExternalLink,
  BarChart2,
  FileText,
  User,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  GraduationCap
} from 'lucide-react';
import AlumniAchievementHub from './AlumniAchievementHub';
import AlumniBlogHub from './AlumniBlogHub';
import AlumniCareerHub from './AlumniCareerHub';
import AlumniMentorshipHub from './AlumniMentorshipHub';
import CreatePostModal from './CreatePostModal';

export default function AlumniMyPostsHub() {
  const [activeTab, setActiveTab] = useState<'all' | 'achievements' | 'blogs' | 'careers' | 'mentorship'>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [achievementsList, setAchievementsList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);
  const [careersList, setCareersList] = useState<any[]>([]);
  const [mentorshipList, setMentorshipList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me').then(res => res.json()).then(data => {
      if (!data.error) setUserData(data);
    }).catch(() => { });

    fetchAllMyPosts();
  }, []);

  const fetchAllMyPosts = async () => {
    setLoading(true);
    try {
      const [achRes, blogRes, carRes, menRes] = await Promise.all([
        fetch('/api/alumni/achievements').then(r => r.json()).catch(() => []),
        fetch('/api/alumni/blogs').then(r => r.json()).catch(() => []),
        fetch('/api/alumni/career').then(r => r.json()).catch(() => []),
        fetch('/api/alumni/mentorship').then(r => r.json()).catch(() => []),
      ]);

      setAchievementsList(Array.isArray(achRes) ? achRes : []);
      setBlogsList(Array.isArray(blogRes) ? blogRes : []);
      setCareersList(Array.isArray(carRes) ? carRes : []);
      setMentorshipList(Array.isArray(menRes) ? menRes : []);
    } catch (err) {
      console.error('Error fetching my posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSelect = (type: 'achievement' | 'story' | 'job' | 'mentorship') => {
    if (type === 'achievement') setActiveTab('achievements');
    else if (type === 'story') setActiveTab('blogs');
    else if (type === 'job') setActiveTab('careers');
    else if (type === 'mentorship') setActiveTab('mentorship');
  };

  // Compute real analytics
  const totalCount = achievementsList.length + blogsList.length + careersList.length + mentorshipList.length;
  const approvedCount = [
    ...achievementsList,
    ...blogsList,
    ...careersList,
    ...mentorshipList
  ].filter(i => i.status === 'APPROVED').length;
  const pendingCount = totalCount - approvedCount;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* 1. Portal Theme Alumni Creator Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl shadow-slate-900/5 overflow-hidden relative group">
        
        {/* Portal Signature Gradient Header */}
        <div className="h-32 bg-gradient-to-r from-[#143d43] via-[#1b4a50] to-[#0d2a4a] relative p-6 flex items-start justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
            <Sparkles size={13} className="text-amber-300 animate-pulse" />
            <span>Alumni Creator Hub</span>
          </span>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>+ Create New Post</span>
          </button>
        </div>

        {/* Profile Details & Live Analytics Grid */}
        <div className="p-6 pt-0 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-10 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative shrink-0">
                {userData?.profilePic ? (
                  <img src={userData.profilePic} alt={userData.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden">
                    {userData?.name ? userData.name.charAt(0) : 'A'}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">✓</span>
              </div>

              <div className="mb-1">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">{userData?.name || 'Alumni Creator'}</h2>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <GraduationCap size={14} className="text-blue-600" />
                  <span>Batch of {userData?.batchYear || '2026-27'}</span>
                  <span>·</span>
                  <span>{userData?.schoolName || 'Madni Education Trust'}</span>
                </p>
              </div>
            </div>

            {/* Real Analytics Counter Cards */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-center min-w-[85px]">
                <span className="text-lg font-black text-slate-900 block leading-none">{totalCount}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center min-w-[85px]">
                <span className="text-lg font-black text-emerald-700 block leading-none">{approvedCount}</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Approved</span>
              </div>
              <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-center min-w-[85px]">
                <span className="text-lg font-black text-amber-700 block leading-none">{pendingCount}</span>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">In Review</span>
              </div>
            </div>
          </div>

          {/* 2. Portal Palette Quick Post Action Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('achievements')}
              className="p-3.5 rounded-2xl bg-amber-50/60 hover:bg-amber-50 border border-amber-200/80 text-left transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-amber-700 mb-1">
                <span className="flex items-center gap-1.5"><Trophy size={15} /> Achievements</span>
                <span className="bg-amber-200/60 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-black">{achievementsList.length}</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">Share awards & honors</p>
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200/80 text-left transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-blue-700 mb-1">
                <span className="flex items-center gap-1.5"><BookOpen size={15} /> Stories / Blogs</span>
                <span className="bg-blue-200/60 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-black">{blogsList.length}</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">Write articles & memories</p>
            </button>

            <button
              onClick={() => setActiveTab('careers')}
              className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-200/80 text-left transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-emerald-700 mb-1">
                <span className="flex items-center gap-1.5"><Briefcase size={15} /> Jobs & Internships</span>
                <span className="bg-emerald-200/60 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-black">{careersList.length}</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">Post hiring opportunities</p>
            </button>

            <button
              onClick={() => setActiveTab('mentorship')}
              className="p-3.5 rounded-2xl bg-purple-50/60 hover:bg-purple-50 border border-purple-200/80 text-left transition-all hover:scale-[1.02] cursor-pointer group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-purple-700 mb-1">
                <span className="flex items-center gap-1.5"><Handshake size={15} /> Mentorship</span>
                <span className="bg-purple-200/60 text-purple-800 text-[10px] px-2 py-0.5 rounded-full font-black">{mentorshipList.length}</span>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-1 font-medium">Offer student sessions</p>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Submissions Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All My Posts', count: totalCount },
          { id: 'achievements', label: 'Achievements', count: achievementsList.length },
          { id: 'blogs', label: 'Stories & Blogs', count: blogsList.length },
          { id: 'careers', label: 'Jobs & Internships', count: careersList.length },
          { id: 'mentorship', label: 'Mentorship Offers', count: mentorshipList.length },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${active ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Submissions Manager Content */}
      {activeTab === 'achievements' ? (
        <AlumniAchievementHub />
      ) : activeTab === 'blogs' ? (
        <AlumniBlogHub />
      ) : activeTab === 'careers' ? (
        <AlumniCareerHub />
      ) : activeTab === 'mentorship' ? (
        <AlumniMentorshipHub />
      ) : (
        /* ALL POSTS MANAGER LIST */
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold">Loading your posts...</div>
          ) : totalCount === 0 ? (
            <div className="bg-white/90 p-10 text-center space-y-3 rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText size={22} />
              </div>
              <h3 className="text-sm font-bold text-slate-800">You haven't submitted any posts yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">Share your achievements, write a blog, or post a job opportunity to help Madni students!</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>Create First Post</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {[
                ...achievementsList.map(i => ({ ...i, itemType: 'achievement' })),
                ...blogsList.map(i => ({ ...i, itemType: 'story' })),
                ...careersList.map(i => ({ ...i, itemType: i.type?.toLowerCase() || 'job', title: `${i.role} at ${i.companyName}` })),
                ...mentorshipList.map(i => ({ ...i, itemType: 'mentorship' }))
              ].map((post) => {
                const isApproved = post.status === 'APPROVED';
                return (
                  <article
                    key={`post-${post.itemType}-${post.id}`}
                    className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl text-white flex items-center justify-center shrink-0 shadow-sm ${
                          post.itemType === 'achievement' ? 'bg-amber-500' :
                          post.itemType === 'story' ? 'bg-blue-600' :
                          post.itemType === 'mentorship' ? 'bg-purple-600' : 'bg-emerald-600'
                        }`}>
                          {post.itemType === 'achievement' ? <Trophy size={18} /> :
                           post.itemType === 'story' ? <BookOpen size={18} /> :
                           post.itemType === 'mentorship' ? <Handshake size={18} /> : <Briefcase size={18} />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {post.itemType}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {isApproved ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                              <span>{isApproved ? 'APPROVED' : 'PENDING REVIEW'}</span>
                            </span>
                          </div>
                          <h4 className="font-extrabold text-slate-900 text-sm mt-1">{post.title}</h4>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (post.itemType === 'achievement') setActiveTab('achievements');
                          else if (post.itemType === 'story') setActiveTab('blogs');
                          else if (post.itemType === 'mentorship') setActiveTab('mentorship');
                          else setActiveTab('careers');
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline shrink-0 cursor-pointer"
                      >
                        Manage →
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed mb-3">
                      {post.content || post.description}
                    </p>

                    {post.mediaUrl && (
                      <div className="mb-3 rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200/60 max-h-48">
                        <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Posted on {new Date(post.createdAt).toLocaleDateString()}</span>
                      <span className="text-slate-500 font-bold">
                        {isApproved ? 'Visible on Community Feed' : 'Under admin verification'}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Creation Selector Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSelectType={handleCreateSelect}
      />
    </div>
  );
}
