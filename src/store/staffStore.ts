import { create } from 'zustand';
import { CollectionTask, RouteStop } from '@/types';

interface StaffState {
  isOffline: boolean;
  activeRoute: RouteStop[] | null;
  tasks: CollectionTask[];
  
  toggleOffline: () => void;
  completeTask: (taskId: string) => void;
  setRoute: (route: RouteStop[]) => void;
}

export const useStaffStore = create<StaffState>((set) => ({
  isOffline: false,
  activeRoute: [],
  tasks: [],

  toggleOffline: () => set((state) => ({ isOffline: !state.isOffline })),
  
  completeTask: (taskId) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
  })),

  setRoute: (route) => set({ activeRoute: route })
}));