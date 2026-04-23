'use client';

import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 dark:bg-black">
            <LoginForm />
        </div>
    );
}
