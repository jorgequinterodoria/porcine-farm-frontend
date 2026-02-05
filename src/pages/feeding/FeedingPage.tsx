import React, { useState, useMemo } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  Package,
  ArrowRightLeft,
  History,
  Edit,
  Trash2,
  Utensils
} from 'lucide-react';


import { database } from '../../db';
import { FeedType, FeedConsumption, Pen, Batch, FeedInventory } from '../../db/models';
import type { FeedTypeFormData, FeedConsumptionFormData } from '../../types/feeding.types';


import { FeedTypeModal } from '../../components/feeding/FeedTypeModal';
import { FeedMovementModal } from '../../components/feeding/FeedMovementModal';
import { FeedConsumptionModal } from '../../components/feeding/FeedConsumptionModal';

interface FeedingPageProps {
  feedTypes: FeedType[];
  feedInventory: FeedInventory[];
  consumptionHistory: FeedConsumption[];
  pens: Pen[];
  batches: Batch[];
}

const FeedingPageComponent: React.FC<FeedingPageProps> = ({ feedTypes, feedInventory, consumptionHistory, pens, batches }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'consumption'>('inventory');
  const [search, setSearch] = useState('');

  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedType | null>(null);
  
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [isConsumptionModalOpen, setIsConsumptionModalOpen] = useState(false);

  
  const enrichedFeedTypes = useMemo(() => {
    return feedTypes.map(type => {
      const inventory = feedInventory.find(inv => inv.feedTypeId === type.id);
      return {
        type,
        currentStockKg: inventory?.currentStockKg || 0,
        minimumStockKg: inventory?.minimumStockKg || 0,
        maximumStockKg: inventory?.maximumStockKg || 0,
        inventoryId: inventory?.id
      };
    });
  }, [feedTypes, feedInventory]);

  const filteredTypes = useMemo(() => 
    enrichedFeedTypes.filter(t => 
      t.type.name.toLowerCase().includes(search.toLowerCase()) || 
      t.type.code.toLowerCase().includes(search.toLowerCase())
    ), [enrichedFeedTypes, search]);

  
  const alerts = useMemo(() => {
    return enrichedFeedTypes.filter(t => (t.currentStockKg || 0) <= (t.minimumStockKg || 0)).map(t => ({
      feedName: t.type.name,
      code: t.type.code,
      currentStock: t.currentStockKg
    }));
  }, [enrichedFeedTypes]);

  
  const handleSaveType = async (data: FeedTypeFormData) => {
    try {
      await database.write(async () => {
        const typeCollection = database.collections.get<FeedType>('feed_types');
        const invCollection = database.collections.get<FeedInventory>('feed_inventory');
        
        let typeRecord: FeedType;

        if (selectedType) {
          
          typeRecord = await selectedType.update(type => {
            type.code = data.code;
            type.name = data.name;
            type.category = data.category;
            type.proteinPercentage = data.proteinPercentage;
            type.energyMcalKg = data.energyMcalKg;
            type.crudeFiberPercentage = data.crudeFiberPercentage;
            type.formula = data.formula;
            type.manufacturer = data.manufacturer;
            type.costPerKg = data.costPerKg;
          });
          
          
          const existingInv = feedInventory.find(inv => inv.feedTypeId === selectedType.id);
          if (existingInv) {
            await existingInv.update(inv => {
               inv.minimumStockKg = data.minimumStockKg;
               inv.maximumStockKg = data.maximumStockKg;
            });
          } else {
             
             await invCollection.create(inv => {
                inv.feedTypeId = selectedType.id;
                inv.currentStockKg = 0;
                inv.minimumStockKg = data.minimumStockKg;
                inv.maximumStockKg = data.maximumStockKg;
             });
          }

        } else {
          
          typeRecord = await typeCollection.create(type => {
            type.code = data.code;
            type.name = data.name;
            type.category = data.category;
            type.proteinPercentage = data.proteinPercentage;
            type.energyMcalKg = data.energyMcalKg;
            type.crudeFiberPercentage = data.crudeFiberPercentage;
            type.formula = data.formula;
            type.manufacturer = data.manufacturer;
            type.costPerKg = data.costPerKg;
          });

          
          await invCollection.create(inv => {
            inv.feedTypeId = typeRecord.id;
            inv.currentStockKg = data.initialStockKg || 0;
            inv.minimumStockKg = data.minimumStockKg;
            inv.maximumStockKg = data.maximumStockKg;
          });
        }
      });
      setIsTypeModalOpen(false);
      setSelectedType(null);
    } catch (error) {
      console.error('Error saving feed type:', error);
      alert('Error al guardar tipo de alimento');
    }
  };

  
  const handleDeleteType = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este tipo de alimento? Se desactivará del inventario.')) return;
    
    try {
        await database.write(async () => {
            const type = await database.collections.get<FeedType>('feed_types').find(id);
            await type.markAsDeleted();
            
            const invs = await database.collections.get<FeedInventory>('feed_inventory').query(Q.where('feed_type_id', id)).fetch();
            for (const inv of invs) {
              await inv.markAsDeleted();
            }
        });
    } catch (error) {
        console.error('Error deleting feed type:', error);
    }
  };

  
  const handleRegisterConsumption = async (data: FeedConsumptionFormData) => {
    try {
        await database.write(async () => {
            
            await database.collections.get<FeedConsumption>('feed_consumption').create(record => {
                record.consumptionDate = new Date(data.consumptionDate).getTime();
                record.feedTypeId = data.feedTypeId;
                record.quantityKg = data.quantityKg;
                record.penId = data.targetType === 'pen' ? data.targetId : undefined;
                record.batchId = data.targetType === 'batch' ? data.targetId : undefined;
                record.notes = data.notes;
                
            });

            
            const inventory = (await database.collections.get<FeedInventory>('feed_inventory').query(Q.where('feed_type_id', data.feedTypeId)).fetch())[0];
            
            if (inventory) {
                await inventory.update(inv => {
                    inv.currentStockKg = (inv.currentStockKg || 0) - data.quantityKg;
                });
            } else {
                console.warn('No inventory record found for feed type:', data.feedTypeId);
            }
        });
        setIsConsumptionModalOpen(false);
    } catch (error) {
        console.error('Error registering consumption:', error);
        alert('Error al registrar consumo');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Alimentación y Nutrición</h1>
          <p className="text-gray-500 text-sm mt-1">Gestiona el inventario de alimentos y monitorea el consumo diario.</p>
        </div>
        <button 
            onClick={() => setIsConsumptionModalOpen(true)}
            className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Utensils className="w-4 h-4" />
          Registrar Consumo
        </button>
      </div>

      {}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'inventory' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Stock de Inventario
          </button>
          <button 
            onClick={() => setActiveTab('consumption')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'consumption' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Historial de Consumo
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar por nombre de alimento o código..."
              className="input pl-9 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="h-10 w-10 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {}
        <div className="lg:col-span-2 space-y-6">
            {activeTab === 'inventory' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {}
                    <button 
                        onClick={() => { setSelectedType(null); setIsTypeModalOpen(true); }}
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group min-h-[200px]"
                    >
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-indigo-600 mb-3 group-hover:scale-110 transition-transform">
                            <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-gray-900">Nuevo Tipo de Alimento</span>
                        <span className="text-xs text-gray-500 mt-1">Configurar stock y alertas</span>
                    </button>

                    {filteredTypes.map((item) => (
                        <div key={item.type.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => { setSelectedType(item.type); setIsTypeModalOpen(true); }}
                                    className="p-1.5 text-gray-400 hover:text-indigo-600 bg-white rounded-md shadow-sm border border-gray-100"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => handleDeleteType(item.type.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded-md shadow-sm border border-gray-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-100 text-gray-600 mb-2">
                                        {item.type.code}
                                    </span>
                                    <h3 className="font-bold text-gray-900">{item.type.name}</h3>
                                    <p className="text-sm text-gray-500">{item.type.category || 'Sin categoría'}</p>
                                </div>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    (item.currentStockKg || 0) <= (item.minimumStockKg || 0) 
                                        ? 'bg-red-50 text-red-600 animate-pulse' 
                                        : 'bg-green-50 text-green-600'
                                }`}>
                                    <Package className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Stock Actual</span>
                                        <span className="font-bold text-gray-900">{item.currentStockKg?.toLocaleString()} kg</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${
                                                (item.currentStockKg || 0) <= (item.minimumStockKg || 0) ? 'bg-red-500' : 'bg-indigo-500'
                                            }`} 
                                            style={{ width: `${Math.min(((item.currentStockKg || 0) / (item.maximumStockKg || 1000)) * 100, 100)}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                        <span>Min: {item.minimumStockKg}kg</span>
                                        <span>Max: {item.maximumStockKg}kg</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3">Fecha</th>
                                    <th className="px-6 py-3">Alimento</th>
                                    <th className="px-6 py-3">Destino</th>
                                    <th className="px-6 py-3 text-right">Cantidad</th>
                                    <th className="px-6 py-3">Registrado Por</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {consumptionHistory.map((record) => {
                                    
                                    const feedType = feedTypes.find(f => f.id === record.feedTypeId);
                                    
                                    
                                    return (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-500">
                                                {new Date(record.consumptionDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {feedType?.name || 'Desconocido'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {}
                                                {record.penId ? `Corral ID: ${record.penId.slice(0,8)}...` : record.batchId ? `Lote ID: ${record.batchId.slice(0,8)}...` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-medium text-gray-900">
                                                <div>
                                                    {record.quantityKg} kg
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-gray-500">
                                                Admin
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {consumptionHistory.length === 0 && (
                             <div className="p-12 text-center text-gray-500">
                                <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No hay registros de consumo.</p>
                             </div>
                        )}
                    </div>
                </div>
            )}
        </div>

        {}
        <div className="space-y-6">
            {}
            {alerts.length > 0 && (
                <div className="bg-white p-5 rounded-xl border border-red-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-red-700 font-bold">
                        <AlertTriangle className="w-5 h-5" />
                        <h3>Alertas de Stock Bajo</h3>
                    </div>
                    <div className="space-y-3">
                        {alerts.map((alert, idx) => (
                            <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-red-900 text-sm">{alert.feedName} ({alert.code})</span>
                                </div>
                                <p className="text-xs text-red-700">
                                    ¡Solo quedan <strong>{alert.currentStock}kg</strong>! 
                                    Reabastecer pronto.
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
                    <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                    <h3>Acciones Rápidas</h3>
                </div>
                <div className="space-y-2">
                    <button 
                        onClick={() => setIsMovementModalOpen(true)}
                        className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-sm font-medium text-gray-700 flex items-center justify-between group"
                    >
                        Ajuste de Inventario / Compra
                        <Plus className="w-4 h-4 text-gray-400 group-hover:text-indigo-600" />
                    </button>
                    {}
                </div>
            </div>
        </div>
      </div>

      <FeedTypeModal 
        isOpen={isTypeModalOpen} 
        onClose={() => setIsTypeModalOpen(false)} 
        feedType={selectedType}
        onSubmit={handleSaveType}
      />
      
      {}
      <FeedMovementModal 
        isOpen={isMovementModalOpen} 
        onClose={() => setIsMovementModalOpen(false)}
        feedTypes={feedTypes} 
      />

      <FeedConsumptionModal
        isOpen={isConsumptionModalOpen}
        onClose={() => setIsConsumptionModalOpen(false)}
        feedTypes={feedTypes}
        pens={pens}
        batches={batches}
        onSubmit={handleRegisterConsumption}
      />
    </div>
  );
};

const enhance = withObservables([], () => ({
  feedTypes: database.collections.get<FeedType>('feed_types').query(),
  feedInventory: database.collections.get<FeedInventory>('feed_inventory').query(),
  consumptionHistory: database.collections.get<FeedConsumption>('feed_consumption').query(
      Q.sortBy('consumption_date', Q.desc)
  ),
  pens: database.collections.get<Pen>('pens').query(),
  batches: database.collections.get<Batch>('batches').query(),
}));

export const FeedingPage = enhance(FeedingPageComponent);
