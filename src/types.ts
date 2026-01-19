export type Role = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string; // 👈 Made optional to fix the build error
  role: Role;
  points?: number;
  avatar?: string;
}

// 👇 Added missing types
export interface Transaction {
  id: string;
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  date: string;
}

export type WasteCategory = 'plastic' | 'organic' | 'metal' | 'hazardous';

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number; // 0-100
  status: 'active' | 'critical' | 'pickup_scheduled';
  lastPickup: string;
  type: 'general' | 'recyclable' | 'hazardous';
  address: string;
}

export interface CollectionTask {
  id: string;
  binId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'verified';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  timestamp: string;
}

export interface RouteStop {
  id: string;
  address: string;
  type: 'bin' | 'dropoff';
  status: 'pending' | 'completed';
  eta?: string;
  lat?: number;
  lng?: number;
  isCompleted?: boolean; // 👈 Added for compatibility
}