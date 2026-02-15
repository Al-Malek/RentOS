"use client";
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useConfig } from '@/context/ConfigContext'; 
import { HU1_VehiculoForm } from '@/components/HU1_VehiculoForm'; // Importamos tu formulario
import { Vehiculo } from '@/data/HU1_VehiculosData';

export default function Page() {
  const { vehiculos } = useVehiculos();
  const { t, highContrast } = useConfig(); 

  // --- NUEVOS ESTADOS PARA DETALLES Y EDICIÓN ---
  const [vehiculoAEditar, setVehiculoAEditar] = useState<Vehiculo | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Función para ver detalles (Simulada con un alert profesional o podrías crear otro modal)
  const verDetalles = (moto: Vehiculo) => {
    alert(`
      🔍 DETALLES TÉCNICOS:
      -----------------------
      Modelo: ${moto.modelo}
      Placa: ${moto.placa}
      Estado: ${t('status', moto.estado)}
      Kilometraje: ${moto.kilometraje}
      Próximo Mantenimiento: 500km
      Ficha Técnica: Disponible en sistema.
    `);
  };

  // Función para abrir el lápiz (editar)
  const abrirEdicion = (moto: Vehiculo) => {
    setVehiculoAEditar(moto);
    setMostrarFormulario(true);
  };

  // Función para guardar cambios
  const guardarCambios = (vehiculoActualizado: Vehiculo) => {
    console.log("Guardando datos en la base...", vehiculoActualizado);
    // Aquí luego conectarías con una función que actualice el Mock o la DB
    setMostrarFormulario(false);
    setVehiculoAEditar(null);
  };

  const cardStyle = highContrast 
    ? 'bg-white border-2 border-gray-200 shadow-md text-black hover:border-black' 
    : 'bg-[#1E1E1E] border border-gray-800 text-white hover:border-[#00E5FF] shadow-lg';

  const textSecondary = highContrast ? 'text-gray-600' : 'text-gray-400';

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-1 ${highContrast ? 'text-black' : 'text-white'}`}>
          {t('home', 'title')}
        </h2>
        <p className={textSecondary}>
          {t('home', 'subtitle')}
        </p>
      </div>

      {/* --- RENDERIZADO DEL FORMULARIO DE EDICIÓN --- */}
      {mostrarFormulario && (
        <HU1_VehiculoForm 
          vehiculo={vehiculoAEditar} 
          onSave={guardarCambios} 
          onCancel={() => setMostrarFormulario(false)} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
        {vehiculos.map((moto) => (
          <div key={moto.id} className={`rounded-xl overflow-hidden transition-all duration-300 group ${cardStyle}`}>
            
            <div className="h-48 overflow-hidden relative">
              <img 
                src={moto.foto} 
                alt={moto.modelo} 
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
              />
              <div className="absolute top-2 right-2 bg-black bg-opacity-80 px-2 py-1 rounded text-[10px] font-bold text-white shadow">
                {moto.placa}
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold leading-tight">{moto.modelo}</h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${
                  moto.estado === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : moto.estado === 'rented'
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-orange-100 text-orange-800' 
                }`}>
                  {t('status', moto.estado)}
                </span>
              </div>
              
              <div className={`text-sm mb-4 space-y-2 ${textSecondary}`}>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span className="font-medium">{t('card', 'km')}:</span> 
                  <span>{moto.kilometraje}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🔧</span>
                  <span className="font-medium">{t('card', 'maint')}:</span> 
                  <span>500km</span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                {/* BOTÓN DETALLES ACTUALIZADO */}
                <button 
                  onClick={() => verDetalles(moto)}
                  className="flex-1 bg-[#00E5FF] text-black font-bold py-2 rounded-lg text-sm hover:bg-cyan-300 transition shadow-sm"
                >
                  {t('card', 'btn_details')}
                </button>
                
                {/* BOTÓN LÁPIZ ACTUALIZADO */}
                <button 
                  onClick={() => abrirEdicion(moto)}
                  className={`px-3 py-2 rounded-lg transition ${
                    highContrast 
                      ? 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  ✏️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}