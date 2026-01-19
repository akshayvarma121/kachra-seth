import { useStaffStore } from '@/store/staffStore';
import { CheckCircle, Circle, MapPin } from 'lucide-react';

export const RouteList = () => {
  const { route, toggleStop } = useStaffStore();

  return (
    <div className="bg-white dark:bg-black rounded-[32px] p-6 border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none">
      <h3 className="font-black text-xl mb-6 flex items-center gap-2 uppercase italic dark:text-white">
        <MapPin size={24} className="text-blue-500" />
        Mission Objectives
      </h3>
      <div className="space-y-3">
        {route.map((stop, index) => (
          <div 
            key={stop.id} 
            onClick={() => toggleStop(stop.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              stop.completed 
                ? 'bg-green-100 dark:bg-green-900/20 border-green-500 opacity-60' 
                : 'bg-gray-50 dark:bg-gray-900 border-black dark:border-gray-600 hover:-translate-y-1 hover:shadow-neo-sm'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <div className="text-xs font-black text-gray-400">#{index + 1}</div>
            </div>
            <div className="flex-1">
              <div className="font-bold text-black dark:text-gray-100 text-lg leading-none mb-1">{stop.address}</div>
              <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Target: {stop.binId}</div>
            </div>
            {stop.completed ? <CheckCircle className="text-green-600 dark:text-green-400" size={28} /> : <Circle className="text-gray-300 dark:text-gray-600" size={28} />}
          </div>
        ))}
      </div>
    </div>
  );
};