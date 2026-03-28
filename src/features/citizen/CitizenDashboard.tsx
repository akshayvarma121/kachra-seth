import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Scan, Calendar, Trophy, Ticket, Activity, Crown, QrCode, Camera, MapPin, ShoppingBag, Users, Flame } from 'lucide-react';
import { KachraMascot, type MascotMood } from '@/components/KachraMascot';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/apiClient';

import { ClassifyTab } from './tabs/ClassifyTab';
import { QRScanTab } from './tabs/QRScanTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { LeaderboardTab } from './tabs/LeaderboardTab';
import { RewardsTab } from './tabs/RewardsTab';
import { EventsTab } from './tabs/EventsTab';
import { LitterReportTab } from './tabs/LitterReportTab'; // ✅ IMPORTED

type Tab = 'home' | 'classify' | 'qr' | 'schedule' | 'leaderboard' | 'rewards' | 'events' | 'report';

export const CitizenDashboard = () => {
  const { t } = useLanguage(); 
  const { user, login } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // 🎭 MASCOT STATE
  const [mood, setMood] = useState<MascotMood>('idle');
  const [msg, setMsg] = useState("");

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  // 1. Fetch Real Data & Sync User Profile
  useEffect(() => {
    // A. Fetch Leaderboard
    api.getLeaderboard()
      .then((data) => setLeaderboard(data || []))
      .catch((err) => console.error("Leaderboard fetch failed", err));

    // B. Sync Points
    api.getMe().then((freshUser: any) => {
        if (freshUser) {
            login(freshUser, localStorage.getItem('kachra_token') || '');
        }
    }).catch(err => console.error("Failed to sync user profile", err));

  }, []);

  // 2. Gamification Logic
  const points = user?.points || 0;
  const currentLevel = Math.floor(points / 1000) + 1;
  const progressPercent = ((points % 1000) / 1000) * 100;

  // Calculate Rank
  const myRankIndex = leaderboard.findIndex(u => u.email === user?.email);
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : '-';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'classify': return <ClassifyTab />;
      case 'report': return <LitterReportTab />; // ✅ NEW TAB
      case 'qr': return <QRScanTab />;
      case 'schedule': return <ScheduleTab />;
      case 'leaderboard': return <LeaderboardTab />;
      case 'rewards': return <RewardsTab />;
      case 'events': return <EventsTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-[80vh]">
      
      {/* 🔙 BACK BUTTON */}
      {activeTab !== 'home' && (
        <div className="mb-6 flex items-center gap-2">
          <button 
            onClick={() => { setActiveTab('home'); setMood('idle'); setMsg(""); }}
            className="text-sm font-bold bg-white dark:bg-black border-2 border-black dark:border-gray-600 dark:text-white px-4 py-2 rounded-xl shadow-neo-sm dark:shadow-none hover:translate-y-[2px] transition-all"
          >
            {t('citizen_back')}
          </button>
        </div>
      )}

      {/* 🏗️ THE MASTER GRID */}
      {activeTab === 'home' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

          {/* --- COL 1: KACHRA SETH & STATUS --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 dark:bg-black rounded-[32px] overflow-hidden shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.2)] border-2 border-black dark:border-brand-neon relative group transition-all duration-300">
              
              <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                 <span className="bg-brand-neon text-black text-xs font-black px-2 py-1 rounded border border-black/20 animate-pulse">
                    {t('citizen_online')}
                 </span>
                 <span className="bg-orange-500 text-white text-xs font-black px-2 py-1 rounded border border-black/20 flex items-center gap-1 shadow-md">
                    <Flame size={12} className="fill-white"/> 5 {t('citizen_streak')}
                 </span>
              </div>

              <KachraMascot mood={mood} message={msg} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none relative overflow-hidden group hover:-translate-y-1 transition-transform">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-300 dark:bg-brand-neon rounded-full blur-2xl opacity-50 dark:opacity-20 group-hover:opacity-80 transition-opacity"></div>
               
               <div className="flex justify-between items-end mb-1">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    {t('citizen_wealth')}
                  </p>
                  <span className="text-xs font-black bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded">
                    {t('citizen_lvl')} {currentLevel}
                  </span>
               </div>
               
               <div className="flex items-baseline gap-2">
                 <h2 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{points}</h2>
                 <span className="text-2xl font-bold text-brand-neon drop-shadow-sm text-stroke-black">pts</span>
               </div>
               
               <div className="mt-4">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
                    <span>{t('citizen_progress')}</span>
                    <span>{Math.round(progressPercent)}% {t('citizen_to_next_lvl')} {currentLevel + 1}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div 
                      className="h-full bg-brand-neon transition-all duration-1000 ease-out" 
                      style={{ width: `${progressPercent}%` }} 
                    />
                  </div>
               </div>
            </div>
          </div>

          {/* --- COL 2: MAIN ACTIONS --- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 📸 ACTION 1: CLASSIFY (KEPT ORIGINAL) */}
            <button 
              onClick={() => setActiveTab('classify')}
              onMouseEnter={() => { setMood('scanning'); setMsg(t('mascot_msg_classify')); }}
              onMouseLeave={() => { setMood('idle'); setMsg(""); }}
              className="w-full h-40 group relative overflow-hidden bg-brand-neon rounded-[32px] border-2 border-black dark:border-white/50 shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-between px-8"
            >
              <div className="relative z-10 text-left">
                  <h3 className="text-3xl font-black italic tracking-tight text-black leading-none whitespace-pre-line">
                    {t('citizen_card_classify_title').replace(' ', '\n')}
                  </h3>
                  <p className="font-bold text-black/70 mt-1 text-sm">{t('citizen_card_classify_desc')}</p>
              </div>
              <div className="w-20 h-20 bg-black text-brand-neon rounded-2xl flex items-center justify-center border-2 border-white/20 group-hover:rotate-6 transition-transform">
                  <Camera size={40} />
              </div>
            </button>

            {/* 🚩 ACTION 2: REPORT OPEN LITTER (NEW FEATURE ADDED BELOW) */}
            <button 
              onClick={() => setActiveTab('report')}
              onMouseEnter={() => { setMood('scanning'); setMsg("Found trash? Report it!"); }}
              onMouseLeave={() => { setMood('idle'); setMsg(""); }}
              className="w-full h-40 group relative overflow-hidden bg-red-500 rounded-[32px] border-2 border-black dark:border-white/50 shadow-neo dark:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-between px-8"
            >
              <div className="relative z-10 text-left">
                  <h3 className="text-3xl font-black italic tracking-tight text-white leading-none whitespace-pre-line">
                    REPORT{'\n'}OPEN LITTER
                  </h3>
                  <p className="font-bold text-white/90 mt-1 text-sm">Snap a photo to flag a hotspot.</p>
              </div>
              <div className="w-20 h-20 bg-white text-red-600 rounded-2xl flex items-center justify-center border-2 border-black group-hover:scale-110 transition-transform">
                  <MapPin size={40} className="fill-current"/>
              </div>
            </button>

            {/* 🔳 ACTION 3: SCAN BIN QR */}
            <button 
              onClick={() => setActiveTab('qr')}
              onMouseEnter={() => { setMood('scanning'); setMsg(t('mascot_msg_qr')); }}
              onMouseLeave={() => { setMood('idle'); setMsg(""); }}
              className="w-full h-40 group relative overflow-hidden bg-purple-500 rounded-[32px] border-2 border-black dark:border-white/50 shadow-neo dark:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-between px-8"
            >
              <div className="relative z-10 text-left">
                  <h3 className="text-3xl font-black italic tracking-tight text-white leading-none whitespace-pre-line">
                    {t('citizen_card_qr_title').replace(' ', '\n')}
                  </h3>
                  <p className="font-bold text-white/80 mt-1 text-sm">{t('citizen_card_qr_desc')}</p>
              </div>
              <div className="w-20 h-20 bg-white text-purple-600 rounded-2xl flex items-center justify-center border-2 border-black group-hover:-rotate-6 transition-transform">
                  <QrCode size={40} />
              </div>
            </button>

            {/* SECONDARY ROW */}
            <div className="grid grid-cols-2 gap-4">
               {/* Rewards */}
               <div 
                 onClick={() => setActiveTab('rewards')} 
                 onMouseEnter={() => { setMood('rich'); setMsg(t('mascot_msg_store')); }}
                 onMouseLeave={() => { setMood('idle'); setMsg(""); }}
                 className="bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 border-2 border-black dark:border-purple-500/50 p-6 rounded-[24px] shadow-neo-sm dark:shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer transition-all hover:-translate-y-1 h-40 flex flex-col justify-between group"
               >
                 <div className="w-12 h-12 bg-white dark:bg-black rounded-xl border-2 border-black dark:border-purple-400 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform">
                    <ShoppingBag size={24} />
                 </div>
                 <div>
                   <h4 className="font-black text-xl text-purple-900 dark:text-purple-100 leading-none whitespace-pre-line">
                     {t('citizen_card_store_title').replace(' ', '\n')}
                   </h4>
                   <p className="text-xs font-bold text-purple-600 dark:text-purple-300 mt-1">{t('citizen_card_store_desc')}</p>
                 </div>
               </div>

               {/* Schedule */}
               <div 
                 onClick={() => setActiveTab('schedule')}
                 onMouseEnter={() => { setMood('scanning'); setMsg(t('mascot_msg_track')); }}
                 onMouseLeave={() => { setMood('idle'); setMsg(""); }}
                 className="bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 border-2 border-black dark:border-blue-500/50 p-6 rounded-[24px] shadow-neo-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer transition-all hover:-translate-y-1 h-40 flex flex-col justify-between group"
               >
                 <div className="w-12 h-12 bg-white dark:bg-black rounded-xl border-2 border-black dark:border-blue-400 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:-rotate-12 transition-transform">
                    <MapPin size={24} />
                 </div>
                 <div>
                   <h4 className="font-black text-xl text-blue-900 dark:text-blue-100 leading-none whitespace-pre-line">
                      {t('citizen_card_track_title').replace(' ', '\n')}
                   </h4>
                   <p className="text-xs font-bold text-blue-600 dark:text-blue-300 mt-1">{t('citizen_card_track_desc')}</p>
                 </div>
               </div>

               {/* Community Events */}
               <div 
                 onClick={() => setActiveTab('events')} 
                 onMouseEnter={() => { setMood('rich'); setMsg(t('mascot_msg_events')); }}
                 onMouseLeave={() => { setMood('idle'); setMsg(""); }}
                 className="col-span-2 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 border-2 border-black dark:border-green-500/50 p-6 rounded-[24px] shadow-neo-sm dark:shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer transition-all hover:-translate-y-1 h-32 flex items-center justify-between group"
               >
                 <div>
                   <h4 className="font-black text-2xl text-green-900 dark:text-green-100 leading-none whitespace-pre-line">
                      {t('citizen_card_events_title').replace(' ', '\n')}
                   </h4>
                   <p className="text-xs font-bold text-green-600 dark:text-green-300 mt-1">{t('citizen_card_events_desc')}</p>
                 </div>
                 <div className="w-16 h-16 bg-white dark:bg-black rounded-xl border-2 border-black dark:border-green-400 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                    <Users size={32} />
                 </div>
               </div>

            </div>
          </div>

          {/* --- COL 3: WIDGETS --- */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* MINI LEADERBOARD */}
            <div className="bg-yellow-400 dark:bg-yellow-600 border-2 border-black dark:border-yellow-300 rounded-[32px] p-6 h-full min-h-[400px] shadow-neo dark:shadow-[0_0_20px_rgba(234,179,8,0.4)] relative overflow-hidden flex flex-col">
              
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-black text-xl flex items-center gap-2 text-black italic uppercase">
                  <Crown className="text-black fill-current" size={24}/> {t('citizen_top_3')}
                </h3>
                <button onClick={() => setActiveTab('leaderboard')} className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">
                   {t('citizen_view_all')}
                </button>
              </div>
              
              <div className="space-y-3 relative z-10 flex-1">
                {leaderboard.length === 0 ? (
                    <div className="text-center py-4 text-xs font-bold text-black/50">{t('citizen_loading_ranks')}</div>
                ) : (
                    leaderboard.slice(0, 3).map((u, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 border-black shadow-sm ${
                        i === 0 ? 'bg-white' : i === 1 ? 'bg-white/80' : 'bg-white/60'
                    }`}>
                        <div className={`w-8 h-8 flex items-center justify-center rounded-lg font-black border-2 border-black text-sm ${
                            i === 0 ? 'bg-yellow-300' : i === 1 ? 'bg-gray-300' : 'bg-orange-300'
                        }`}>
                            #{i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-sm truncate text-black">{u.name}</p>
                        </div>
                        <div className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded border border-black/10">
                            {u.points}
                        </div>
                    </div>
                    ))
                )}
                
                <div className="mt-auto pt-6 text-center">
                   <div 
                     className="bg-black/10 rounded-xl p-3 border-2 border-black/10 cursor-pointer hover:bg-black/20 transition-colors"
                     onClick={() => setActiveTab('leaderboard')}
                   >
                      <p className="text-xs font-bold text-black uppercase">{t('citizen_your_rank')}</p>
                      <p className="text-2xl font-black text-black">#{myRank}</p>
                   </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-300">
           {renderTabContent()}
        </div>
      )}

    </div>
  );
};