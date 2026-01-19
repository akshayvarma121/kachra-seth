import { useState } from 'react';
import { CheckCircle, X, Trash2, AlertOctagon, Ban } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Scanner } from '@yudiel/react-qr-scanner';
import confetti from 'canvas-confetti';

export const QRScanTab = () => {
  const { updatePoints } = useAuthStore();
  const [step, setStep] = useState<'scan' | 'report' | 'success' | 'error'>('scan');
  const [scannedBin, setScannedBin] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // 🛡️ ANTI-SPAM CHECKER
  const checkCooldown = (binId: string) => {
    const today = new Date().toLocaleDateString();
    const history = JSON.parse(localStorage.getItem('ks_scan_history') || '{}');
    
    // Check if this bin was scanned today
    if (history[binId] === today) {
       return false; // BLOCKED
    }
    return true; // ALLOWED
  };

  const saveScan = (binId: string) => {
    const today = new Date().toLocaleDateString();
    const history = JSON.parse(localStorage.getItem('ks_scan_history') || '{}');
    history[binId] = today;
    localStorage.setItem('ks_scan_history', JSON.stringify(history));
  };

  const handleScan = (detectedCodes: any) => {
    const rawValue = detectedCodes[0]?.rawValue;
    if (!rawValue) return;

    // Validate QR Format
    if (rawValue.startsWith('KS:BIN:')) {
      const parts = rawValue.split(':');
      const binId = parts[2];
      const location = parts[3] || 'Unknown';

      // 🔊 PLAY BEEP SOUND (Success)
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(e => console.log("Audio blocked by browser", e));

      // 🛑 STEP 1: CHECK SPAM
      if (!checkCooldown(binId)) {
          setErrorMsg("You already scanned this bin today! Come back tomorrow.");
          setStep('error');
          return;
      }

      // ✅ STEP 2: PROCEED TO REPORTING
      setScannedBin({ binId, location });
      setStep('report'); // Move to "Report Status" screen
    } else {
      // 🔊 PLAY ERROR SOUND
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/mechanical_clock_ring.ogg');
      audio.play().catch(e => console.log("Audio blocked", e));

      setErrorMsg('Invalid QR Code. This is not a Kachra Seth Bin.');
      setStep('error');
    }
  };

  const submitReport = (_status: string) => {
     // 🚀 FINAL SUBMISSION
     saveScan(scannedBin.binId); // Lock this bin for the day
     updatePoints(20); // Award Points
     setStep('success');
     confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#39FF14', '#ffffff'] });
     
     // 🔊 PLAY COIN SOUND
     const audio = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
     audio.play().catch(e => console.log("Audio blocked", e));
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
               {/* 👇 FIXED: No 'audio' prop, added className */}
               <Scanner 
                  onScan={handleScan} 
                  onError={(err) => console.error(err)}
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
                 Looking for KS:BIN...
               </span>
            </div>
          </div>
        )}

        {/* 📝 STATE 2: REPORT FILL LEVEL */}
        {step === 'report' && (
           <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
              <h3 className="text-2xl font-black uppercase italic dark:text-white mb-2">One Last Step!</h3>
              <p className="text-sm font-bold text-gray-500 mb-6">Help us update the map. How full is this bin?</p>
              
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
                Thanks for keeping {scannedBin?.location} clean.
             </p>
             <div className="bg-black text-brand-neon px-6 py-3 rounded-xl font-black text-xl border-2 border-brand-neon shadow-[4px_4px_0px_#39FF14]">
                +20 POINTS
             </div>
             <button onClick={reset} className="mt-12 w-full bg-gray-100 dark:bg-gray-800 py-4 rounded-xl font-bold uppercase hover:bg-black hover:text-white transition-colors">
               Scan Another
             </button>
          </div>
        )}

        {/* ❌ STATE 4: ERROR / SPAM DETECTED */}
        {step === 'error' && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-300 z-30">
             <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6 border-4 border-red-500">
                 {errorMsg.includes("already scanned") ? <Ban size={48} className="text-red-600"/> : <X size={48} className="text-red-600" />}
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