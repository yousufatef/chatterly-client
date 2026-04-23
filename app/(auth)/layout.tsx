'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user, token } = useAuthStore();

    useEffect(() => {
        // Redirect to chat if already authenticated
        if (user && token) {
            router.push('/chat');
        }
    }, [user, token, router]);

    return <>{children}</>;
}
