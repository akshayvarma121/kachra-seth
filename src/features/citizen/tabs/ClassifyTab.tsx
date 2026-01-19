import { useState } from 'react';
import { Camera, CheckCircle, Loader2, X, Info } from 'lucide-react'; // Added Info icon
import { mockClassifyImage } from '@/lib/mockApi';
// import { useAuthStore } from '@/store/authStore'; // ❌ REMOVED: No need to update points here
import confetti from 'canvas-confetti';

export const ClassifyTab = () => {
  // const { updatePoints } = useAuthStore(); // ❌ REMOVED
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const res = await mockClassifyImage(file);
      setResult(res);
      // updatePoints(res.points); // ❌ DISABLED: No points for just identifying
      
      // Keep confetti for the "Success" feeling, but maybe less intense?
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 }, colors: ['#ffffff', '#39FF14'] });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* HEADER */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-4xl font-black italic uppercase dark:text-white">AI Sorter</h2>
        <p className="font-bold text-gray-500">Identify waste type correctly</p>
      </div>

      {!image ? (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-neon to-green-600 rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <label className="relative flex flex-col items-center justify-center h-80 bg-white dark:bg-black border-4 border-dashed border-gray-300 dark:border-gray-700 rounded-[32px] cursor-pointer hover:border-black dark:hover:border-brand-neon hover:bg-gray-50 dark:hover:bg-gray-900 transition-all group">
            <div className="bg-black dark:bg-brand-neon text-white dark:text-black p-6 rounded-full mb-4 shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.5)] group-hover:scale-110 transition-transform">
              <Camera size={40} />
            </div>
            <span className="text-2xl font-black uppercase dark:text-white">Open Cam</span>
            <span className="text-sm font-bold text-gray-400 mt-2">or upload file</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
          </label>
        </div>
      ) : (
        <div className="relative rounded-[32px] overflow-hidden border-2 border-black shadow-neo">
          <img src={image} alt="Preview" className="w-full h-96 object-cover" />
          
          {loading && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white backdrop-blur-sm">
              <Loader2 className="animate-spin text-brand-neon mb-4" size={60} />
              <p className="text-2xl font-black italic animate-pulse">ANALYZING...</p>
            </div>
          )}
          
          <button onClick={reset} className="absolute top-4 right-4 p-3 bg-white border-2 border-black rounded-full shadow-neo-sm hover:scale-110 transition-transform">
            <X size={24} className="text-black" />
          </button>
        </div>
      )}

      {/* RESULTS CARD */}
      {result && !loading && (
        <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-[0_0_20px_rgba(57,255,20,0.2)] animate-in slide-in-from-bottom duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="font-bold text-gray-500 uppercase tracking-widest text-xs">AI Detected</p>
              <h3 className="text-5xl font-black uppercase italic dark:text-white">{result.category}</h3>
            </div>
            <div className={`w-20 h-20 rounded-2xl ${result.binColor} border-2 border-black shadow-neo flex items-center justify-center`}>
               <CheckCircle className="text-white w-10 h-10" />
            </div>
          </div>
          
          <div className="bg-gray-100 dark:bg-black p-6 rounded-2xl border-2 border-black/10 dark:border-gray-800 mb-6">
             <p className="text-lg font-bold italic dark:text-gray-300">"💡 {result.tip}"</p>
          </div>

          <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-6">
             <Info className="text-blue-500 shrink-0" />
             <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
               Note: Use the <span className="underline">QR Scanner</span> at the bin to earn points for this item.
             </p>
          </div>

          <button onClick={reset} className="w-full bg-black text-white dark:bg-brand-neon dark:text-black border-2 border-transparent py-4 rounded-xl font-black text-xl uppercase shadow-neo hover:-translate-y-1 hover:shadow-neo-lg active:shadow-none active:translate-y-0 transition-all">
            Identify Another
          </button>
        </div>
      )}
    </div>
  );
};