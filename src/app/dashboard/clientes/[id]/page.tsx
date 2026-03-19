"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import { useClientes } from '@/hooks/useClientes';
import { useReservas } from '@/hooks/useReservas';
import { useVehiculos } from '@/hooks/useVehiculos';
import { buildClienteHistorialStats } from '@/hooks/clienteHistorial.utils';
import { ClienteIncidente } from '@/data/ClientesData';
import toast from 'react-hot-toast';

export default function ClienteDetallePage() {
  const params = useParams<{ id: string }>();
  const clienteId = params.id;

  const { clientes, actualizarCliente } = useClientes();
  const { reservas } = useReservas();
  const { vehiculos } = useVehiculos();

  const [nuevoIncidente, setNuevoIncidente] = useState({
    tipo: 'multa' as ClienteIncidente['tipo'],
    descripcion: '',
    monto: '',
  });

  const cliente = clientes.find((item) => item.id === clienteId);

  const stats = useMemo(() => {
    if (!cliente) {
      return null;
    }

    return buildClienteHistorialStats(cliente, reservas, vehiculos);
  }, [cliente, reservas, vehiculos]);

  if (!cliente || !stats) {
    return (
      <MainLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Cliente no encontrado</h1>
          <Link href="/dashboard/clientes" className="text-[#00E5FF] underline">Volver al listado</Link>
        </div>
      </MainLayout>
    );
  }

  const addIncidente = () => {
    if (!nuevoIncidente.descripcion.trim()) {
      toast.error('Agrega una descripción del incidente.');
      return;
    }

    const incidente: ClienteIncidente = {
      id: `inc-${Date.now()}`,
      tipo: nuevoIncidente.tipo,
      descripcion: nuevoIncidente.descripcion,
      fecha: new Date().toISOString().split('T')[0],
      monto: nuevoIncidente.monto ? Number(nuevoIncidente.monto) : undefined,
    };

    actualizarCliente(cliente.id, {
      incidentes: [...(cliente.incidentes ?? []), incidente],
    });

    setNuevoIncidente({ tipo: 'multa', descripcion: '', monto: '' });
    toast.success('Incidente agregado al historial.');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1 className="text-3xl font-black italic uppercase">Ficha del Cliente</h1>
            <p className="text-gray-400">{cliente.nombre} · {cliente.numeroDocumento}</p>
          </div>
          <Link href="/dashboard/clientes" className="bg-white/10 px-4 py-2 rounded-lg text-sm">Volver</Link>
        </div>

        {stats.riesgoAlto && (
          <div className="border border-red-500/40 bg-red-500/10 rounded-xl p-4" role="alert" aria-live="polite">
            <p className="font-bold text-red-400">Riesgo alto detectado</p>
            <p className="text-sm text-red-200">El cliente tiene incidentes/multas recientes. Revisa condiciones antes de confirmar una nueva reserva.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase">LTV</p>
            <p className="text-2xl font-black text-[#00E5FF]">${stats.ltv.toLocaleString()}</p>
          </div>
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase">Reservas Totales</p>
            <p className="text-2xl font-black">{stats.reservasTotales}</p>
          </div>
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase">Reservas Activas</p>
            <p className="text-2xl font-black">{stats.reservasActivas}</p>
          </div>
          <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 uppercase">Multas/Daños</p>
            <p className="text-2xl font-black text-orange-400">${stats.totalMultas.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-5">
            <h2 className="font-bold mb-3">Vehículos más rentados</h2>
            <div className="space-y-2">
              {stats.topVehiculos.length === 0 && <p className="text-sm text-gray-400">No hay histórico de reservas.</p>}
              {stats.topVehiculos.map((item) => (
                <div key={item.vehiculoId} className="flex justify-between border border-gray-700 rounded-lg p-3">
                  <p>{item.nombre}</p>
                  <p className="font-bold">{item.cantidad}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#1E1E1E] border border-gray-800 rounded-xl p-5 space-y-4">
            <h2 className="font-bold">Incidentes y multas</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label htmlFor="tipoIncidente" className="block text-xs text-gray-400 mb-1">Tipo</label>
                <select
                  id="tipoIncidente"
                  value={nuevoIncidente.tipo}
                  onChange={(event) => setNuevoIncidente((prev) => ({ ...prev, tipo: event.target.value as ClienteIncidente['tipo'] }))}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-sm"
                >
                  <option value="multa">Multa</option>
                  <option value="dano">Daño</option>
                  <option value="retraso">Retraso</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="descripcionIncidente" className="block text-xs text-gray-400 mb-1">Descripción</label>
                <input
                  id="descripcionIncidente"
                  value={nuevoIncidente.descripcion}
                  onChange={(event) => setNuevoIncidente((prev) => ({ ...prev, descripcion: event.target.value }))}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-sm"
                />
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="w-full max-w-40">
                <label htmlFor="montoIncidente" className="block text-xs text-gray-400 mb-1">Monto (opcional)</label>
                <input
                  id="montoIncidente"
                  type="number"
                  min={0}
                  value={nuevoIncidente.monto}
                  onChange={(event) => setNuevoIncidente((prev) => ({ ...prev, monto: event.target.value }))}
                  className="w-full bg-black/30 border border-gray-700 rounded-lg p-2 text-sm"
                />
              </div>
              <button type="button" onClick={addIncidente} className="bg-[#00E5FF] text-black font-bold px-4 py-2 rounded-lg">Agregar</button>
            </div>

            <div className="space-y-2">
              {stats.incidentes.length === 0 && <p className="text-sm text-gray-400">Sin incidentes registrados.</p>}
              {stats.incidentes.map((incidente) => (
                <div key={incidente.id} className="border border-gray-700 rounded-lg p-3 text-sm">
                  <p className="font-bold capitalize">{incidente.tipo}</p>
                  <p className="text-gray-400">{incidente.descripcion}</p>
                  <p className="text-gray-500 text-xs mt-1">{incidente.fecha}{incidente.monto ? ` · $${incidente.monto}` : ''}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
