import { useStaffStore } from '@/store/staffStore';
import { BarChart3, Fuel, Clock } from 'lucide-react';

export const KPICards = () => {
  const { stats } = useStaffStore();

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-600 mb-1">
          <BarChart3 size={16} />
          <span className="text-xs font-bold uppercase">Collected</span>
        </div>
        <p className="text-xl font-black text-blue-900">{stats.collected}kg</p>
      </div>

      <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100">
        <div className="flex items-center gap-2 text-orange-600 mb-1">
          <Fuel size={16} />
          <span className="text-xs font-bold uppercase">Efficiency</span>
        </div>
        <p className="text-xl font-black text-orange-900">{stats.fuel}km/L</p>
      </div>

      <div className="bg-green-50 p-3 rounded-2xl border border-green-100">
        <div className="flex items-center gap-2 text-green-600 mb-1">
          <Clock size={16} />
          <span className="text-xs font-bold uppercase">SLA</span>
        </div>
        <p className="text-xl font-black text-green-900">{stats.sla}%</p>
      </div>
    </div>
  );
};