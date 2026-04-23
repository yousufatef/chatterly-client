'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/ui.store';
import { Menu, X } from 'lucide-react';
import { RoomList } from '@/components/rooms/room-list';

export function Sidebar() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { sidebarOpen, toggleSidebar } = useUIStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <>
            {/* Toggle button for mobile */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 dark:bg-gray-900"
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static w-64 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="font-bold text-xl">Chatterly</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <RoomList />
                </div>

                {/* User info & logout */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    {user && (
                        <div className="text-sm">
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                    )}
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full"
                    >
                        Logout
                    </Button>
                </div>
            </aside>
        </>
    );
}
