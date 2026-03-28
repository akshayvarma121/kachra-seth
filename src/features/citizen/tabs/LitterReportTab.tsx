import { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, CheckCircle, Loader2, X, UploadCloud, Navigation } from 'lucide-react';
import { api } from '@/lib/apiClient';
import { useAuthStore } from '@/store/authStore';

export const LitterReportTab = () => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [form, setForm] = useState({ landmark: '', description: '' });
  const [gps, setGps] = useState<{lat: number, lng: number} | null>(null);
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(true);
  const [done, setDone] = useState(false);

  // 1. Auto-Fetch GPS on Mount
  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGps({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setGpsLoading(false);
            },
            () => { alert("GPS Permission Denied"); setGpsLoading(false); }
        );
    }
  }, []);

  // 2. Handle Photo Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        // Create a local preview URL (Magic Trick for instant preview)
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
    }
  };

  // 3. Submit Report
  const handleSubmit = async () => {
    if (!user?.id) return alert("Login required");
    if (!imagePreview) return alert("Photo is required!");
    if (!gps) return alert("Waiting for GPS location...");

    setLoading(true);
    try {
        // In a real app, you would upload the file here. 
        // For the demo, we send the form data and GPS.
        await api.post('/litter/report', {
           userId: user.id,
           lat: gps.lat,
           lng: gps.lng,
           imageUrl: 'uploaded_image_demo.jpg', // Placeholder for backend
           landmark: form.landmark,
           description: form.description
        });
        setDone(true);
    } catch (e) {
        alert("Failed to send report");
    } finally {
        setLoading(false);
    }
  };

  // --- SUCCESS SCREEN ---
  if (done) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in zoom-in">
       <div className="bg-green-100 p-6 rounded-full mb-6 ring-8 ring-green-50">
          <CheckCircle className="w-16 h-16 text-green-600" />
       </div>
       <h2 className="text-3xl font-black uppercase italic">Report Filed!</h2>
       <p className="text-gray-500 mt-2 font-bold max-w-xs mx-auto">
         Thank you, Citizen! We have flagged this location for cleanup.
       </p>
       <div className="mt-6 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-bold text-sm">
         +10 Karma Points Added
       </div>
       <button 
         onClick={() => { setDone(false); setImagePreview(null); setForm({landmark:'', description:''}); }} 
         className="mt-8 text-black underline font-bold uppercase"
       >
         Report Another Spot
       </button>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto pb-24">
      
      {/* HEADER */}
      <div className="mb-6">
          <h2 className="text-3xl font-black italic uppercase leading-none">Report<br/>Open Litter</h2>
          <div className="flex items-center gap-2 mt-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
             {gpsLoading ? (
                 <span className="flex items-center gap-1 text-orange-500 animate-pulse"><Loader2 size={10} className="animate-spin"/> Locating Satellite...</span>
             ) : gps ? (
                 <span className="flex items-center gap-1 text-green-600"><Navigation size={10}/> GPS Locked: {gps.lat.toFixed(4)}, {gps.lng.toFixed(4)}</span>
             ) : (
                 <span className="text-red-500">GPS Failed</span>
             )}
          </div>
      </div>

      {/* 📸 CAMERA SECTION */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-56 rounded-3xl border-4 border-dashed transition-all cursor-pointer relative overflow-hidden group mb-6 ${
            imagePreview ? 'border-brand-neon bg-black' : 'border-gray-300 bg-gray-100 hover:bg-gray-200'
        }`}
      >
         {/* Hidden Input for Real Camera */}
         <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            capture="environment" // 👈 TRIGGERS PHONE CAMERA
            className="hidden" 
         />

         {imagePreview ? (
             <>
               <img src={imagePreview} className="w-full h-full object-cover opacity-80" alt="Evidence" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/50 text-white px-4 py-2 rounded-full font-bold text-xs uppercase flex items-center gap-2 backdrop-blur-md">
                     <Camera size={14}/> Retake Photo
                  </div>
               </div>
             </>
         ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors">
                 <div className="bg-white p-4 rounded-full shadow-sm mb-3">
                    <Camera size={32} />
                 </div>
                 <span className="font-bold text-sm uppercase">Tap to Take Photo</span>
                 <span className="text-[10px] opacity-60 mt-1">Proof is required</span>
             </div>
         )}
      </div>

      {/* 📝 FORM DETAILS */}
      <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-1 mb-1 block">Location / Landmark Name</label>
            <input 
              value={form.landmark}
              onChange={(e) => setForm({...form, landmark: e.target.value})}
              placeholder="e.g. Near City Park Gate 2"
              className="w-full bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-xl px-4 py-3 font-bold dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-neon"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-1 mb-1 block">Description (Optional)</label>
            <textarea 
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              placeholder="Describe the waste (e.g. construction debris, overflow)..."
              rows={3}
              className="w-full bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-neon resize-none"
            />
          </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button 
        onClick={handleSubmit} 
        disabled={loading || !gps || !imagePreview}
        className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg uppercase shadow-xl flex items-center justify-center gap-2 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
        {loading ? "Uploading Report..." : "Submit Report"}
      </button>

    </div>
  );
};