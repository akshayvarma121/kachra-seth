import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updatePoints: (points: number) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updatePoints: (pts) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, points: state.user.points + pts }
            : null,
        })),
    }),
    {
      name: 'kachra-seth-auth', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);