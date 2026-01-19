import { useState } from 'react';
import { Ticket, ShoppingBag, Coffee, Gift, Zap, Lock, CreditCard, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import confetti from 'canvas-confetti';

// 🛍️ MOCK REWARDS INVENTORY
const REWARDS = [
  { id: 1, title: "PVR Movie Ticket", cost: 500, type: 'entertainment', icon: Ticket, color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/20", border: "border-pink-500", desc: "1 Free Ticket (Any Show)" },
  { id: 2, title: "Amazon Gift Card", cost: 1000, type: 'shopping', icon: Gift, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/20", border: "border-orange-500", desc: "₹500 Voucher Balance" },
  { id: 3, title: "Starbucks Coffee", cost: 350, type: 'food', icon: Coffee, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20", border: "border-green-600", desc: "Tall Cappuccino (Hot/Cold)" },
  { id: 4, title: "Metro Pass (7 Days)", cost: 800, type: 'travel', icon: CreditCard, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/20", border: "border-blue-500", desc: "Unlimited Travel Pass" },
  { id: 5, title: "Pro Badge (Profile)", cost: 2000, type: 'exclusive', icon: Zap, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-900/20", border: "border-yellow-500", desc: "Golden Profile Frame" },
  { id: 6, title: "Mystery Box", cost: 1500, type: 'mystery', icon: Lock, color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/20", border: "border-purple-500", desc: "Random Rare Item!" },
];

export const RewardsTab = () => {
  const { user, updatePoints } = useAuthStore();
  const [processing, setProcessing] = useState<number | null>(null);

  const handleRedeem = (id: number, cost: number) => {
    if ((user?.points || 0) < cost) return;

    setProcessing(id);
    setTimeout(() => {
      updatePoints(-cost);
      setProcessing(null);
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    }, 1500);
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      
      {/* 💳 WALLET HEADER */}
      <div className="relative mb-10 mt-4">
         <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform -skew-x-6 rounded-[32px] blur-xl opacity-30"></div>
         <div className="relative bg-black text-white p-8 rounded-[32px] border-2 border-white/20 shadow-neo dark:shadow-[0_0_20px_rgba(147,51,234,0.5)] overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Pattern */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

            <div className="relative z-10 flex items-center gap-4">
               <div className="w-16 h-16 rounded-full bg-brand-neon flex items-center justify-center text-black border-4 border-black shadow-[0_0_20px_#39FF14]">
                  <ShoppingBag size={32} />
               </div>
               <div>
                  <h2 className="text-3xl font-black italic uppercase leading-none">Loot Store</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Spend your hard earned trash cash</p>
               </div>
            </div>

            <div className="relative z-10 text-right bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
               <p className="text-[10px] font-black uppercase text-brand-neon tracking-widest mb-1">Current Balance</p>
               <div className="text-4xl font-black text-white leading-none flex items-baseline justify-end gap-1">
                  {user?.points} <span className="text-lg text-gray-400">PTS</span>
               </div>
            </div>
         </div>
      </div>

      {/* 📦 ITEMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {REWARDS.map((item) => {
          const canAfford = (user?.points || 0) >= item.cost;
          const isProcessing = processing === item.id;

          return (
            <div 
              key={item.id}
              className={`relative group overflow-hidden rounded-[32px] border-2 transition-all duration-300 ${
                 canAfford 
                 ? 'bg-white dark:bg-black border-black dark:border-gray-700 hover:-translate-y-2 dark:hover:border-brand-neon hover:shadow-neo dark:hover:shadow-[0_0_20px_rgba(57,255,20,0.3)]' 
                 : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-800 opacity-70 grayscale'
              }`}
            >
              <div className="p-6 flex items-start justify-between">
                 
                 {/* Icon Box */}
                 <div className={`w-16 h-16 rounded-2xl ${item.bg} ${item.border} border-2 flex items-center justify-center mb-4 shadow-sm group-hover:rotate-6 transition-transform`}>
                    <item.icon size={32} className={item.color} />
                 </div>

                 {/* Price Tag */}
                 <div className={`px-3 py-1 rounded-full text-xs font-black uppercase border-2 ${
                    canAfford 
                    ? 'bg-black text-brand-neon border-brand-neon shadow-[0_0_10px_rgba(57,255,20,0.4)]' 
                    : 'bg-gray-300 text-gray-600 border-gray-400'
                 }`}>
                    {item.cost} PTS
                 </div>
              </div>

              <div className="px-6 pb-6">
                 <h3 className="text-2xl font-black italic uppercase text-black dark:text-white leading-tight mb-1">
                    {item.title}
                 </h3>
                 <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-6">
                    {item.desc}
                 </p>

                 <button
                   disabled={!canAfford || isProcessing}
                   onClick={() => handleRedeem(item.id, item.cost)}
                   className={`w-full py-4 rounded-xl font-black uppercase flex items-center justify-center gap-2 transition-all ${
                      isProcessing
                      ? 'bg-yellow-400 text-black cursor-wait'
                      : canAfford
                        ? 'bg-black text-white dark:bg-brand-neon dark:text-black hover:scale-[1.02] active:scale-95'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                   }`}
                 >
                    {isProcessing ? (
                       <span className="animate-pulse">Processing...</span>
                    ) : canAfford ? (
                       <>Redeem <ArrowRight size={18} /></>
                    ) : (
                       "Not Enough Points"
                    )}
                 </button>
              </div>

              {/* Decorative "Locked" Overlay if poor */}
              {!canAfford && (
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10 pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};