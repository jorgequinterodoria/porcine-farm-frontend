import React, { useState } from 'react';
import { withObservables } from '@nozbe/watermelondb/react';
import { 
  Plus, 
  Search, 
  Stethoscope, 
  Activity,
  Calendar,
  History,
  ShieldCheck,
  MoreVertical,
  Filter,
  Syringe,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react';
import database from '../../db';
import HealthRecord from '../../db/models/HealthRecord';
import Medication from '../../db/models/Medication';
import Vaccine from '../../db/models/Vaccine';
import Disease from '../../db/models/Disease';
import { MedicationModal } from '../../components/health/MedicationModal';
import { VaccineModal } from '../../components/health/VaccineModal';
import { DiseaseModal } from '../../components/health/DiseaseModal';
import { HealthRecordModal } from '../../components/health/HealthRecordModal';

interface HealthPageProps {
  healthRecords: HealthRecord[];
  medications: Medication[];
  vaccines: Vaccine[];
  diseases: Disease[];
}

const HealthPage: React.FC<HealthPageProps> = ({ 
  healthRecords, 
  medications, 
  vaccines, 
  diseases 
}) => {
  const [activeTab, setActiveTab] = useState<'records' | 'catalog'>('records');
  const [search, setSearch] = useState('');

  
  const [isHealthRecordModalOpen, setIsHealthRecordModalOpen] = useState(false);
  const [isMedicationModalOpen, setIsMedicationModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  const [isVaccineModalOpen, setIsVaccineModalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);

  const [isDiseaseModalOpen, setIsDiseaseModalOpen] = useState(false);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);

  const handleDelete = async (type: 'medication' | 'vaccine' | 'disease', item: any) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
        try {
          await database.write(async () => {
              await item.markAsDeleted();
          });
        } catch (error) {
          console.error('Error deleting item:', error);
          alert('Error al eliminar el registro.');
        }
    }
  };

  const filteredRecords = healthRecords.filter(record => 
    (record.diagnosis?.toLowerCase().includes(search.toLowerCase()) ||
    record.treatmentPlan?.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredMedications = medications.filter(med => 
    (med.commercialName?.toLowerCase().includes(search.toLowerCase()) ||
    med.genericName?.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredVaccines = vaccines.filter(vac => 
    (vac.name?.toLowerCase().includes(search.toLowerCase()) ||
    vac.disease?.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredDiseases = diseases.filter(dis => 
    (dis.name?.toLowerCase().includes(search.toLowerCase()) ||
    dis.code?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Salud y Sanidad</h1>
          <p className="text-gray-500 text-sm mt-1">Rastrea tratamientos, vacunas e historial clínico del ganado.</p>
        </div>
        <button 
          onClick={() => setIsHealthRecordModalOpen(true)}
          className="btn btn-primary shadow-lg shadow-indigo-500/20 gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar Registro
        </button>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('records')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'records' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Historial Clínico
          </button>
          <button 
            onClick={() => setActiveTab('catalog')}
            className={`flex-1 md:flex-none px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'catalog' 
                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Catálogos
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Buscar registros o medicamentos..."
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

      {activeTab === 'records' ? (
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="bg-white border border-gray-200 border-dashed p-16 text-center rounded-xl">
              <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">Sin historial clínico</h3>
              <p className="text-gray-500 mt-1 text-sm">Registra eventos de salud para comenzar el seguimiento.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div 
                key={record.id} 
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col sm:flex-row sm:items-center gap-5 cursor-pointer"
              >
                <div className="flex items-center gap-5 flex-1">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{record.diagnosis || 'Observación General'}</h3>
                      {/* Status logic needs to be adapted if it's not in the model directly */}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5 capitalize">
                        <Stethoscope className="w-4 h-4 text-gray-400" />
                        {record.recordType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors self-end sm:self-center">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Catalog Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Medications */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Medicamentos</h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {filteredMedications.map(med => (
                <div key={med.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{med.commercialName}</p>
                    <p className="text-xs text-gray-500">{med.presentation || 'N/A'}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedMedication(med); setIsMedicationModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('medication', med)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
                onClick={() => { setSelectedMedication(null); setIsMedicationModalOpen(true); }}
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              + Agregar Medicamento
            </button>
          </div>

          {/* Vaccines */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Syringe className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Vacunas</h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {filteredVaccines.map(vac => (
                <div key={vac.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-teal-200 hover:bg-teal-50/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{vac.name}</p>
                    <p className="text-xs text-gray-500">{vac.disease}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedVaccine(vac); setIsVaccineModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-white rounded-md shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('vaccine', vac)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
                onClick={() => { setSelectedVaccine(null); setIsVaccineModalOpen(true); }}
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            >
              + Agregar Vacuna
            </button>
          </div>

           {/* Diseases */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-gray-900">Enfermedades</h3>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar">
              {filteredDiseases.map(dis => (
                <div key={dis.id} className="p-3 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{dis.name}</p>
                    <p className="text-xs text-gray-500">{dis.code}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setSelectedDisease(dis); setIsDiseaseModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-white rounded-md shadow-sm">
                        <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete('disease', dis)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button 
                onClick={() => { setSelectedDisease(null); setIsDiseaseModalOpen(true); }}
                className="w-full mt-4 py-2 border border-dashed border-gray-300 rounded-lg text-xs font-medium text-gray-500 hover:border-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              + Agregar Patología
            </button>
          </div>

        </div>
      )}

      {/* Modals */}
      <MedicationModal 
        isOpen={isMedicationModalOpen} 
        onClose={() => setIsMedicationModalOpen(false)} 
        medication={selectedMedication} 
      />
      <VaccineModal 
        isOpen={isVaccineModalOpen} 
        onClose={() => setIsVaccineModalOpen(false)} 
        vaccine={selectedVaccine} 
      />
      <DiseaseModal 
        isOpen={isDiseaseModalOpen} 
        onClose={() => setIsDiseaseModalOpen(false)} 
        disease={selectedDisease} 
      />
      <HealthRecordModal
        isOpen={isHealthRecordModalOpen}
        onClose={() => setIsHealthRecordModalOpen(false)}
        medications={medications || []}
        diseases={diseases || []}
      />
    </div>
  );
};

const enhance = withObservables([], () => ({
  healthRecords: database.collections.get<HealthRecord>('health_records').query().observe(),
  medications: database.collections.get<Medication>('medications').query().observe(),
  vaccines: database.collections.get<Vaccine>('vaccines').query().observe(),
  diseases: database.collections.get<Disease>('diseases').query().observe(),
}));

export const HealthPageEnhanced = enhance(HealthPage);
// We need to export it as HealthPage to maintain compatibility with the router if it uses named exports
export { HealthPageEnhanced as HealthPage };