// ✅ Use 'import type' to avoid Vite build errors
import type { User, Transaction, WasteCategory, Bin } from '@/types';

// ==========================================
// 1. MOCK DATASETS
// ==========================================

const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Rohan Kumar', 
    email: 'citizen@kachra.com',
    role: 'citizen', 
    points: 1250, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan' 
  },
  { 
    id: '2', 
    name: 'Vikram Singh', 
    email: 'staff@kachra.com',
    role: 'staff', 
    points: 0, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' 
  },
  { 
    id: '3', 
    name: 'Admin Control', 
    email: 'admin@kachra.com',
    role: 'admin', 
    points: 0, 
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' 
  },
];

const MOCK_HISTORY: Transaction[] = [
  { id: 't1', userId: '1', category: 'organic', amount: 2.5, description: 'Organic Waste', type: 'earn', date: new Date().toISOString() },
  { id: 't2', userId: '1', category: 'plastic', amount: 0.5, description: 'Plastic Bottles', type: 'earn', date: new Date(Date.now() - 86400000).toISOString() },
];

export const MOCK_REWARDS = [
  { id: 1, title: "Swiggy ₹50 Off", cost: 500, icon: "🍔", color: "bg-orange-100 text-orange-600" },
  { id: 2, title: "Amazon ₹100 Gift", cost: 1000, icon: "📦", color: "bg-blue-100 text-blue-600" },
  { id: 3, title: "Free Compost Bag", cost: 300, icon: "🌱", color: "bg-green-100 text-green-600" },
  { id: 4, title: "Movie Ticket (BOGO)", cost: 800, icon: "🎬", color: "bg-red-100 text-red-600" },
];

export const CITIES = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'];

// ==========================================
// 2. HELPER FUNCTIONS
// ==========================================

const getBinColor = (cat: string) => {
  switch(cat) {
    case 'organic': return 'bg-green-500';
    case 'plastic': return 'bg-yellow-500';
    case 'paper': return 'bg-blue-500';
    case 'metal': return 'bg-gray-500';
    case 'glass': return 'bg-amber-700';
    case 'e-waste': return 'bg-red-500';
    default: return 'bg-black';
  }
};

const getRecycleTip = (cat: string) => {
  if (cat === 'organic') return "Great for composting! Keep it dry.";
  if (cat === 'plastic') return "Rinse it before throwing. Crush to save space.";
  if (cat === 'e-waste') return "Dangerous! Do not mix with regular trash.";
  if (cat === 'paper') return "Keep it dry and clean. No grease!";
  return "Thanks for keeping the city clean!";
};

// ==========================================
// 3. EXPORTED API FUNCTIONS
// ==========================================

// --- AUTH ---
export const mockLogin = async (email: string, role: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 800)); // Simulate network delay
  
  // Return mock user based on role (ignoring email for demo)
  const user = MOCK_USERS.find(u => u.role === role);
  if (!user) {
    // Fallback if specific role not found in mock array
    return {
        id: '99',
        name: 'Guest User',
        email: email,
        role: role as any,
        points: 0,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
    };
  }
  return { ...user, email }; // Return user with the email typed in
};

// --- CITIZEN FEATURES ---
export const mockGetHistory = async (): Promise<Transaction[]> => {
  await new Promise(r => setTimeout(r, 500));
  return MOCK_HISTORY;
};

export const mockFetchHistory = mockGetHistory; // Alias for compatibility

export const mockSubmitWaste = async (category: string, weight: number): Promise<Transaction> => {
  await new Promise(r => setTimeout(r, 1000));
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId: '1',
    category,
    amount: weight,
    description: `Recycled ${category}`,
    type: 'earn',
    date: new Date().toISOString(),
  };
};

export const mockClassifyImage = async (_file: File) => {
  await new Promise(r => setTimeout(r, 2000)); // Simulate AI processing
  
  // ✅ FIXED: Clean array definition
  const categories: WasteCategory[] = ['organic', 'plastic', 'paper', 'metal', 'glass', 'e-waste'];
  
  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  const confidence = (Math.random() * (0.99 - 0.75) + 0.75).toFixed(2); // 75-99% confidence

  return {
    category: randomCat,
    confidence: parseFloat(confidence),
    binColor: getBinColor(randomCat),
    tip: getRecycleTip(randomCat),
    points: 10
  };
};

export const mockGetLeaderboard = async () => {
  await new Promise(r => setTimeout(r, 600));
  return [
    { rank: 1, name: "Rohan Kumar", points: 2850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan", trend: 'up' },
    { rank: 2, name: "Priya Sharma", points: 2720, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", trend: 'same' },
    { rank: 3, name: "Amit Verma", points: 2650, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit", trend: 'up' },
    { rank: 4, name: "Neha Gupta", points: 2400, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha", trend: 'down' },
    { rank: 5, name: "Vikram Singh", points: 2150, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram", trend: 'up' },
    { rank: 6, name: "You", points: 1980, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", trend: 'up' },
  ];
};

// --- STAFF FEATURES ---
export const mockGetBins = async (): Promise<Bin[]> => {
    await new Promise(r => setTimeout(r, 500));
    return [
      { id: '101', lat: 23.259933, lng: 77.412613, fillLevel: 80, status: 'critical', lastPickup: '4h ago', type: 'general', address: 'MP Nagar Zone 1' },
      { id: '102', lat: 23.250000, lng: 77.400000, fillLevel: 30, status: 'active', lastPickup: '1d ago', type: 'recyclable', address: 'New Market' },
      { id: '103', lat: 23.260000, lng: 77.420000, fillLevel: 95, status: 'critical', lastPickup: '6h ago', type: 'hazardous', address: 'Hamidia Hospital' },
    ];
};
  
export const mockUploadEvidence = async (taskId: string, _file: File) => {
    await new Promise(r => setTimeout(r, 1500));
    console.log(`Uploaded evidence for task ${taskId}`);
    return { success: true, url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80' };
};

// --- ADMIN FEATURES ---
export const mockGetAdminStats = async (city: string) => {
  await new Promise(r => setTimeout(r, 800));
  
  // Simulate variation between cities
  const multiplier = city === 'Bhopal' ? 1 : 0.8;
  
  return {
    kpis: {
      segregationRate: 78 * multiplier,
      participation: 64 * multiplier,
      totalWaste: 12500 * multiplier, // kg
      fuelSaved: 450 * multiplier, // liters
    },
    trends: [
      { day: 'Mon', wet: 4000, dry: 2400 },
      { day: 'Tue', wet: 3000, dry: 1398 },
      { day: 'Wed', wet: 2000, dry: 9800 },
      { day: 'Thu', wet: 2780, dry: 3908 },
      { day: 'Fri', wet: 1890, dry: 4800 },
      { day: 'Sat', wet: 2390, dry: 3800 },
      { day: 'Sun', wet: 3490, dry: 4300 },
    ],
    composition: [
      { name: 'Organic', value: 45, fill: '#22c55e' },
      { name: 'Plastic', value: 25, fill: '#eab308' },
      { name: 'Paper', value: 15, fill: '#3b82f6' },
      { name: 'Others', value: 15, fill: '#9ca3af' },
    ]
  };
};