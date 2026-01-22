import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { changePassword, updateProfile } from '../../api/auth';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmNewPassword: z.string().min(6, 'Confirma tu nueva contraseña')
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

const profileSchema = z.object({
  firstName: z.string().min(1, 'El nombre es requerido'),
  lastName: z.string().min(1, 'El apellido es requerido'),
  email: z.email('Email inválido')
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const { user, login, token, tenant } = useAuthStore();
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors } 
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    }
  });

  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema)
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      if (token) {
        const updatedUser = { ...user!, ...data };
        login(updatedUser, tenant, token);
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  });

  const changePasswordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setPasswordSuccess(true);
      setPasswordError(null);
      resetPassword();
      setTimeout(() => setPasswordSuccess(false), 3000);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string; errors?: { message: string }[] } } };
      const validationError = err.response?.data?.errors?.[0]?.message;
      setPasswordError(validationError || err.response?.data?.message || 'Error al cambiar la contraseña');
    }
  });

  const onUpdateProfile = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const onChangePassword = (data: PasswordFormData) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Mi Perfil</h1>
        <p className="text-gray-500 text-sm mt-1">Gestiona tu información personal y seguridad de acceso.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: User Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4 border-4 border-white shadow-lg">
              {user?.firstName?.charAt(0) || 'U'}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-gray-500 mb-4">{user?.email}</p>
            
            <div className="w-full pt-4 border-t border-gray-100 flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Rol
                </span>
                <span className="font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md capitalize">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-2">
                  <User className="w-4 h-4" /> Estado
                </span>
                <span className="font-medium text-green-600">Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Personal Info Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-400" />
                Información Personal
              </h3>
            </div>
            <form onSubmit={handleSubmitProfile(onUpdateProfile)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  <input {...registerProfile('firstName')} className="input" />
                  {profileErrors.firstName && <p className="text-red-500 text-xs">{profileErrors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Apellido</label>
                  <input {...registerProfile('lastName')} className="input" />
                  {profileErrors.lastName && <p className="text-red-500 text-xs">{profileErrors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input {...registerProfile('email')} className="input pl-10" />
                </div>
                {profileErrors.email && <p className="text-red-500 text-xs">{profileErrors.email.message}</p>}
              </div>

              <div className="pt-2 flex items-center justify-between">
                {profileSuccess ? (
                  <span className="text-green-600 text-sm flex items-center gap-1 font-medium animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" /> Guardado correctamente
                  </span>
                ) : <span />}
                
                <button 
                  type="submit" 
                  disabled={updateProfileMutation.isPending}
                  className="btn btn-primary"
                >
                  {updateProfileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-5 h-5 text-gray-400" />
                Seguridad
              </h3>
            </div>
            <form onSubmit={handleSubmitPassword(onChangePassword)} className="p-6 space-y-4">
              
              {passwordError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {passwordError}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Contraseña Actual</label>
                <input 
                  type="password" 
                  {...registerPassword('currentPassword')} 
                  className="input" 
                  placeholder="••••••"
                />
                {passwordErrors.currentPassword && <p className="text-red-500 text-xs">{passwordErrors.currentPassword.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                  <input 
                    type="password" 
                    {...registerPassword('newPassword')} 
                    className="input" 
                    placeholder="••••••"
                  />
                  {passwordErrors.newPassword && <p className="text-red-500 text-xs">{passwordErrors.newPassword.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                  <input 
                    type="password" 
                    {...registerPassword('confirmNewPassword')} 
                    className="input" 
                    placeholder="••••••"
                  />
                  {passwordErrors.confirmNewPassword && <p className="text-red-500 text-xs">{passwordErrors.confirmNewPassword.message}</p>}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                {passwordSuccess ? (
                  <span className="text-green-600 text-sm flex items-center gap-1 font-medium animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" /> Contraseña actualizada
                  </span>
                ) : <span />}

                <button 
                  type="submit" 
                  disabled={changePasswordMutation.isPending}
                  className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                >
                  {changePasswordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cambiar Contraseña'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
