import { CheckCircle, Circle, MapPin, Navigation } from 'lucide-react';
import { useStaffStore } from '@/store/staffStore';
import { RouteStop } from '@/types';

export const RouteList = () => {
  const { route, toggleStop } = useStaffStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black italic uppercase">Today's Route</h3>
      
      <div className="space-y-3">
        {route.map((stop: RouteStop, index: number) => (
          <div 
            key={stop.id}
            // 👇 Fixed: using isCompleted instead of completed
            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
              stop.isCompleted 
                ? 'bg-green-50 border-green-500 opacity-60' 
                : 'bg-white dark:bg-gray-800 border-black dark:border-gray-600'
            }`}
          >
            <button onClick={() => toggleStop(stop.id)}>
              {stop.isCompleted ? (
                <CheckCircle className="text-green-600 fill-green-100" size={24} />
              ) : (
                <Circle className="text-gray-400" size={24} />
              )}
            </button>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-black text-white px-2 py-1 rounded">
                  #{index + 1}
                </span>
                <h4 className={`font-bold ${stop.isCompleted ? 'line-through text-gray-400' : 'dark:text-white'}`}>
                  {stop.address}
                </h4>
              </div>
              <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">
                {stop.type} • {stop.eta || '--:--'}
              </p>
            </div>

            {/* 👇 Fixed: Added safety check for binId */}
            {stop.type === 'bin' && stop.binId && (
               <div className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">
                  Bin #{stop.binId}
               </div>
            )}
            
            <button className="p-2 bg-brand-neon rounded-lg border-2 border-black hover:scale-105 transition-transform">
               <Navigation size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};