import { useState, useEffect } from 'react';
import { User, MessageSquare, Phone, Ban, Battery, Signal, AlertTriangle, Siren, WifiOff } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 🚚 Fix for default Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// 🚛 TRUCK ICONS
const truckIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:black; border:2px solid #39FF14; color:#39FF14; padding:5px; border-radius:8px; font-weight:900; font-size:10px; text-align:center; box-shadow:0 0 10px #39FF14;">🚛</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

const offlineTruckIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#6b7280; border:2px solid white; color:white; padding:5px; border-radius:8px; font-weight:900; font-size:10px; text-align:center;">OFF</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// 🚨 CRITICAL TRUCK ICON
const criticalTruckIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#ef4444; border:2px solid white; color:white; padding:5px; border-radius:8px; font-weight:900; font-size:10px; text-align:center; box-shadow:0 0 15px #ef4444; animation: pulse 1s infinite;">🚛</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// 🗑️ CRITICAL BIN ICON
const criticalBinIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:#dc2626; border:2px solid white; color:white; padding:4px; border-radius:8px; font-size:12px; text-align:center; box-shadow: 0 0 20px #ef4444; animation: bounce 1s infinite;">⚠️</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// 📍 REAL BHOPAL LOCATIONS
const BHOPAL_CENTER: [number, number] = [23.2450, 77.4200]; 
const CRITICAL_BIN_LOC: [number, number] = [23.2380, 77.4280]; // Bittan Market

const MOCK_DRIVERS = [
  { id: 1, name: 'Ramesh Gupta', status: 'active', lat: 23.2332, lng: 77.4343, location: 'Arera Colony', battery: '80%', task: 'Collecting Bin #102', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh' },
  { id: 2, name: 'Suresh Yadav', status: 'offline', lat: 23.2500, lng: 77.4000, location: 'Depot HQ', battery: '100%', task: 'Connection Lost', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh' },
  { id: 3, name: 'Vikram Singh', status: 'active', lat: 23.2360, lng: 77.4290, location: 'Bittan Market', battery: '15%', task: 'Patrolling Zone 4', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' }, 
  { id: 4, name: 'Amit Patel', status: 'active', lat: 23.2400, lng: 77.3900, location: 'New Market', battery: '45%', task: 'En route to Dump Yard', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
];

export const StaffControlTab = () => {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [drivers, setDrivers] = useState(MOCK_DRIVERS);
  const [alertMode, setAlertMode] = useState(false);

  const toggleAlert = () => {
     const newState = !alertMode;
     setAlertMode(newState);
     if (newState) {
        setDrivers(prev => prev.map(d => d.id === 3 ? { ...d, status: 'critical', task: 'RESPONDING TO OVERFLOW' } : d));
        const vikram = drivers.find(d => d.id === 3);
        if(vikram) setSelectedDriver({ ...vikram, status: 'critical', task: 'RESPONDING TO OVERFLOW' });
     } else {
        setDrivers(MOCK_DRIVERS);
        setSelectedDriver(null);
     }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      
      {/* 📋 LEFT: DRIVER ROSTER */}
      <div className="lg:col-span-1 bg-white dark:bg-black border-2 border-black dark:border-gray-700 rounded-[32px] p-6 overflow-hidden flex flex-col shadow-neo dark:shadow-none">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-2xl uppercase italic dark:text-white flex items-center gap-2">
                <User className="text-brand-neon fill-black" /> Staff Roster
            </h3>
            <button onClick={toggleAlert} className={`p-2 rounded-full border-2 transition-all active:scale-95 ${alertMode ? 'bg-red-500 border-white text-white animate-pulse shadow-[0_0_10px_red]' : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-500'}`}><Siren size={18} /></button>
        </div>

        <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
          {drivers.map(driver => (
            <div 
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${
                selectedDriver?.id === driver.id 
                ? driver.status === 'critical' ? 'bg-red-600 text-white border-red-800' 
                  : driver.status === 'offline' ? 'bg-gray-600 text-white border-gray-500'
                  : 'bg-black text-brand-neon border-brand-neon'
                : 'bg-gray-50 dark:bg-gray-900 border-black/10 dark:border-gray-700 hover:border-black dark:hover:border-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                   <img src={driver.avatar} className={`w-10 h-10 rounded-full border border-gray-400 bg-white ${driver.status === 'offline' ? 'grayscale' : ''}`} />
                   <div>
                      <h4 className={`font-black text-lg leading-none ${selectedDriver?.id === driver.id ? 'text-white' : 'text-black dark:text-white'}`}>{driver.name}</h4>
                      <p className={`text-[10px] font-bold uppercase mt-1 ${selectedDriver?.id === driver.id ? 'text-white/80' : 'text-gray-400'}`}>{driver.task}</p>
                   </div>
                </div>
                {/* STATUS DOTS */}
                {driver.status === 'active' && <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>}
                {driver.status === 'offline' && <WifiOff size={16} className="text-gray-400"/>}
                {driver.status === 'critical' && <div className="w-3 h-3 rounded-full bg-red-500 animate-bounce shadow-[0_0_10px_#ef4444]"></div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🗺️ RIGHT: LIVE MAP */}
      <div className="lg:col-span-2 flex flex-col gap-6">
         <div className={`flex-1 rounded-[32px] border-2 relative overflow-hidden group z-0 transition-colors duration-500 ${alertMode ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-black dark:border-gray-600 shadow-neo'}`}>
            <MapContainer center={BHOPAL_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                {drivers.map(d => (
                    <Marker key={d.id} position={[d.lat, d.lng]} icon={d.status === 'critical' ? criticalTruckIcon : d.status === 'offline' ? offlineTruckIcon : truckIcon} eventHandlers={{ click: () => setSelectedDriver(d) }}><Popup><b>{d.name}</b><br/>{d.task}</Popup></Marker>
                ))}
                {alertMode && (
                   <><Marker position={CRITICAL_BIN_LOC} icon={criticalBinIcon}><Popup className="text-red-600 font-black">CRITICAL: BIN #102<br/>OVERFLOW 98%</Popup></Marker><CircleMarker center={CRITICAL_BIN_LOC} radius={30} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} /></>
                )}
            </MapContainer>
            {alertMode && (
                <div className="absolute top-4 right-4 z-[400]"><div className="bg-red-600 text-white px-6 py-2 rounded-xl shadow-lg animate-pulse flex items-center gap-3"><Siren className="animate-bounce" size={20} /><div><p className="text-[10px] font-black uppercase tracking-widest leading-none">Emergency</p><p className="text-sm font-black uppercase leading-none">Bin #102 Overflow</p></div></div></div>
            )}
         </div>

         {/* ACTION PANEL */}
         {selectedDriver ? (
           <div className={`h-48 border-2 rounded-[32px] p-6 shadow-neo animate-in slide-in-from-bottom duration-300 flex flex-col justify-between ${
               selectedDriver.status === 'critical' ? 'bg-red-50 dark:bg-red-900/10 border-red-500' : selectedDriver.status === 'offline' ? 'bg-gray-100 dark:bg-gray-900 border-gray-400' : 'bg-white dark:bg-black border-black dark:border-brand-neon'
           }`}>
              <div className="flex justify-between items-start">
                 <div className="flex gap-4">
                    <img src={selectedDriver.avatar} className={`w-12 h-12 rounded-xl border-2 border-black ${selectedDriver.status === 'offline' ? 'grayscale' : ''}`} />
                    <div>
                        <h3 className={`font-black text-xl uppercase italic ${selectedDriver.status === 'critical' ? 'text-red-600' : selectedDriver.status === 'offline' ? 'text-gray-500' : 'dark:text-white'}`}>
                           {selectedDriver.status === 'critical' ? '⚠️ DISPATCH REQUIRED' : selectedDriver.status === 'offline' ? 'OFFLINE' : `Command: ${selectedDriver.name}`}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-gray-500">
                           {selectedDriver.status === 'offline' 
                             ? <span className="flex items-center gap-1 text-red-500"><WifiOff size={12}/> Connection Lost</span> 
                             : <span className="flex items-center gap-1"><Signal size={12}/> Online</span>
                           }
                           <span className="flex items-center gap-1"><Battery size={12}/> {selectedDriver.battery}</span>
                        </div>
                    </div>
                 </div>
              </div>
              
              {/* BUTTONS (Disabled if Offline) */}
              <div className="flex gap-4 mt-4">
                 <button disabled={selectedDriver.status === 'offline'} className="flex-1 bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-200 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed"><MessageSquare size={18} /> Message</button>
                 <button className="flex-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-300 border-2 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 py-3"><Phone size={18} /> Call</button>
                 {selectedDriver.status === 'critical' && (
                     <button className="flex-1 bg-red-600 text-white border-2 border-red-800 hover:bg-red-700 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 py-3 shadow-lg"><AlertTriangle size={18} /> Reroute Now</button>
                 )}
              </div>
           </div>
         ) : (
           <div className="h-48 bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[32px] flex items-center justify-center text-gray-400 font-black uppercase tracking-widest">Select a driver to view actions</div>
         )}
      </div>
    </div>
  );
};