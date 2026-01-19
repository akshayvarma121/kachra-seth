export type Role = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email?: string;
  role: Role;
  points?: number;
  avatar?: string;
}

export interface Transaction {
  id: string;
  userId?: string; // 👈 Added this
  type: 'earn' | 'redeem';
  amount: number;
  description: string;
  date: string;
}

// 👈 Expanded this list to match your Mock API
export type WasteCategory = 'organic' | 'plastic' | 'metal' | 'hazardous' | 'paper' | 'glass' | 'e-waste';

export interface Bin {
  id: string;
  lat: number;
  lng: number;
  fillLevel: number; // 👈 We use fillLevel, not 'level'
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
  binId?: string; // 👈 Added optional binId
  address: string;
  type: 'bin' | 'dropoff';
  status: 'pending' | 'completed';
  eta?: string;
  lat?: number;
  lng?: number;
  isCompleted?: boolean;
}