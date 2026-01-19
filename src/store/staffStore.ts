import { create } from 'zustand';
import { CollectionTask, RouteStop } from '@/types';

interface StaffStats {
  completed: number;
  pending: number;
  efficiency: number; // percentage
  distance: number;   // km
}

interface StaffState {
  isOffline: boolean;
  activeRoute: RouteStop[] | null;
  tasks: CollectionTask[];
  stats: StaffStats; // 👈 Added this to fix the error
  
  toggleOffline: () => void;
  completeTask: (taskId: string) => void;
  setRoute: (route: RouteStop[]) => void;
  updateStats: (newStats: Partial<StaffStats>) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  isOffline: false,
  activeRoute: [],
  tasks: [],
  
  // 👇 Default Stats (Fixes the "undefined" error)
  stats: {
    completed: 12,
    pending: 5,
    efficiency: 94,
    distance: 42.5
  },

  toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),
  
  completeTask: (taskId) => set((state) => {
    // Auto-update stats when a task is completed
    const newStats = { ...state.stats, completed: state.stats.completed + 1, pending: state.stats.pending - 1 };
    
    return {
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t),
      stats: newStats
    };
  }),

  setRoute: (route) => set({ activeRoute: route }),
  
  updateStats: (newStats) => set((state) => ({
    stats: { ...state.stats, ...newStats }
  }))
}));