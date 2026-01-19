import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Phone, Navigation, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { AlertOctagon } from 'lucide-react';

// 🚚 CUSTOM ICONS
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

// 📍 MOCK DATA
const USER_LOCATION: [number, number] = [23.2332, 77.4343]; // Arera Colony (Home)
const BIG_BINS = [
    { id: 1, lat: 23.2350, lng: 77.4300, name: "Community Bin #401", location: "Near 10 No. Market" },
    { id: 2, lat: 23.2310, lng: 77.4380, name: "Community Bin #405", location: "Bittan Market Gate 2" },
];

export const ScheduleTab = () => {
  // 🚛 TRUCK POSITION (STATIC NOW)
  // We removed the useEffect interval so it won't move.
  const [truckPos] = useState<[number, number]>([23.2360, 77.4360]); 

  // 📞 CALL HANDLER
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
            ETA: 12 MINS
         </div>
      </div>

      {/* 🗺️ MAP CONTAINER */}
      <div className="flex-1 rounded-[32px] border-2 border-black dark:border-gray-600 relative overflow-hidden shadow-neo dark:shadow-none z-0">
          <MapContainer center={USER_LOCATION} zoom={15} style={{ height: '100%', width: '100%' }}>
             
             {/* Dark Mode Map Tiles */}
             <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
             />

             {/* 🏠 MY HOME */}
             <Marker position={USER_LOCATION} icon={homeIcon}>
                <Popup><b>My Home</b><br/>Pickups Daily @ 9 AM</Popup>
             </Marker>

             {/* 🚛 TRUCK (STATIC) */}
             <Marker position={truckPos} icon={truckIcon}>
                <Popup><b>Collector Truck</b><br/>Driver: Ramesh<br/>Status: Loading Bin</Popup>
             </Marker>

             {/* 🗑️ BIG BINS (FALLBACK) */}
             {BIG_BINS.map(bin => (
                 <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon}>
                    <Popup>
                        <b>{bin.name}</b><br/>
                        {bin.location}<br/>
                        <span className="text-green-600 font-bold text-xs">Always Open</span>
                    </Popup>
                 </Marker>
             ))}

          </MapContainer>

          {/* OVERLAY LEGEND */}
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur p-3 rounded-xl border border-black/20 text-[10px] font-bold uppercase space-y-2 z-[400]">
              <div className="flex items-center gap-2">
                 <span className="text-lg">🏠</span> Your Home
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-lg">🚛</span> Truck (Live)
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-lg">🗑️</span> Public Dump
              </div>
          </div>
      </div>

      {/* 🏎️ DRIVER CARD */}
      <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-[24px] p-5 shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.1)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-500">
         
         {/* Driver Info */}
         <div className="flex items-center gap-3">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh" className="w-12 h-12 rounded-xl border-2 border-black bg-gray-200" />
            <div>
               <h3 className="font-black text-lg dark:text-white uppercase">Ramesh G.</h3>
               <div className="flex items-center gap-1 text-xs font-bold text-gray-500">
                  <span className="text-yellow-500">★ 4.8</span> • Driver
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="flex gap-2">
            <button 
                onClick={handleCall}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-700 hover:scale-105 transition-transform"
                title="Call Driver"
            >
                <Phone size={20} />
            </button>
            <button 
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-700 hover:scale-105 transition-transform"
                title="Navigate to Big Bin"
            >
                <Navigation size={20} />
            </button>
         </div>

      </div>

      {/* ⚠️ MISSED TRUCK ALERT */}
      <div className="bg-yellow-50 dark:bg-yellow-900/10 border-2 border-yellow-200 dark:border-yellow-800 p-3 rounded-xl flex items-start gap-3">
         <Clock size={16} className="text-yellow-600 mt-1 shrink-0" />
         <div>
            <p className="text-xs font-black uppercase text-yellow-800 dark:text-yellow-500">Missed the truck?</p>
            <p className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400">
               Don't litter! Go to the nearest <b>Community Bin (🗑️)</b> shown on the map. It's open 24/7.
            </p>
         </div>
         
         <button 
        onClick={() => alert("Report Submitted! Admin has been notified to re-route a vehicle.")}
        className="w-full py-4 bg-red-100 dark:bg-red-900/20 text-red-600 border-2 border-red-200 dark:border-red-800 rounded-2xl font-black uppercase flex items-center justify-center gap-2 hover:bg-red-200 transition-colors"
      >
         <AlertOctagon size={20} /> Report No-Show / Complaint
      </button>
      </div>

    </div>
  );
};