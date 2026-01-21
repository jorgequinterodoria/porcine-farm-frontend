import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  MoreVertical,
  Filter,
  PieChart
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { FinancialTransaction } from '../../types/management.types';

export const FinancialPage: React.FC = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['financial-transactions'],
    queryFn: async () => {
      const response = await api.get('/financial/transactions');
      return response.data.data as FinancialTransaction[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Finanzas y Ventas</h1>
          <p className="text-slate-400 mt-1">Monitorea ingresos, gastos y ventas de animales</p>
        </div>
        <div className="flex gap-2">
            <button className="btn bg-white/5 border-white/10 hover:bg-white/10 text-slate-400 gap-2">
                <PieChart className="w-4 h-4" />
                Reportes
            </button>
            <button className="btn btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Agregar Transacción
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-24 h-24" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Ingresos Totales (Mensual)</p>
            <h2 className="text-3xl font-bold text-green-400">$12,450.00</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-400">
                <ArrowUpRight className="w-3 h-3" />
                <span>+15.2% vs mes anterior</span>
            </div>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingDown className="w-24 h-24" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1">Gastos Totales (Mensual)</p>
            <h2 className="text-3xl font-bold text-red-400">$8,120.00</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-red-400">
                <TrendingDown className="w-3 h-3" />
                <span>+5.4% vs mes anterior</span>
            </div>
        </div>

        <div className="glass p-6 rounded-2xl bg-blue-500/10 border-blue-500/20">
            <p className="text-slate-400 text-sm font-medium mb-1">Balance Neto</p>
            <h2 className="text-3xl font-bold text-blue-400">$4,330.00</h2>
            <p className="mt-4 text-xs text-slate-400">¡Sigue así! Tu granja es rentable.</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2 text-white">
                <DollarSign className="w-5 h-5 text-blue-400" />
                Transacciones Recientes
            </h3>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Buscar..." className="input pl-9 h-9 text-xs w-48" />
                </div>
                <button className="btn bg-white/5 border-white/10 p-2 min-h-0 h-9 text-slate-400">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    <th className="px-6 py-3">Fecha</th>
                    <th className="px-6 py-3">Descripción</th>
                    <th className="px-6 py-3">Categoría</th>
                    <th className="px-6 py-3 text-right">Monto</th>
                    <th className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {isLoading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center animate-pulse text-slate-400">Cargando transacciones...</td></tr>
                ) : transactions?.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No se encontraron transacciones</td></tr>
                ) : transactions?.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-sm font-mono text-slate-300">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-medium text-white">{tx.description}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] uppercase font-bold text-slate-400">Gasto de Alimento</span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold text-right ${tx.transactionType === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                            {tx.transactionType === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-slate-400 hover:text-white"><MoreVertical className="w-4 h-4" /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
