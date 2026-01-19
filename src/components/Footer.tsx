import { Heart, Recycle } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6 border-t-4 border-brand-neon mt-auto relative overflow-hidden">
      
      {/* BACKGROUND PATTERN */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(57,255,20,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* LEFT: BRAND */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-black italic uppercase text-brand-neon leading-none">
              Kachra Seth
            </h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mt-1">
              Urban Waste OS v1.0
            </p>
          </div>

          {/* RIGHT: COPYRIGHT */}
          <div className="text-center md:text-right">
            <p className="font-bold text-sm text-gray-400 flex items-center justify-center md:justify-end gap-1">
              
            </p>
            <p className="text-[10px] font-bold text-gray-600 uppercase mt-1">
              © {new Date().getFullYear()} Team Kachra Seth. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};