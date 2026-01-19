import { useState, useEffect } from 'react';
import { Scan, Calendar, Trophy, Ticket, Activity, Crown, QrCode, Camera, MapPin, ShoppingBag, Users } from 'lucide-react';
import { KachraMascot, type MascotMood } from '@/components/KachraMascot';
import { useAuthStore } from '@/store/authStore';
import { mockGetLeaderboard } from '@/lib/mockApi';

import { ClassifyTab } from './tabs/ClassifyTab';
import { QRScanTab } from './tabs/QRScanTab';
import { ScheduleTab } from './tabs/ScheduleTab';
import { LeaderboardTab } from './tabs/LeaderboardTab';
import { RewardsTab } from './tabs/RewardsTab';
import { EventsTab } from './tabs/EventsTab';

type Tab = 'home' | 'classify' | 'qr' | 'schedule' | 'leaderboard' | 'rewards' | 'events';

export const CitizenDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // 🎭 MASCOT STATE
  const [mood, setMood] = useState<MascotMood>('idle');
  const [msg, setMsg] = useState("");

  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    mockGetLeaderboard().then(setLeaderboard);
  }, []);

  const myRankIndex = leaderboard.findIndex(u => u.name === user?.name || u.id === user?.id);
  const myRank = myRankIndex !== -1 ? myRankIndex + 1 : '-';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'classify': return <ClassifyTab />;
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
            ← Back to Dashboard
          </button>
        </div>
      )}

      {/* 🏗️ THE MASTER GRID */}
      {activeTab === 'home' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">

          {/* --- COL 1: KACHRA SETH & STATUS --- */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gray-900 dark:bg-black rounded-[32px] overflow-hidden shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.2)] border-2 border-black dark:border-brand-neon relative group transition-all duration-300">
              <div className="absolute top-4 right-4 z-20">
                 <span className="bg-brand-neon text-black text-xs font-black px-2 py-1 rounded border border-black/20 animate-pulse">ONLINE</span>
              </div>
              <KachraMascot mood={mood} message={msg} />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none relative overflow-hidden group hover:-translate-y-1 transition-transform">
               <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-300 dark:bg-brand-neon rounded-full blur-2xl opacity-50 dark:opacity-20 group-hover:opacity-80 transition-opacity"></div>
               <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">Total Wealth</p>
               <div className="flex items-baseline gap-2">
                 <h2 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter">{user?.points}</h2>
                 <span className="text-2xl font-bold text-brand-neon drop-shadow-sm text-stroke-black">pts</span>
               </div>
               <div className="mt-4 flex gap-2">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                    <Activity size={12}/> +45 this week
                  </div>
               </div>
            </div>
          </div>

          {/* --- COL 2: MAIN ACTIONS --- */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 🚀 ACTION 1: AI IDENTIFY */}
            <button 
              onClick={() => setActiveTab('classify')}
              onMouseEnter={() => { setMood('scanning'); setMsg("Photo analysis? Smart move."); }}
              onMouseLeave={() => { setMood('idle'); setMsg(""); }}
              className="w-full h-40 group relative overflow-hidden bg-brand-neon rounded-[32px] border-2 border-black dark:border-white/50 shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-between px-8"
            >
              <div className="relative z-10 text-left">
                 <h3 className="text-3xl font-black italic tracking-tight text-black leading-none">WHAT IS<br/>THIS?</h3>
                 <p className="font-bold text-black/70 mt-1 text-sm">Check Trash Type</p>
              </div>
              <div className="w-20 h-20 bg-black text-brand-neon rounded-2xl flex items-center justify-center border-2 border-white/20 group-hover:rotate-6 transition-transform">
                 <Camera size={40} />
              </div>
            </button>

            {/* 🚀 ACTION 2: SCAN BIN QR */}
            <button 
              onClick={() => setActiveTab('qr')}
              onMouseEnter={() => { setMood('scanning'); setMsg("Scanning a Bin? I hope it's clean."); }}
              onMouseLeave={() => { setMood('idle'); setMsg(""); }}
              className="w-full h-40 group relative overflow-hidden bg-purple-500 rounded-[32px] border-2 border-black dark:border-white/50 shadow-neo dark:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none flex items-center justify-between px-8"
            >
              <div className="relative z-10 text-left">
                 <h3 className="text-3xl font-black italic tracking-tight text-white leading-none">I'M AT<br/>A BIN</h3>
                 <p className="font-bold text-white/80 mt-1 text-sm">Scan QR & Earn</p>
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
                 onMouseEnter={() => { setMood('rich'); setMsg("Spending money? My favorite activity!"); }}
                 onMouseLeave={() => { setMood('idle'); setMsg(""); }}
                 className="bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-900/60 border-2 border-black dark:border-purple-500/50 p-6 rounded-[24px] shadow-neo-sm dark:shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer transition-all hover:-translate-y-1 h-40 flex flex-col justify-between group"
               >
                 <div className="w-12 h-12 bg-white dark:bg-black rounded-xl border-2 border-black dark:border-purple-400 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:rotate-12 transition-transform">
                    <ShoppingBag size={24} />
                 </div>
                 <div>
                   <h4 className="font-black text-xl text-purple-900 dark:text-purple-100 leading-none">SPEND<br/>CASH</h4>
                   <p className="text-xs font-bold text-purple-600 dark:text-purple-300 mt-1">Loot Store</p>
                 </div>
               </div>

               {/* Schedule */}
               <div 
                 onClick={() => setActiveTab('schedule')}
                 onMouseEnter={() => { setMood('scanning'); setMsg("Where is my truck? Let's check."); }}
                 onMouseLeave={() => { setMood('idle'); setMsg(""); }}
                 className="bg-blue-100 dark:bg-blue-900/40 hover:bg-blue-200 dark:hover:bg-blue-900/60 border-2 border-black dark:border-blue-500/50 p-6 rounded-[24px] shadow-neo-sm dark:shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer transition-all hover:-translate-y-1 h-40 flex flex-col justify-between group"
               >
                 <div className="w-12 h-12 bg-white dark:bg-black rounded-xl border-2 border-black dark:border-blue-400 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:-rotate-12 transition-transform">
                    <MapPin size={24} />
                 </div>
                 <div>
                   <h4 className="font-black text-xl text-blue-900 dark:text-blue-100 leading-none">TRACK<br/>TRUCK</h4>
                   <p className="text-xs font-bold text-blue-600 dark:text-blue-300 mt-1">Pickup Time</p>
                 </div>
               </div>

               {/* Community Events */}
               <div 
                 onClick={() => setActiveTab('events')} 
                 onMouseEnter={() => { setMood('rich'); setMsg("Join the squad. Earn massive respect."); }}
                 onMouseLeave={() => { setMood('idle'); setMsg(""); }}
                 className="col-span-2 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 border-2 border-black dark:border-green-500/50 p-6 rounded-[24px] shadow-neo-sm dark:shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer transition-all hover:-translate-y-1 h-32 flex items-center justify-between group"
               >
                 <div>
                   <h4 className="font-black text-2xl text-green-900 dark:text-green-100 leading-none">COMMUNITY<br/>EVENTS</h4>
                   <p className="text-xs font-bold text-green-600 dark:text-green-300 mt-1">Join Cleanup Drives</p>
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
                  <Crown className="text-black fill-current" size={24}/> Top 3
                </h3>
                <button onClick={() => setActiveTab('leaderboard')} className="bg-black text-yellow-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-800 transition-colors">
                   View All
                </button>
              </div>
              
              <div className="space-y-3 relative z-10 flex-1">
                {leaderboard.slice(0, 3).map((u, i) => (
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
                ))}
                
                <div className="mt-auto pt-6 text-center">
                   <div 
                     className="bg-black/10 rounded-xl p-3 border-2 border-black/10 cursor-pointer hover:bg-black/20 transition-colors"
                     onClick={() => setActiveTab('leaderboard')}
                   >
                      <p className="text-xs font-bold text-black uppercase">Your Current Rank</p>
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