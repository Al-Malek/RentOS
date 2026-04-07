"use client";
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useAudit } from '@/hooks/useAudit';
import { useConfig } from '@/context/ConfigContext';

export default function AuditoriaPage() {
  const { t } = useConfig();
  const [filters, setFilters] = useState({
    entity: '',
    action: '',
    userId: '',
  });
  
  const { logs, loading, error, refresh } = useAudit(filters);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionColor = (action: string) => {
    if (action.includes('CREATE')) return 'text-green-400';
    if (action.includes('UPDATE')) return 'text-yellow-400';
    if (action.includes('DELETE')) return 'text-red-400';
    return 'text-blue-400';
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase mb-2">
            Auditoría del Sistema
          </h1>
          <p className="text-gray-500">
            Registro completo de todas las acciones realizadas en el sistema
          </p>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">
                Entidad
              </label>
              <select
                className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-[#00E5FF] focus:outline-none"
                value={filters.entity}
                onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
              >
                <option value="">Todas</option>
                <option value="vehiculo">Vehículos</option>
                <option value="cliente">Clientes</option>
                <option value="reserva">Reservas</option>
                <option value="tarifa">Tarifas</option>
                <option value="tenant">Tenants</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">
                Acción
              </label>
              <select
                className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-[#00E5FF] focus:outline-none"
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
              >
                <option value="">Todas</option>
                <option value="CREATE">Crear</option>
                <option value="UPDATE">Actualizar</option>
                <option value="DELETE">Eliminar</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-wider">
                Usuario ID
              </label>
              <input
                type="text"
                className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-[#00E5FF] focus:outline-none"
                placeholder="Filtrar por usuario..."
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={refresh}
                className="w-full bg-[#00E5FF] text-black font-bold py-2.5 px-4 rounded-lg hover:bg-[#00B8CC] transition-colors uppercase text-xs tracking-wider"
              >
                Actualizar
              </button>
            </div>
          </div>
        </Card>

        {error && (
          <Card>
            <div className="text-red-400 text-sm">
              Error al cargar logs: {error}
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total de Logs</p>
            <p className="text-3xl font-black text-white">{logs.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Creaciones</p>
            <p className="text-3xl font-black text-green-400">
              {logs.filter(l => l.action.includes('CREATE')).length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Actualizaciones</p>
            <p className="text-3xl font-black text-yellow-400">
              {logs.filter(l => l.action.includes('UPDATE')).length}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Eliminaciones</p>
            <p className="text-3xl font-black text-red-400">
              {logs.filter(l => l.action.includes('DELETE')).length}
            </p>
          </Card>
        </div>

        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
          <Table caption="Registro de auditoría del sistema">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Acción</TableHead>
                <TableHead>Entidad</TableHead>
                <TableHead>ID Entidad</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    Cargando logs...
                  </TableCell>
                </TableRow>
              )}
              {!loading && logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500">
                    No hay logs de auditoría disponibles
                  </TableCell>
                </TableRow>
              )}
              {!loading && logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">
                    {formatDate(log.createdAt)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.userId}
                  </TableCell>
                  <TableCell className={`font-bold ${getActionColor(log.action)}`}>
                    {log.action}
                  </TableCell>
                  <TableCell className="capitalize">
                    {log.entity}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.entityId || '-'}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {log.ip || '-'}
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
