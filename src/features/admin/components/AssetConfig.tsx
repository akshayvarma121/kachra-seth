import { useState } from 'react';
import { Plus, Truck, Trash2, MapPin, Loader2, Navigation } from 'lucide-react';
import { api } from '@/lib/apiClient';

export const AssetConfig = () => {
  const [activeTab, setActiveTab] = useState<'bins' | 'trucks' | 'wards'>('bins');
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);

  // Form States (Removed 'type' from binForm)
  const [binForm, setBinForm] = useState({ id: '', lat: '', lng: '' });
  const [truckForm, setTruckForm] = useState({ licensePlate: '', capacity: '', staffId: '' });
  const [wardForm, setWardForm] = useState({ name: '' });

  // 📍 AUTOMATIC LOCATION DETECTOR
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setBinForm(prev => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6)
        }));
        setDetecting(false);
      },
      () => { alert("Location failed"); setDetecting(false); },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (activeTab === 'bins') {
        const baseId = binForm.id.toUpperCase().trim();
        
        // 🧠 SMART ADD: Automatically create BOTH bins (Wet & Dry)
        // This fits your new "Dual-ID" system perfectly.
        await api.addBin(`${baseId}-W`, Number(binForm.lat), Number(binForm.lng), '');
        await api.addBin(`${baseId}-D`, Number(binForm.lat), Number(binForm.lng), '');

        alert(`Success! Added ${baseId}-W and ${baseId}-D`);
        setBinForm({ id: '', lat: '', lng: '' }); 
      } 
      else if (activeTab === 'trucks') {
        await api.addTruck(truckForm.licensePlate, Number(truckForm.capacity), truckForm.staffId);
        alert('Truck Added!');
        setTruckForm({ licensePlate: '', capacity: '', staffId: '' });
      }
      else if (activeTab === 'wards') {
        await api.addWard(wardForm.name);
        alert('Ward Created!');
        setWardForm({ name: '' });
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none h-fit">
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-xl uppercase italic dark:text-white">Asset Manager</h3>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('bins')} className={`p-2 rounded-lg transition-all ${activeTab === 'bins' ? 'bg-black text-white dark:bg-brand-neon dark:text-black' : 'bg-gray-100 text-gray-400'}`}><Trash2 size={16} /></button>
          <button onClick={() => setActiveTab('trucks')} className={`p-2 rounded-lg transition-all ${activeTab === 'trucks' ? 'bg-black text-white dark:bg-brand-neon dark:text-black' : 'bg-gray-100 text-gray-400'}`}><Truck size={16} /></button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'bins' && (
          <div className="animate-in fade-in slide-in-from-right duration-300 space-y-3">
             <div>
               <label className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">Base Bin ID (e.g. BIN-105)</label>
               <input 
                 value={binForm.id}
                 onChange={(e) => setBinForm({...binForm, id: e.target.value})}
                 placeholder="BIN-XXX"
                 className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white uppercase"
               />
               <p className="text-[10px] text-gray-400 mt-1">System will auto-create -W (Wet) and -D (Dry)</p>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <input value={binForm.lat} onChange={(e) => setBinForm({...binForm, lat: e.target.value})} placeholder="Lat" className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white text-xs"/>
               <input value={binForm.lng} onChange={(e) => setBinForm({...binForm, lng: e.target.value})} placeholder="Lng" className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white text-xs"/>
             </div>

             <button onClick={detectLocation} disabled={detecting} className="w-full py-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-xl text-blue-600 dark:text-blue-400 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
               {detecting ? <Loader2 size={14} className="animate-spin"/> : <Navigation size={14} />}
               {detecting ? "Locating..." : "Auto-Detect Location"}
             </button>
          </div>
        )}

        {/* ... (Keep Trucks and Wards sections same as before) ... */}
        {activeTab === 'trucks' && (
          <div className="animate-in fade-in slide-in-from-right duration-300 space-y-3">
             <input value={truckForm.licensePlate} onChange={(e) => setTruckForm({...truckForm, licensePlate: e.target.value})} placeholder="License Plate" className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white" />
             <input value={truckForm.capacity} onChange={(e) => setTruckForm({...truckForm, capacity: e.target.value})} placeholder="Capacity" type="number" className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white" />
             <input value={truckForm.staffId} onChange={(e) => setTruckForm({...truckForm, staffId: e.target.value})} placeholder="Driver ID" className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white" />
          </div>
        )}
        
         {activeTab === 'wards' && (
           <div className="animate-in fade-in slide-in-from-right duration-300 space-y-3">
             <input value={wardForm.name} onChange={(e) => setWardForm({...wardForm, name: e.target.value})} placeholder="Ward Name" className="w-full bg-gray-100 dark:bg-gray-900 border-2 border-black dark:border-gray-600 rounded-xl px-4 py-2 font-bold dark:text-white" />
           </div>
        )}

        <button onClick={handleSubmit} disabled={loading} className="w-full bg-black text-white dark:bg-brand-neon dark:text-black py-3 rounded-xl font-black uppercase flex items-center justify-center gap-2 hover:opacity-80 transition-opacity mt-4">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
          Add {activeTab === 'bins' ? 'Smart Bin Pair' : activeTab === 'trucks' ? 'Vehicle' : 'Zone'}
        </button>

      </div>
    </div>
  );
};