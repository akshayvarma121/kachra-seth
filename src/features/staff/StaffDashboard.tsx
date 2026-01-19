import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { CheckCircle, Navigation, Scan, Fuel, Clock, Trash2, AlertTriangle, ArrowRight, Camera, X, UploadCloud, Siren, Wifi, WifiOff, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import confetti from 'canvas-confetti';

// 🚚 CUSTOM ICONS
const truckIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:black; border:2px solid #39FF14; color:#39FF14; padding:5px; border-radius:8px; font-weight:900; font-size:12px; text-align:center; box-shadow:0 0 15px #39FF14;">🚛</div>`,
  iconSize: [35, 35],
  iconAnchor: [17, 17]
});

const binIcon = (status: 'pending' | 'done' | 'critical') => new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color:${
    status === 'done' ? '#22c55e' : status === 'critical' ? '#dc2626' : '#facc15'
  }; border:2px solid black; color:${status === 'critical' ? 'white' : 'black'}; padding:4px; border-radius:8px; font-size:12px; text-align:center; ${status === 'critical' ? 'box-shadow: 0 0 10px #ef4444;' : ''}">${status === 'done' ? '✅' : status === 'critical' ? '⚠️' : '🗑️'}</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

// 📍 MOCK DATA
const BHOPAL_CENTER: [number, number] = [23.2332, 77.4343];
const ROUTE_POINTS: [number, number][] = [
  [23.2332, 77.4343],
  [23.2350, 77.4300],
  [23.2380, 77.4280],
  [23.2400, 77.4320]
];

// 🟢 INITIAL CLEAN STATE
const INITIAL_TASKS = [
  { id: 101, lat: 23.2350, lng: 77.4300, address: "10 No. Market, Shop 4", status: 'done', fill: '0%' },
  { id: 102, lat: 23.2380, lng: 77.4280, address: "Bittan Market, Gate 2", status: 'pending', fill: '65%' }, // Normal fill
  { id: 103, lat: 23.2400, lng: 77.4320, address: "Arera Colony, E-7", status: 'pending', fill: '40%' },
];

export const StaffDashboard = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [currentPos] = useState<[number, number]>(BHOPAL_CENTER);
  const [alertMode, setAlertMode] = useState(false); // 🟢 Default OFF
  
  // 📶 OFFLINE MODE STATE
  const [isOffline, setIsOffline] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // 📸 PROOF OF WORK STATE
  const [activeTask, setActiveTask] = useState<any>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // 🚨 TOGGLE SIMULATION
  const toggleAlert = () => {
    const newState = !alertMode;
    setAlertMode(newState);
    if (newState) {
       // Set Bin 102 to CRITICAL
       setTasks(prev => prev.map(t => t.id === 102 ? { ...t, status: 'critical', fill: '98%' } : t));
    } else {
       // Reset to Normal
       setTasks(INITIAL_TASKS);
    }
  };

  // 📶 TOGGLE OFFLINE MODE
  const toggleOffline = () => {
    if (isOffline) {
      // Go Online -> Simulate Sync
      setIsSyncing(true);
      setTimeout(() => {
        setIsSyncing(false);
        setIsOffline(false);
      }, 2000);
    } else {
      setIsOffline(true);
    }
  };

  const handleTaskClick = (task: any) => {
    setActiveTask(task);
    setProofImage(null);
  };

  const handleCapture = () => {
     setIsUploading(true);
     setTimeout(() => {
        setProofImage("https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400"); 
        setIsUploading(false);
     }, 1500);
  };

  const submitProof = () => {
    if (!activeTask || !proofImage) return;
    
    // If offline, just close modal (Simulate local save)
    if (isOffline) {
        alert("Saved to Local Cache. Will upload when online.");
    } else {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: 'done', fill: '0%' } : t));
    setActiveTask(null);
  };

  return (
    <div className="pb-24 space-y-6">
      
      {/* 🛑 HEADER HUD */}
      <div className={`border-2 text-white p-6 rounded-[32px] shadow-lg relative overflow-hidden transition-all duration-500 ${
         isOffline 
         ? 'bg-gray-800 border-gray-500 grayscale' // GRAYSCALE WHEN OFFLINE
         : alertMode 
           ? 'bg-red-900 border-red-500 shadow-[0_0_30px_rgba(220,38,38,0.5)]' 
           : 'bg-black border-brand-neon shadow-[0_0_20px_rgba(57,255,20,0.3)]'
      }`}>
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>
         
         <div className="relative z-10 flex justify-between items-center">
            <div>
               <p className={`font-black text-xs uppercase tracking-widest mb-1 ${alertMode && !isOffline ? 'text-red-300' : 'text-brand-neon'}`}>Unit ID: MP-04-1234</p>
               <h1 className="text-3xl font-black italic uppercase leading-none flex items-center gap-3">
                  Ops Dashboard
                  {/* SYNC INDICATOR */}
                  {isSyncing && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 shadow-md"><Loader2 className="animate-spin" size={12}/> Syncing...</span>}
               </h1>
            </div>
            
            <div className="flex items-center gap-3">
               {/* 📶 OFFLINE TOGGLE */}
               <button 
                  onClick={toggleOffline}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase border-2 transition-all ${
                     isOffline 
                     ? 'bg-gray-200 text-gray-800 border-gray-400' 
                     : 'bg-green-500 text-white border-white hover:bg-green-600'
                  }`}
                  title="Toggle Network Sim"
               >
                  {isOffline ? <><WifiOff size={14}/> Offline Mode</> : <><Wifi size={14}/> Online</>}
               </button>

               {/* 🔴 THE MAGIC BUTTON */}
               <button 
                  onClick={toggleAlert}
                  className={`p-3 rounded-full border-2 transition-all active:scale-95 ${
                     alertMode 
                     ? 'bg-red-500 border-white text-white animate-pulse shadow-[0_0_15px_white]' 
                     : 'bg-gray-800 border-gray-600 text-gray-500 hover:text-white hover:border-white'
                  }`}
                  title="Toggle Emergency Sim"
               >
                  <Siren size={20} />
               </button>
            </div>
         </div>

         {/* OFFLINE BANNER */}
         {isOffline && (
            <div className="mt-4 bg-gray-700/50 p-2 rounded-lg text-xs font-bold text-center uppercase tracking-widest border border-white/20 animate-pulse text-gray-300 flex items-center justify-center gap-2">
               <UploadCloud size={14} /> Connection Lost • Data caching locally • Auto-upload pending
            </div>
         )}
      </div>

      {/* 🚨 DISPATCH ALERT (CONDITIONAL) */}
      {alertMode && (
         <div className="bg-white dark:bg-gray-900 border-l-4 border-red-600 p-4 rounded-r-xl shadow-lg flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full text-red-600">
               <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
               <h3 className="font-black text-lg text-red-600 uppercase italic leading-none mb-1">Dispatch Alert</h3>
               <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                  Bin #102 is overloaded (98%). Route update required.
               </p>
            </div>
         </div>
      )}

      {/* 🗺️ MAP CONTAINER (Border changes color) */}
      <div className={`h-80 w-full rounded-[32px] border-2 overflow-hidden relative z-0 transition-colors duration-500 ${
         alertMode ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'border-black dark:border-gray-600 shadow-neo'
      }`}>
          <MapContainer center={currentPos} zoom={15} style={{ height: '100%', width: '100%' }}>
             <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
             <Polyline positions={ROUTE_POINTS} color={alertMode ? "#ef4444" : "#39FF14"} weight={4} opacity={0.6} dashArray="10, 10" />
             <Marker position={currentPos} icon={truckIcon}><Popup><b>Your Location</b></Popup></Marker>
             {tasks.map(t => (
                 <Marker key={t.id} position={[t.lat, t.lng]} icon={binIcon(t.status as any)}><Popup><b>{t.address}</b></Popup></Marker>
             ))}
          </MapContainer>
      </div>

      {/* 📋 MISSION OBJECTIVES */}
      <div>
         <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-xl uppercase italic dark:text-white flex items-center gap-2">
               <Navigation className={alertMode ? "text-red-500" : "text-brand-neon"} /> Current Objectives
            </h3>
         </div>
         
         <div className="space-y-3">
            {tasks.map((task, index) => (
               <div 
                 key={task.id} 
                 className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    task.status === 'done' 
                    ? 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 opacity-60' 
                    : task.status === 'critical'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500 shadow-sm'
                      : 'bg-white dark:bg-black border-black dark:border-brand-neon shadow-neo'
                 }`}
               >
                  <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black border-2 ${
                        task.status === 'done' ? 'bg-green-100 border-green-500 text-green-700' : 
                        task.status === 'critical' ? 'bg-white border-red-600 text-red-600' :
                        'bg-yellow-100 border-yellow-500 text-yellow-700'
                     }`}>
                        {task.status === 'critical' ? '!' : index + 1}
                     </div>
                     <div>
                        <h4 className={`font-black text-lg leading-none ${task.status === 'critical' ? 'text-red-600 dark:text-red-400' : 'dark:text-white'}`}>
                           {task.address}
                        </h4>
                        <p className="text-xs font-bold uppercase text-gray-500 mt-1">
                           Bin #{task.id} • Fill: <span className={parseInt(task.fill) > 80 ? 'text-red-600 font-black' : 'text-green-500'}>{task.fill}</span>
                        </p>
                     </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  {task.status !== 'done' ? (
                     <button 
                        onClick={() => handleTaskClick(task)}
                        className={`p-3 rounded-xl border transition-colors flex items-center gap-2 font-black uppercase text-xs ${
                           task.status === 'critical' 
                           ? 'bg-red-600 text-white border-red-800 hover:bg-red-700 shadow-md' 
                           : 'bg-black text-brand-neon border-brand-neon hover:bg-brand-neon hover:text-black'
                        }`}
                     >
                        <Camera size={18} /> {task.status === 'critical' ? 'Resolve' : 'Log'}
                     </button>
                  ) : (
                     <CheckCircle size={24} className="text-green-500" />
                  )}
               </div>
            ))}
         </div>
      </div>

      {/* 📸 PROOF OF WORK MODAL */}
      {activeTask && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-[32px] overflow-hidden border-2 border-black dark:border-gray-700 shadow-2xl animate-in slide-in-from-bottom duration-300">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-black">
                 <div>
                    <h3 className="text-xl font-black italic uppercase dark:text-white">Proof of Work</h3>
                    <p className="text-xs font-bold text-gray-500">Bin #{activeTask.id} • {activeTask.address}</p>
                 </div>
                 <button onClick={() => setActiveTask(null)} className="p-2 bg-gray-200 dark:bg-gray-800 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                 {!proofImage ? (
                    <div onClick={handleCapture} className="h-64 border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-black dark:hover:border-brand-neon transition-all group">
                       {isUploading ? (
                          <div className="flex flex-col items-center animate-pulse"><UploadCloud size={48} className="text-brand-neon mb-2" /><span className="font-black uppercase text-gray-400">Uploading Evidence...</span></div>
                       ) : (
                          <><div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Camera size={32} /></div><h4 className="font-black text-lg uppercase text-gray-400 group-hover:text-black dark:group-hover:text-white">Tap to Capture</h4><p className="text-xs font-bold text-gray-400">Geo-tagging enabled</p></>
                       )}
                    </div>
                 ) : (
                    <div className="relative h-64 rounded-2xl overflow-hidden border-2 border-black shadow-neo">
                       <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                       <div className="absolute bottom-0 left-0 right-0 bg-black/80 text-white p-2 text-[10px] font-mono">LAT: 23.2380 | LNG: 77.4280 | TIME: 14:32:01</div>
                       <button onClick={() => setProofImage(null)} className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full shadow-lg"><X size={16} /></button>
                    </div>
                 )}
                 <button disabled={!proofImage} onClick={submitProof} className={`w-full py-4 rounded-xl font-black uppercase text-lg transition-all ${proofImage ? 'bg-brand-neon text-black shadow-[0_4px_0_#000] hover:-translate-y-1 hover:shadow-[0_6px_0_#000] active:translate-y-0 active:shadow-none' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>{proofImage ? (isOffline ? 'Save to Cache' : 'Submit Log') : 'Photo Required'}</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};