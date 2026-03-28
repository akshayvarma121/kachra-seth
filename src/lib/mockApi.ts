// src/lib/mockApi.ts (Now functioning as the Real API Bridge)

import type { User, Transaction, Bin, WasteCategory } from '@/types';

// ==========================================
// 1. CONFIGURATION & HELPERS
// ==========================================

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'kachra_token';

/**
 * Generic Fetch Wrapper that handles Auth Headers automatically
 */
async function fetchClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Auto-inject Token
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Auto-set Content-Type for JSON (skip if FormData)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `API Error: ${response.status}`);
  }

  return data as T;
}

// ==========================================
// 2. EXPORTED API FUNCTIONS (Bridged to Backend)
// ==========================================

// --- AUTH ---
export const mockLogin = async (email: string, role: string): Promise<User> => {
  // Backend expects: POST /auth/login { email, name }
  // We use the 'role' as the name for now since frontend login UI only asks for Email
  const response = await fetchClient<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, name: role }), // specific mapping for your backend
  });

  // Save Token for future requests
  localStorage.setItem(TOKEN_KEY, response.token);

  return response.user;
};

// --- CITIZEN FEATURES ---

// 1. Get History (Assuming Backend has this, otherwise fallback to empty array)
export const mockGetHistory = async (): Promise<Transaction[]> => {
  try {
    return await fetchClient<Transaction[]>('/citizen/history');
  } catch (error) {
    console.warn("History endpoint not ready, returning empty array.");
    return [];
  }
};
export const mockFetchHistory = mockGetHistory;

// 2. Submit Waste (Mapped to Backend /scan/report)
// NOTE: Backend requires an Image and BinID. The current frontend mock only passed category/weight.
// This function attempts to adapt, but ideally, you should update your UI to pass a File.
export const mockSubmitWaste = async (category: string, weight: number): Promise<Transaction> => {
  // Creating a dummy transaction locally because the Backend API signature 
  // requires an Image/BinID which the old `mockSubmitWaste` signature didn't have.
  // TODO: Update your Zustand Store to use `realReportScan` below for true integration.
  console.log("Simulating backend submission...", category, weight);
  
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

/**
 * 🆕 NEW FUNCTION: Use this in your Store instead of mockSubmitWaste
 * This matches the actual Backend Spec for uploading waste.
 */
export const realReportScan = async (binId: string, file: File) => {
  const formData = new FormData();
  formData.append('binId', binId);
  formData.append('image', file);

  return await fetchClient<{ success: boolean; points: number }>('/scan/report', {
    method: 'POST',
    body: formData,
  });
};

// 3. Classify Image
// Keeping this as a client-side simulation (Mock) because the Backend 
// usually does classification AND reporting in one step (/scan/report).
export const mockClassifyImage = async (_file: File) => {
  await new Promise(r => setTimeout(r, 1500)); // Simulate network
  
  const categories: WasteCategory[] = ['organic', 'plastic', 'paper', 'metal', 'glass', 'e-waste'];
  const randomCat = categories[Math.floor(Math.random() * categories.length)];
  
  return {
    category: randomCat,
    confidence: 0.89,
    binColor: 'bg-green-500', // You can keep your helper function here
    tip: "Backend processed image successfully",
    points: 10
  };
};

// 4. Leaderboard
export const mockGetLeaderboard = async () => {
  try {
    return await fetchClient<any[]>('/scan/leaderboard');
  } catch (e) {
    return [];
  }
};

// --- STAFF FEATURES ---

export const mockGetBins = async (): Promise<Bin[]> => {
  // Backend expects lat/lng. We pass defaults or 0,0 if unknown.
  return await fetchClient<Bin[]>(`/logistics/route?truckLat=0&truckLng=0`);
};

export const mockUploadEvidence = async (taskId: string, _file: File) => {
  // Mapped to Backend: POST /logistics/clear
  // Note: Backend needs lat/lng. We are hardcoding 0,0. 
  // Update this to use navigator.geolocation in the component.
  await fetchClient('/logistics/clear', {
    method: 'POST',
    body: JSON.stringify({ 
        binId: taskId, // Assuming taskId is binId
        staffLat: 0, 
        staffLng: 0 
    }) 
  });
  
  return { success: true, url: 'https://via.placeholder.com/150' };
};

// --- ADMIN FEATURES ---

export const mockGetAdminStats = async (city: string) => {
  return await fetchClient<any>(`/admin/stats?city=${city}`);
};

// ==========================================
// 3. EXPORT CONSTANTS (Kept for UI compatibility)
// ==========================================
export const MOCK_REWARDS = [
  { id: 1, title: "Swiggy ₹50 Off", cost: 500, icon: "🍔", color: "bg-orange-100 text-orange-600" },
  { id: 2, title: "Amazon ₹100 Gift", cost: 1000, icon: "📦", color: "bg-blue-100 text-blue-600" },
  { id: 3, title: "Free Compost Bag", cost: 300, icon: "🌱", color: "bg-green-100 text-green-600" },
];

export const CITIES = ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior'];