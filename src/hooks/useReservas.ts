import { useState, useEffect } from 'react';
import { PagoReserva, Reserva } from '@/data/HU3_ReservasData';

export const useReservas = () => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('reservas_db');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Array<Reserva & { pago?: PagoReserva }>;
        setReservas(
          parsed.map((reserva) => ({
            ...reserva,
            pago: reserva.pago ?? {
              metodoPago: 'efectivo',
              estado: 'procesado',
              fechaOperacion: reserva.fechaInicio,
              referencia: `TXN-${reserva.id}`,
            },
          })),
        );
      } catch (e) {
        setError('Error al cargar reservas');
      }
    }
    setLoading(false);
  }, []);

  const saveToStorage = (nuevasReservas: Reserva[]) => {
    setReservas(nuevasReservas);
    localStorage.setItem('reservas_db', JSON.stringify(nuevasReservas));
  };

  const crearReserva = (reserva: Omit<Reserva, 'id' | 'pago'> & { pago?: PagoReserva }) => {
    const nuevaReserva: Reserva = {
      ...reserva,
      id: `res-${Date.now()}`,
      pago: reserva.pago ?? {
        metodoPago: 'efectivo',
        estado: 'procesado',
        fechaOperacion: reserva.fechaInicio,
        referencia: `TXN-${Date.now()}`
      }
    };
    saveToStorage([...reservas, nuevaReserva]);
    return nuevaReserva;
  };

  const actualizarReserva = (id: string, cambios: Partial<Reserva>) => {
    const nuevasReservas = reservas.map(r => r.id === id ? { ...r, ...cambios } : r);
    saveToStorage(nuevasReservas);
  };

  const cancelarReserva = (id: string) => {
    actualizarReserva(id, { estado: 'cancelada' });
  };

  const completarReserva = (id: string) => {
    actualizarReserva(id, { estado: 'finalizada' });
  };

  const verificarDisponibilidad = (vehiculoId: number, fechaInicio: string, fechaFin: string, excluirReservaId?: string): boolean => {
    const inicioSolicitud = new Date(fechaInicio).getTime();
    const finSolicitud = new Date(fechaFin).getTime();

    const tieneConflicto = reservas.some(res => {
      if (res.vehiculoId !== vehiculoId || res.estado === 'cancelada') return false;
      if (excluirReservaId && res.id === excluirReservaId) return false;
      
      const inicioRes = new Date(res.fechaInicio).getTime();
      const finRes = new Date(res.fechaFin).getTime();

      return (inicioSolicitud <= finRes && finSolicitud >= inicioRes);
    });

    return !tieneConflicto;
  };

  return {
    reservas,
    loading,
    error,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    completarReserva,
    verificarDisponibilidad
  };
};
