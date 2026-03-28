import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Navigation, Clock, AlertOctagon } from 'lucide-react'; 
import { api } from '@/lib/apiClient';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- ICONS CONFIGURATION ---
const truckIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:black; border:2px solid #39FF14; color:#39FF14; padding:5px; border-radius:8px; font-weight:900; font-size:12px; text-align:center; box-shadow:0 0 15px #39FF14;">🚛</div>`,
  iconSize: [35, 35],
  iconAnchor: [17, 17]
});

const homeIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:white; border:2px solid black; color:black; padding:5px; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 0 black;">🏠</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const binIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#3b82f6; border:2px solid white; color:white; padding:4px; border-radius:8px; font-size:12px; text-align:center; box-shadow:0 4px 6px rgba(0,0,0,0.3);">🗑️</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// --- MOCK DATA ---
const USER_LOCATION: [number, number] = [23.2599, 77.4126]; 
const BIG_BINS = [
    { id: 1, lat: 23.2620, lng: 77.4100, name: "Community Bin #401", location: "Near 10 No. Market" },
    { id: 2, lat: 23.2550, lng: 77.4200, name: "Community Bin #405", location: "Bittan Market Gate 2" },
];

export const ScheduleTab = () => {
  const navigate = useNavigate();
  
  // 🟢 Live Truck State
  const [truckPos, setTruckPos] = useState<[number, number] | null>(null);
  const [eta, setEta] = useState<string>('Calculating...');

  // 🔄 Poll Backend
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const data = await api.getTruckLocation();
        setTruckPos([data.lat, data.lng]);
        setEta(data.eta);
      } catch (error) {
        console.error("Failed to track truck:", error);
      }
    };
    fetchLocation();
    const interval = setInterval(fetchLocation, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCall = () => {
      window.location.href = "tel:+919876543210";
  };

  return (
    <div className="h-[75vh] flex flex-col gap-4">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-2">
         <div>
            <h2 className="text-3xl font-black italic uppercase dark:text-white">Track Truck</h2>
            <p className="font-bold text-gray-500 text-xs">Unit MP-04-1234 • Arriving Soon</p>
         </div>
         <div className="bg-black text-brand-neon px-3 py-1 rounded-lg text-xs font-black border border-brand-neon animate-pulse">
            ETA: {eta}
         </div>
      </div>

      {/* 🗺️ MAP */}
      <div className="flex-1 rounded-[32px] border-2 border-black dark:border-gray-600 relative overflow-hidden shadow-neo dark:shadow-none z-0">
          <MapContainer center={USER_LOCATION} zoom={14} style={{ height: '100%', width: '100%' }}>
              <TileLayer attribution='© OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
              <Marker position={USER_LOCATION} icon={homeIcon}><Popup>My Home</Popup></Marker>
              
              {truckPos && (
                <Marker position={truckPos} icon={truckIcon}><Popup>Collector Truck</Popup></Marker>
              )}

              {BIG_BINS.map(bin => (
                  <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon}><Popup>{bin.name}</Popup></Marker>
              ))}
          </MapContainer>

          {/* LEGEND */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur p-3 rounded-xl border border-black/20 text-[10px] font-bold uppercase space-y-2 z-[400]">
              <div className="flex items-center gap-2"><span className="text-lg">🏠</span> Home</div>
              <div className="flex items-center gap-2"><span className="text-lg">🚛</span> Truck</div>
              <div className="flex items-center gap-2"><span className="text-lg">🗑️</span> Bin</div>
          </div>
      </div>

      {/* 🏎️ DRIVER INFO */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-[24px] p-4 shadow-neo flex items-center justify-between gap-4">
         <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" className="w-10 h-10 rounded-xl border-2 border-black bg-gray-200" />
            <div>
               <h3 className="font-black text-base dark:text-white uppercase">Ramesh G.</h3>
               <div className="text-xs font-bold text-gray-500">Driver ★ 4.8</div>
            </div>
         </div>
         <div className="flex gap-2">
            <button onClick={handleCall} className="w-10 h-10 flex items-center justify-center rounded-xl bg-green-100 text-green-700 border-2 border-green-200">
                <Phone size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-100 text-blue-700 border-2 border-blue-200">
                <Navigation size={18} />
            </button>
         </div>
      </div>

      {/* 👇 HERE IS THE BUTTON YOU ARE LOOKING FOR 👇 */}
      <div className="flex gap-3">
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 p-3 rounded-xl flex items-start gap-3 flex-1">
           <Clock size={16} className="text-yellow-600 mt-1 shrink-0" />
           <div>
              <p className="text-xs font-black uppercase text-yellow-800 dark:text-yellow-500">Missed it?</p>
              <p className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 leading-tight">
                 Go to the nearest <b>Community Bin (🗑️)</b> or report an issue.
              </p>
           </div>
        </div>

        {/* 🚨 THIS BUTTON OPENS THE COMPLAINT PAGE 🚨 */}
        <button 
           // ✅ FIXED: Now points to the correct route "/citizen/complaint"
           onClick={() => navigate('/citizen/complaint')} 
           className="px-4 bg-red-100 dark:bg-red-900/20 text-red-600 border-2 border-red-200 dark:border-red-800 rounded-xl font-black uppercase text-xs flex flex-col items-center justify-center gap-1 hover:bg-red-200 transition-colors"
        >
           <AlertOctagon size={18} />
           <span>Report</span>
        </button>
      </div>

    </div>
  );
};