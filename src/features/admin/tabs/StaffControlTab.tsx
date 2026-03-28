import { useState, useEffect } from 'react';
import { User, MessageSquare, Phone, Plus, Signal, WifiOff, Loader2, X, Power, AlertTriangle, Search, Copy, CheckCircle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '@/lib/apiClient';

// 🚛 LEAFLET ICON FIXES
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Map Icons
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

const BHOPAL_CENTER: [number, number] = [23.2599, 77.4126]; 

// 🛑 FALLBACK DATA
const MOCK_DRIVERS = [
  { id: 'd3eebc99-9c0b', name: 'Ramesh (Mock)', email: 'ramesh@ks.com', lat: 23.2599, lng: 77.4126, status: 'active', task: 'Sector A' },
  { id: 'e4eebc99-9c0c', name: 'Suresh (Mock)', email: 'suresh@ks.com', lat: 23.2450, lng: 77.4200, status: 'offline', task: 'Off Duty' },
];

// Helper to zoom map when driver selected
const MapUpdater = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14);
  }, [center, map]);
  return null;
};

export const StaffControlTab = () => {
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({ name: '', email: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [toggling, setToggling] = useState(false);

  // 🛡️ DATA FETCHING
  const fetchDrivers = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Race API against 2s timeout
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000));
      const data: any = await Promise.race([api.getDrivers(), timeoutPromise]);

      const list = Array.isArray(data) ? data : [];
      setDrivers(mapDrivers(list.length > 0 ? list : MOCK_DRIVERS));
    } catch (err: any) {
      console.warn("⚠️ Using Mock Data:", err);
      setErrorMsg("Backend unresponsive. Showing offline data.");
      setDrivers(mapDrivers(MOCK_DRIVERS));
    } finally {
      setLoading(false);
    }
  };

  const mapDrivers = (list: any[]) => {
    return list.map((d: any, i: number) => ({
      id: d.id || `temp-${Math.random()}`,
      name: d.name || 'Unknown',
      email: d.email || 'No Email',
      lat: (d.lat && !isNaN(d.lat)) ? d.lat : 23.2599 + (Math.random() * 0.05 - 0.025),
      lng: (d.lng && !isNaN(d.lng)) ? d.lng : 77.4126 + (Math.random() * 0.05 - 0.025),
      status: d.isActive ? 'active' : (d.status === 'active' ? 'active' : 'offline'),
      task: d.isActive ? `Patrolling Sector ${i+1}` : 'Idle'
    }));
  };

  useEffect(() => { fetchDrivers(); }, []);

  // 🔄 ACTIONS
  const handleToggleStatus = async () => {
    if (!selectedDriver) return;
    setToggling(true);
    const newStatusBoolean = selectedDriver.status !== 'active';
    
    // Optimistic Update
    const updatedList = drivers.map(d => 
      d.id === selectedDriver.id ? { ...d, status: newStatusBoolean ? 'active' : 'offline' } : d
    );
    setDrivers(updatedList);
    setSelectedDriver({ ...selectedDriver, status: newStatusBoolean ? 'active' : 'offline' });

    try {
      await api.updateDriverStatus(selectedDriver.id, newStatusBoolean);
    } catch (err) {
      alert("Failed to sync status with server.");
    } finally {
      setToggling(false);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await api.addDriver(newDriver.email, newDriver.name);
      alert("Driver added! Default password: 'password123'");
      setShowAddModal(false);
      setNewDriver({ name: '', email: '' });
      fetchDrivers();
    } catch (err: any) {
      alert("Failed: " + err.message);
    } finally {
      setIsAdding(false);
    }
  };

  // Filter Logic
  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = drivers.filter(d => d.status === 'active').length;

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-brand-neon w-10 h-10" />
        <p className="text-gray-500 font-bold animate-pulse">Contacting Fleet...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-black text-white p-6 rounded-[24px] shadow-lg flex flex-col justify-between">
            <h3 className="text-gray-400 font-bold uppercase text-xs">Total Staff</h3>
            <div className="text-4xl font-black italic">{drivers.length}</div>
         </div>
         <div className="bg-brand-neon text-black p-6 rounded-[24px] shadow-lg flex flex-col justify-between">
            <h3 className="text-black/60 font-bold uppercase text-xs">Active Duty</h3>
            <div className="text-4xl font-black italic">{activeCount}</div>
         </div>
         <div className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-6 rounded-[24px] flex flex-col justify-between">
            <h3 className="text-gray-400 font-bold uppercase text-xs">Offline</h3>
            <div className="text-4xl font-black italic">{drivers.length - activeCount}</div>
         </div>
         <button onClick={() => setShowAddModal(true)} className="bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 p-6 rounded-[24px] flex flex-col justify-center items-center hover:bg-gray-50 transition-colors group">
            <div className="bg-black text-white p-3 rounded-full group-hover:scale-110 transition-transform">
               <Plus size={24} />
            </div>
            <span className="font-bold text-xs uppercase mt-2">Recruit Staff</span>
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] relative">
      
        {/* 2. LEFT: ROSTER LIST */}
        <div className="lg:col-span-1 bg-white dark:bg-black border-2 border-black dark:border-gray-700 rounded-[32px] p-6 overflow-hidden flex flex-col shadow-neo dark:shadow-none">
          
          <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-xl uppercase italic dark:text-white flex items-center gap-2">
                  <User className="text-brand-neon fill-black" /> Roster
              </h3>
              
              {/* 🛠️ FIX: Wrapped AlertTriangle in a div for the tooltip */}
              {errorMsg && (
                <div title={errorMsg}>
                  <AlertTriangle size={18} className="text-orange-500 animate-pulse" />
                </div>
              )}
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
             <Search className="absolute left-3 top-3 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search driver..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 rounded-xl font-bold text-sm outline-none focus:ring-2 ring-brand-neon"
             />
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {filteredDrivers.map(driver => (
              <div 
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-900 ${
                  selectedDriver?.id === driver.id 
                  ? 'border-brand-neon bg-gray-50 dark:bg-gray-900 shadow-sm' 
                  : 'border-transparent bg-gray-50 dark:bg-black'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} className="w-10 h-10 rounded-full border border-gray-400 bg-white" />
                     <div className="overflow-hidden">
                        <h4 className="font-bold text-sm truncate dark:text-white">{driver.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className={`text-[10px] font-black uppercase ${driver.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                              {driver.status}
                           </span>
                           {/* COPY UUID BUTTON */}
                           <button 
                             onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(driver.id); alert("UUID Copied!"); }}
                             className="text-[9px] bg-gray-200 dark:bg-gray-800 px-1 rounded flex items-center gap-1 hover:bg-gray-300"
                             title="Copy UUID for Truck Registration"
                           >
                             <Copy size={8}/> ID
                           </button>
                        </div>
                     </div>
                  </div>
                  {driver.status === 'active' 
                    ? <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    : <WifiOff size={14} className="text-gray-400"/>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. RIGHT: MAP & ACTIONS */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
           
           {/* Map Container */}
           <div className="flex-1 rounded-[32px] border-2 border-black dark:border-gray-600 shadow-neo relative overflow-hidden z-0 bg-gray-900">
              <MapContainer center={BHOPAL_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                  
                  {/* Fly to selected driver */}
                  {selectedDriver && <MapUpdater center={[selectedDriver.lat, selectedDriver.lng]} />}

                  {drivers.map(d => (
                      <Marker 
                        key={d.id} 
                        position={[d.lat, d.lng]} 
                        icon={d.status === 'active' ? truckIcon : offlineTruckIcon} 
                        eventHandlers={{ click: () => setSelectedDriver(d) }}
                      >
                        <Popup>
                          <div className="text-center">
                            <b className="uppercase">{d.name}</b><br/>
                            <span className="text-xs">{d.task}</span>
                          </div>
                        </Popup>
                      </Marker>
                  ))}
              </MapContainer>
           </div>

           {/* Action Panel (Bottom Right) */}
           {selectedDriver ? (
             <div className="h-40 bg-white dark:bg-black border-2 border-black dark:border-gray-700 rounded-[32px] p-6 shadow-neo animate-in slide-in-from-bottom duration-300 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedDriver.name}`} className="w-16 h-16 rounded-2xl border-2 border-black bg-white" />
                   <div>
                      <h3 className="font-black text-xl uppercase italic dark:text-white">{selectedDriver.name}</h3>
                      <p className="text-xs font-bold text-brand-neon uppercase tracking-widest">{selectedDriver.email}</p>
                      <div className="flex gap-2 mt-2">
                         <button className="p-2 bg-black-100 hover:bg-black-200 rounded-full"><MessageSquare size={16}/></button>
                         <button className="p-2 bg-black-100 hover:bg-black-200 rounded-full"><Phone size={16}/></button>
                      </div>
                   </div>
                </div>
                
                <button 
                  onClick={handleToggleStatus}
                  disabled={toggling}
                  className={`px-6 py-3 rounded-xl font-black text-xs uppercase flex items-center gap-2 border-2 transition-all ${
                    selectedDriver.status === 'active'
                      ? 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'
                  }`}
                >
                  {toggling ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                  {selectedDriver.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
             </div>
           ) : (
             <div className="h-40 bg-gray-100 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[32px] flex items-center justify-center text-gray-400 font-black uppercase tracking-widest">
                Select a driver on map to view actions
             </div>
           )}
        </div>
      </div>

      {/* ADD STAFF MODAL */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-[32px]">
           <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl w-full max-w-md border-2 border-brand-neon shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-2xl font-black italic uppercase dark:text-white">Recruit Staff</h3>
                 <button onClick={() => setShowAddModal(false)}><X className="text-gray-500 hover:text-red-500" /></button>
              </div>
              <form onSubmit={handleAddDriver} className="space-y-4">
                 <input placeholder="Full Name" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} className="w-full p-4 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-brand-neon rounded-xl font-bold outline-none" required />
                 <input placeholder="Email Address" type="email" value={newDriver.email} onChange={e => setNewDriver({...newDriver, email: e.target.value})} className="w-full p-4 bg-gray-100 dark:bg-gray-900 border-2 border-transparent focus:border-brand-neon rounded-xl font-bold outline-none" required />
                 <button disabled={isAdding} className="w-full bg-brand-neon text-black py-4 rounded-xl font-black uppercase hover:scale-[1.02] transition-transform">
                   {isAdding ? 'Creating Account...' : 'Confirm Recruitment'}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};