import React from 'react';
import { 
  X, 
  Tag, 
  Calendar, 
  Scale, 
  Dna, 
  MapPin, 
  Activity, 
  DollarSign, 
  FileText, 
  Info,
  Venus,
  Mars
} from 'lucide-react';
import type { Animal } from '../../types/animal.types';

interface AnimalDetailsModalProps {
  animal: Animal | null;
  onClose: () => void;
  getPenCode: (id?: string | null) => string;
  getStatusInfo: (status: string) => { label: string; className: string };
  getStageInfo: (stage: string) => { label: string; className: string };
}

export const AnimalDetailsModal: React.FC<AnimalDetailsModalProps> = ({ 
  animal, 
  onClose,
  getPenCode,
  getStatusInfo,
  getStageInfo
}) => {
  if (!animal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-scaleIn border border-gray-100 my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2.5 rounded-xl">
              <Tag className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detalles del Animal</h2>
              <p className="text-sm text-gray-500 font-mono">{animal.internalCode}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar flex-1 p-8 space-y-8">
          
          {/* Sección: Identificación */}
          <section className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Identificación</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Código Interno</label>
                <p className="text-lg font-bold text-gray-900 font-mono">{animal.internalCode}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">ID Electrónico</label>
                <p className="text-gray-900">{animal.electronicId || '-'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">ID Visual</label>
                <p className="text-gray-900">{animal.visualId || '-'}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Columna Izquierda */}
            <div className="space-y-8">
              {/* Sección: Características */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <Dna className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Características</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Sexo</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      {animal.sex === 'male' ? <Mars className="w-4 h-4 text-blue-500" /> : <Venus className="w-4 h-4 text-pink-500" />}
                      {animal.sex === 'male' ? 'Macho' : 'Hembra'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Fecha Nacimiento</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(animal.birthDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Peso al Nacer</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-gray-400" />
                      {animal.birthWeight ? `${animal.birthWeight} kg` : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Línea Genética</span>
                    <span className="text-sm font-medium text-gray-900">{animal.geneticLine || '-'}</span>
                  </div>
                   <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Raza</span>
                    <span className="text-sm font-medium text-gray-900">{animal.breed?.name || '-'}</span>
                  </div>
                </div>
              </section>

              {/* Sección: Ubicación y Estado */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Ubicación y Estado</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Estado Operativo</label>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusInfo(animal.currentStatus).className}`}>
                      {getStatusInfo(animal.currentStatus).label}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Etapa Productiva</label>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStageInfo(animal.stage).className}`}>
                      {getStageInfo(animal.stage).label}
                    </span>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Corral Actual</label>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {getPenCode(animal.currentPenId)}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Columna Derecha */}
            <div className="space-y-8">
              {/* Sección: Origen y Costos */}
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <DollarSign className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Origen y Costos</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Origen</span>
                    <span className="text-sm font-medium text-gray-900">{animal.origin || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Propósito</span>
                    <span className="text-sm font-medium text-gray-900">{animal.purpose || '-'}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Costo Adquisición</span>
                    <span className="text-sm font-medium text-gray-900">
                      {animal.acquisitionCost ? `$${animal.acquisitionCost}` : '-'}
                    </span>
                  </div>
                   <div className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-sm text-gray-500">Fecha Ingreso</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(animal.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </section>

              {/* Sección: Notas */}
              <section className="flex-1">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Notas</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 min-h-[100px] text-sm text-gray-600 italic">
                  {animal.notes || "No hay notas registradas para este animal."}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
