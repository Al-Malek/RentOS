import { renderHook, waitFor } from '@testing-library/react';
import { useAudit } from '../useAudit';
import { api } from '@/lib/api';

jest.mock('@/lib/api');

describe('useAudit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockLogs = [
    {
      id: '1',
      userId: 'user-1',
      action: 'CREATE_VEHICULO',
      entity: 'vehiculo',
      entityId: '1',
      oldValue: null,
      newValue: { marca: 'Yamaha', modelo: 'MT-03' },
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      createdAt: '2026-04-07T10:00:00Z',
      tenantId: 'tenant-1',
    },
    {
      id: '2',
      userId: 'user-1',
      action: 'UPDATE_VEHICULO',
      entity: 'vehiculo',
      entityId: '1',
      oldValue: { estado: 'disponible' },
      newValue: { estado: 'rentado' },
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      createdAt: '2026-04-07T11:00:00Z',
      tenantId: 'tenant-1',
    },
  ];

  describe('loadLogs', () => {
    it('should load audit logs on mount', async () => {
      (api.getAuditLogs as jest.Mock).mockResolvedValue(mockLogs);

      const { result } = renderHook(() => useAudit());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.logs).toEqual(mockLogs);
      expect(api.getAuditLogs).toHaveBeenCalledWith(undefined);
    });

    it('should load logs with filters', async () => {
      (api.getAuditLogs as jest.Mock).mockResolvedValue([mockLogs[0]]);

      const filters = {
        entity: 'vehiculo',
        action: 'CREATE',
        userId: 'user-1',
      };

      const { result } = renderHook(() => useAudit(filters));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(api.getAuditLogs).toHaveBeenCalledWith(filters);
    });

    it('should handle errors when loading logs', async () => {
      const mockError = new Error('Network error');
      (api.getAuditLogs as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAudit());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Network error');
      });

      expect(result.current.logs).toEqual([]);
    });
  });

  describe('refresh', () => {
    it('should reload logs when refresh is called', async () => {
      (api.getAuditLogs as jest.Mock).mockResolvedValue(mockLogs);

      const { result } = renderHook(() => useAudit());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      (api.getAuditLogs as jest.Mock).mockClear();
      (api.getAuditLogs as jest.Mock).mockResolvedValue([...mockLogs, { ...mockLogs[0], id: '3' }]);

      await result.current.refresh();

      await waitFor(() => {
        expect(result.current.logs).toHaveLength(3);
      });

      expect(api.getAuditLogs).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEntityLogs', () => {
    it('should fetch logs for specific entity', async () => {
      const entityLogs = [mockLogs[0], mockLogs[1]];
      (api.getAuditLogs as jest.Mock).mockResolvedValue([]);
      (api.getAuditByEntity as jest.Mock).mockResolvedValue(entityLogs);

      const { result } = renderHook(() => useAudit());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const data = await result.current.getEntityLogs('vehiculo', '1');

      expect(data).toEqual(entityLogs);
      expect(api.getAuditByEntity).toHaveBeenCalledWith('vehiculo', '1');
    });

    it('should handle errors when fetching entity logs', async () => {
      const mockError = new Error('API error');
      (api.getAuditLogs as jest.Mock).mockResolvedValue([]);
      (api.getAuditByEntity as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAudit());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const data = await result.current.getEntityLogs('vehiculo', '1');

      await waitFor(() => {
        expect(result.current.error).toBe('API error');
      });

      expect(data).toEqual([]);
    });
  });

  describe('filter changes', () => {
    it('should reload logs when filters change', async () => {
      (api.getAuditLogs as jest.Mock).mockResolvedValue(mockLogs);

      const { result, rerender } = renderHook(
        ({ filters }) => useAudit(filters),
        { initialProps: { filters: { entity: 'vehiculo' } } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(api.getAuditLogs).toHaveBeenCalledWith({ entity: 'vehiculo' });

      (api.getAuditLogs as jest.Mock).mockClear();
      (api.getAuditLogs as jest.Mock).mockResolvedValue([mockLogs[0]]);

      rerender({ filters: { entity: 'vehiculo', action: 'CREATE' } });

      await waitFor(() => {
        expect(api.getAuditLogs).toHaveBeenCalledWith({ entity: 'vehiculo', action: 'CREATE' });
      });
    });
  });

  describe('loading state', () => {
    it('should set loading to true while fetching', async () => {
      (api.getAuditLogs as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockLogs), 100))
      );

      const { result } = renderHook(() => useAudit());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });
});
