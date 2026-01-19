import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down';
  trendValue?: string;
  icon: LucideIcon;
  color: string;
}

export const AdminKPICard = ({ title, value, subValue, trend, trendValue, icon: Icon, color }: Props) => {
  return (
    <div className="bg-white dark:bg-black p-6 rounded-[32px] border-2 border-black dark:border-gray-700 shadow-neo dark:shadow-none hover:-translate-y-1 transition-transform">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} border-2 border-black text-white shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-black px-2 py-1 rounded border-2 border-black uppercase ${trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {trend === 'up' ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <div className="flex items-baseline gap-2 mt-1">
        <h2 className="text-4xl font-black text-black dark:text-white tracking-tighter">{value}</h2>
        {subValue && <span className="text-sm text-gray-400 font-bold">{subValue}</span>}
      </div>
    </div>
  );
};