import React, { useState } from 'react';
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
          <h1 className="text-3xl font-bold">Financials & Sales</h1>
          <p className="text-text-dim mt-1">Monitor revenue, expenses and animal sales</p>
        </div>
        <div className="flex gap-2">
            <button className="btn bg-white/5 border-border hover:bg-white/10 text-text-dim gap-2">
                <PieChart className="w-4 h-4" />
                Reports
            </button>
            <button className="btn btn-primary gap-2">
                <Plus className="w-4 h-4" />
                Add Transaction
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-24 h-24" />
            </div>
            <p className="text-text-dim text-sm font-medium mb-1">Total Revenue (Monthly)</p>
            <h2 className="text-3xl font-bold text-success">$12,450.00</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-success">
                <ArrowUpRight className="w-3 h-3" />
                <span>+15.2% from last month</span>
            </div>
        </div>

        <div className="glass p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingDown className="w-24 h-24" />
            </div>
            <p className="text-text-dim text-sm font-medium mb-1">Total Expenses (Monthly)</p>
            <h2 className="text-3xl font-bold text-error">$8,120.00</h2>
            <div className="mt-4 flex items-center gap-2 text-xs text-error">
                <TrendingDown className="w-3 h-3" />
                <span>+5.4% from last month</span>
            </div>
        </div>

        <div className="glass p-6 rounded-2xl bg-primary/10 border-primary/20">
            <p className="text-text-dim text-sm font-medium mb-1">Net Balance</p>
            <h2 className="text-3xl font-bold text-primary">$4,330.00</h2>
            <p className="mt-4 text-xs text-text-dim">Keep it up! Your farm is profitable.</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Recent Transactions
            </h3>
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim" />
                    <input type="text" placeholder="Search..." className="input pl-9 h-9 text-xs w-48" />
                </div>
                <button className="btn bg-white/5 border-border p-2 min-h-0 h-9">
                    <Filter className="w-4 h-4" />
                </button>
            </div>
        </div>
        <table className="w-full text-left">
            <thead>
                <tr className="bg-white/5 text-[10px] uppercase tracking-wider text-text-dim font-bold">
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                    <th className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {isLoading ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center animate-pulse">Loading transactions...</td></tr>
                ) : transactions?.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-12 text-center text-text-dim">No transactions found</td></tr>
                ) : transactions?.map(tx => (
                    <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-sm font-mono">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-medium">{tx.description}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-white/5 rounded-md text-[10px] uppercase font-bold text-text-dim">Feed Expense</span>
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold text-right ${tx.transactionType === 'income' ? 'text-success' : 'text-error'}`}>
                            {tx.transactionType === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                            <button className="text-text-dim hover:text-text-main"><MoreVertical className="w-4 h-4" /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
