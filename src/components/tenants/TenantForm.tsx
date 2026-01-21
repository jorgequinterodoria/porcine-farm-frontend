import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2, Landmark, User, ShieldCheck } from 'lucide-react';
import type { TenantFormData } from '../../types/tenant.types';
import { tenantSchema } from '../../types/tenant.types';

interface TenantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TenantFormData) => void;
  isLoading?: boolean;
}

export const TenantForm: React.FC<TenantFormProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      subscriptionPlan: 'free',
      maxAnimals: 100,
      maxUsers: 5,
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass w-full max-w-3xl rounded-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Landmark className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Register New Farm</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8 overflow-y-auto">
          {/* Farm Information */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-primary">
              <ShieldCheck className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Farm Information</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Farm Name</label>
                <input {...register('name')} className="input" placeholder="e.g. Granja El Porvenir" />
                {errors.name && <p className="text-error text-xs ml-1">{errors.name.message?.toString()}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Subdomain</label>
                <div className="relative">
                  <input {...register('subdomain')} className="input transition-all" placeholder="elporvenir" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-dim">.porcifarm.com</span>
                </div>
                {errors.subdomain && <p className="text-error text-xs ml-1">{errors.subdomain.message?.toString()}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">General Contact Email</label>
                <input {...register('email')} className="input" placeholder="contact@farm.com" />
                {errors.email && <p className="text-error text-xs ml-1">{errors.email.message?.toString()}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Subscription Plan</label>
                <select {...register('subscriptionPlan')} className="input h-[42px] py-0">
                  <option value="free">Free Plan</option>
                  <option value="premium">Premium Plan</option>
                  <option value="enterprise">Enterprise Plan</option>
                </select>
              </div>
            </div>
          </section>

          {/* Admin User Information */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-accent">
              <User className="w-4 h-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Initial Administrator</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">First Name</label>
                <input {...register('adminFirstName')} className="input" placeholder="John" />
                {errors.adminFirstName && <p className="text-error text-xs ml-1">{errors.adminFirstName.message?.toString()}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Last Name</label>
                <input {...register('adminLastName')} className="input" placeholder="Doe" />
                {errors.adminLastName && <p className="text-error text-xs ml-1">{errors.adminLastName.message?.toString()}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium ml-1">Admin Email</label>
                <input {...register('adminEmail')} className="input" placeholder="admin@farm.com" />
                {errors.adminEmail && <p className="text-error text-xs ml-1">{errors.adminEmail.message?.toString()}</p>}
              </div>
            </div>
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-border">
              <p className="text-xs text-text-dim leading-relaxed">
                By default, a temporary security password will be generated for the administrator. They will be prompted to change it upon their first login.
              </p>
            </div>
          </section>

          {/* Limits */}
          <section>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Max Animals</label>
                  <input {...register('maxAnimals', { valueAsNumber: true })} type="number" className="input" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1">Max Users</label>
                  <input {...register('maxUsers', { valueAsNumber: true })} type="number" className="input" />
                </div>
             </div>
          </section>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <button type="button" onClick={onClose} className="btn btn-ghost" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn btn-primary min-w-[160px]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create and Activate Farm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
