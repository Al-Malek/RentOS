"use client";
import { useEffect, useMemo, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { useReservas } from '@/hooks/useReservas';
import { useClientes } from '@/hooks/useClientes';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import toast from 'react-hot-toast';

export default function NotificacionesPage() {
  const {
    notificaciones,
    templates,
    programadas,
    updateTemplate,
    processScheduledReminders,
    scheduleReminder24h,
  } = useNotificaciones();
  const { reservas } = useReservas();
  const { clientes } = useClientes();

  const [templateForm, setTemplateForm] = useState(() => {
    const current = templates.find((item) => item.tipo === 'recordatorio');
    return {
      tipo: 'recordatorio' as 'confirmacion' | 'recordatorio' | 'mora',
      asuntoTemplate: current?.asuntoTemplate ?? '',
      mensajeTemplate: current?.mensajeTemplate ?? '',
    };
  });

  const tasaExito = notificaciones.length > 0
    ? ((notificaciones.filter(n => n.estado === 'enviado').length / notificaciones.length) * 100).toFixed(0)
    : '0';

  const reservasCandidatas = useMemo(() => {
    return reservas.filter((reserva) => reserva.estado === 'confirmada');
  }, [reservas]);

  useEffect(() => {
    const current = templates.find((item) => item.tipo === templateForm.tipo);
    if (!current) {
      return;
    }

    setTemplateForm((prev) => ({
      ...prev,
      asuntoTemplate: current.asuntoTemplate,
      mensajeTemplate: current.mensajeTemplate,
    }));
  }, [templates, templateForm.tipo]);

  const getIcono = (tipo: string) => {
    switch (tipo) {
      case 'confirmacion': return '✅';
      case 'recordatorio': return '⏰';
      case 'cancelacion': return '❌';
      case 'recibo': return '🧾';
      case 'mora': return '⚠️';
      default: return '📧';
    }
  };

  const scheduleRemindersForConfirmadas = () => {
    let created = 0;
    reservasCandidatas.forEach((reserva) => {
      const cliente = clientes.find((item) => item.numeroDocumento === reserva.documento);
      if (!cliente) {
        return;
      }

      const programada = scheduleReminder24h({
        reservaId: reserva.id,
        destinatario: cliente.nombre,
        email: cliente.email,
        vehiculo: `Vehículo ${reserva.vehiculoId}`,
        fechaInicio: reserva.fechaInicio,
      });

      if (programada) {
        created += 1;
      }
    });

    toast.success(created > 0 ? `${created} recordatorios programados.` : 'No hay recordatorios nuevos por programar.');
  };

  const handleTemplateTypeChange = (tipo: 'confirmacion' | 'recordatorio' | 'mora') => {
    const current = templates.find((item) => item.tipo === tipo);
    setTemplateForm({
      tipo,
      asuntoTemplate: current?.asuntoTemplate ?? '',
      mensajeTemplate: current?.mensajeTemplate ?? '',
    });
  };

  const handleSaveTemplate = () => {
    updateTemplate(templateForm.tipo, templateForm.asuntoTemplate, templateForm.mensajeTemplate);
    toast.success('Plantilla actualizada.');
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
              {tasaExito}%
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <h2 className="font-bold mb-3">Plantillas personalizables</h2>
            <div className="space-y-3">
              <div>
                <label htmlFor="tipoPlantilla" className="block text-xs text-gray-500 uppercase font-bold mb-1">Tipo</label>
                <select
                  id="tipoPlantilla"
                  value={templateForm.tipo}
                  onChange={(event) => handleTemplateTypeChange(event.target.value as 'confirmacion' | 'recordatorio' | 'mora')}
                  className="w-full bg-black/20 border border-gray-700 rounded p-2 text-sm"
                >
                  <option value="confirmacion">Confirmación</option>
                  <option value="recordatorio">Recordatorio</option>
                  <option value="mora">Mora</option>
                </select>
              </div>
              <div>
                <label htmlFor="asuntoTemplate" className="block text-xs text-gray-500 uppercase font-bold mb-1">Asunto</label>
                <input
                  id="asuntoTemplate"
                  value={templateForm.asuntoTemplate}
                  onChange={(event) => setTemplateForm((prev) => ({ ...prev, asuntoTemplate: event.target.value }))}
                  className="w-full bg-black/20 border border-gray-700 rounded p-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="mensajeTemplate" className="block text-xs text-gray-500 uppercase font-bold mb-1">Mensaje</label>
                <textarea
                  id="mensajeTemplate"
                  value={templateForm.mensajeTemplate}
                  onChange={(event) => setTemplateForm((prev) => ({ ...prev, mensajeTemplate: event.target.value }))}
                  className="w-full bg-black/20 border border-gray-700 rounded p-2 text-sm min-h-24"
                />
              </div>
              <button type="button" onClick={handleSaveTemplate} className="bg-[#00E5FF] text-black px-4 py-2 rounded text-sm font-bold">
                Guardar plantilla
              </button>
            </div>
          </Card>

          <Card>
            <h2 className="font-bold mb-3">Recordatorios automáticos (24h)</h2>
            <p className="text-sm text-gray-400 mb-3">Reservas confirmadas detectadas: {reservasCandidatas.length}</p>
            <p className="text-sm text-gray-400 mb-4">Cola programada: {programadas.filter((item) => item.estado === 'pendiente').length} pendientes</p>
            <div className="flex gap-2 flex-wrap">
              <button type="button" onClick={scheduleRemindersForConfirmadas} className="bg-white/10 px-4 py-2 rounded text-sm">Programar recordatorios</button>
              <button
                type="button"
                onClick={async () => {
                  const sent = await processScheduledReminders(new Date().toISOString());
                  toast.success(sent.length > 0 ? `${sent.length} recordatorios enviados.` : 'No hay recordatorios para enviar aún.');
                }}
                className="bg-white/10 px-4 py-2 rounded text-sm"
              >
                Procesar cola
              </button>
            </div>
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
