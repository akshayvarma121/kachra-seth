import { useState, useEffect, useRef } from 'react';
import { Leaf, Users, Fuel, TrendingUp, ShieldCheck, BarChart3, Loader2, Volume2, VolumeX, Droplets, Recycle } from 'lucide-react';
import { CITIES } from '@/lib/mockApi';
import { api } from '@/lib/apiClient';
import { AdminKPICard } from './components/AdminKPICard';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { AssetConfig } from './components/AssetConfig';
import { QRGenerator } from './components/QRGenerator';
import { SmartPlanning } from './components/SmartPlanning';
import { LiveReportsFeed } from './components/LiveReportsFeed'; 
import { StaffControlTab } from './tabs/StaffControlTab';
import { CommunityTab } from './tabs/CommunityTab';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'staff' | 'community'>('analytics');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stats, setStats] = useState<any>({});
  const [heatMapData, setHeatMapData] = useState<any[]>([]);
  
  // 🔊 VOICE ALERT STATE
  const [soundEnabled, setSoundEnabled] = useState(false); 
  const lastSpokenTime = useRef<number>(0);

  // 🎨 COMMON STYLES (The Neon Border Look)
  const cardClass = "bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-brand-neon shadow-neo dark:shadow-[0_0_15px_rgba(57,255,20,0.2)] h-full transition-all hover:shadow-none hover:translate-y-[2px]";

  // 🎨 COLOR HELPER
  const getColor = (level: number) => {
    if (level >= 90) return 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse'; // Critical
    if (level >= 50) return 'bg-yellow-400'; // Warning
    return 'bg-green-500'; // Safe
  };

  // 🛡️ DATA SANITIZER
  const sanitizeMapData = (data: any[]) => {
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      id: item.id || 'UNKNOWN',
      wet: Number(item.wetLevel ?? item.wet_level ?? 0),
      dry: Number(item.dryLevel ?? item.dry_level ?? 0),
      lat: Number(item.lat),
      lng: Number(item.lng),
      status: item.status || 'normal',
      updatedAt: item.updated_at || new Date().toISOString()
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, mapData] = await Promise.all([
          api.getStats().catch(e => { console.warn("Stats Failed", e); return null; }),
          api.getHeatMap().catch(e => { console.warn("Map Failed", e); return []; })
        ]);

        setStats(statsData || {}); 
        const cleanMap = sanitizeMapData(mapData || []);
        setHeatMapData(cleanMap);
        checkAndPlayAlerts(cleanMap);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 4000); 
    return () => clearInterval(interval);
  }, [selectedCity, soundEnabled]);

  const checkAndPlayAlerts = (bins: any[]) => {
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastSpokenTime.current < 30000) return;
    const criticalBins = bins.filter(b => Math.max(b.wet, b.dry) >= 90);
    if (criticalBins.length > 0) {
      const binNames = criticalBins.map(b => b.id).join(", ");
      const text = `Attention. Critical levels in bins ${binNames}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      window.speechSynthesis.speak(utterance);
      lastSpokenTime.current = now;
    }
  };

  const toggleSound = () => {
    if (!soundEnabled) {
      const test = new SpeechSynthesisUtterance("Audio Online");
      window.speechSynthesis.speak(test);
    } else {
      window.speechSynthesis.cancel();
    }
    setSoundEnabled(!soundEnabled);
  };

  if (loading && !stats.totalWaste) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-brand-neon animate-spin" />
        <span className="font-black text-xl uppercase italic animate-pulse dark:text-brand-neon">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className={cardClass}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
            <h1 className="text-4xl font-black italic uppercase text-black dark:text-white leading-none">Command Center</h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">Real-time Analytics • {selectedCity}</p>
            </div>

            <div className="flex items-center gap-4">
            <button 
                onClick={toggleSound}
                className={`p-3 rounded-xl border-2 transition-all ${soundEnabled ? 'bg-red-500 text-white border-red-700 animate-pulse' : 'bg-gray-100 text-gray-400 border-gray-300'}`}
            >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border-2 border-black dark:border-gray-600">
                <button onClick={() => setActiveTab('analytics')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-black text-white dark:bg-brand-neon dark:text-black shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>
                    <BarChart3 size={14} /> Analytics
                </button>
                <button onClick={() => setActiveTab('staff')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-black text-white dark:bg-brand-neon dark:text-black shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>
                    <ShieldCheck size={14} /> Staff Ops
                </button>
                <button onClick={() => setActiveTab('community')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'community' ? 'bg-black text-white dark:bg-brand-neon dark:text-black shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}>
                    <Users size={14} /> Community
                </button>
            </div>
            </div>
        </div>
      </div>

      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
            
            {/* ROW 1: KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminKPICard title="Total Waste" value={`${(stats?.totalWaste || 0).toLocaleString()} kg`} trend="up" trendValue="+12%" icon={Leaf} color="bg-green-500" />
                <AdminKPICard title="Active Fleet" value={`${stats?.activeFleet || 0}`} subValue=" Trucks" trend="up" trendValue="Online" icon={Fuel} color="bg-blue-500" />
                <AdminKPICard title="Segregation" value={`${stats?.segregationRate || 0}%`} trend={stats?.segregationRate > 80 ? 'up' : 'down'} trendValue="Avg Quality" icon={Users} color="bg-orange-500" />
                <AdminKPICard title="Revenue" value={`₹${(stats?.revenue || 0).toLocaleString()}`} trend="up" trendValue="+8%" icon={TrendingUp} color="bg-purple-500" />
            </div>

            {/* ROW 2: OPERATIONS (Bin Levels + Live Reports) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Live Bin Levels (Takes 2/3 space) */}
                <div className={`lg:col-span-2 ${cardClass} flex flex-col`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-black text-xl uppercase italic dark:text-white">Live Bin Levels</h3>
                        <span className="text-[10px] font-black bg-brand-neon text-black px-2 py-1 rounded border border-black animate-pulse">LIVE MONITORING</span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                        {(heatMapData && heatMapData.length > 0) ? heatMapData.map((bin) => {
                        const wet = bin.wet;
                        const dry = bin.dry;
                        const isRisk = wet > 80 || dry > 80;
                        const isCritical = wet >= 90 || dry >= 90;

                        return (
                            <div key={bin.id} className={`relative p-4 rounded-xl border-2 flex flex-col gap-3 transition-all ${
                                isCritical ? 'bg-red-50 dark:bg-red-950 border-red-500 animate-pulse' : 
                                isRisk ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500' : 
                                'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700'
                            }`}>
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-sm text-black dark:text-white">#{bin.id}</span>
                                    {isCritical && <span className="bg-red-600 text-white text-[9px] px-2 py-1 rounded-full font-bold uppercase">Critical</span>}
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                            <span className="flex items-center gap-1 text-green-600"><Droplets size={10}/> Wet</span>
                                            <span>{wet}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${getColor(wet)}`} style={{ width: `${wet}%` }}></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[10px] font-bold text-gray-600 dark:text-gray-300 uppercase mb-1">
                                            <span className="flex items-center gap-1 text-blue-500"><Recycle size={10}/> Dry</span>
                                            <span>{dry}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-1000 ${getColor(dry)}`} style={{ width: `${dry}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                        }) : (
                        <p className="col-span-full text-center text-gray-500 font-bold py-8">No active bin data.</p>
                        )}
                    </div>
                </div>

                {/* Live Reports Feed (Takes 1/3 space) */}
                <div className="lg:col-span-1 h-full">
                   {/* We wrap the component in a div to ensure the class applies if the component doesn't support it directly, 
                       but since LiveReportsFeed has its own container, we rely on consistency or modify it. 
                       Ideally, LiveReportsFeed should accept className, but for now we assume it fits the theme. 
                       Wait! I should modify the import to ensure it matches. 
                       Actually, let's wrap it in a Neon Border div if it doesn't have one. 
                       But the component has its own card style. Let's assume it matches or is consistent. 
                       Let's put it here. */}
                   <div className={cardClass}>
                      <LiveReportsFeed />
                   </div>
                </div>
            </div>

            {/* ROW 3: TOOLS (3 Columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={cardClass}>
                   <SmartPlanning />
                </div>
                <div className={cardClass}>
                   <QRGenerator />
                </div>
                <div className={cardClass}>
                   <AssetConfig />
                </div>
            </div>

            {/* ROW 4: Analytics */}
            <div className={cardClass}>
                <AnalyticsCharts data={stats} />
            </div>

        </div>
      ) : activeTab === 'staff' ? (
        <div className="animate-in slide-in-from-right duration-300">
           <StaffControlTab />
        </div>
      ) : (
        <div className="animate-in slide-in-from-right duration-300">
           <CommunityTab />
        </div>
      )}
    </div>
  );
};