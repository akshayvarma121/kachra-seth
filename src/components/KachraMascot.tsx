import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

export type MascotMood = 'idle' | 'scanning' | 'rich' | 'judging';

// 🎥 LOCAL VIDEO ASSETS
const VIDEO_STATES = {
  idle: {
    webm: "/assets/videos/kachra_idle.webm",
    defaultText: "Kachra laye ho??"
  },
  scanning: {
    webm: "/assets/videos/kachra_scan.webm",
    mp4: "/assets/videos/kachra_scan.mp4",
    defaultText: "Ruko... checking chal rahi hai."
  },
  rich: {
    webm: "/assets/videos/kachra_rich.webm",
    defaultText: "Paisa hi paisa! Mauj karo!"
  },
  judging: {
    webm: "/assets/videos/kachra_fail.webm",
    defaultText: "Maza nahi aya. Aur lao."
  }
};

interface MascotProps {
  mood: MascotMood;
  message?: string;
}

export const KachraMascot = ({ mood, message }: MascotProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // @ts-ignore
  const data = VIDEO_STATES[mood] || VIDEO_STATES.idle;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      // ⚡ SPEED HACK: Make the loop feel faster and more energetic
      videoRef.current.playbackRate = 1.35; 
      videoRef.current.play().catch((e) => console.log("Autoplay blocked", e));
    }
  }, [mood]);

  return (
    <div className="relative w-full h-[45vh] bg-gray-900 overflow-hidden shadow-2xl rounded-b-[40px] z-0 border-b-2 border-brand-neon">
      
      {/* 🎬 THE BIG HERO VIDEO */}
      <video
        ref={videoRef}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500 opacity-90",
          mood === 'rich' ? "brightness-110 saturate-125" : "brightness-100"
        )}
        autoPlay
        loop
        muted
        playsInline
        // Ensure speed stays fast even after loop resets
        onTimeUpdate={(e) => { e.currentTarget.playbackRate = 1.35; }} 
      >
        <source src={data.webm} type="video/webm" />
      </video>

      {/* 🌑 GRADIENT OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

      {/* 💬 CAPTION STYLE DIALOGUE */}
      <div className="absolute bottom-16 left-0 right-0 p-6 text-center animate-in slide-in-from-bottom-4 fade-in duration-500 z-10 pointer-events-none">
        <div className="inline-block bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl transform rotate-1">
          <p className="text-xl md:text-2xl font-black text-white italic tracking-wide drop-shadow-md">
            "{message || data.defaultText}"
          </p>
        </div>
      </div>

      {/* STATUS BADGE */}
      <div className="absolute top-8 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 z-10">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", mood === 'idle' ? "bg-green-400" : "bg-red-500")} />
        <span className="text-xs font-bold text-white uppercase tracking-wider">
          {mood === 'idle' ? 'Online' : 'Busy'}
        </span>
      </div>
    </div>
  );
};