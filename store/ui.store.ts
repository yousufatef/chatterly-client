import { create } from 'zustand';

/**
 * Zustand store for UI state
 * NOT for server state (use React Query for that)
 * Examples: sidebar open/closed, active modal, theme preferences
 */

interface UIStore {
    sidebarOpen: boolean;
    activeModalType: 'createRoom' | 'settings' | 'profile' | null;
    activeRoomId: string | null;

    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setActiveModal: (modal: UIStore['activeModalType']) => void;
    closeModal: () => void;
    setActiveRoom: (roomId: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
    sidebarOpen: true,
    activeModalType: null,
    activeRoomId: null,

    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setActiveModal: (modal) => set({ activeModalType: modal }),

    closeModal: () => set({ activeModalType: null }),

    setActiveRoom: (roomId) => set({ activeRoomId: roomId }),
}));
