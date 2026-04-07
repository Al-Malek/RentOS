"use client";
import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useBackup } from '@/hooks/useBackup';
import { useConfig } from '@/context/ConfigContext';

export default function BackupPage() {
  const { t } = useConfig();
  const { loading, error, backups, createBackup, listBackups, restoreBackup } = useBackup();
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null);

  useEffect(() => {
    listBackups();
  }, []);

  const handleCreateBackup = async () => {
    if (confirm('¿Deseas crear un backup manual de la base de datos?')) {
      await createBackup();
    }
  };

  const handleRestoreBackup = async (filename: string) => {
    if (confirm(`⚠️ ADVERTENCIA: Restaurar el backup "${filename}" sobrescribirá todos los datos actuales. ¿Estás seguro?`)) {
      await restoreBackup(filename);
    }
  };

  const formatFilename = (filename: string) => {
    const match = filename.match(/backup-(\d{4}-\d{2}-\d{2})-(\d{2})-(\d{2})-(\d{2})/);
    if (match) {
      const [, date, hour, minute, second] = match;
      return `${date} ${hour}:${minute}:${second}`;
    }
    return filename;
  };

  const getBackupSize = (filename: string) => {
    return 'N/A';
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase mb-2">
            Gestión de Backups
          </h1>
          <p className="text-gray-500">
            Crea y restaura copias de seguridad de la base de datos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total de Backups</p>
            <p className="text-3xl font-black text-white">{backups.length}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Último Backup</p>
            <p className="text-lg font-black text-[#00E5FF]">
              {backups.length > 0 ? formatFilename(backups[0]).split(' ')[0] : 'N/A'}
            </p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Backup Automático</p>
            <p className="text-lg font-black text-green-400">Activo (2:00 AM)</p>
          </Card>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-black uppercase text-[#00E5FF]">
                Crear Backup Manual
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Crea una copia de seguridad completa de la base de datos
              </p>
            </div>
            <Button
              onClick={handleCreateBackup}
              disabled={loading}
              className="bg-[#00E5FF] text-black hover:bg-[#00B8CC]"
            >
              {loading ? 'Creando...' : '💾 Crear Backup'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-4">
              <p className="text-red-400 text-sm">Error: {error}</p>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-400 text-xs">
              ℹ️ Los backups se crean automáticamente todos los días a las 2:00 AM. 
              Se mantienen los últimos 7 días de backups automáticos.
            </p>
          </div>
        </Card>

        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-sm font-black uppercase text-[#00E5FF]">
              Backups Disponibles
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Lista de todos los backups disponibles para restauración
            </p>
          </div>

          <Table caption="Lista de backups disponibles">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Archivo</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && backups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    Cargando backups...
                  </TableCell>
                </TableRow>
              )}
              {!loading && backups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No hay backups disponibles
                  </TableCell>
                </TableRow>
              )}
              {backups.map((backup) => (
                <TableRow key={backup}>
                  <TableCell className="font-mono text-xs">
                    {backup}
                  </TableCell>
                  <TableCell>
                    {formatFilename(backup)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 text-xs font-bold rounded-full bg-blue-500/20 text-blue-400">
                      {backup.includes('manual') ? 'Manual' : 'Automático'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleRestoreBackup(backup)}
                      disabled={loading}
                      className="text-xs font-bold text-[#00E5FF] hover:text-[#00B8CC] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                    >
                      🔄 Restaurar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Card>
          <h2 className="text-sm font-black uppercase text-red-400 mb-4">
            ⚠️ Advertencias Importantes
          </h2>
          <ul className="space-y-2 text-sm text-gray-400">
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>Restaurar un backup sobrescribirá TODOS los datos actuales de la base de datos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>Se recomienda crear un backup manual antes de restaurar otro backup</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>Los backups automáticos se eliminan después de 7 días</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              <span>Asegúrate de tener suficiente espacio en disco para los backups</span>
            </li>
          </ul>
        </Card>
      </div>
    </MainLayout>
  );
}
