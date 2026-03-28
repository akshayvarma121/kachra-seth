import { useState } from 'react';
import { CheckCircle, X, Trash2, AlertOctagon, Ban, Loader2, Camera } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/apiClient';
import { Scanner } from '@yudiel/react-qr-scanner';
import confetti from 'canvas-confetti';

export const QRScanTab = () => {
  const { updatePoints } = useAuthStore();
  const [step, setStep] = useState<'scan' | 'verifying' | 'report' | 'submitting' | 'success' | 'error'>('scan');
  
  // 🧠 STORE BIN TYPE HERE (Critical Fix)
  const [scannedBin, setScannedBin] = useState<{ id: string; type: string; location: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 📸 Helper to convert a string/canvas to a File object (for backend)
  const createDummyImageFile = () => {
    const blob = new Blob(["dummy-image-data"], { type: "image/jpeg" });
    return new File([blob], "scan_evidence.jpg", { type: "image/jpeg" });
  };

  const handleScan = async (detectedCodes: any) => {
    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    // 🔊 BEEP
    new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});

    // --- 1. SIMPLIFIED PARSING ---
    // Rule: IDs must end in -W (Wet) or -D (Dry)
    // Example: "BIN-999-W"
    let binId = rawValue;
    let type = 'Wet'; // Default

    // Case-insensitive check for suffix
    const upperId = rawValue.toUpperCase();
    
    if (upperId.endsWith('-D') || upperId.includes('DRY')) {
        type = 'Dry';
    } else if (upperId.endsWith('-W') || upperId.includes('WET')) {
        type = 'Wet';
    }

    // --- 2. VERIFY ---
    setStep('verifying');

    try {
        // Send the raw ID (e.g. "BIN-999-W")
        // We Mock the Lat/Lng for speed
        const response = await api.verifyBin(binId, 23.2599, 77.4126);

        if (response.valid) {
            setScannedBin({ 
                id: binId, 
                type: type, // Derived from the ID itself
                location: 'Verified Location' 
            });
            setStep('report');
        } else {
            throw new Error(response.message || "Invalid Bin");
        }
    } catch (err: any) {
        setErrorMsg("Invalid QR Code. Try BIN-999-W");
        setStep('error');
    }
};
  const submitReport = async (_status: string) => {
     if (!scannedBin) return;
     setStep('submitting');

     try {
       // 4. Send Report to Backend
       const imageFile = createDummyImageFile(); // In prod, use real camera
       
       // 🚀 API CALL (Updated to pass 3 args)
       // We ignore '_status' for now because the backend logic handles fill calculation automatically
       // or you can update the backend to accept 'fillStatus' later.
       const response = await api.reportWaste(scannedBin.id, imageFile, scannedBin.type);

       if (response.success) {
         updatePoints(response.points || 20); // Sync global state
         
         // Success UI
         setStep('success');
         confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#39FF14', '#ffffff'] });
         new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg').play().catch(() => {});
       } else {
         throw new Error("Report rejected by server.");
       }
     } catch (err: any) {
       console.error(err);
       setErrorMsg("Failed to submit report. Server error.");
       setStep('error');
     }
  };

  const reset = () => {
    setStep('scan');
    setErrorMsg('');
    setScannedBin(null);
  };

  return (
    <div className="max-w-md mx-auto h-full min-h-[60vh] flex flex-col relative">
      
      {/* HEADER */}
      <div className="text-center mb-6">
        <h2 className="text-4xl font-black italic uppercase dark:text-white">Bin Scanner</h2>
        <p className="font-bold text-gray-500">Scan QR • Report Level • Earn</p>
      </div>

      <div className="relative flex-1 bg-black rounded-[32px] overflow-hidden border-4 border-black dark:border-gray-700 shadow-neo group">
        
        {/* 📸 STATE 1: CAMERA SCANNING */}
        {step === 'scan' && (
          <div className="relative h-full w-full">
            <div className="h-full w-full [&>section]:h-full [&>section]:w-full [&_video]:object-cover">
               <Scanner 
                  onScan={handleScan} 
                  onError={(err) => console.log(err)}
                  constraints={{ facingMode: 'environment' }}
                  components={{ finder: false }}
                  styles={{ container: { height: '100%', width: '100%' } }}
               />
            </div>
            {/* Laser Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
               <div className="w-64 h-64 border-2 border-brand-neon rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand-neon shadow-[0_0_15px_#39FF14] animate-[scan_2s_infinite]"></div>
               </div>
            </div>
            <div className="absolute bottom-8 left-0 right-0 text-center z-20">
               <span className="bg-black/80 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest animate-pulse border border-white/20">
                 Looking for QR...
               </span>
            </div>
          </div>
        )}

        {/* ⏳ STATE 1.5: VERIFYING / SUBMITTING */}
        {(step === 'verifying' || step === 'submitting') && (
           <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50">
              <Loader2 className="w-16 h-16 text-brand-neon animate-spin mb-4" />
              <p className="text-white font-bold uppercase tracking-widest animate-pulse">
                {step === 'verifying' ? 'Verifying Location...' : 'Uploading Report...'}
              </p>
           </div>
        )}

        {/* 📝 STATE 2: REPORT FILL LEVEL */}
        {step === 'report' && scannedBin && (
           <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
              <h3 className="text-2xl font-black uppercase italic dark:text-white mb-2">
                  {scannedBin.type} Bin Verified!
              </h3>
              <p className="text-sm font-bold text-gray-500 mb-6">
                  Help us update the map. How full is this bin?
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <button onClick={() => submitReport('empty')} className="p-4 rounded-xl border-2 border-green-500 bg-green-50 hover:bg-green-100 flex flex-col items-center gap-2">
                    <Trash2 className="text-green-600" />
                    <span className="font-black text-green-700 uppercase text-sm">Empty</span>
                 </button>
                 <button onClick={() => submitReport('half')} className="p-4 rounded-xl border-2 border-yellow-500 bg-yellow-50 hover:bg-yellow-100 flex flex-col items-center gap-2">
                    <div className="relative"><Trash2 className="text-yellow-600" /><div className="absolute inset-0 top-1/2 bg-yellow-600/20"></div></div>
                    <span className="font-black text-yellow-700 uppercase text-sm">Half Full</span>
                 </button>
                 <button onClick={() => submitReport('full')} className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50 hover:bg-orange-100 flex flex-col items-center gap-2">
                    <Trash2 className="text-orange-600 fill-orange-600" />
                    <span className="font-black text-orange-700 uppercase text-sm">Full</span>
                 </button>
                 <button onClick={() => submitReport('overflow')} className="p-4 rounded-xl border-2 border-red-500 bg-red-50 hover:bg-red-100 flex flex-col items-center gap-2 animate-pulse">
                    <AlertOctagon className="text-red-600" />
                    <span className="font-black text-red-700 uppercase text-sm">Overflowing</span>
                 </button>
              </div>

              <div className="bg-gray-100 p-4 rounded-xl text-xs font-bold text-gray-500 text-center">
                 Incorrect reporting may lead to account suspension.
              </div>
           </div>
        )}

        {/* 🎉 STATE 3: SUCCESS */}
        {step === 'success' && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300 z-30">
             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border-4 border-green-500">
                <CheckCircle size={48} className="text-green-600" />
             </div>
             <h3 className="text-3xl font-black uppercase italic mb-2 dark:text-white">Bin Reported!</h3>
             <p className="text-gray-500 font-bold mb-6">
                Thanks for keeping the city clean.
             </p>
             <div className="bg-black text-brand-neon px-6 py-3 rounded-xl font-black text-xl border-2 border-brand-neon shadow-[4px_4px_0px_#39FF14]">
                +20 POINTS
             </div>
             <button onClick={reset} className="mt-12 w-full bg-gray-100 dark:bg-gray-800 py-4 rounded-xl font-bold uppercase hover:bg-black hover:text-white transition-colors">
               Scan Another
             </button>
          </div>
        )}

        {/* ❌ STATE 4: ERROR */}
        {step === 'error' && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300 z-30">
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-500">
                 {errorMsg.includes("far") ? <Ban size={48} className="text-red-600"/> : <X size={48} className="text-red-600" />}
             </div>
             <h3 className="text-3xl font-black uppercase italic mb-2 dark:text-white">Scan Failed</h3>
             <p className="text-red-500 font-bold mb-6">{errorMsg}</p>
             <button onClick={reset} className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold uppercase">
               Try Again
             </button>
          </div>
        )}
      </div>
    </div>
  );
};