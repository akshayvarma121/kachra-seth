export const BottomTicker = () => {
  return (
    // ALWAYS Black background (bg-gray-900). Border changes color based on mode.
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t-2 border-black dark:border-brand-neon h-8 flex items-center overflow-hidden transition-colors duration-300">
      
      {/* Light Mode: text-white (Classic Ticker)
          Dark Mode:  text-brand-neon (Cyber/Hacker)
      */}
      <div className="flex whitespace-nowrap animate-marquee text-white dark:text-brand-neon">
        <span className="text-xs font-black uppercase tracking-widest mx-6">⚠️ CITY UPDATE: ORGANIC WASTE PICKUP DELAYED IN ZONE 4</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">•</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">♻️ RECYCLING RATES UP 12%</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">•</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">🏆 ROHAN K. JUST REDEEMED A MOVIE TICKET</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">•</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">🚛 TRUCK MP-04-1234 IS ACTIVE</span>
        
        {/* Duplicate for seamless loop */}
        <span className="text-xs font-black uppercase tracking-widest mx-6">⚠️ CITY UPDATE: ORGANIC WASTE PICKUP DELAYED IN ZONE 4</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">•</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">♻️ RECYCLING RATES UP 12%</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">•</span>
        <span className="text-xs font-black uppercase tracking-widest mx-6">🏆 ROHAN K. JUST REDEEMED A MOVIE TICKET</span>
      </div>
    </div>
  );
};