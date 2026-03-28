// src/lib/apiClient.ts

// --- TYPES ---
interface AuthResponse { token: string; user: any }
interface Bin { id: string; lat: number; lng: number; fillLevel: number; wetLevel?: number; dryLevel?: number; type: string }
interface AdminStats { totalWaste: number; activeTrucks: number; segregationRate: number; revenue: number; wasteTypeBreakdown: any[]; dailyActivity: any[] }
interface HeatMapPoint { id: string; lat: number; lng: number; wetLevel: number; dryLevel: number; status: string }

// --- CONFIGURATION ---
// ⚠️ MAKE SURE THIS IP MATCHES YOUR LAPTOP IP
const API_BASE_URL = 'https://kachra-seth-backend.onrender.com'; 
const TOKEN_KEY = 'kachra_token';

// --- CORE REQUEST HANDLER ---
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: HeadersInit = {
    ...options.headers,
  };

  // 🟢 CRITICAL FIX: 
  // Only set 'Content-Type: application/json' if we are NOT sending a file (FormData).
  if (!(options.body instanceof FormData)) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  // Attach Token if available
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle No Content (204)
  if (response.status === 204) {
    return {} as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
       console.warn("Unauthorized request");
       // localStorage.removeItem(TOKEN_KEY); 
    }
    throw new Error(data.error || data.message || `API Error: ${response.status}`);
  }

  return data;
}

// --- EXPORTED API METHODS ---

export const api = {
  // 1. GENERIC METHODS
  get: <T>(endpoint: string, config?: { params?: Record<string, any> }) => {
    const query = config?.params ? '?' + new URLSearchParams(config.params).toString() : '';
    return request<T>(`${endpoint}${query}`);
  },

  post: <T>(endpoint: string, body: any) => {
    return request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  // 2. AUTH
  login: (email: string, name?: string) => 
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }), 
    }),

  register: (email: string, name: string, role: string) => 
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, role }),
    }),

  getMe: () => request<any>(`/auth/me?t=${new Date().getTime()}`),

  // 3. CITIZEN: CORE & SCANNING
  
  // ✅ Step 1: Verify Location (Renamed to match QRScanTab)
  verifyBin: (qrId: string, userLat: number, userLng: number) =>
    request<{ valid: boolean; message: string; binType?: string; binId?: string }>('/citizen/scan', {
      method: 'POST',
      body: JSON.stringify({ qrId, userLat, userLng }),
    }),

  // ✅ Step 2: Upload Image (Updated to accept wasteType)
  reportWaste: (binId: string, imageFile: File, wasteType: string) => {
    const formData = new FormData();
    formData.append('binId', binId);
    formData.append('wasteType', wasteType); // 👈 Critical for Wet/Dry logic
    formData.append('image', imageFile);
    
    return request<{ success: boolean; points: number; wasteType: string }>('/citizen/dispose', {
      method: 'POST',
      body: formData,
    });
  },

  getLeaderboard: () => 
    request<any[]>('/citizen/leaderboard'),

  // 4. CITIZEN: DASHBOARD FEATURES
  getTruckLocation: () => 
    request<{ lat: number, lng: number, eta: string }>('/citizen/truck-location'),
  
  fileComplaint: (ward: string, issueType: string, description: string) => 
    request('/citizen/complaint', {
      method: 'POST',
      body: JSON.stringify({ wardName: ward, issueType, description })
    }),

  getCitizenEvents: () => request<any[]>('/citizen/events'),
  
  joinEvent: (eventId: string) => 
    request<{ success: boolean; message: string }>('/citizen/events/join', {
      method: 'POST',
      body: JSON.stringify({ eventId })
    }),

  // 5. STAFF & LOGISTICS
  getRoute: (lat: number, lng: number) =>
    request<Bin[]>(`/logistics/route?lat=${lat}&lng=${lng}`),

  clearBin: (binId: string, staffId: string) =>
    request<{ success: boolean }>('/logistics/clear', {
      method: 'POST',
      body: JSON.stringify({ binId, staffId }),
    }),

  // 6. ADMIN - DASHBOARD STATS
  getStats: () => request<AdminStats>('/admin/stats'),
  
  getHeatMap: () => request<HeatMapPoint[]>('/admin/heat-map'),

  // 7. ADMIN - STAFF OPERATIONS
  getDrivers: () => request<any[]>('/admin/roster'),
  
  addDriver: (email: string, name: string) => 
    request('/auth/register', { 
      method: 'POST',
      body: JSON.stringify({ email, name, role: 'staff' }),
    }),

  updateDriverStatus: (userId: number | string, isActive: boolean) => 
    request('/admin/roster/status', {
      method: 'PATCH',
      body: JSON.stringify({ userId, isActive }),
    }),

  // 8. ADMIN - ASSET MANAGEMENT
  addBin: (id: string, lat: number, lng: number, type: string) => 
    request('/admin/bins', {
      method: 'POST',
      body: JSON.stringify({ id, lat, lng, type })
    }),

  addTruck: (licensePlate: string, capacity: number, staffId: string) => 
    request('/admin/trucks', {
      method: 'POST',
      body: JSON.stringify({ licensePlate, capacity, staffId })
    }),

  addWard: (name: string) => 
    request('/admin/wards', {
      method: 'POST',
      body: JSON.stringify({ name })
    }),

  // 9. ADMIN - COMMUNITY MANAGEMENT
  getComplaints: () => request<any[]>('/admin/complaints'),

  resolveComplaint: (complaintId: string) => 
    request<{ success: boolean }>('/admin/complaints/resolve', {
      method: 'PATCH',
      body: JSON.stringify({ complaintId }),
    }),

  getEvents: () => request<any[]>('/admin/events'),

  addEvent: (title: string, date: string, location: string, description: string) => 
    request('/admin/events', {
      method: 'POST',
      body: JSON.stringify({ title, date, location, description }),
    }),

  // 10. CITIZEN - REWARDS & REDEMPTION
  redeemReward: (rewardTitle: string, cost: number) => 
    request<{ success: boolean; newBalance: number }>('/citizen/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardTitle, cost })
    }),
    
  // 11. LOGISTICS - DRIVER STATS
  getDriverCalendar: (staffId: string) => 
    request<{ logs: any[]; stats: any }>(`/logistics/calendar/${staffId}`),
  
  getDriverStats: (staffId: string) => 
    request<{ 
      activeTime: string; 
      bonusAmount: number; 
      nextPayDate: string; 
      rank: string;
      isOnShift: boolean;
      shiftStart: string | null; 
    }>(`/logistics/stats/${staffId}`),

  toggleShift: (start: boolean) => 
    request<{ message: string }>(`/logistics/shift/toggle`, { 
      method: 'POST', 
      body: JSON.stringify({ start }) 
    }),
};