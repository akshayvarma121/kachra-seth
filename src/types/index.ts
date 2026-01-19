export type Role = 'citizen' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  role: Role;
  points: number;
  avatar?: string;
}

export type WasteCategory = 'Organic' | 'Plastic' | 'Paper' | 'Metal' | 'Glass' | 'E-waste' | 'Hazardous';

export interface Transaction {
  id: string;
  userId: string;
  category: WasteCategory;
  weight: number;
  pointsEarned: number;
  date: string;
  status: 'pending' | 'verified';
}