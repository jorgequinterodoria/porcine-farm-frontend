import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Package,
  ArrowRightLeft,
  AlertTriangle,
  Filter
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alimentación y Nutrición</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona el inventario de alimentos y monitorea el consumo diario.</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2">
          <Plus className="w-4 h-4" />
          {activeTab === 'inventory' ? 'Agregar Inventario' : 'Registrar Consumo'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-fit">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'inventory'
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-900'
            }`}
        >
          Stock de Inventario
        </button>
        <button
          onClick={() => setActiveTab('consumption')}
          className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'consumption'
              ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-900'
            }`}
        >
          Historial de Consumo
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <div className="lg:col-span-3 space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre de alimento o código..."
                className="input pl-9 h-10"
              />
            </div>
            <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 p-6 animate-pulse h-32 rounded-xl"></div>
              ))
            ) : feedTypes?.map(type => (
              <div
                key={type.id}
                className="bg-white p-5 rounded-xl border border-gray-200 flex items-center justify-between group cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-100 transition-colors">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{type.name}</h3>
                    <p className="text-xs text-gray-500 font-mono uppercase bg-gray-100 inline-block px-1.5 py-0.5 rounded mt-1">{type.code}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900 tabular-nums">{type.currentStockKg} <span className="text-sm text-gray-500 font-normal">kg</span></p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mt-0.5">En Stock</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Widgets (Span 1) */}
        <div className="space-y-6">
          {/* Alerts Widget */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Alertas de Stock Bajo
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm font-bold text-amber-800">Harina de Soja (S-01)</p>
                <p className="text-xs text-amber-700 mt-1 leading-snug">¡Solo quedan 45kg! Reabastecer pronto.</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Widget */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900 text-sm">
              <ArrowRightLeft className="w-4 h-4 text-indigo-600" />
              Acciones Rápidas
            </h3>
            <div className="space-y-2">
              <button className="w-full py-2 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-left">
                Ajuste de Inventario
              </button>
              <button className="w-full py-2 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-left">
                Transferir Stock entre Silos
              </button>
              <button className="w-full py-2 px-3 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-left">
                Generar Orden de Compra
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};