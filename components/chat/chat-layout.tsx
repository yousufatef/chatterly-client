'use client';

import { ReactNode } from 'react';
import { Sidebar } from '@/components/chat/sidebar';

export function ChatLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen bg-white dark:bg-black">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
}
