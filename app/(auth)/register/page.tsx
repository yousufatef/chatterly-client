'use client';

import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-gray-50 dark:bg-black">
            <RegisterForm />
        </div>
    );
}
