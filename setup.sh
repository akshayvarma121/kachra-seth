#!/bin/bash

echo "🚀 Initializing Kachra Seth Project Structure..."

# 1. Create Directory Structure
echo "📂 Creating folders..."
mkdir -p src/components
mkdir -p src/features/auth
mkdir -p src/features/citizen
mkdir -p src/features/staff
mkdir -p src/hooks
mkdir -p src/lib
mkdir -p src/store
mkdir -p src/types

# 2. Write File Contents using 'cat' with quoted EOF (to preserve ${variable} syntax)

# --- TYPES ---
echo "📝 Creating types..."
cat << 'EOF' > src/types/index.ts
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
  weight: number; // in kg
  pointsEarned: number;
  date: string;
  status: 'pending' | 'verified';
}
EOF

# --- LIB UTILS ---
echo "📝 Creating utilities..."
cat << 'EOF' > src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
EOF

# --- MOCK API ---
echo "📝 Creating mock API..."
cat << 'EOF' > src/lib/mockApi.ts
import { User, Transaction, WasteCategory } from '@/types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Rohan Kumar', role: 'citizen', points: 1250 },
  { id: '2', name: 'Staff Operator', role: 'staff', points: 0 },
  { id: '3', name: 'Admin User', role: 'admin', points: 0 },
];

const MOCK_HISTORY: Transaction[] = [
  { id: 't1', userId: '1', category: 'Organic', weight: 2.5, pointsEarned: 25, date: new Date().toISOString(), status: 'verified' },
  { id: 't2', userId: '1', category: 'Plastic', weight: 0.5, pointsEarned: 50, date: new Date(Date.now() - 86400000).toISOString(), status: 'verified' },
];

export const mockLogin = async (role: string): Promise<User> => {
  await new Promise(r => setTimeout(r, 800)); // Simulate delay
  const user = MOCK_USERS.find(u => u.role === role);
  if (!user) throw new Error('User not found');
  return user;
};

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
EOF

# --- STORE ---
echo "📝 Creating Zustand store..."
cat << 'EOF' > src/store/authStore.ts
import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updatePoints: (pts) => set((state) => ({
    user: state.user ? { ...state.user, points: state.user.points + pts } : null
  })),
}));
EOF

# --- COMPONENTS ---
echo "📝 Creating Layout..."
cat << 'EOF' > src/components/Layout.tsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Sun, Moon } from 'lucide-react';

export const Layout = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(false);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <header className="fixed top-0 w-full bg-white dark:bg-gray-800 shadow-md z-50 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-600 tracking-tight">Kachra Seth</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          {user && (
            <button onClick={handleLogout} className="text-sm font-medium text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>
      <main className="pt-20 pb-20 px-4 max-w-md mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};
EOF

# --- FEATURES: AUTH ---
echo "📝 Creating Login Page..."
cat << 'EOF' > src/features/auth/LoginPage.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { mockLogin } from '@/lib/mockApi';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const schema = z.object({
  role: z.enum(['citizen', 'staff', 'admin']),
});

export const LoginPage = () => {
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const user = await mockLogin(data.role);
      login(user);
      navigate(`/${data.role}`);
    } catch (e) {
      alert('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-[80vh] gap-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500">Select your role to prototype</p>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {['citizen', 'staff', 'admin'].map((role) => (
            <label key={role} className="relative flex items-center p-4 border rounded-xl cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 has-[:checked]:border-green-500 has-[:checked]:bg-green-50 dark:has-[:checked]:bg-green-900/30 transition-all">
              <input {...register("role")} type="radio" value={role} className="mr-3 w-5 h-5 accent-green-600" />
              <span className="capitalize font-medium">{role} Access</span>
            </label>
          ))}
        </div>
        
        <button disabled={isLoading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 flex justify-center">
          {isLoading ? <Loader2 className="animate-spin" /> : 'Enter Prototype'}
        </button>
      </form>
    </div>
  );
};
EOF

# --- FEATURES: CITIZEN ---
echo "📝 Creating Citizen Dashboard..."
cat << 'EOF' > src/features/citizen/CitizenDashboard.tsx
import { useAuthStore } from '@/store/authStore';
import { QrCode, History, Leaf, Zap, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { mockSubmitWaste } from '@/lib/mockApi';

export const CitizenDashboard = () => {
  const { user, updatePoints } = useAuthStore();
  const [isScanning, setIsScanning] = useState(false);

  // Mock Scanning Functionality
  const handleScan = async () => {
    setIsScanning(true);
    // Simulate camera delay
    setTimeout(async () => {
      const result = await mockSubmitWaste('Plastic', 1.5);
      updatePoints(result.pointsEarned);
      setIsScanning(false);
      alert(`Scanned Successfully! Added ${result.pointsEarned} Points.`);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Stats Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-green-100 text-sm font-medium">My Eco-Balance</p>
        <div className="flex items-baseline gap-1 mt-1">
          <h2 className="text-4xl font-bold">{user?.points}</h2>
          <span className="text-sm opacity-80">pts</span>
        </div>
        <div className="mt-4 flex gap-2 text-xs bg-white/20 p-2 rounded-lg w-fit">
          <Leaf className="w-4 h-4" />
          <span>Top 5% of Recyclers</span>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleScan}
          disabled={isScanning}
          className="col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          {isScanning ? (
             <RefreshCw className="w-10 h-10 text-green-500 animate-spin" />
          ) : (
             <QrCode className="w-10 h-10 text-green-600" />
          )}
          <span className="font-bold text-lg">{isScanning ? 'Simulating Scan...' : 'Scan QR Code'}</span>
          <span className="text-xs text-gray-400">Scan bin to deposit waste</span>
        </button>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2">
          <History className="w-6 h-6 text-blue-500" />
          <span className="font-medium text-sm">History</span>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <span className="font-medium text-sm">Rewards</span>
        </div>
      </div>

      {/* Categories Legend */}
      <div>
        <h3 className="font-bold mb-3">Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
             { name: 'Organic', color: 'bg-waste-organic' },
             { name: 'Plastic', color: 'bg-waste-plastic' },
             { name: 'Paper', color: 'bg-waste-paper' },
             { name: 'Metal', color: 'bg-waste-metal' },
             { name: 'E-Waste', color: 'bg-waste-ewaste' },
          ].map((c) => (
            <div key={c.name} className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className={`w-3 h-3 rounded-full ${c.color}`} />
              <span className="text-xs font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
EOF

# --- FEATURES: STAFF ---
echo "📝 Creating Staff Dashboard..."
cat << 'EOF' > src/features/staff/StaffDashboard.tsx
import { CheckCircle } from 'lucide-react';

export const StaffDashboard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bin Ops</h2>
      <div className="p-4 bg-orange-100 text-orange-800 rounded-lg">
        <p className="font-bold">Pending Pickups: 12</p>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-medium text-gray-500">Live Feed</h3>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700">
            <div>
              <p className="font-bold">Bin #10{i}</p>
              <p className="text-xs text-gray-400">Full: 90% • Organic</p>
            </div>
            <button className="p-2 bg-green-100 text-green-700 rounded-full">
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
EOF

# --- APP & ROUTES ---
echo "📝 Creating App.tsx with Routes..."
cat << 'EOF' > src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { LoginPage } from '@/features/auth/LoginPage';
import { CitizenDashboard } from '@/features/citizen/CitizenDashboard';
import { StaffDashboard } from '@/features/staff/StaffDashboard';
import { useAuthStore } from '@/store/authStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles: string[] }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LoginPage />} />
        
        <Route path="/citizen" element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['staff', 'admin']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
                <div className="p-4 text-center">Admin Analytics Dashboard Placeholder</div>
            </ProtectedRoute>
        } />
      </Route>
    </Routes>
  );
}

export default App;
EOF

# --- MAIN.TSX (Providers) ---
echo "📝 Creating main.tsx..."
cat << 'EOF' > src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
EOF

# --- STYLES ---
echo "📝 Updating index.css..."
cat << 'EOF' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Hide scrollbar for category list */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
EOF

echo "✅ Setup Complete! Run 'npm run dev' to start."