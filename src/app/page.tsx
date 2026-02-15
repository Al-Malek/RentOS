"use client";
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useConfig } from '@/context/ConfigContext'; 
import { HU1_VehiculoForm } from '@/components/HU1_VehiculoForm';
import { Vehiculo } from '@/data/HU1_VehiculosData';

export default function Page() {
  const { vehiculos } = useVehiculos();
  const { t, highContrast } = useConfig(); 

  const [vehiculoAEditar, setVehiculoAEditar] = useState<Vehiculo | null>(null);
  const [vehiculoDetalle, setVehiculoDetalle] = useState<Vehiculo | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const guardarCambios = (vehiculoActualizado: Vehiculo) => {
    console.log("Datos actualizados:", vehiculoActualizado);
    setMostrarFormulario(false);
    setVehiculoAEditar(null);
  };

  const cardStyle = highContrast 
    ? 'bg-white border-2 border-gray-200 shadow-md text-black' 
    : 'bg-[#1E1E1E] border border-gray-800 text-white hover:border-[#00E5FF] shadow-lg';

  const textSecondary = highContrast ? 'text-gray-600' : 'text-gray-400';

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-1 ${highContrast ? 'text-black' : 'text-white'}`}>
          {t('home', 'title')}
        </h2>
        <p className={textSecondary}>{t('home', 'subtitle')}</p>
      </div>

      {vehiculoDetalle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all">
          <div className={`${highContrast ? 'bg-white text-black' : 'bg-[#121212] text-white'} border ${highContrast ? 'border-gray-400' : 'border-[#00E5FF]/30'} p-0 rounded-3xl max-w-2xl w-full overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)] animate-in fade-in zoom-in duration-300`}>
            
            <div className="relative h-72 w-full">
              <img src={vehiculoDetalle.foto} alt={vehiculoDetalle.modelo} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                  vehiculoDetalle.estado === 'available' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  ● {t('status', vehiculoDetalle.estado)}
                </span>
              </div>
              <button 
                onClick={() => setVehiculoDetalle(null)} 
                className="absolute top-4 right-4 bg-black/40 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center transition-all backdrop-blur-md"
              >
                ✕
              </button>
              <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${highContrast ? 'from-white' : 'from-[#121212]'} to-transparent`}></div>
            </div>
            
            <div className="p-8 -mt-12 relative">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <p className="text-[#00E5FF] font-black text-xs uppercase tracking-[0.3em] mb-1">
                    {vehiculoDetalle.marca || "RentOS Fleet"}
                  </p>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                    {vehiculoDetalle.modelo}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Tarifa Base</p>
                  <p className="text-4xl font-black text-[#00E5FF]">$45<span className="text-sm text-gray-500 font-medium">/día</span></p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Matrícula', value: vehiculoDetalle.placa, icon: '🆔' },
                  { label: 'Uso Total', value: vehiculoDetalle.kilometraje, icon: '📍' },
                  { label: 'Modelo Año', value: '2024', icon: '📅' },
                  { label: 'Categoría', value: 'Sport Naked', icon: '🏍️' }
                ].map((spec, i) => (
                  <div key={i} className={`${highContrast ? 'bg-gray-100 border-gray-300' : 'bg-white/5 border-white/10'} p-3 rounded-2xl border transition-colors hover:border-[#00E5FF]/50`}>
                    <p className="text-[9px] uppercase text-gray-500 font-black mb-1 tracking-tighter">{spec.label}</p>
                    <p className="font-bold text-xs truncate flex items-center gap-1.5">{spec.icon} {spec.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => { setVehiculoDetalle(null); setVehiculoAEditar(vehiculoDetalle); setMostrarFormulario(true); }}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all active:scale-95 border ${
                    highContrast ? 'bg-gray-200 border-gray-400 text-black' : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  Editar Ficha
                </button>
                <button className="flex-1 bg-[#00E5FF] hover:bg-cyan-300 text-black py-4 rounded-2xl font-black transition-all shadow-[0_10px_30px_rgba(0,229,255,0.3)] active:scale-95 uppercase text-sm tracking-wider">
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <img src={moto.foto} alt={moto.modelo} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold text-white">{moto.placa}</div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold leading-tight">{moto.modelo}</h3>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  moto.estado === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {t('status', moto.estado)}
                </span>
              </div>
              
              <div className={`text-sm mb-4 space-y-2 ${textSecondary}`}>
                <p>📍 <span className="font-medium">{t('card', 'km')}:</span> {moto.kilometraje}</p>
                <p>🔧 <span className="font-medium">{t('card', 'maint')}:</span> 500km</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setVehiculoDetalle(moto)}
                  className="flex-1 bg-[#00E5FF] text-black font-bold py-2 rounded-lg text-sm hover:bg-cyan-300 transition-colors shadow-sm"
                >
                  {t('card', 'btn_details')}
                </button>
                <button 
                  onClick={() => { setVehiculoAEditar(moto); setMostrarFormulario(true); }}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    highContrast ? 'bg-gray-100 text-black border border-gray-300' : 'bg-gray-800 text-white'
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