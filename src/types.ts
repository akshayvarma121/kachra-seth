// src/types.ts

export type Role = 'citizen' | 'staff' | 'admin';

// Matches POST /auth/login response
export interface User {
  id?: string; // Optional, as backend might not return it in the 'user' object immediately
  name: string;
  email: string;
  role: Role;
  points?: number; // Optional until we confirm backend sends this on login
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Matches GET /logistics/route
export interface Bin {
  id: string;
  lat: number;
  lng: number;
  status: 'active' | 'critical' | 'maintenance'; 
  fillLevel: number; // 0-100
  type: 'dry' | 'wet' | 'hazardous';
  lastServiced?: string;
}

// Matches GET /scan/verify response
export interface VerifyScanResponse {
  valid: boolean;
  distance: number;
  message?: string;
}

// Matches GET /admin/stats
export interface AdminStats {
  totalWaste: number;
  activeTrucks: number;
  segregationRate: number; // inferred from "dry/organic mix"
}

// Matches GET /admin/heat-map
export interface HeatMapPoint {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number;
}