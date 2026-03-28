import { create } from 'zustand';
import { api } from '@/lib/apiClient';
import type { RouteStop } from '@/types';

interface StaffState {
  route: RouteStop[];
  isLoading: boolean;
  
  // Actions
  fetchRoute: (lat: number, lng: number) => Promise<void>;
  markStopComplete: (binId: string, lat: number, lng: number) => Promise<void>;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  route: [],
  isLoading: false,

  // 1. Fetch Optimal Route from Backend (TSP Algorithm)
  fetchRoute: async (lat, lng) => {
    set({ isLoading: true });
    try {
      const bins = await api.getRoute(lat, lng);
      
      // Convert Backend Bins -> Frontend Route Stops
      const routeStops: RouteStop[] = bins.map((bin, index) => ({
        id: `stop-${bin.id}`,
        binId: bin.id,
        address: `Bin Station #${bin.id} (${bin.type})`, // In real app, reverse geocode this
        type: 'bin',
        status: bin.status === 'critical' ? 'pending' : 'completed',
        isCompleted: bin.fillLevel === 0, // 0% means cleared
        eta: `${10 + index * 5} min`, // Mock ETA for now
        lat: bin.lat,
        lng: bin.lng
      }));

      set({ route: routeStops, isLoading: false });
    } catch (err) {
      console.error("Failed to fetch route:", err);
      set({ isLoading: false });
    }
  },

  // 2. Mark Bin as Cleared
  markStopComplete: async (binId, lat, lng) => {
    // Optimistic Update (Update UI immediately for speed)
    set((state) => ({
      route: state.route.map(stop => 
        stop.binId === binId ? { ...stop, isCompleted: true } : stop
      )
    }));

    try {
      // Send to Backend
      await api.clearBin(binId, lat, lng);
    } catch (err) {
      console.error("Failed to clear bin:", err);
      // Revert if failed (Optional)
    }
  }
}));