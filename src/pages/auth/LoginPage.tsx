import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { LogIn, Loader2, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../api/axiosInstance';

const loginSchema = z.object({
  email: z.email('Ingresa un correo válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
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
      const rawData = response.data.data || response.data;
      const { user, tenant, token } = rawData;
      if (user && user.farmId && !user.tenantId) user.tenantId = user.farmId;
      login(user, tenant || null, token);
      navigate(user.role === 'super_admin' || (!user.tenantId && !tenant) ? '/tenants' : '/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        setError(axiosErr.response?.data?.message || 'Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 p-8 md:p-10 relative z-10">

        {/* Encabezado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4 shadow-lg shadow-indigo-500/30">
            <LogIn className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Bienvenido</h1>
          <p className="text-gray-500 text-sm mt-2">Gestiona tu granja eficientemente</p>
        </div>

        {/* Alerta de Error */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                {...register('email')}
                type="email"
                placeholder="nombre@granja.com"
                className={`
                  block w-full h-11 pl-10 pr-3 
                  bg-white border border-gray-300 rounded-lg 
                  text-gray-900 placeholder:text-gray-400 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                  transition-all shadow-sm
                  ${errors.email ? 'border-red-300 bg-red-50' : ''}
                `}
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 font-medium ml-1">{errors.email.message}</span>}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700">Contraseña</label>
              <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className={`
                  block w-full h-11 pl-10 pr-3 
                  bg-white border border-gray-300 rounded-lg 
                  text-gray-900 placeholder:text-gray-400 text-sm
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500
                  transition-all shadow-sm
                  ${errors.password ? 'border-red-300 bg-red-50' : ''}
                `}
              />
            </div>
            {errors.password && <span className="text-xs text-red-500 font-medium ml-1">{errors.password.message}</span>}
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">© 2026 PorciFarm Technology</p>
        </div>
      </div>
    </div>
  );
};