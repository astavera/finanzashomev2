import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './types';

interface AppState {
  users: User[];
  updateUser: (id: string, updates: Partial<User>) => void;
  addUser: (user: User) => void;
  deleteUser: (id: string) => void;
}

export const DEFAULT_WEEKLY_INCOME = 1536;
export const WEEKLY_INCOME = DEFAULT_WEEKLY_INCOME;
export const WEEKLY_INCOME_AMOUNT = DEFAULT_WEEKLY_INCOME;
export const MONTHLY_ESTIMATE = DEFAULT_WEEKLY_INCOME * 4;

const createDefaultState = () => ({
  users: [
    { id: 'u-1', name: 'Sebastian', role: 'Admin' },
    { id: 'u-2', name: 'Sharon', role: 'Admin' },
  ] as User[],
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...createDefaultState(),

      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user,
          ),
        })),
      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),
    }),
    {
      name: 'finanzas-storage',
      version: 3,
      partialize: (state) => ({
        users: state.users,
      }),
    },
  ),
);
