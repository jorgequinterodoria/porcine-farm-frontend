import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  UserPlus, 
  Search, 
  Trash2, 
  Mail,
  X,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { getUsers, updateUser, deleteUser, inviteUser } from '../../api/users';
import { useAuthStore } from '../../store/useAuthStore';


const createUserSchema = z.object({
    firstName: z.string().min(1, 'El nombre es requerido'),
    lastName: z.string().min(1, 'El apellido es requerido'),
    email: z.email('Email inválido'),
    role: z.enum(['admin', 'veterinarian', 'operator']),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'La confirmación debe tener al menos 6 caracteres')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export const EmployeeListPage: React.FC = () => {
    const { user: currentUser } = useAuthStore();
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers
    });

    const createMutation = useMutation({
        mutationFn: inviteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setIsModalOpen(false);
            reset();
        }
    });

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; role: string; isActive: boolean }) => 
            updateUser(data.id, { role: data.role, isActive: data.isActive }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            role: 'operator',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const handleCreateUser = (data: CreateUserFormData) => {
        createMutation.mutate(data);
    };

    const handleUpdateRole = (userId: string, newRole: string) => {
        const user = users?.find(u => u.id === userId);
        if (user) {
            updateMutation.mutate({ id: userId, role: newRole, isActive: user.isActive });
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario? Perderá el acceso inmediatamente.')) {
            deleteMutation.mutate(id);
        }
    };

    const filteredUsers = users?.filter(u => 
        u.firstName.toLowerCase().includes(search.toLowerCase()) || 
        u.lastName.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        const styles: Record<string, string> = {
            super_admin: 'bg-purple-100 text-purple-700 border-purple-200',
            admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            farm_admin: 'bg-indigo-100 text-indigo-700 border-indigo-200',
            veterinarian: 'bg-teal-100 text-teal-700 border-teal-200',
            operator: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        const labels: Record<string, string> = {
            super_admin: 'Super Admin',
            admin: 'Administrador',
            farm_admin: 'Administrador',
            veterinarian: 'Veterinario',
            operator: 'Operario'
        };
        
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[role] || 'bg-gray-100 text-gray-700'}`}>
                {labels[role] || role}
            </span>
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Equipo de Trabajo</h1>
                    <p className="text-gray-500 text-sm mt-1">Gestiona los empleados y sus permisos de acceso.</p>
                </div>
                <button 
                    onClick={() => {
                        reset();
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Nuevo Empleado
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o email..." 
                            className="input pl-10 h-10 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Empleado</th>
                                <th className="px-6 py-3">Rol</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3">Fecha Ingreso</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                [...Array(3)].map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-6 py-4"><div className="h-10 w-32 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                                        <td className="px-6 py-4" />
                                    </tr>
                                ))
                            ) : filteredUsers?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getRoleBadge(user.role)}
                                            {}
                                            {user.id !== currentUser?.id && (
                                                <select 
                                                    className="text-xs border-none bg-transparent text-gray-400 hover:text-gray-600 cursor-pointer focus:ring-0"
                                                    value={user.role}
                                                    onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="veterinarian">Vet</option>
                                                    <option value="operator">Op</option>
                                                </select>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isActive ? (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                <CheckCircle2 className="w-3 h-3" /> Activo
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                                                Inactivo
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {user.id !== currentUser?.id && (
                                            <button 
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!isLoading && filteredUsers?.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            No se encontraron empleados.
                        </div>
                    )}
                </div>
            </div>

            {}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-scaleIn my-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Registrar Empleado</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>
                        
                        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                                    <input {...register('firstName')} className="input" placeholder="Juan" />
                                    {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Apellido</label>
                                    <input {...register('lastName')} className="input" placeholder="Pérez" />
                                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Email Corporativo</label>
                                <input {...register('email')} className="input" placeholder="juan@granja.com" type="email" />
                                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Contraseña</label>
                                <input {...register('password')} className="input" type="password" placeholder="••••••" />
                                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                                <input {...register('confirmPassword')} className="input" type="password" placeholder="••••••" />
                                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-700">Rol Asignado</label>
                                <div className="grid grid-cols-1 gap-3">
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" value="operator" {...register('role')} />
                                        <div>
                                            <div className="font-medium text-sm text-gray-900">Operario</div>
                                            <div className="text-xs text-gray-500">Acceso a tareas diarias y registros básicos</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" value="veterinarian" {...register('role')} />
                                        <div>
                                            <div className="font-medium text-sm text-gray-900">Veterinario</div>
                                            <div className="text-xs text-gray-500">Gestión de sanidad, tratamientos y reportes</div>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input type="radio" value="admin" {...register('role')} />
                                        <div>
                                            <div className="font-medium text-sm text-gray-900">Administrador</div>
                                            <div className="text-xs text-gray-500">Control total de la granja y finanzas</div>
                                        </div>
                                    </label>
                                </div>
                                {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 flex-1">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={createMutation.isPending} className="btn btn-primary flex-1">
                                    {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Usuario'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
