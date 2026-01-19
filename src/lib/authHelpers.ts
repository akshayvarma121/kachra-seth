import type { User, Role } from '@/types';

// Mock credentials database
const MOCK_DB = [
  { email: 'citizen@ks.com', password: '123', role: 'citizen', name: 'Rohan Kumar', points: 120 },
  { email: 'staff@ks.com', password: '123', role: 'staff', name: 'Ops Officer', points: 0 },
  { email: 'admin@ks.com', password: '123', role: 'admin', name: 'System Admin', points: 0 },
];

export const performMockLogin = async (email: string, pass: string): Promise<User> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const match = MOCK_DB.find((u) => u.email === email && u.password === pass);

  if (!match) {
    throw new Error('Invalid credentials');
  }

  return {
    id: Math.random().toString(36).substring(7),
    name: match.name,
    role: match.role as Role,
    points: match.points,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${match.name}`,
  };
};