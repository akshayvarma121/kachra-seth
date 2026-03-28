// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User, Role } from '@/types';
import { api } from '@/lib/apiClient';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, name: string) => Promise<void>;
  register: (email: string, name: string, role: Role) => Promise<void>; // 👈 Added
  logout: () => void;
  setUser: (user: User) => void;
  updatePoints: (pointsToAdd: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.login(email, name);
          localStorage.setItem('kachra_token', response.token);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          set({ error: err.message || 'Login failed', isLoading: false });
          throw err;
        }
      },

      // 🟢 NEW REGISTER ACTION
      register: async (email: string, name: string, role: Role) => {
        set({ isLoading: true, error: null });
        try {
          // 1. Call Backend
          const response = await api.register(email, name, role);
          
          // 2. Auto-Login
          localStorage.setItem('kachra_token', response.token);
          set({ user: response.user, isAuthenticated: true, isLoading: false });
        } catch (err: any) {
          console.error("Registration Error:", err);
          set({ error: err.message || 'Registration failed', isLoading: false });
          throw err;
        }
      },

      logout: () => {
        localStorage.removeItem('kachra_token'); 
        set({ user: null, isAuthenticated: false, error: null });
      },

      setUser: (user: User) => set({ user, isAuthenticated: !!user }),
      
      updatePoints: (pointsToAdd: number) => 
        set((state) => ({
          user: state.user 
            ? { ...state.user, points: (state.user.points || 0) + pointsToAdd } 
            : null
        })),
    }),
    {
      name: 'kachra-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);