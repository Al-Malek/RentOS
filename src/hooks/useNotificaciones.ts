import { useState, useEffect } from 'react';
import { Notificacion, NotificacionesMock } from '@/data/NotificacionesData';
import toast from 'react-hot-toast';

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('rentos_notificaciones');
    if (saved) {
      setNotificaciones(JSON.parse(saved));
    } else {
      setNotificaciones(NotificacionesMock);
      localStorage.setItem('rentos_notificaciones', JSON.stringify(NotificacionesMock));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (nuevasNotificaciones: Notificacion[]) => {
    setNotificaciones(nuevasNotificaciones);
    localStorage.setItem('rentos_notificaciones', JSON.stringify(nuevasNotificaciones));
  };

  const enviarNotificacion = (notificacion: Omit<Notificacion, 'id' | 'fecha' | 'estado'>): Promise<Notificacion> => {
    return new Promise((resolve) => {
      // Simular delay de envío
      setTimeout(() => {
        const nuevaNotificacion: Notificacion = {
          ...notificacion,
          id: `not-${Date.now()}`,
          fecha: new Date().toISOString(),
          estado: Math.random() > 0.1 ? 'enviado' : 'fallido' // 90% éxito
        };
        
        saveToStorage([nuevaNotificacion, ...notificaciones]);
        
        if (nuevaNotificacion.estado === 'enviado') {
          toast.success(`Email enviado a ${notificacion.email}`);
        } else {
          toast.error(`Error al enviar email a ${notificacion.email}`);
        }
        
        resolve(nuevaNotificacion);
      }, 1000);
    });
  };

  const enviarConfirmacionReserva = (reservaId: string, cliente: string, email: string, vehiculo: string, fechas: string) => {
    return enviarNotificacion({
      tipo: 'confirmacion',
      destinatario: cliente,
      email,
      asunto: `Confirmación de Reserva #${reservaId}`,
      mensaje: `Tu reserva ha sido confirmada para el vehículo ${vehiculo} ${fechas}.`,
      reservaId
    });
  };

  const enviarCancelacion = (reservaId: string, cliente: string, email: string) => {
    return enviarNotificacion({
      tipo: 'cancelacion',
      destinatario: cliente,
      email,
      asunto: `Cancelación de Reserva #${reservaId}`,
      mensaje: 'Tu reserva ha sido cancelada según tu solicitud. El reembolso se procesará en 3-5 días hábiles.',
      reservaId
    });
  };

  const enviarRecibo = (reservaId: string, cliente: string, email: string, monto: number) => {
    return enviarNotificacion({
      tipo: 'recibo',
      destinatario: cliente,
      email,
      asunto: `Recibo de Pago - Reserva #${reservaId}`,
      mensaje: `Gracias por tu preferencia. El monto total de $${monto} ha sido procesado exitosamente.`,
      reservaId
    });
  };

  return {
    notificaciones,
    loading,
    enviarNotificacion,
    enviarConfirmacionReserva,
    enviarCancelacion,
    enviarRecibo
  };
};
