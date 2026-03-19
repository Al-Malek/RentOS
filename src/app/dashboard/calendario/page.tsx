"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/MainLayout';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useReservas } from '@/hooks/useReservas';
import {
  buildWeekDays,
  CalendarFilters,
  filterVehiculosForCalendar,
  formatDayLabel,
  getVehicleDayReservations,
} from '@/hooks/calendario.utils';
import { Reserva } from '@/data/HU3_ReservasData';
import { Vehiculo } from '@/data/HU1_VehiculosData';

interface CalendarDetailState {
  vehiculo: Vehiculo;
  day: Date;
  reservas: Reserva[];
}

export default function CalendarioPage() {
  const { vehiculos } = useVehiculos();
  const { reservas } = useReservas();

  const [filters, setFilters] = useState<CalendarFilters>({ tipo: 'todos', estado: 'todos' });
  const [anchorDay, setAnchorDay] = useState<Date>(new Date());
  const [details, setDetails] = useState<CalendarDetailState | null>(null);

  const weekDays = useMemo(() => buildWeekDays(anchorDay), [anchorDay]);
  const vehiculosFiltrados = useMemo(
    () => filterVehiculosForCalendar(vehiculos, filters),
    [vehiculos, filters],
  );

  const moveWeek = (delta: number) => {
    setAnchorDay((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + (delta * 7));
      return next;
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black italic uppercase">Calendario de Ocupación</h1>
            <p className="text-gray-500">Vista semanal para coordinar entregas y devoluciones</p>
          </div>

          <Link
            href="/dashboard/reservas"
            className="bg-[#00E5FF] text-black font-bold px-4 py-2 rounded-lg"
          >
            + Nueva reserva
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#1E1E1E] border border-gray-800 p-4 rounded-xl">
          <div>
            <label htmlFor="tipoFiltro" className="block text-xs text-gray-400 mb-1">Tipo</label>
            <select
              id="tipoFiltro"
              value={filters.tipo}
              onChange={(event) => setFilters((prev) => ({ ...prev, tipo: event.target.value as CalendarFilters['tipo'] }))}
              className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="todos">Todos</option>
              <option value="Sport">Sport</option>
              <option value="Adventure">Adventure</option>
              <option value="Naked">Naked</option>
              <option value="Cruiser">Cruiser</option>
            </select>
          </div>

          <div>
            <label htmlFor="estadoFiltro" className="block text-xs text-gray-400 mb-1">Estado</label>
            <select
              id="estadoFiltro"
              value={filters.estado}
              onChange={(event) => setFilters((prev) => ({ ...prev, estado: event.target.value as CalendarFilters['estado'] }))}
              className="w-full bg-black/40 border border-gray-700 rounded-lg p-2 text-sm"
            >
              <option value="todos">Todos</option>
              <option value="available">Disponible</option>
              <option value="rented">Rentado</option>
              <option value="maintenance">Mantenimiento</option>
            </select>
          </div>

          <div className="md:col-span-2 flex items-end gap-2">
            <button
              type="button"
              onClick={() => moveWeek(-1)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
            >
              Semana anterior
            </button>
            <button
              type="button"
              onClick={() => moveWeek(1)}
              className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm"
            >
              Semana siguiente
            </button>
          </div>
        </div>

        <div className="overflow-auto border border-gray-800 rounded-xl">
          <table className="min-w-full text-sm">
            <thead className="bg-[#1E1E1E]">
              <tr>
                <th className="text-left p-3 font-bold">Vehículo</th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="text-left p-3 font-bold min-w-36">{formatDayLabel(day)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {vehiculosFiltrados.map((vehiculo) => (
                <tr key={vehiculo.id} className="border-t border-gray-800">
                  <td className="p-3">
                    <p className="font-bold">{vehiculo.marca} {vehiculo.modelo}</p>
                    <p className="text-xs text-gray-500">{vehiculo.placa}</p>
                  </td>

                  {weekDays.map((day) => {
                    const dayReservations = getVehicleDayReservations(reservas, vehiculo.id, day);
                    const hasReservations = dayReservations.length > 0;

                    return (
                      <td key={`${vehiculo.id}-${day.toISOString()}`} className="p-2 align-top">
                        <button
                          type="button"
                          title={hasReservations
                            ? dayReservations.map((item) => `${item.cliente} (${item.fechaInicio} - ${item.fechaFin})`).join(' | ')
                            : 'Sin reservas'}
                          onClick={() => hasReservations && setDetails({ vehiculo, day, reservas: dayReservations })}
                          className={`w-full text-left rounded-lg px-2 py-2 border text-xs ${
                            hasReservations
                              ? 'bg-[#00E5FF]/20 border-[#00E5FF]/40 text-white'
                              : 'bg-white/5 border-white/10 text-gray-400'
                          }`}
                        >
                          {hasReservations ? `${dayReservations.length} reserva(s)` : 'Libre'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {vehiculosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-400">No hay vehículos con esos filtros.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {details && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-label="Detalle de ocupación">
            <div className="bg-[#121212] border border-gray-700 rounded-xl w-full max-w-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Detalle de ocupación</h2>
                <button type="button" onClick={() => setDetails(null)} className="text-sm bg-white/10 px-2 py-1 rounded">Cerrar</button>
              </div>
              <p className="text-sm text-gray-400">{details.vehiculo.marca} {details.vehiculo.modelo} · {details.day.toLocaleDateString('es-CO')}</p>
              <div className="space-y-2">
                {details.reservas.map((reserva) => (
                  <div key={reserva.id} className="border border-gray-700 rounded-lg p-3 text-sm">
                    <p className="font-bold">{reserva.cliente}</p>
                    <p className="text-gray-400">Documento: {reserva.documento}</p>
                    <p className="text-gray-400">Periodo: {reserva.fechaInicio} - {reserva.fechaFin}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
