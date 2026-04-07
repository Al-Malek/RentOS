import { useState } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

export const useBackup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backups, setBackups] = useState<string[]>([]);

  const createBackup = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.createBackup();
      toast.success('Backup creado exitosamente');
      await listBackups(); // Refresh list
      return result;
    } catch (err: any) {
      console.error('Error creating backup:', err);
      setError(err.message);
      toast.error('Error al crear backup: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const listBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.listBackups();
      setBackups(result.backups || []);
      return result.backups;
    } catch (err: any) {
      console.error('Error listing backups:', err);
      setError(err.message);
      setBackups([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const restoreBackup = async (filename: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.restoreBackup(filename);
      toast.success('Backup restaurado exitosamente');
      return result;
    } catch (err: any) {
      console.error('Error restoring backup:', err);
      setError(err.message);
      toast.error('Error al restaurar backup: ' + err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    backups,
    createBackup,
    listBackups,
    restoreBackup,
  };
};
