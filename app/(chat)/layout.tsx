'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ChatLayout } from '@/components/chat/chat-layout';

export default function ChatLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, token } = useAuthStore();

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user || !token) {
            router.push('/login');
        }
    }, [user, token, router]);

    if (!user || !token) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return <ChatLayout>{children}</ChatLayout>;
}
