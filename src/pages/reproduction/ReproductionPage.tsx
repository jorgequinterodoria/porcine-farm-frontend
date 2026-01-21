import React, { useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
import { 
  Plus, 
  Heart,
  Baby,
  CalendarDays,
  ClipboardCheck,
  MoreVertical
} from 'lucide-react';
// import api from '../../api/axiosInstance';
// import type { BreedingService } from '../../types/farm.types';

export const ReproductionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breeding' | 'pregnancy' | 'farrowing'>('breeding');

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reproduction Cycle</h1>
          <p className="text-text-dim mt-1">Manage breeding, pregnancy and farrowing events</p>
        </div>
        <button className="btn btn-primary gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('breeding')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'breeding' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Breeding (Celos)
        </button>
        <button 
          onClick={() => setActiveTab('pregnancy')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'pregnancy' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Pregnancies
        </button>
        <button 
          onClick={() => setActiveTab('farrowing')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'farrowing' ? 'bg-primary text-white shadow-lg' : 'text-text-dim hover:text-text-main'
          }`}
        >
          Farrowing (Partos)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTab === 'breeding' ? (
          // Breeding View
          [...Array(3)].map((_, i) => (
             <div key={i} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-error/20 rounded-xl flex items-center justify-center text-error">
                        <Heart className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold">Natural Service #88</h3>
                        <p className="text-text-dim text-sm">Animal ID: P-203</p>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-text-dim">Date</span>
                        <span className="font-medium">21/01/2024</span>
                    </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-text-dim">Technician</span>
                        <span className="font-medium">Juan Pérez</span>
                    </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-white/5 text-text-dim rounded">In Progress</span>
                    <button className="text-primary hover:underline text-sm font-bold">Details</button>
                </div>
             </div>
          ))
        ) : activeTab === 'pregnancy' ? (
          // Pregnancy View
          <div className="col-span-full glass p-12 text-center rounded-3xl">
             <ClipboardCheck className="w-16 h-16 mx-auto mb-4 text-text-dim/20" />
             <h3 className="text-xl font-bold">No active pregnancies</h3>
             <p className="text-text-dim mt-1">Confirmed pregnancies will appear here after breeding confirmation.</p>
          </div>
        ) : (
          // Farrowing View
          [...Array(2)].map((_, i) => (
            <div key={i} className="glass p-6 rounded-2xl border-l-4 border-success">
                <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center text-success">
                        <Baby className="w-5 h-5" />
                    </div>
                    <button className="text-text-dim"><MoreVertical className="w-4 h-4" /></button>
                </div>
                <h3 className="font-bold text-lg mb-1">Parto #F-23</h3>
                <p className="text-sm text-text-dim mb-4">Madre: Sow_A2 (Large White)</p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white/5 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-text-dim uppercase font-bold">Alive</p>
                        <p className="text-lg font-bold text-success">14</p>
                    </div>
                     <div className="bg-white/5 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-text-dim uppercase font-bold">Dead</p>
                        <p className="text-lg font-bold text-error">1</p>
                    </div>
                     <div className="bg-white/5 p-2 rounded-lg text-center">
                        <p className="text-[10px] text-text-dim uppercase font-bold">Mumm.</p>
                        <p className="text-lg font-bold text-warning">0</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-dim">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Farrowed on Jan 18, 2024
                </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
