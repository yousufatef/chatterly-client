'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const loginSchema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/login', data);
            const { user, token } = response.data as { user: unknown; token: string };

            setUser(user as unknown as typeof undefined);
            setToken(token);
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Logged in successfully');
            router.push('/chat');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
            <h1 className="text-2xl font-bold">Login</h1>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Email</label>
                <Input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    aria-invalid={!!errors.email}
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Password</label>
                <Input
                    {...register('password')}
                    type="password"
                    placeholder="••••••"
                    disabled={isLoading}
                    aria-invalid={!!errors.password}
                />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-center text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <a href="/register" className="text-blue-600 hover:underline">
                    Register
                </a>
            </p>
        </form>
    );
}
