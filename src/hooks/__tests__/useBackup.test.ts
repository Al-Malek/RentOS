import { renderHook, waitFor } from '@testing-library/react';
import { useBackup } from '../useBackup';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

jest.mock('@/lib/api');
jest.mock('react-hot-toast');

describe('useBackup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBackups = [
    'backup-2026-04-07-10-00-00.sql',
    'backup-2026-04-06-10-00-00.sql',
    'backup-2026-04-05-10-00-00.sql',
  ];

  describe('createBackup', () => {
    it('should create backup successfully', async () => {
      const mockResult = {
        message: 'Backup created successfully',
        filepath: '/backups/backup-2026-04-07-10-00-00.sql',
      };

      (api.createBackup as jest.Mock).mockResolvedValue(mockResult);
      (api.listBackups as jest.Mock).mockResolvedValue({ backups: mockBackups });

      const { result } = renderHook(() => useBackup());

      const data = await result.current.createBackup();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockResult);
      expect(api.createBackup).toHaveBeenCalled();
      expect(api.listBackups).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Backup creado exitosamente');
    });

    it('should handle errors when creating backup', async () => {
      const mockError = new Error('Backup failed');
      (api.createBackup as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBackup());

      await expect(result.current.createBackup()).rejects.toThrow('Backup failed');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Backup failed');
      });

      expect(toast.error).toHaveBeenCalledWith('Error al crear backup: Backup failed');
    });
  });

  describe('listBackups', () => {
    it('should list backups successfully', async () => {
      (api.listBackups as jest.Mock).mockResolvedValue({ backups: mockBackups });

      const { result } = renderHook(() => useBackup());

      const data = await result.current.listBackups();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockBackups);
      expect(result.current.backups).toEqual(mockBackups);
      expect(api.listBackups).toHaveBeenCalled();
    });

    it('should handle errors when listing backups', async () => {
      const mockError = new Error('List failed');
      (api.listBackups as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBackup());

      const data = await result.current.listBackups();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('List failed');
      });

      expect(data).toEqual([]);
      expect(result.current.backups).toEqual([]);
    });

    it('should handle missing backups array in response', async () => {
      (api.listBackups as jest.Mock).mockResolvedValue({});

      const { result } = renderHook(() => useBackup());

      const data = await result.current.listBackups();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual([]);
      expect(result.current.backups).toEqual([]);
    });
  });

  describe('restoreBackup', () => {
    it('should restore backup successfully', async () => {
      const mockResult = {
        message: 'Backup restored successfully',
        filename: 'backup-2026-04-07-10-00-00.sql',
      };

      (api.restoreBackup as jest.Mock).mockResolvedValue(mockResult);

      const { result } = renderHook(() => useBackup());

      const data = await result.current.restoreBackup('backup-2026-04-07-10-00-00.sql');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockResult);
      expect(api.restoreBackup).toHaveBeenCalledWith('backup-2026-04-07-10-00-00.sql');
      expect(toast.success).toHaveBeenCalledWith('Backup restaurado exitosamente');
    });

    it('should handle errors when restoring backup', async () => {
      const mockError = new Error('Restore failed');
      (api.restoreBackup as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useBackup());

      await expect(result.current.restoreBackup('backup-2026-04-07-10-00-00.sql')).rejects.toThrow('Restore failed');

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Restore failed');
      });

      expect(toast.error).toHaveBeenCalledWith('Error al restaurar backup: Restore failed');
    });
  });

  describe('loading state', () => {
    it('should set loading to true while creating backup', async () => {
      (api.createBackup as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );
      (api.listBackups as jest.Mock).mockResolvedValue({ backups: [] });

      const { result } = renderHook(() => useBackup());

      result.current.createBackup();

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it('should set loading to true while listing backups', async () => {
      (api.listBackups as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ backups: [] }), 100))
      );

      const { result } = renderHook(() => useBackup());

      result.current.listBackups();

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it('should set loading to true while restoring backup', async () => {
      (api.restoreBackup as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      const { result } = renderHook(() => useBackup());

      result.current.restoreBackup('backup-2026-04-07-10-00-00.sql');

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });
  });

  describe('error clearing', () => {
    it('should clear error on successful operation', async () => {
      (api.listBackups as jest.Mock).mockRejectedValueOnce(new Error('First error'));
      (api.listBackups as jest.Mock).mockResolvedValueOnce({ backups: mockBackups });

      const { result } = renderHook(() => useBackup());

      await result.current.listBackups();

      await waitFor(() => {
        expect(result.current.error).toBe('First error');
      });

      await result.current.listBackups();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });
});
