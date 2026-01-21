import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Package, 
  ArrowRightLeft,
  AlertTriangle
} from 'lucide-react';
import api from '../../api/axiosInstance';
import type { FeedType } from '../../types/management.types';

export const FeedingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'consumption'>('inventory');
  
  const { data: feedTypes, isLoading } = useQuery({
    queryKey: ['feed-types'],
    queryFn: async () => {
      const response = await api.get('/feeding/types');
      return response.data.data as FeedType[];
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feeding & Nutrition</h1>
          <p className="text-text-dim mt-1">Manage food inventory and daily consumption</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          {activeTab === 'inventory' ? 'Add Inventory' : 'Log Consumption'}
        </button>
      </div>

       <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'inventory' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Inventory Stock
        </button>
        <button 
          onClick={() => setActiveTab('consumption')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'consumption' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Consumption History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-dim" />
                <input 
                    type="text"
                    placeholder="Search by feed name or code..."
                    className="input pl-10 h-11"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                    <div className="glass p-6 animate-pulse h-32 rounded-2xl"></div>
                ) : feedTypes?.map(type => (
                    <div key={type.id} className="glass p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">{type.name}</h3>
                                <p className="text-xs text-text-dim font-mono uppercase">{type.code}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">{type.currentStockKg} kg</p>
                            <p className="text-[10px] text-text-dim uppercase font-bold">In Stock</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div className="space-y-4">
            <div className="glass p-6 rounded-2xl">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    Low Stock Alerts
                </h3>
                <div className="space-y-3">
                    <div className="p-3 bg-warning/10 rounded-xl border border-warning/20">
                        <p className="text-sm font-bold text-warning">Soy Meal (S-01)</p>
                        <p className="text-xs">Only 45kg left! Restock soon.</p>
                    </div>
                </div>
            </div>

             <div className="glass p-6 rounded-2xl">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <ArrowRightLeft className="w-5 h-5 text-primary" />
                    Quick Actions
                </h3>
                <div className="space-y-2">
                    <button className="btn btn-outline w-full text-xs py-2">Inventory Adj.</button>
                    <button className="btn btn-outline w-full text-xs py-2">Transfer Stock</button>
                    <button className="btn btn-outline w-full text-xs py-2">Purchase Order</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
