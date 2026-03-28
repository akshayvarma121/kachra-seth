import { useEffect } from 'react';
import { CheckCircle, Circle, Navigation, Loader2 } from 'lucide-react';
import { useStaffStore } from '@/store/staffStore';

export const RouteList = () => {
  const { route, fetchRoute, markStopComplete, isLoading } = useStaffStore();

  // 1. Load Route on Mount
  useEffect(() => {
    // We hardcode the truck's starting position for now (e.g. Depot)
    // In production: navigator.geolocation.getCurrentPosition(...)
    fetchRoute(23.2599, 77.4126); 
  }, []);

  const handleToggle = (stop: any) => {
    if (stop.isCompleted) return; // Can't undo a clear (backend restriction)
    
    // Pass current location to validate "Geofence" (Driver must be close)
    markStopComplete(stop.binId, 23.2599, 77.4126);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="animate-spin w-8 h-8 text-brand-neon" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black italic uppercase flex justify-between items-center">
        Today's Route 
        <span className="text-xs bg-black text-white px-2 py-1 rounded not-italic font-sans">
          {route.filter(r => !r.isCompleted).length} Stops Left
        </span>
      </h3>
      
      <div className="space-y-3">
        {route.map((stop, index) => (
          <div 
            key={stop.id}
            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all duration-300 ${
              stop.isCompleted 
                ? 'bg-green-50 border-green-500 opacity-60' 
                : 'bg-white dark:bg-gray-800 border-black dark:border-gray-600'
            }`}
          >
            {/* CHECKBOX BUTTON */}
            <button 
              onClick={() => handleToggle(stop)}
              disabled={stop.isCompleted}
              className="hover:scale-110 transition-transform"
            >
              {stop.isCompleted ? (
                <CheckCircle className="text-green-600 fill-green-100" size={28} />
              ) : (
                <Circle className="text-gray-400 hover:text-black" size={28} />
              )}
            </button>

            {/* INFO */}
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
                {stop.type} • ETA: {stop.eta || '--:--'}
              </p>
            </div>

            {/* NAVIGATE BUTTON */}
            <button 
              onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`)}
              className="p-3 bg-brand-neon rounded-lg border-2 border-black hover:scale-105 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none"
            >
               <Navigation size={18} />
            </button>
          </div>
        ))}

        {route.length === 0 && !isLoading && (
          <div className="text-center p-8 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
            <p className="font-bold text-gray-500">No critical bins nearby. Good job!</p>
          </div>
        )}
      </div>
    </div>
  );
};