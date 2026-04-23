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

const registerSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
    const router = useRouter();
    const { setUser, setToken } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormData) => {
        setIsLoading(true);
        try {
            const response = await apiClient.post('/auth/register', {
                username: data.username,
                email: data.email,
                password: data.password,
            });
            const { user, token } = response.data as { user: unknown; token: string };

            setUser(user as unknown as typeof undefined);
            setToken(token);
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Account created successfully');
            router.push('/chat');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
            <h1 className="text-2xl font-bold">Create Account</h1>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Username</label>
                <Input
                    {...register('username')}
                    type="text"
                    placeholder="john_doe"
                    disabled={isLoading}
                    aria-invalid={!!errors.username}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

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

            <div className="space-y-2">
                <label className="block text-sm font-medium">Confirm Password</label>
                <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="••••••"
                    disabled={isLoading}
                    aria-invalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Register'}
            </Button>

            <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                    Login
                </a>
            </p>
        </form>
    );
}
