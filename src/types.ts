export type Role = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  points?: number;
  avatar?: string;
}

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
}