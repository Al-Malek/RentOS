"use client";
import MainLayout from '@/components/MainLayout';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';

export default function NotificacionesPage() {
  const { notificaciones } = useNotificaciones();

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'confirmacion': return '✅';
      case 'recordatorio': return '⏰';
      case 'cancelacion': return '❌';
      case 'recibo': return '🧾';
      default: return '📧';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase">🔔 Centro de Notificaciones</h1>
          <p className="text-gray-500">Historial de emails enviados a clientes</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Enviados</p>
            <p className="text-3xl font-black text-white">{notificaciones.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Exitosos</p>
            <p className="text-3xl font-black text-green-400">
              {notificaciones.filter(n => n.estado === 'enviado').length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Fallidos</p>
            <p className="text-3xl font-black text-red-400">
              {notificaciones.filter(n => n.estado === 'fallido').length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Tasa de Éxito</p>
            <p className="text-3xl font-black text-[#00E5FF]">
              {((notificaciones.filter(n => n.estado === 'enviado').length / notificaciones.length) * 100).toFixed(0)}%
            </p>
          </Card>
        </div>

        {/* Tabla de Notificaciones */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
          <Table caption="Historial de notificaciones enviadas">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Tipo</TableHead>
                <TableHead>Destinatario</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificaciones.map((notif) => (
                <TableRow key={notif.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getIcono(notif.tipo)}</span>
                      <span className="text-xs capitalize">{notif.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-bold text-sm">{notif.destinatario}</p>
                    <p className="text-xs text-gray-500">{notif.email}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{notif.asunto}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-xs">
                      {new Date(notif.fecha).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={notif.estado === 'enviado' ? 'success' : 'danger'}>
                      {notif.estado}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
