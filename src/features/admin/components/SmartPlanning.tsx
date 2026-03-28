import { useState, useEffect } from 'react';
import { api } from '@/lib/apiClient';
import { MapPin, Plus, AlertTriangle, Loader2 } from 'lucide-react';

export const SmartPlanning = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch from the backend:
    // api.get('/litter/recommendations').then(data => setSuggestions(data));
    
    // ⚡ DEMO MOCK: We simulate finding a hotspot for the presentation
    setTimeout(() => {
        setSuggestions([
            { lat: 23.259933, lng: 77.412615, severity: 5, message: "High litter reported by 12 citizens.", report_count: 12 }
        ]);
    }, 2000);
  }, []);

  const deployBin = async (lat: number, lng: number) => {
    const id = prompt("Enter New Bin ID for Deployment (e.g. BIN-HOTSPOT):");
    if (!id) return;
    
    setLoading(true);
    try {
        // Auto-Deploy Wet AND Dry bins at this calculated coordinate
        const baseId = id.toUpperCase();
        await api.addBin(`${baseId}-W`, lat, lng, '');
        await api.addBin(`${baseId}-D`, lat, lng, '');
        
        alert(`✅ PROBLEM SOLVED! Deployed Smart Bins at Hotspot.`);
        
        // Remove the solved item from the list
        setSuggestions(prev => prev.filter(s => s.lat !== lat));
    } catch (e) {
        alert("Failed to deploy bin");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none h-fit">
      <h3 className="text-xl font-black uppercase italic mb-4 dark:text-white flex items-center gap-2">
        <MapPin className="text-red-500" /> AI Deployment Planner
      </h3>
      
      {suggestions.length === 0 ? (
        <p className="text-gray-400 text-sm font-bold">Scanning for litter hotspots...</p>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
          {suggestions.map((spot, i) => (
            <div key={i} className="flex flex-col gap-3 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-2 border-red-100 dark:border-red-900">
               <div className="flex items-start gap-3">
                  <div className="bg-red-500 text-white p-2 rounded-lg animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]">
                     <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h4 className="font-black text-red-600 dark:text-red-400 text-sm uppercase">Hotspot Detected</h4>
                    <p className="text-[10px] text-gray-600 dark:text-gray-300 font-bold leading-tight mt-1">{spot.message}</p>
                    <p className="text-[9px] font-mono mt-1 text-gray-400">Lat: {spot.lat.toFixed(4)} | Lng: {spot.lng.toFixed(4)}</p>
                  </div>
               </div>
               
               <button 
                 onClick={() => deployBin(spot.lat, spot.lng)}
                 disabled={loading}
                 className="bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg font-black text-xs uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity"
               >
                 {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} 
                 Deploy Smart Bin
               </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};