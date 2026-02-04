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
  PieChart,
  Wallet
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
    <div className="space-y-8">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Finanzas y Ventas</h1>
          <p className="text-gray-500 text-sm mt-1">Monitorea ingresos, gastos y rentabilidad de la granja.</p>
        </div>
        <div className="flex gap-3">
            <button className="btn bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 shadow-sm gap-2">
                <PieChart className="w-4 h-4" />
                Reportes
            </button>
            <button className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2">
                <Plus className="w-4 h-4" />
                Nueva Transacción
            </button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 border border-emerald-100">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                    <ArrowUpRight className="w-3 h-3" />
                    <span>+15.2%</span>
                </div>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Ingresos Totales (Mes)</p>
                <h2 className="text-3xl font-bold text-gray-900">$12,450.00</h2>
            </div>
        </div>

        {}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600 border border-rose-100">
                    <TrendingDown className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-100">
                    <TrendingUp className="w-3 h-3" />
                    <span>+5.4%</span>
                </div>
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium mb-1">Gastos Totales (Mes)</p>
                <h2 className="text-3xl font-bold text-gray-900">$8,120.00</h2>
            </div>
        </div>

        {}
        <div className="bg-indigo-600 p-6 rounded-xl border border-indigo-500 shadow-lg shadow-indigo-500/20 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Wallet className="w-32 h-32 transform -rotate-12 translate-x-8 -translate-y-8" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <DollarSign className="w-6 h-6 text-white" />
                    </div>
                </div>
                <p className="text-indigo-100 text-sm font-medium mb-1">Balance Neto</p>
                <h2 className="text-3xl font-bold text-white">$4,330.00</h2>
                <p className="mt-4 text-xs text-indigo-100 bg-indigo-500/50 inline-block px-2 py-1 rounded border border-indigo-400/30">
                    ¡Excelente! Tu margen es saludable.
                </p>
            </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {}
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                Transacciones Recientes
            </h3>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar movimiento..." 
                        className="pl-9 h-9 w-64 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none" 
                    />
                </div>
                <button className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors bg-white">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>

        {}
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                        <th className="px-6 py-4">Fecha</th>
                        <th className="px-6 py-4">Descripción</th>
                        <th className="px-6 py-4">Categoría</th>
                        <th className="px-6 py-4 text-right">Monto</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 animate-pulse">Cargando información financiera...</td></tr>
                    ) : transactions?.length === 0 ? (
                        <tr><td colSpan={5} className="px-6 py-16 text-center text-gray-500">No se encontraron transacciones registradas</td></tr>
                    ) : transactions?.map(tx => (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 tabular-nums">
                                {new Date(tx.transactionDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                {tx.description}
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    Gasto de Alimento
                                </span>
                            </td>
                            <td className={`px-6 py-4 text-sm font-bold text-right tabular-nums ${
                                tx.transactionType === 'income' ? 'text-emerald-600' : 'text-rose-600'
                            }`}>
                                {tx.transactionType === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};