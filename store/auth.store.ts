import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types/user.types';

/**
 * Zustand store for authentication UI state
 * NOT for server state (messages, rooms, users)
 */

interface AuthStore {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    setUser: (user: AuthUser | null) => void;
    setToken: (token: string | null) => void;
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isLoading: false,
            error: null,

            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            setIsLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            logout: () => {
                set({ user: null, token: null, error: null });
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
            },
        }),
        {
            name: 'auth_store',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
            }),
        }
    )
);
