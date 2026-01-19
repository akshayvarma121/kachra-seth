import { create } from 'zustand';
import { CollectionTask, RouteStop, Bin } from '@/types';

interface StaffStats {
  completed: number;
  pending: number;
  efficiency: number;
  distance: number;
  // 👇 Added these 3 missing properties
  collected: number; // kg
  fuel: number;      // liters or %
  sla: number;       // % compliance
}

interface StaffState {
  isOffline: boolean;
  route: RouteStop[];
  tasks: CollectionTask[];
  stats: StaffStats;
  vehicleLoc: [number, number];
  bins: Bin[];
  
  toggleOffline: () => void;
  completeTask: (taskId: string) => void;
  setRoute: (route: RouteStop[]) => void;
  updateStats: (newStats: Partial<StaffStats>) => void;
  toggleStop: (stopId: string) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  isOffline: false,
  route: [
    { id: '1', address: 'Market Bin #12', type: 'bin', status: 'pending', lat: 23.2599, lng: 77.4126 },
    { id: '2', address: 'Station Dump', type: 'dropoff', status: 'pending', lat: 23.2500, lng: 77.4000 }
  ],
  tasks: [],
  vehicleLoc: [23.259933, 77.412613],
  bins: [
    { id: '101', lat: 23.258, lng: 77.410, fillLevel: 80, status: 'critical', lastPickup: '2h ago', type: 'general', address: 'Zone 1' }
  ],
  
  // 👇 Default Stats (Including the new fields)
  stats: {
    completed: 12,
    pending: 5,
    efficiency: 94,
    distance: 42.5,
    collected: 1250, // 1250 kg
    fuel: 45,        // 45% fuel left
    sla: 98          // 98% SLA met
  },

  toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),
  
  completeTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t),
    // Auto-update stats on completion
    stats: { 
      ...state.stats, 
      completed: state.stats.completed + 1, 
      pending: state.stats.pending - 1,
      collected: state.stats.collected + 50 
    }
  })),

  setRoute: (route) => set({ route }),
  
  updateStats: (newStats) => set((state) => ({
    stats: { ...state.stats, ...newStats }
  })),

  toggleStop: (stopId) => set((state) => ({
    route: state.route.map(stop => 
      stop.id === stopId 
        ? { ...stop, status: stop.status === 'completed' ? 'pending' : 'completed', isCompleted: !stop.isCompleted } 
        : stop
    )
  }))
}));