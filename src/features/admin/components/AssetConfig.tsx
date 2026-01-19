import { Plus, Trash2, Truck, Trash } from 'lucide-react';
import { useState } from 'react';

export const AssetConfig = () => {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bins'>('vehicles');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Asset Configuration</h3>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('vehicles')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'vehicles' ? 'bg-white text-black shadow' : 'text-gray-500'}`}
          >Vehicles</button>
          <button 
             onClick={() => setActiveTab('bins')}
             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${activeTab === 'bins' ? 'bg-white text-black shadow' : 'text-gray-500'}`}
          >Smart Bins</button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mock List */}
        <div className="flex items-center justify-between p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
               {activeTab === 'vehicles' ? <Truck size={18} /> : <Trash size={18} />}
            </div>
            <div>
              <p className="font-bold text-sm">{activeTab === 'vehicles' ? 'MP-04-GA-1212' : 'Bin #1092 - Market'}</p>
              <p className="text-xs text-green-600">Active • Online</p>
            </div>
          </div>
          <button className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
        </div>

        {/* Add New Button */}
        <button className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-green-500 hover:text-green-500 transition-colors">
          <Plus size={18} />
          <span className="font-medium text-sm">Add New {activeTab === 'vehicles' ? 'Vehicle' : 'Smart Bin'}</span>
        </button>
      </div>
    </div>
  );
};
