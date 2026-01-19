// ✅ Use 'import type' to avoid Vite build errors
import type { User, Transaction, WasteCategory } from '@/types';

// ==========================================
// 1. MOCK DATASETS
// ==========================================

const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Rohan Kumar', 
    role: 'citizen', 
    points: 1250, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan' 
  },
  { 
    id: '2', 
    name: 'Staff Operator', 
    role: 'staff', 
    points: 0, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Staff' 
  },
  { 
    id: '3', 
    name: 'Admin User', 
    role: 'admin', 
    points: 0, 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin' 
  },
];

const MOCK_HISTORY: Transaction[] = [
  { id: 't1', userId: '1', category: 'Organic', weight: 2.5, pointsEarned: 25, date: new Date().toISOString(), status: 'verified' },
  { id: 't2', userId: '1', category: 'Plastic', weight: 0.5, pointsEarned: 50, date: new Date(Date.now() - 86400000).toISOString(), status: 'verified' },
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
    case 'Organic': return 'bg-green-500';
    case 'Plastic': return 'bg-yellow-500';
    case 'Paper': return 'bg-blue-500';
    case 'Metal': return 'bg-gray-500';
    case 'Glass': return 'bg-amber-700';
    case 'E-waste': return 'bg-red-500';
    default: return 'bg-black';
  }
};

const getRecycleTip = (cat: string) => {
  if (cat === 'Organic') return "Great for composting! Keep it dry.";
  if (cat === 'Plastic') return "Rinse it before throwing. Crush to save space.";
  if (cat === 'E-waste') return "Dangerous! Do not mix with regular trash.";
  if (cat === 'Paper') return "Keep it dry and clean. No grease!";
  return "Thanks for keeping the city clean!";
};

// ==========================================
// 3. EXPORTED API FUNCTIONS
// ==========================================

// --- AUTH ---
export const mockLogin = async (role: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 800)); // Simulate network delay
  const user = MOCK_USERS.find(u => u.role === role);
  if (!user) throw new Error('User not found');
  return user;
};

// --- CITIZEN FEATURES ---
export const mockFetchHistory = async (): Promise<Transaction[]> => {
  await new Promise(r => setTimeout(r, 500));
  return MOCK_HISTORY;
};

export const mockSubmitWaste = async (category: WasteCategory, weight: number): Promise<Transaction> => {
  await new Promise(r => setTimeout(r, 1000));
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId: '1',
    category,
    weight,
    pointsEarned: Math.floor(weight * 10),
    date: new Date().toISOString(),
    status: 'pending'
  };
};

export const mockClassifyImage = async (file: File) => {
  await new Promise(r => setTimeout(r, 2000)); // Simulate AI processing
  
  // Random "AI" Decision
  const categories: WasteCategory[] = ['Organic', 'Plastic', 'Paper', 'Metal', 'Glass', 'E-waste'];
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
    { rank: 6, name: "You", points: 1980, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", trend: 'up' }, // Your User
    { rank: 7, name: "Anjali D.", points: 1850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali", trend: 'down' },
    { rank: 8, name: "Rahul K.", points: 1600, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul", trend: 'same' },
    { rank: 9, name: "Suresh P.", points: 1450, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh", trend: 'down' },
    { rank: 10, name: "Meera J.", points: 1200, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera", trend: 'up' },
    { rank: 11, name: "Kabir", points: 900, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir", trend: 'same' },
    { rank: 12, name: "Tara", points: 850, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tara", trend: 'down' },
  ];
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