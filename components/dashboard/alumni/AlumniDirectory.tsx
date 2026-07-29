'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Users, BookOpen, Trophy, Briefcase, GraduationCap, Handshake,
  Search, Mail, ExternalLink, Loader2, X, Star, Building2, User,
  MessageCircle, Globe, ChevronRight, Award, Copy, Check, Link2
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AlumniMember {
  id: string;
  name: string;
  email: string;
  batchYear: string | null;
  linkedIn: string | null;
  profilePic: string | null;
  currentTitle: string | null;
  currentBio: string | null;
  workLink: string | null;
  schoolName: string | null;
}

interface CommunityItem {
  id: string;
  // blog/achievement/job/internship/mentorship fields
  title?: string;
  content?: string;
  description?: string;
  category?: string;
  companyName?: string;
  companyLink?: string;
  role?: string;
  relation?: string;
  targetStudent?: string;
  availability?: string;
  type?: string;
  mediaUrl?: string;
  // alumni info
  alumniName: string;
  currentTitle: string | null;
  batchYear: string | null;
  profilePic: string | null;
  alumniId: string;
  alumniEmail: string;
  schoolName: string;
  createdAt?: string;
}

interface Topper {
  id: string;
  studentName: string;
  percentage: string | null;
  rank: string | null;
  marks: string | null;
  totalMarks: string | null;
  academicYear: string | null;
  standardName: string;
  stream: string | null;
  schoolName: string;
}

type TabKey = 'directory' | 'stories' | 'achievements' | 'jobs' | 'internships' | 'mentorships' | 'toppers';

const TABS: { key: TabKey; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'directory',    label: 'All Alumni',    icon: <Users size={15} />,         color: 'blue' },
  { key: 'stories',      label: 'Stories',       icon: <BookOpen size={15} />,      color: 'emerald' },
  { key: 'achievements', label: 'Achievements',  icon: <Trophy size={15} />,        color: 'amber' },
  { key: 'jobs',         label: 'Job Openings',  icon: <Briefcase size={15} />,     color: 'violet' },
  { key: 'internships',  label: 'Internships',   icon: <GraduationCap size={15} />, color: 'sky' },
  { key: 'mentorships',  label: 'Mentorship',    icon: <Handshake size={15} />,     color: 'rose' },
  { key: 'toppers',      label: 'Top Achievers', icon: <Star size={15} />,          color: 'yellow' },
];

const tabColor: Record<string, string> = {
  blue:    'bg-blue-600 text-white',
  emerald: 'bg-emerald-600 text-white',
  amber:   'bg-amber-500 text-white',
  violet:  'bg-violet-600 text-white',
  sky:     'bg-sky-600 text-white',
  rose:    'bg-rose-500 text-white',
  yellow:  'bg-yellow-500 text-white',
};

const tabBorder: Record<string, string> = {
  blue:    'border-blue-200 hover:border-blue-400',
  emerald: 'border-emerald-200 hover:border-emerald-400',
  amber:   'border-amber-200 hover:border-amber-400',
  violet:  'border-violet-200 hover:border-violet-400',
  sky:     'border-sky-200 hover:border-sky-400',
  rose:    'border-rose-200 hover:border-rose-400',
  yellow:  'border-yellow-200 hover:border-yellow-400',
};

// ─── Quick Message Templates ──────────────────────────────────────────────────

const MESSAGE_TEMPLATES = {
  job:         "Hi! I came across your job opening at {company} for {role}. I'm a Madni Alumni and would love to connect and learn more about this opportunity.",
  internship:  "Hello! I'm a Madni Alumni interested in the {role} internship at {company}. I'd love to know more about it and share my background.",
  mentorship:  "As-salamu alaykum! I'm a Madni Alumni and very interested in your mentorship session '{title}'. Would you be available to connect?",
  story:       "Congratulations on your inspiring journey! As a fellow Madni Alumnus, your story truly motivated me. Would love to connect and learn from your experience.",
  achievement: "Mashallah! Congratulations on your achievement. As a Madni Alumnus, I'm really inspired by your success. Would love to connect and celebrate!",
  general:     "As-salamu alaykum! I found your profile on the Madni Alumni Hub and would love to connect as fellow graduates.",
};

function buildMessage(template: string, item?: CommunityItem) {
  return template
    .replace('{company}', item?.companyName || 'your company')
    .replace('{role}', item?.role || 'the role')
    .replace('{title}', item?.title || 'your session');
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

function AlumniAvatar({ name, profilePic, size = 48 }: { name: string; profilePic?: string | null; size?: number }) {
  const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0]?.toUpperCase()).join('');
  if (profilePic) {
    return (
      <div style={{ width: size, height: size }} className="rounded-full overflow-hidden relative border-2 border-white shadow-md flex-shrink-0">
        <Image src={profilePic} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div style={{ width: size, height: size, fontSize: size * 0.32 }} className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white shadow-md flex items-center justify-center font-black text-blue-600 flex-shrink-0">
      {initials}
    </div>
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────────

function ContactModal({ item, type, onClose }: { item: CommunityItem; type: string; onClose: () => void }) {
  const templateKey = type as keyof typeof MESSAGE_TEMPLATES;
  const [message, setMessage] = useState(buildMessage(MESSAGE_TEMPLATES[templateKey] || MESSAGE_TEMPLATES.general, item));
  const [copied, setCopied] = useState(false);

  const mailtoLink = `mailto:${item.alumniEmail}?subject=Madni Alumni Network – Connecting with ${item.alumniName}&body=${encodeURIComponent(message)}`;

  const copyMessage = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-8 animate-in zoom-in-95 duration-200 space-y-5">
        <button onClick={onClose} className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={18} />
        </button>

        <div className="flex items-center gap-4">
          <AlumniAvatar name={item.alumniName} profilePic={item.profilePic} size={56} />
          <div>
            <h3 className="text-lg font-black text-slate-900">{item.alumniName}</h3>
            <p className="text-xs text-slate-500 font-semibold">{item.currentTitle || 'Madni Alumnus'}</p>
            <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">Class of {item.batchYear || 'N/A'}</p>
          </div>
        </div>

        {/* Context pill */}
        {(item.title || item.role || item.companyName) && (
          <div className="bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Regarding</p>
            <p className="text-sm font-bold text-slate-800">{item.title || item.role}</p>
            {item.companyName && <p className="text-xs text-slate-500 font-medium">{item.companyName}</p>}
          </div>
        )}

        {/* Message Editor */}
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ready Message (edit before sending)</p>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            className="w-full text-sm text-slate-700 font-medium bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <a
            href={mailtoLink}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-2xl transition-all shadow-md shadow-blue-600/25 active:scale-95"
          >
            <Mail size={16} />
            Send Email
          </a>
          <button
            onClick={copyMessage}
            className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 px-5 rounded-2xl transition-all active:scale-95"
          >
            {copied ? '✓ Copied!' : 'Copy'}
          </button>
          {item.alumniId && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 px-5 rounded-2xl transition-all active:scale-95"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Individual Item Cards ────────────────────────────────────────────────────

function StoryCard({ item, onContact }: { item: CommunityItem; onContact: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const preview = item.content ? item.content.slice(0, 200) + (item.content.length > 200 ? '...' : '') : '';
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4">
      <div className="flex items-start gap-3">
        <AlumniAvatar name={item.alumniName} profilePic={item.profilePic} size={44} />
        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-900 text-sm leading-tight">{item.alumniName}</p>
          <p className="text-[10px] text-slate-500 font-semibold">{item.currentTitle} · Class of {item.batchYear}</p>
          <p className="text-[10px] text-blue-600 font-bold">{item.schoolName}</p>
        </div>
        <span className="bg-emerald-50 text-emerald-600 text-[9px] font-bold px-2.5 py-1 rounded-full border border-emerald-100 whitespace-nowrap">Story</span>
      </div>
      <h3 className="font-extrabold text-slate-900 text-base leading-snug">{item.title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{expanded ? item.content : preview}</p>
      {item.content && item.content.length > 200 && (
        <button onClick={() => setExpanded(!expanded)} className="text-xs font-bold text-blue-600 hover:underline">
          {expanded ? 'Show less ↑' : 'Read more →'}
        </button>
      )}
      <button onClick={onContact} className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-all">
        <MessageCircle size={13} /> Connect & Congratulate
      </button>
    </div>
  );
}

function AchievementCard({ item, onContact }: { item: CommunityItem; onContact: () => void }) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4">
      <div className="flex items-start gap-3">
        <AlumniAvatar name={item.alumniName} profilePic={item.profilePic} size={44} />
        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-900 text-sm">{item.alumniName}</p>
          <p className="text-[10px] text-slate-500 font-semibold">{item.currentTitle} · Class of {item.batchYear}</p>
          <p className="text-[10px] text-blue-600 font-bold">{item.schoolName}</p>
        </div>
        {item.category && (
          <span className="bg-amber-50 text-amber-600 text-[9px] font-bold px-2.5 py-1 rounded-full border border-amber-100 whitespace-nowrap">{item.category}</span>
        )}
      </div>
      <div className="flex gap-3">
        <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 flex-shrink-0">
          <Trophy size={20} />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{item.title}</h3>
          <p className="text-sm text-slate-600 leading-relaxed mt-1">{item.description}</p>
        </div>
      </div>
      <button onClick={onContact} className="flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-all">
        <MessageCircle size={13} /> Send Congratulations
      </button>
    </div>
  );
}

function CareerCard({ item, type, onContact }: { item: CommunityItem; type: 'job' | 'internship'; onContact: () => void }) {
  const isJob = type === 'job';
  return (
    <div className={`bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border shadow-lg hover:shadow-xl transition-all duration-300 space-y-4 ${isJob ? 'border-violet-100' : 'border-sky-100'}`}>
      <div className="flex items-start gap-3">
        <AlumniAvatar name={item.alumniName} profilePic={item.profilePic} size={40} />
        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-900 text-sm">{item.alumniName}</p>
          <p className="text-[10px] text-slate-500 font-semibold">{item.currentTitle} · Class of {item.batchYear}</p>
        </div>
        <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${isJob ? 'bg-violet-50 text-violet-600 border-violet-100' : 'bg-sky-50 text-sky-600 border-sky-100'}`}>
          {isJob ? '💼 Job' : '🎓 Internship'}
        </span>
      </div>

      <div>
        <h3 className="font-extrabold text-slate-900 text-base">{item.role}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <Building2 size={12} className="text-slate-400" />
          {item.companyLink ? (
            <a href={item.companyLink} target="_blank" rel="noopener noreferrer" className={`text-sm font-bold ${isJob ? 'text-violet-600' : 'text-sky-600'} hover:underline flex items-center gap-1`}>
              {item.companyName} <ExternalLink size={10} />
            </a>
          ) : (
            <span className="text-sm font-bold text-slate-700">{item.companyName}</span>
          )}
        </div>
        {item.relation && <p className="text-xs text-slate-500 font-medium mt-0.5">via {item.relation}</p>}
      </div>

      {item.description && <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>}

      <button
        onClick={onContact}
        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-xl transition-all w-full justify-center ${isJob ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'bg-sky-600 hover:bg-sky-700 text-white'}`}
      >
        <MessageCircle size={13} />
        I am Interested – Contact Alumni
      </button>
    </div>
  );
}

function MentorshipCard({ item, onContact }: { item: CommunityItem; onContact: () => void }) {
  return (
    <div className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-rose-100 shadow-lg hover:shadow-xl transition-all duration-300 space-y-4">
      <div className="flex items-start gap-3">
        <AlumniAvatar name={item.alumniName} profilePic={item.profilePic} size={44} />
        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-900 text-sm">{item.alumniName}</p>
          <p className="text-[10px] text-slate-500 font-semibold">{item.currentTitle} · Class of {item.batchYear}</p>
          <p className="text-[10px] text-blue-600 font-bold">{item.schoolName}</p>
        </div>
        <span className="bg-rose-50 text-rose-500 text-[9px] font-bold px-2.5 py-1 rounded-full border border-rose-100">🤝 Mentor</span>
      </div>
      <div>
        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{item.title}</h3>
        <p className="text-sm text-slate-600 leading-relaxed mt-1">{item.description}</p>
      </div>
      <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5">
        {item.targetStudent && <p className="text-xs font-bold text-slate-700">👤 For: <span className="font-semibold text-slate-600">{item.targetStudent}</span></p>}
        {item.availability && <p className="text-xs font-bold text-slate-700">🕐 <span className="font-semibold text-slate-600">{item.availability}</span></p>}
      </div>
      <button onClick={onContact} className="flex items-center gap-1.5 text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-xl transition-all w-full justify-center">
        <MessageCircle size={13} />
        Request Mentorship Session
      </button>
    </div>
  );
}

function ToppersList({ toppers }: { toppers: Topper[] }) {
  const grouped: Record<string, Topper[]> = {};
  toppers.forEach(t => {
    const key = `${t.schoolName} – Std ${t.standardName}${t.stream ? ` (${t.stream})` : ''}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  });

  return (
    <div className="space-y-6">
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Star size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-bold">No topper data available yet.</p>
        </div>
      )}
      {Object.entries(grouped).map(([group, list]) => (
        <div key={group} className="bg-white/70 backdrop-blur-md p-6 rounded-[2rem] border border-yellow-100 shadow-lg space-y-3">
          <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            {group}
          </h3>
          <div className="divide-y divide-slate-100">
            {list.map((t, idx) => (
              <div key={t.id} className="flex items-center justify-between py-2.5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-yellow-400 text-white' : idx === 1 ? 'bg-slate-300 text-slate-700' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{t.studentName}</p>
                    {t.academicYear && <p className="text-[10px] text-slate-400 font-semibold">{t.academicYear}</p>}
                  </div>
                </div>
                <div className="text-right">
                  {t.percentage && <p className="text-sm font-black text-emerald-600">{parseFloat(t.percentage).toFixed(1)}%</p>}
                  {t.marks && t.totalMarks && <p className="text-[10px] text-slate-400 font-semibold">{t.marks}/{t.totalMarks}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── LinkedIn URL Panel ───────────────────────────────────────────────────────

function LinkedInPanel({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Extract readable handle from URL  (e.g. linkedin.com/in/bilal-shaikh)
  const handle = url.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\/?/i, '').replace(/\/$/, '') || url;

  return (
    <div className="mt-3 rounded-2xl border border-[#0a66c2]/20 bg-[#0a66c2]/5 p-3 space-y-2.5">
      {/* Header row */}
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
          <svg className="w-4 h-4 fill-[#0a66c2]" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </span>
        <p className="text-[10px] font-bold text-[#0a66c2] uppercase tracking-wide">LinkedIn Profile</p>
      </div>

      {/* URL Display */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 overflow-hidden">
        <Link2 size={11} className="text-slate-400 shrink-0" />
        <span className="text-[10px] font-semibold text-slate-600 truncate flex-1">/{handle}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-white border-emerald-500'
              : 'bg-white text-slate-600 border-slate-200 hover:border-[#0a66c2] hover:text-[#0a66c2]'
          }`}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          <span>{copied ? 'Copied!' : 'Copy URL'}</span>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[10px] font-bold bg-[#0a66c2] hover:bg-[#004182] text-white border border-[#0a66c2] transition-all"
        >
          <ExternalLink size={11} />
          <span>Open Profile</span>
        </a>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AlumniDirectory() {
  const [activeTab, setActiveTab] = useState<TabKey>('directory');
  const [alumniList, setAlumniList] = useState<AlumniMember[]>([]);
  const [communityItems, setCommunityItems] = useState<CommunityItem[]>([]);
  const [toppers, setToppers] = useState<Topper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('All');
  const [selectedSchool, setSelectedSchool] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactItem, setContactItem] = useState<{ item: CommunityItem; type: string } | null>(null);
  const itemsPerPage = 9;

  // Fetch directory listing (all alumni)
  const fetchAlumni = useCallback(async () => {
    try {
      const res = await fetch('/api/alumni/directory');
      if (res.ok) {
        const data = await res.json();
        setAlumniList(Array.isArray(data) ? data : []);
      }
    } catch { }
  }, []);

  // Fetch community content by tab
  const fetchCommunity = useCallback(async (tab: TabKey) => {
    if (tab === 'directory') return;
    setLoading(true);
    try {
      const res = await fetch(`/api/alumni/community?tab=${tab}`);
      if (res.ok) {
        const data = await res.json();
        if (tab === 'toppers') {
          setToppers(Array.isArray(data.items) ? data.items : []);
        } else {
          setCommunityItems(Array.isArray(data.items) ? data.items : []);
        }
      }
    } catch { }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchAlumni();
      setLoading(false);
    };
    init();
  }, [fetchAlumni]);

  useEffect(() => {
    if (activeTab !== 'directory') {
      fetchCommunity(activeTab);
    } else {
      setLoading(false);
    }
    setCurrentPage(1);
    setSearchQuery('');
  }, [activeTab, fetchCommunity]);

  const batchYears = ['All', ...Array.from(new Set(alumniList.map(a => a.batchYear).filter(Boolean)))].sort((a, b) => b!.localeCompare(a!));
  const schools = ['All', ...Array.from(new Set(alumniList.map(a => a.schoolName).filter(Boolean)))].sort();

  const filteredAlumni = alumniList.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || (a.currentTitle || '').toLowerCase().includes(q) || (a.schoolName || '').toLowerCase().includes(q);
    const matchBatch = selectedBatch === 'All' || a.batchYear === selectedBatch;
    const matchSchool = selectedSchool === 'All' || a.schoolName === selectedSchool;
    return matchSearch && matchBatch && matchSchool;
  });

  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage);
  const paginated = filteredAlumni.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const filteredCommunity = communityItems.filter(item => {
    const q = searchQuery.toLowerCase();
    return !q || item.alumniName.toLowerCase().includes(q) || (item.title || '').toLowerCase().includes(q) || (item.companyName || '').toLowerCase().includes(q) || (item.role || '').toLowerCase().includes(q);
  });

  const activeTabInfo = TABS.find(t => t.key === activeTab)!;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Tab Navigation (Mobile Dropdown + Desktop Scrollable/Wrap Bar) ── */}
      <div className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xl p-3 sm:p-4">
        {/* Mobile Dropdown (Visible on screens < sm) */}
        <div className="sm:hidden mb-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Select View</label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as TabKey)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 outline-none shadow-sm focus:border-blue-500"
          >
            {TABS.map((tab) => (
              <option key={tab.key} value={tab.key}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Buttons (Horizontal Scrollable on mobile, Centered wrap on desktop) */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-1 sm:pb-0 scroll-smooth snap-x sm:flex-wrap sm:justify-center">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border shrink-0 whitespace-nowrap snap-start ${
                activeTab === tab.key
                  ? tabColor[tab.color] + ' shadow-md'
                  : 'bg-white/60 text-slate-600 ' + tabBorder[tab.color]
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-xl p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            type="text"
            placeholder={`Search in ${activeTabInfo.label}...`}
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl outline-none text-xs font-semibold text-slate-800 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all"
          />
        </div>
        {activeTab === 'directory' && (
          <>
            <select value={selectedBatch} onChange={e => { setSelectedBatch(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 outline-none cursor-pointer">
              <option value="All">All Batches</option>
              {batchYears.filter(b => b !== 'All').map(y => <option key={y} value={y!}>Class of {y}</option>)}
            </select>
            <select value={selectedSchool} onChange={e => { setSelectedSchool(e.target.value); setCurrentPage(1); }} className="px-4 py-2.5 bg-white/70 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 outline-none cursor-pointer">
              <option value="All">All Schools</option>
              {schools.filter(s => s !== 'All').map(s => <option key={s} value={s!}>{s}</option>)}
            </select>
          </>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-blue-500" size={36} />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading {activeTabInfo.label}...</p>
        </div>
      ) : (
        <>
          {/* DIRECTORY TAB */}
          {activeTab === 'directory' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map(member => (
                  <div key={member.id} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/80 shadow-xl flex flex-col gap-4 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      <AlumniAvatar name={member.name} profilePic={member.profilePic} size={56} />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{member.name}</h3>
                        <p className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mt-1">
                          <GraduationCap size={11} /> Batch of {member.batchYear || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50/60 rounded-2xl p-3 space-y-1.5 text-xs">
                      <div className="flex items-center gap-2 text-slate-500 font-bold"><Building2 size={12} className="text-slate-400" /><span className="truncate">{member.schoolName || 'Madni School'}</span></div>
                      <div className="flex items-center gap-2 text-slate-700 font-bold"><Briefcase size={12} className="text-blue-400" /><span className="truncate">{member.currentTitle || 'Graduate'}</span></div>
                    </div>
                    {member.currentBio && <p className="text-xs text-slate-500 italic line-clamp-2 leading-relaxed">"{member.currentBio}"</p>}
                    {/* LinkedIn URL Panel */}
                    {member.linkedIn ? (
                      <LinkedInPanel url={member.linkedIn} />
                    ) : (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-full flex items-center justify-center gap-1.5 mt-3 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-slate-200 transition-all"
                      >
                        <Mail size={11} /> Send Email
                      </a>
                    )}
                  </div>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white/60 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/50 hover:bg-white disabled:opacity-40 shadow-sm transition-all">Previous</button>
                  <span className="text-[11px] font-bold text-slate-500 bg-white/40 px-3 py-1.5 rounded-lg border border-slate-200/50">Page {currentPage} of {totalPages}</span>
                  <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white/60 text-slate-700 font-bold text-xs rounded-xl border border-slate-200/50 hover:bg-white disabled:opacity-40 shadow-sm transition-all">Next</button>
                </div>
              )}
              {filteredAlumni.length === 0 && (
                <div className="text-center py-16 text-slate-400">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No alumni found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {/* STORIES TAB */}
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunity.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400"><BookOpen size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold">No approved stories yet.</p></div>}
              {filteredCommunity.map(item => (
                <StoryCard key={item.id} item={item} onContact={() => setContactItem({ item, type: 'story' })} />
              ))}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunity.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400"><Trophy size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold">No approved achievements yet.</p></div>}
              {filteredCommunity.map(item => (
                <AchievementCard key={item.id} item={item} onContact={() => setContactItem({ item, type: 'achievement' })} />
              ))}
            </div>
          )}

          {/* JOBS TAB */}
          {activeTab === 'jobs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunity.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400"><Briefcase size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold">No job openings posted yet.</p></div>}
              {filteredCommunity.map(item => (
                <CareerCard key={item.id} item={item} type="job" onContact={() => setContactItem({ item, type: 'job' })} />
              ))}
            </div>
          )}

          {/* INTERNSHIPS TAB */}
          {activeTab === 'internships' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunity.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400"><GraduationCap size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold">No internship opportunities posted yet.</p></div>}
              {filteredCommunity.map(item => (
                <CareerCard key={item.id} item={item} type="internship" onContact={() => setContactItem({ item, type: 'internship' })} />
              ))}
            </div>
          )}

          {/* MENTORSHIPS TAB */}
          {activeTab === 'mentorships' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommunity.length === 0 && <div className="col-span-3 text-center py-16 text-slate-400"><Handshake size={40} className="mx-auto mb-3 opacity-30" /><p className="font-bold">No mentorship sessions offered yet.</p></div>}
              {filteredCommunity.map(item => (
                <MentorshipCard key={item.id} item={item} onContact={() => setContactItem({ item, type: 'mentorship' })} />
              ))}
            </div>
          )}

          {/* TOP ACHIEVERS TAB */}
          {activeTab === 'toppers' && <ToppersList toppers={toppers} />}
        </>
      )}

      {/* ── Contact Modal ── */}
      {contactItem && (
        <ContactModal
          item={contactItem.item}
          type={contactItem.type}
          onClose={() => setContactItem(null)}
        />
      )}
    </div>
  );
}
