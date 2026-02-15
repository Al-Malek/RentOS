"use client";
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useConfig } from '@/context/ConfigContext'; 
import { Vehiculo } from '@/data/HU1_VehiculosData';

export default function TallerPage() {
  const { vehiculos, setVehiculos } = useVehiculos();
  const { t, highContrast } = useConfig(); 

  const vehiculosEnRevision = vehiculos.filter(v => 
    v.estado === 'maintenance' || v.proximoMantenimiento <= 500
  );

  const cardStyle = highContrast 
    ? 'bg-white border-2 border-gray-200 shadow-md text-black' 
    : 'bg-[#1E1E1E] border border-gray-800 text-white shadow-lg';

  const textSecondary = highContrast ? 'text-gray-600' : 'text-gray-400';

  return (
    <MainLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className={`text-3xl font-black mb-1 italic uppercase ${highContrast ? 'text-black' : 'text-white'}`}>
            🛠️ Centro de Servicio
          </h2>
          <p className={textSecondary}>Gestión de mantenimientos preventivos y correctivos</p>
        </div>
        
        <div className="flex gap-4">
          <div className={`${highContrast ? 'bg-gray-100' : 'bg-white/5'} px-6 py-3 rounded-2xl border border-white/10 text-center`}>
            <p className="text-[10px] uppercase text-gray-500 font-bold">En Taller</p>
            <p className="text-xl font-black text-orange-500">
              {vehiculos.filter(v => v.estado === 'maintenance').length}
            </p>
          </div>
          <div className={`${highContrast ? 'bg-gray-100' : 'bg-white/5'} px-6 py-3 rounded-2xl border border-white/10 text-center`}>
            <p className="text-[10px] uppercase text-gray-500 font-bold">Críticos</p>
            <p className="text-xl font-black text-red-500">
              {vehiculos.filter(v => v.proximoMantenimiento <= 200).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        {vehiculosEnRevision.length > 0 ? (
          vehiculosEnRevision.map((moto) => (
            <div key={moto.id} className={`rounded-2xl overflow-hidden flex h-44 transition-all ${cardStyle} border-l-4 ${moto.proximoMantenimiento <= 200 ? 'border-l-red-500' : 'border-l-orange-500'}`}>
              
              <div className="w-40 h-full relative">
                <img src={moto.foto} alt={moto.modelo} className="w-full h-full object-cover grayscale-[0.5]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[#00E5FF] text-[10px] font-black uppercase tracking-tighter">{moto.marca} - {moto.placa}</p>
                    <h3 className="text-xl font-bold uppercase italic">{moto.modelo}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Estado Actual</p>
                    <span className={`text-xs font-black ${moto.estado === 'maintenance' ? 'text-orange-500' : 'text-green-500'}`}>
                      {moto.estado === 'maintenance' ? 'EN REPARACIÓN' : 'OPERATIVA'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className={textSecondary}>Vida útil de aceite/piezas</span>
                    <span className={moto.proximoMantenimiento <= 200 ? 'text-red-500' : 'text-orange-500'}>
                      {moto.proximoMantenimiento} KM restantes
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${moto.proximoMantenimiento <= 200 ? 'bg-red-500' : 'bg-orange-500'}`}
                      style={{ width: `${Math.min((moto.proximoMantenimiento / 1000) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase py-2 rounded-lg border border-white/10 transition">
                    Ver Historial
                  </button>
                  <button 
                    onClick={() => {
                      const nuevaLista = vehiculos.map(v => 
                        v.id === moto.id ? { ...v, estado: 'available', proximoMantenimiento: 2000 } : v
                      );
                      setVehiculos(nuevaLista);
                    }}
                    className="flex-1 bg-[#00E5FF] hover:bg-cyan-300 text-black text-[10px] font-black uppercase py-2 rounded-lg transition"
                  >
                    {moto.estado === 'maintenance' ? 'Finalizar Servicio' : 'Ingresar a Taller'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
             <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No hay motos requiriendo atención inmediata</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}