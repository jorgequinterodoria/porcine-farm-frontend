import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axiosInstance';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginInputs = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', data);
      
      // Handle both { data: { ... } } and direct { ... } response formats
      const rawData = response.data.data || response.data;
      const { user, tenant, token } = rawData;
      
      // Map farmId to tenantId if farmId exists (compatibility)
      if (user && user.farmId && !user.tenantId) {
        user.tenantId = user.farmId;
      }

      login(user, tenant || null, token);
      
      if (user.role === 'super_admin' || (!user.tenantId && !tenant)) {
        navigate('/tenants');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg p-4">
      <div className="glass w-full max-w-md p-8 rounded-2xl page-transition">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-text-dim mt-2">Sign in to manage your farm</p>
        </div>

        {error && (
          <div className="bg-error/10 border border-error/20 text-error p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
              <input
                {...register('email')}
                className="input pl-10"
                placeholder="name@company.com"
                type="email"
              />
            </div>
            {errors.email && <p className="text-error text-xs ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
              <input
                {...register('password')}
                className="input pl-10"
                placeholder="••••••••"
                type="password"
              />
            </div>
            {errors.password && <p className="text-error text-xs ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 h-12"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-text-dim text-sm mt-8">
          Don't have an account?{' '}
          <button className="text-primary font-medium hover:underline">
            Register your farm
          </button>
        </p>
      </div>
    </div>
  );
};
