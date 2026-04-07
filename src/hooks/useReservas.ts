import { useState, useEffect } from 'react';
import { PagoReserva, Reserva } from '@/data/HU3_ReservasData';
import { DEFAULT_DEPOSIT_RATE, hasReservationOverlap } from '@/hooks/reservas.utils';
import { api } from '@/lib/api';

export const useReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getReservas();
      setReservas(data);
    } catch (err: any) {
      console.error('Error loading reservas:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('reservas_db');
      if (saved) {
        const parsed = JSON.parse(saved) as Array<Reserva & { pago?: PagoReserva }>;
        setReservas(
          parsed.map((reserva) => ({
            ...reserva,
            desglose: {
              ...reserva.desglose,
              deposito: reserva.desglose?.deposito ?? Math.round(reserva.totalFinal * DEFAULT_DEPOSIT_RATE),
            },
            pago: reserva.pago ?? {
              metodoPago: 'efectivo',
              estado: 'procesado',
              fechaOperacion: reserva.fechaInicio,
              referencia: `TXN-${reserva.id}`,
            },
          })),
        );
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const crearReserva = async (reserva: Omit<Reserva, 'id' | 'pago'> & { pago?: PagoReserva }) => {
    try {
      const nuevaReserva = await api.createReserva(reserva);
      setReservas([...reservas, nuevaReserva]);
      return nuevaReserva;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const actualizarReserva = async (id: string, cambios: Partial<Reserva>) => {
    try {
      // API doesn't have generic update, so we handle specific cases
      setReservas(reservas.map(r => r.id === id ? { ...r, ...cambios } : r));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const cancelarReserva = async (id: string) => {
    try {
      await api.cancelarReserva(id);
      setReservas(reservas.map(r => r.id === id ? { ...r, estado: 'cancelada' } : r));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const completarReserva = async (id: string) => {
    try {
      await api.finalizarReserva(id);
      setReservas(reservas.map(r => r.id === id ? { ...r, estado: 'finalizada' } : r));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const verificarDisponibilidad = async (vehiculoId: number, fechaInicio: string, fechaFin: string, excluirReservaId?: string): Promise<boolean> => {
    try {
      const result = await api.verificarDisponibilidad({ vehiculoId, fechaInicio, fechaFin });
      return result.disponible;
    } catch (err: any) {
      // Fallback to local check
      return !hasReservationOverlap(reservas, vehiculoId, fechaInicio, fechaFin, excluirReservaId);
    }
  };

  return {
    reservas,
    loading,
    error,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    completarReserva,
    verificarDisponibilidad,
    refresh: loadReservas
  };
};
