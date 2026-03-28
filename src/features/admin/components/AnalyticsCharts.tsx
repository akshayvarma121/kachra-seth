import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// 🎨 Chart Colors (Neon Theme)
const COLORS = ['#39FF14', '#FF00FF', '#00FFFF', '#FFFF00', '#FFA500'];

export const AnalyticsCharts = ({ data }: { data: any }) => {
  // 🛡️ SAFETY CHECK: If data is completely missing, render a "No Data" placeholder
  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
        <div className="bg-white dark:bg-black rounded-[32px] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 font-bold uppercase">
          Waiting for Analytics Data...
        </div>
        <div className="bg-white dark:bg-black rounded-[32px] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 font-bold uppercase">
          Waiting for Charts...
        </div>
      </div>
    );
  }

  // 🛡️ DATA PREPARATION (Safe Fallbacks)
  // We use `|| []` to ensure .map() never crashes
  const wasteData = data.wasteTypeBreakdown || [
    { name: 'Organic', value: 400 },
    { name: 'Dry', value: 300 },
    { name: 'Plastic', value: 300 },
    { name: 'Metal', value: 200 }
  ];

  const activityData = data.dailyActivity || [
    { name: 'Mon', organic: 40, dry: 24, plastic: 24 },
    { name: 'Tue', organic: 30, dry: 13, plastic: 22 },
    { name: 'Wed', organic: 20, dry: 58, plastic: 22 },
    { name: 'Thu', organic: 27, dry: 39, plastic: 20 },
    { name: 'Fri', organic: 18, dry: 48, plastic: 21 },
    { name: 'Sat', organic: 23, dry: 38, plastic: 25 },
    { name: 'Sun', organic: 34, dry: 43, plastic: 21 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* 📊 LEFT: WASTE COMPOSITION (PIE CHART) */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-gray-700 rounded-[32px] p-8 shadow-neo dark:shadow-none flex flex-col">
        <h3 className="font-black text-xl uppercase italic dark:text-white mb-6">Waste Composition</h3>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={wasteData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {/* 🛡️ SAFE MAP: loops through safely prepared wasteData */}
                {wasteData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#39FF14', fontWeight: 'bold' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📈 RIGHT: DAILY COLLECTION (STACKED BAR) */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-gray-700 rounded-[32px] p-8 shadow-neo dark:shadow-none flex flex-col">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-black text-xl uppercase italic dark:text-white">Weekly Collection</h3>
           <div className="flex gap-2 text-[10px] font-bold uppercase">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full"></div> Organic</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full"></div> Dry</span>
           </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData} barSize={12}>
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                fontWeight="bold"
              />
              <YAxis 
                stroke="#888888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}kg`} 
                fontWeight="bold"
              />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: 'none', color: '#fff' }}
              />
              <Bar dataKey="organic" stackId="a" fill="#4ade80" radius={[0, 0, 4, 4]} />
              <Bar dataKey="dry" stackId="a" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};