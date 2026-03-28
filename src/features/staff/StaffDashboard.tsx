import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  Map as MapIcon, 
  List, 
  Clock, 
  Wallet, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Trophy 
} from 'lucide-react';
import { api } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- ICONS ---
const truckIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:black; border:2px solid #39FF14; color:#39FF14; padding:5px; border-radius:8px; font-weight:900; font-size:16px; text-align:center; box-shadow:0 0 15px #39FF14;">🚛</div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});
const binIconRed = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#ef4444; border:2px solid white; color:white; padding:5px; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 6px rgba(0,0,0,0.3);">🗑️</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});
const binIconGreen = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#22c55e; border:2px solid white; color:white; padding:5px; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; opacity:0.6;">✨</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

export const StaffDashboard = () => {
  const { user } = useAuthStore();
  const [view, setView] = useState<'map' | 'list' | 'calendar'>('map');
  const [bins, setBins] = useState<any[]>([]);
  const [isOnShift, setIsOnShift] = useState(false);
  const [liveTime, setLiveTime] = useState("00:00:00"); // ⏱️ Live Ticking State

  // 📊 Stats State
  const [stats, setStats] = useState({
    shiftStart: null as string | null, // Raw timestamp for the timer
    bonusAmount: 0,
    nextPayDate: 'Loading...',
    rank: 'Rookie',
    isOnShift: false
  });

  // 🗓️ Calendar State
  const [calData, setCalData] = useState({
    logs: [] as any[],
    stats: { streakDays: 0, totalDistanceKm: 0, bonusProgress: 0, isEligible: false }
  });
  const [currentDate, setCurrentDate] = useState(new Date()); 
  const [selectedDayStats, setSelectedDayStats] = useState<any>(null);

  // 1. Live Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOnShift && stats.shiftStart) {
      const updateClock = () => {
        const start = new Date(stats.shiftStart!).getTime();
        const now = new Date().getTime();
        const diff = Math.max(0, now - start);

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setLiveTime(
          `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
        );
      };

      updateClock();
      interval = setInterval(updateClock, 1000);
    } else {
      setLiveTime("00:00:00");
    }

    return () => clearInterval(interval);
  }, [isOnShift, stats.shiftStart]);

  // 2. Fetch Data
  useEffect(() => {
    const loadDashboardData = async () => {
        if (!user?.id) return;

        try {
            const statsData = await api.getDriverStats(user.id);
            setStats({
                shiftStart: statsData.shiftStart, // Expecting raw ISO string from backend
                bonusAmount: statsData.bonusAmount || 0,
                nextPayDate: statsData.nextPayDate || 'Pending',
                rank: statsData.rank || 'Rookie',
                isOnShift: statsData.isOnShift || false
            });
            if (statsData.isOnShift !== undefined) setIsOnShift(statsData.isOnShift);
        } catch (err) {
            console.error("Stats API Failed:", err);
            setStats(prev => ({ ...prev, nextPayDate: 'Error' })); 
        }

        try {
            const calData = await api.getDriverCalendar(user.id);
            setCalData(calData || { 
                logs: [], 
                stats: { streakDays: 0, totalDistanceKm: 0, bonusProgress: 0, isEligible: false } 
            });
        } catch (err) {
            console.error("Calendar API Failed:", err);
        }
    };

    loadDashboardData();
  }, [user]);

  // 3. Route Logic
  useEffect(() => {
    const loadBins = async () => {
        try {
            const data = await api.getRoute(23.2599, 77.4126); 
            setBins(data || []);
        } catch (e) { console.error(e) }
    };
    loadBins();
  }, []);

  // 4. Toggle Shift Handler
  const handleToggleShift = async () => {
    try {
      const newState = !isOnShift;
      await api.toggleShift(newState); 
      setIsOnShift(newState);
      alert(newState ? "🚀 Shift Started! Stay productive." : "Punched out. Great work today!");
      window.location.reload(); 
    } catch (err) {
      alert("Shift Toggle Failed. Please check your connection.");
    }
  };

  // 5. Clear Logic
  const handleClearBin = async (binId: string) => {
    if (!isOnShift) return alert("❌ You must START SHIFT to clear bins!");
    if (!navigator.geolocation || !user) return;

    navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
            await api.clearBin(binId, user.id, pos.coords.latitude, pos.coords.longitude);
            alert("✅ Verified! Bin Cleared.");
            setStats(prev => ({ ...prev, bonusAmount: prev.bonusAmount + 0.5 }));
            setBins(prev => prev.filter(b => b.id !== binId));
        } catch (err: any) { alert(err.message || "Failed"); }
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); 
    return { daysInMonth, firstDay, year, month };
  };

  const { daysInMonth, firstDay, year, month } = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (dir: -1 | 1) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setCurrentDate(newDate);
    setSelectedDayStats(null);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32 font-sans">
      
      {/* 💰 HEADER */}
      <div className="bg-gradient-to-br from-gray-900 to-black p-6 rounded-b-[40px] shadow-[0_10px_40px_rgba(57,255,20,0.15)] border-b border-white/10 relative overflow-hidden mb-4">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-black italic uppercase text-white tracking-tighter">
                Hello, <span className="text-brand-neon">{user?.name || 'Driver'}</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-brand-neon text-black text-xs font-black px-2 py-0.5 rounded uppercase">{stats.rank}</span>
                <span className="text-gray-400 text-xs font-bold">#MP-04-STAFF</span>
              </div>
            </div>
            
            {/* ⏱️ LIVE TIMER DISPLAY */}
            <div className={`flex items-center gap-2 bg-gray-800/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg ${isOnShift ? 'animate-pulse' : 'opacity-50'}`}>
               <Clock size={18} className={isOnShift ? "text-brand-neon" : "text-gray-500"} />
               <span className={`font-mono font-bold text-lg tracking-widest ${isOnShift ? "text-brand-neon" : "text-gray-500"}`}>
                {liveTime}
               </span>
            </div>
          </div>

          <button 
            onClick={handleToggleShift}
            className={`mb-6 w-full py-3 rounded-2xl font-black uppercase text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${
              isOnShift 
              ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white' 
              : 'bg-brand-neon text-black hover:scale-[1.02] shadow-[0_0_15px_#39FF14]'
            }`}
          >
            {isOnShift ? (
                <><span className="w-2 h-2 bg-red-500 rounded-full animate-ping" /> End Shift</>
            ) : (
                <>Start Shift</>
            )}
          </button>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
               <div>
                 <div className="flex items-center gap-2 text-gray-400 mb-1">
                    <CalendarIcon size={16} />
                    <span className="text-xs font-bold uppercase">Next Payout</span>
                 </div>
                 <div className="text-xl font-black text-white">{stats.nextPayDate}</div>
               </div>
               <div className="text-[10px] text-gray-500 font-bold uppercase mt-2 bg-white/5 px-2 py-1 rounded w-fit">Auto-Deposit</div>
            </div>

            <div className="bg-gradient-to-br from-brand-neon/20 to-transparent p-4 rounded-2xl border border-brand-neon/30 relative overflow-hidden group">
               <div className="relative z-10">
                 <div className="flex items-center gap-2 text-brand-neon mb-1">
                    <Wallet size={16} />
                    <span className="text-xs font-bold uppercase">Total Bonus</span>
                 </div>
                 <div className="text-2xl font-black text-white drop-shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                    ₹{Math.floor(stats.bonusAmount)}
                 </div>
                 <div className="mt-2 text-[10px] font-bold text-brand-neon/80 border-t border-brand-neon/20 pt-2 animate-pulse">
                    🚀 1000 Pts = ₹10
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ NAVIGATION BUTTONS */}
      <div className="flex gap-2 px-6 mb-6">
         {['map', 'list', 'calendar'].map((t) => (
           <button 
             key={t}
             onClick={() => setView(t as any)}
             className={`flex-1 py-3 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${
               view === t ? 'bg-brand-neon text-black shadow-[0_0_15px_#39FF14]' : 'bg-gray-900 border border-white/10 text-gray-500'
             }`}
           >
             {t === 'map' && <MapIcon size={16} />}
             {t === 'list' && <List size={16} />}
             {t === 'calendar' && <TrendingUp size={16} />}
             {t}
           </button>
         ))}
      </div>

      {/* 📍 MAP VIEW */}
      {view === 'map' && (
        <div className="px-6 h-[50vh]">
          <div className="h-full w-full rounded-[32px] overflow-hidden border-2 border-white/20 shadow-2xl relative z-0 bg-gray-900">
             {!isOnShift && (
                 <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                     <p className="font-bold text-brand-neon text-lg uppercase tracking-tighter">Please Start Shift to access map</p>
                 </div>
             )}
             <MapContainer center={[23.2599, 77.4126]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                <Marker position={[23.2599, 77.4126]} icon={truckIcon}><Popup>You</Popup></Marker>
                {bins.map(bin => {
                   const isFull = (Number(bin.wet_level)||0) > 75 || (Number(bin.dry_level)||0) > 75;
                   return (
                     <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={isFull ? binIconRed : binIconGreen}>
                        <Popup className="custom-popup">
                            <button onClick={() => handleClearBin(bin.id)} className="bg-red-600 text-white px-3 py-1 rounded">Clear</button>
                        </Popup>
                     </Marker>
                   );
                })}
             </MapContainer>
          </div>
        </div>
      )}

      {/* 📝 LIST VIEW */}
      {view === 'list' && (
        <div className="px-6 space-y-3">
          {!isOnShift && <div className="text-center text-gray-500 py-10 uppercase font-black text-xs tracking-widest">Shift Inactive</div>}
          {isOnShift && bins.map((bin) => (
             <div key={bin.id} className="bg-gray-900 border border-white/10 p-4 rounded-2xl flex justify-between items-center">
                <div>
                   <h3 className="font-bold text-white">Bin {bin.id}</h3>
                   <div className="text-xs text-gray-500 mt-1">
                      W: <span className="text-blue-400">{bin.wet_level}%</span> | D: <span className="text-green-400">{bin.dry_level}%</span>
                   </div>
                </div>
                <button onClick={() => handleClearBin(bin.id)} className="bg-brand-neon text-black px-4 py-2 rounded-lg font-bold text-xs uppercase">Action</button>
             </div>
          ))}
        </div>
      )}

      {/* 📅 CALENDAR VIEW */}
      {view === 'calendar' && (
        <div className="px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center mb-6 bg-gray-900/80 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="bg-yellow-500/20 p-2 rounded-full text-yellow-500"><Trophy size={20} /></div>
                 <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Current Streak</div>
                    <div className="text-xl font-black text-white">{calData.stats.streakDays} Days</div>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-[10px] text-gray-400 font-bold uppercase">Monthly Goal</div>
                 <div className="text-sm font-bold text-brand-neon">{calData.stats.bonusProgress}%</div>
              </div>
           </div>

           <div className="bg-gray-900 border border-white/10 rounded-[32px] p-4 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-4 px-2">
                 <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white/10 rounded-full text-gray-400"><ChevronLeft size={20} /></button>
                 <div className="text-lg font-black uppercase tracking-wider">{monthNames[month]} {year}</div>
                 <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white/10 rounded-full text-gray-400"><ChevronRight size={20} /></button>
              </div>

              <div className="grid grid-cols-7 mb-2 text-center">
                 {['S','M','T','W','T','F','S'].map(d => (
                    <div key={d} className="text-[10px] font-bold text-gray-500 uppercase">{d}</div>
                 ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                 {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                 {Array(daysInMonth).fill(null).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                    const log = calData.logs.find((l: any) => l.date === dateStr);
                    const hasWork = !!log;

                    return (
                       <button 
                          key={day}
                          onClick={() => setSelectedDayStats(log || { date: dateStr, distance: 0, hours: 0 })}
                          className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold relative transition-all active:scale-95
                            ${isToday ? 'border-2 border-brand-neon text-brand-neon' : ''}
                            ${hasWork ? 'bg-green-600 text-white shadow-[0_0_10px_rgba(22,163,74,0.4)]' : 'bg-white/5 text-gray-500'}
                          `}
                       >
                          {day}
                          {hasWork && <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full"></div>}
                       </button>
                    );
                 })}
              </div>
           </div>

           {selectedDayStats && (
              <div className="mt-4 bg-gray-800 p-4 rounded-2xl border border-white/10 animate-in slide-in-from-top-2">
                 <div className="text-xs font-bold text-gray-400 uppercase mb-2">
                    {new Date(selectedDayStats.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                 </div>
                 <div className="flex justify-between items-center">
                    <div>
                       <div className="text-2xl font-black text-white">{selectedDayStats.distance} <span className="text-sm font-normal text-gray-500">km</span></div>
                       <div className="text-[10px] text-brand-neon font-bold uppercase">Distance Covered</div>
                    </div>
                    <div className="text-right">
                       <div className="text-2xl font-black text-white">{selectedDayStats.hours} <span className="text-sm font-normal text-gray-500">hrs</span></div>
                       <div className="text-[10px] text-blue-400 font-bold uppercase">Active Time</div>
                    </div>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};