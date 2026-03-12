"use client";
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useConfig } from '@/context/ConfigContext';
import { Vehiculo } from '@/data/HU1_VehiculosData';
import { Reserva, TarifaExtra, TarifasIniciales } from '@/data/HU3_ReservasData';

export default function ReservasPage() {
  const { vehiculos, setVehiculos } = useVehiculos(); 
  const { highContrast } = useConfig();
  
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [tarifasExtras, setTarifasExtras] = useState<TarifaExtra[]>(TarifasIniciales);
  
  const [fechas, setFechas] = useState({ 
    inicio: new Date().toISOString().split('T')[0], 
    fin: new Date(Date.now() + 86400000).toISOString().split('T')[0] 
  });
  
  const [motoSeleccionada, setMotoSeleccionada] = useState<Vehiculo | null>(null);
  const [cliente, setCliente] = useState({ nombre: '', documento: '' });
  const [nuevaTarifa, setNuevaTarifa] = useState({ nombre: '', precio: 0, esPorDia: true });

  useEffect(() => {
    const stored = localStorage.getItem('reservas_db');
    if (stored) {
      setReservas(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('reservas_db', JSON.stringify(reservas));
  }, [reservas]);

  const verificarDisponibilidad = (moto: Vehiculo) => {
    const inicioSolicitud = new Date(fechas.inicio).getTime();
    const finSolicitud = new Date(fechas.fin).getTime();

    const motoData = moto as any; 
    if (moto.estado === 'maintenance' && motoData.periodoMantenimiento) {
      const inicioMant = new Date(motoData.periodoMantenimiento.inicio).getTime();
      const finMant = new Date(motoData.periodoMantenimiento.fin).getTime();

      if (inicioSolicitud <= finMant && finSolicitud >= inicioMant) {
        return false; 
      }
    }

    const tieneConflicto = reservas.some(res => {
      if (res.vehiculoId !== moto.id || res.estado === 'cancelada') return false;
      
      const inicioRes = new Date(res.fechaInicio).getTime();
      const finRes = new Date(res.fechaFin).getTime();

      return (inicioSolicitud <= finRes && finSolicitud >= inicioRes);
    });

    return !tieneConflicto;
  };

  const motosDisponibles = vehiculos.filter(verificarDisponibilidad);

  const calcularDias = () => {
    const inicio = new Date(fechas.inicio).getTime();
    const fin = new Date(fechas.fin).getTime();
    const diff = fin - inicio;
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calcularDesglose = (precioDiaMoto: number) => {
    const dias = calcularDias();
    const subtotalRenta = dias * precioDiaMoto;
    let totalExtras = 0;
    tarifasExtras.forEach(t => {
      totalExtras += t.esPorDia ? (t.precio * dias) : t.precio;
    });
    return { dias, subtotalRenta, totalExtras, granTotal: subtotalRenta + totalExtras };
  };

  const agregarTarifa = () => {
    if (!nuevaTarifa.nombre || nuevaTarifa.precio <= 0) return;
    setTarifasExtras([...tarifasExtras, { ...nuevaTarifa, id: Date.now().toString() }]);
    setNuevaTarifa({ nombre: '', precio: 0, esPorDia: true });
  };

  const eliminarTarifa = (id: string) => {
    setTarifasExtras(tarifasExtras.filter(t => t.id !== id));
  };

  const confirmarReserva = () => {
    if (!motoSeleccionada) return;
    const desglose = calcularDesglose(motoSeleccionada.precioDia);
    
    const nuevaReserva: Reserva = {
      id: Date.now().toString(),
      vehiculoId: motoSeleccionada.id,
      cliente: cliente.nombre,
      documento: cliente.documento,
      fechaInicio: fechas.inicio,
      fechaFin: fechas.fin,
      desglose: {
        dias: desglose.dias,
        precioDia: motoSeleccionada.precioDia,
        totalExtras: desglose.totalExtras
      },
      totalFinal: desglose.granTotal,
      estado: 'confirmada'
    };

    setReservas([...reservas, nuevaReserva]);

    const hoy = new Date().toISOString().split('T')[0];
    if (fechas.inicio === hoy) {
      const nuevaFlota = vehiculos.map(v => 
        v.id === motoSeleccionada.id ? { ...v, estado: 'rented' as const } : v
      );
      setVehiculos(nuevaFlota);
    }

    setMotoSeleccionada(null);
    setCliente({ nombre: '', documento: '' });
  };

  const themeCard = highContrast ? 'bg-white border-gray-300 text-black' : 'bg-[#1E1E1E] border-gray-800 text-white';
  const themeInput = "w-full bg-black/40 border border-gray-700 rounded-xl p-3 text-xs outline-none focus:border-[#00E5FF] text-white";

  return (
    <MainLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-black italic uppercase italic">📅 Motor de Reservas</h2>
        <p className="text-gray-500">Gestión de disponibilidad y facturación</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-4 space-y-6">
          
          <div className={`p-6 rounded-3xl border ${themeCard}`}>
            <h3 className="font-black uppercase text-[#00E5FF] mb-4 text-sm tracking-widest">1. Periodo de Renta</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500">Fecha Retiro</label>
                <input type="date" value={fechas.inicio} className={themeInput} onChange={(e) => setFechas({...fechas, inicio: e.target.value})} />
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-500">Fecha Devolución</label>
                <input type="date" value={fechas.fin} className={themeInput} onChange={(e) => setFechas({...fechas, fin: e.target.value})} />
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-dashed border-gray-700 text-center">
                <span className="text-2xl font-black text-white">{calcularDias()}</span>
                <span className="text-[10px] uppercase text-gray-500 block font-bold">Días Totales</span>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border ${themeCard}`}>
            <h3 className="font-black uppercase text-[#00E5FF] mb-4 text-sm tracking-widest">2. Tarifas y Adicionales</h3>
            
            <div className="space-y-2 mb-6">
              {tarifasExtras.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 group hover:border-red-500/30 transition">
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-300">{t.nombre}</p>
                    <p className="text-[9px] text-gray-500 uppercase">{t.esPorDia ? 'Precio por día' : 'Precio Fijo'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-[#00E5FF] font-bold text-xs">+${t.precio}</p>
                    <button 
                      onClick={() => eliminarTarifa(t.id)}
                      className="w-6 h-6 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition"
                      title="Eliminar cargo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              {tarifasExtras.length === 0 && <p className="text-xs text-gray-500 text-center italic">No hay tarifas extras configuradas</p>}
            </div>

            <div className="pt-4 border-t border-gray-800">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-2">Crear Nuevo Cargo</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input 
                  placeholder="Nombre" className={themeInput}
                  value={nuevaTarifa.nombre} onChange={(e) => setNuevaTarifa({...nuevaTarifa, nombre: e.target.value})}
                />
                <input 
                  type="number" placeholder="$" className={themeInput}
                  value={nuevaTarifa.precio || ''} onChange={(e) => setNuevaTarifa({...nuevaTarifa, precio: Number(e.target.value)})}
                />
              </div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] text-gray-400 flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={nuevaTarifa.esPorDia} onChange={(e) => setNuevaTarifa({...nuevaTarifa, esPorDia: e.target.checked})} />
                  Cobrar por día
                </label>
                <button onClick={agregarTarifa} className="text-[10px] font-black bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white transition">AGREGAR +</button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-end px-2">
            <h3 className="font-black uppercase text-gray-500 text-xs tracking-widest">
              Vehículos Disponibles ({motosDisponibles.length})
            </h3>
            <p className="text-[10px] text-gray-600 italic">
              Rango: {fechas.inicio} ➔ {fechas.fin}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {motosDisponibles.length > 0 ? (
              motosDisponibles.map(moto => (
                <div 
                  key={moto.id}
                  onClick={() => setMotoSeleccionada(moto)}
                  className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 overflow-hidden group hover:scale-[1.02] duration-300 ${
                    motoSeleccionada?.id === moto.id ? 'border-[#00E5FF] bg-[#00E5FF]/5' : 'border-gray-800 bg-[#1E1E1E] hover:border-gray-600'
                  }`}
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={moto.foto} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] text-[#00E5FF] font-black uppercase tracking-widest">{moto.marca}</p>
                        <h4 className="font-black uppercase italic text-lg leading-none mb-1">{moto.modelo}</h4>
                        <p className="text-[10px] text-gray-500 font-bold bg-white/5 inline-block px-2 py-0.5 rounded">{moto.tipo}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-white">${moto.precioDia}</p>
                        <p className="text-[9px] text-gray-500 uppercase font-bold">/ día</p>
                      </div>
                    </div>
                  </div>
                  {motoSeleccionada?.id === moto.id && (
                    <div className="absolute inset-0 border-2 border-[#00E5FF] rounded-2xl pointer-events-none flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                      <span className="bg-[#00E5FF] text-black font-black px-4 py-2 rounded-full text-xs uppercase shadow-[0_0_20px_rgba(0,229,255,0.6)]">Seleccionada</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-800 rounded-3xl">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Sin disponibilidad en estas fechas</p>
                <p className="text-xs text-gray-600 mt-2">Intenta cambiar el rango o verifica si las motos están en mantenimiento.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {motoSeleccionada && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-0 rounded-3xl overflow-hidden border ${themeCard}`}>
            
            <div className="bg-[#00E5FF] p-6 text-black">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter">Confirmar Renta</h3>
              <p className="text-xs font-bold opacity-70 uppercase">Ticket de Reserva</p>
            </div>

            <div className="p-8 space-y-6">
              
              <div className="flex gap-4 items-center pb-6 border-b border-gray-800">
                <img src={motoSeleccionada.foto} className="w-16 h-16 rounded-full object-cover border-2 border-[#00E5FF]" />
                <div>
                  <h4 className="font-black text-lg uppercase">{motoSeleccionada.modelo}</h4>
                  <p className="text-xs text-gray-500 uppercase font-bold">{motoSeleccionada.placa}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Periodo</p>
                  <p className="text-sm font-bold text-white">{fechas.inicio} <span className="text-[#00E5FF]">➜</span> {fechas.fin}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Cliente</label>
                  <input placeholder="Nombre Completo" className="w-full bg-transparent border-b border-gray-700 py-2 text-sm outline-none focus:border-[#00E5FF] transition-colors"
                    onChange={(e) => setCliente({...cliente, nombre: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Documento ID</label>
                  <input placeholder="DNI / Pasaporte" className="w-full bg-transparent border-b border-gray-700 py-2 text-sm outline-none focus:border-[#00E5FF] transition-colors"
                    onChange={(e) => setCliente({...cliente, documento: e.target.value})} />
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-5 border border-white/5 space-y-2 font-mono text-sm">
                <div className="flex justify-between text-gray-400 text-xs uppercase font-bold mb-2">
                  <span>Concepto</span><span>Subtotal</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Renta x {calcularDesglose(motoSeleccionada.precioDia).dias} días</span>
                  <span>${calcularDesglose(motoSeleccionada.precioDia).subtotalRenta}</span>
                </div>

                {tarifasExtras.map(t => (
                  <div key={t.id} className="flex justify-between text-gray-400 text-xs">
                    <span>+ {t.nombre} {t.esPorDia && `(x${calcularDias()})`}</span>
                    <span>${t.esPorDia ? t.precio * calcularDias() : t.precio}</span>
                  </div>
                ))}

                <div className="border-t border-dashed border-gray-600 my-3 pt-3 flex justify-between items-center">
                  <span className="font-black text-lg uppercase italic text-[#00E5FF]">Total a Pagar</span>
                  <span className="font-black text-2xl text-white">${calcularDesglose(motoSeleccionada.precioDia).granTotal}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setMotoSeleccionada(null)} className="flex-1 py-4 text-xs font-bold uppercase text-gray-500 hover:bg-white/5 rounded-xl transition">Cancelar</button>
                <button onClick={confirmarReserva} className="flex-[2] bg-[#00E5FF] text-black py-4 rounded-xl font-black text-xs uppercase shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] transition-all">
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}