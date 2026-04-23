'use client';

import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, token } = useAuthStore();

    useEffect(() => {
        if (!user || !token) {
            router.push('/login');
        }
    }, [user, token, router]);

    if (!user || !token) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
