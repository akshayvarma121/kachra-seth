import { useState, useEffect } from 'react';
import { Download, Building2, Leaf, Users, Fuel, TrendingUp, ShieldCheck, BarChart3 } from 'lucide-react';
import { CITIES, mockGetAdminStats } from '@/lib/mockApi';
import { AdminKPICard } from './components/AdminKPICard';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { AssetConfig } from './components/AssetConfig';
import { QRGenerator } from './components/QRGenerator';
import { StaffControlTab } from './tabs/StaffControlTab';
import { CommunityTab } from './tabs/CommunityTab'; // ✅ Import New Tab

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'staff' | 'community'>('analytics'); // ✅ Added 'community'
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    mockGetAdminStats(selectedCity).then((res) => {
      setData(res);
      setLoading(false);
    });
  }, [selectedCity]);

  const handleExport = () => {
    alert("Exporting data for " + selectedCity);
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-black text-2xl uppercase italic animate-pulse dark:text-brand-neon">Loading City Data...</div>;

  return (
    <div className="min-h-screen pb-24 space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-gray-700 p-6 rounded-[32px] shadow-neo dark:shadow-none flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-black dark:text-white leading-none">Command Center</h1>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mt-2">Real-time Analytics • {selectedCity}</p>
        </div>

        {/* 🕹️ TAB SWITCHER */}
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border-2 border-black dark:border-gray-600">
           <button 
             onClick={() => setActiveTab('analytics')}
             className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-black text-white dark:bg-brand-neon dark:text-black shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
           >
             <BarChart3 size={14} /> Analytics
           </button>
           <button 
             onClick={() => setActiveTab('staff')}
             className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-black text-white dark:bg-brand-neon dark:text-black shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
           >
             <ShieldCheck size={14} /> Staff Ops
           </button>
           {/* 👇 NEW COMMUNITY BUTTON */}
           <button 
             onClick={() => setActiveTab('community')}
             className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'community' ? 'bg-black text-white dark:bg-brand-neon dark:text-black shadow-sm' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
           >
             <Users size={14} /> Community
           </button>
        </div>

        {/* City Selector (Only for Analytics) */}
        {activeTab === 'analytics' && (
           <div className="flex items-center gap-3">
             <div className="relative">
               <Building2 className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
               <select 
                 value={selectedCity}
                 onChange={(e) => setSelectedCity(e.target.value)}
                 className="pl-12 pr-10 py-3 bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl font-bold text-sm focus:outline-none focus:shadow-neo-sm appearance-none cursor-pointer text-black dark:text-white uppercase tracking-wide"
               >
                 {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <button onClick={handleExport} className="p-3 bg-black dark:bg-brand-neon text-white dark:text-black rounded-xl border-2 border-transparent hover:scale-105 transition-transform">
                <Download size={20} />
             </button>
           </div>
        )}
      </div>

      {/* 🔄 CONDITIONAL RENDER */}
      {activeTab === 'analytics' ? (
        <div className="space-y-8 animate-in slide-in-from-left duration-300">
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminKPICard title="Segregation Rate" value={`${data.kpis.segregationRate.toFixed(1)}%`} trend="up" trendValue="+2.4%" icon={Leaf} color="bg-green-500" />
                <AdminKPICard title="Citizen Participation" value={`${data.kpis.participation.toFixed(1)}%`} trend="up" trendValue="+5.1%" icon={Users} color="bg-blue-500" />
                <AdminKPICard title="Fuel Saved" value={data.kpis.fuelSaved} subValue="L" trend="down" trendValue="-12%" icon={Fuel} color="bg-orange-500" />
                <AdminKPICard title="ROI / Savings" value="₹4.2L" trend="up" trendValue="+8%" icon={TrendingUp} color="bg-purple-500" />
            </div>

            {/* CHARTS */}
            <AnalyticsCharts data={data} />

            {/* BOTTOM CONFIG */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                <AssetConfig />
                <QRGenerator />
                </div>
                
                {/* HEATMAP */}
                <div className="lg:col-span-2 bg-white dark:bg-black p-8 rounded-[32px] border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl uppercase italic dark:text-white">Ward Heatmap</h3>
                    <span className="text-[10px] font-black bg-brand-neon text-black px-2 py-1 rounded border border-black animate-pulse">LIVE</span>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {Array.from({ length: 24 }).map((_, i) => {
                    const score = Math.random();
                    let color = 'bg-red-400 border-red-600';
                    if (score > 0.4) color = 'bg-yellow-400 border-yellow-600';
                    if (score > 0.7) color = 'bg-green-400 border-green-600';
                    if (score > 0.9) color = 'bg-brand-neon border-green-400';
                    
                    return (
                        <div key={i} className={`${color} h-10 rounded-lg border-b-4 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center text-black font-black text-xs cursor-pointer`} title={`Ward ${i+1}`}>
                        W{i+1}
                        </div>
                    );
                    })}
                </div>
                </div>
            </div>
        </div>
      ) : activeTab === 'staff' ? (
        /* 🛡️ STAFF CONTROL VIEW */
        <div className="animate-in slide-in-from-right duration-300">
           <StaffControlTab />
        </div>
      ) : (
        /* 🏘️ NEW COMMUNITY VIEW */
        <div className="animate-in slide-in-from-right duration-300">
           <CommunityTab />
        </div>
      )}

    </div>
  );
};