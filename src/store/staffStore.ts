import { create } from 'zustand';

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  level: number; // 0-100%
  status: 'active' | 'issue';
  lastPickup: string;
}

export interface RouteStop {
  id: string;
  address: string;
  binId: string;
  completed: boolean;
}

interface StaffState {
  bins: Bin[];
  vehicleLoc: { lat: number; lng: number };
  route: RouteStop[];
  stats: { collected: number; fuel: number; sla: number };
  updateBinLevel: (id: string, level: number) => void;
  toggleStop: (id: string) => void;
  simulateLiveMovement: () => void;
}

// Bhopal Coordinates as base
const BASE_LAT = 23.2599;
const BASE_LNG = 77.4126;

export const useStaffStore = create<StaffState>((set) => ({
  bins: [
    { id: 'B101', lat: BASE_LAT + 0.002, lng: BASE_LNG + 0.001, level: 85, status: 'active', lastPickup: 'Yesterday' }, // Red (Full)
    { id: 'B102', lat: BASE_LAT - 0.003, lng: BASE_LNG - 0.002, level: 45, status: 'active', lastPickup: 'Today' },     // Yellow
    { id: 'B103', lat: BASE_LAT + 0.004, lng: BASE_LNG - 0.004, level: 10, status: 'active', lastPickup: 'Today' },     // Green
    { id: 'B104', lat: BASE_LAT - 0.001, lng: BASE_LNG + 0.005, level: 95, status: 'issue', lastPickup: '2 days ago' }, // Overflow + Issue
  ],
  vehicleLoc: { lat: BASE_LAT, lng: BASE_LNG },
  route: [
    { id: 'S1', address: '12 MP Nagar Zone 1', binId: 'B101', completed: false },
    { id: 'S2', address: 'Near DB Mall', binId: 'B104', completed: false },
    { id: 'S3', address: 'New Market Circle', binId: 'B102', completed: false },
  ],
  stats: { collected: 1240, fuel: 8.5, sla: 98 },

  updateBinLevel: (id, level) => set((state) => ({
    bins: state.bins.map(b => b.id === id ? { ...b, level } : b)
  })),

  toggleStop: (id) => set((state) => ({
    route: state.route.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
  })),

  simulateLiveMovement: () => set((state) => ({
    vehicleLoc: {
      lat: state.vehicleLoc.lat + (Math.random() - 0.5) * 0.0005,
      lng: state.vehicleLoc.lng + (Math.random() - 0.5) * 0.0005,
    }
  }))
}));