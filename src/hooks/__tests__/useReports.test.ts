import { renderHook, waitFor } from '@testing-library/react';
import { useReports } from '../useReports';
import { api } from '@/lib/api';

jest.mock('@/lib/api');

describe('useReports', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getIngresosReport', () => {
    it('should fetch ingresos report successfully', async () => {
      const mockData = {
        totalIngresos: 125000,
        totalReservas: 45,
        promedioIngreso: 2777.78,
        ingresosPorMes: [
          { mes: '2026-01', ingresos: 15000, reservas: 5 },
          { mes: '2026-02', ingresos: 18000, reservas: 6 },
        ],
        reservas: [],
      };

      (api.getReporteIngresos as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useReports());

      const data = await result.current.getIngresosReport({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockData);
      expect(api.getReporteIngresos).toHaveBeenCalledWith({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });
    });

    it('should handle errors when fetching ingresos report', async () => {
      const mockError = new Error('Network error');
      (api.getReporteIngresos as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useReports());

      const data = await result.current.getIngresosReport();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Network error');
      });

      expect(data).toBeNull();
    });
  });

  describe('getVehiculosReport', () => {
    it('should fetch vehiculos report successfully', async () => {
      const mockData = {
        totalVehiculos: 8,
        disponibles: 5,
        rentados: 2,
        enMantenimiento: 1,
        vehiculos: [
          {
            id: 1,
            marca: 'Yamaha',
            modelo: 'MT-03',
            estadisticas: {
              totalReservas: 12,
              totalIngresos: 5400,
              reservasActivas: 1,
              promedioIngreso: 450,
            },
          },
        ],
      };

      (api.getReporteVehiculos as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useReports());

      const data = await result.current.getVehiculosReport();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockData);
      expect(api.getReporteVehiculos).toHaveBeenCalled();
    });

    it('should handle errors when fetching vehiculos report', async () => {
      const mockError = new Error('API error');
      (api.getReporteVehiculos as jest.Mock).mockRejectedValue(mockError);

      const { result } = renderHook(() => useReports());

      const data = await result.current.getVehiculosReport();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('API error');
      });

      expect(data).toBeNull();
    });
  });

  describe('getClientesReport', () => {
    it('should fetch clientes report successfully', async () => {
      const mockData = {
        totalClientes: 25,
        clientes: [],
        topClientes: [
          {
            id: 'cli-1',
            nombre: 'Juan Pérez',
            estadisticas: {
              totalReservas: 8,
              totalGastado: 3600,
              cancelaciones: 0,
              promedioGasto: 450,
            },
          },
        ],
      };

      (api.getReporteClientes as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useReports());

      const data = await result.current.getClientesReport();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockData);
      expect(api.getReporteClientes).toHaveBeenCalled();
    });
  });

  describe('getOcupacionReport', () => {
    it('should fetch ocupacion report successfully', async () => {
      const mockData = {
        diasDisponibles: 240,
        diasOcupados: 156,
        tasaOcupacion: 65.0,
        vehiculosTotales: 8,
        reservasTotales: 45,
      };

      (api.getReporteOcupacion as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useReports());

      const data = await result.current.getOcupacionReport({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(data).toEqual(mockData);
      expect(api.getReporteOcupacion).toHaveBeenCalledWith({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });
    });
  });

  describe('loading and error states', () => {
    it('should set loading to true while fetching', async () => {
      (api.getReporteIngresos as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
      );

      const { result } = renderHook(() => useReports());

      result.current.getIngresosReport();

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it('should clear error on successful fetch', async () => {
      const mockData = { totalIngresos: 1000 };
      (api.getReporteIngresos as jest.Mock).mockResolvedValue(mockData);

      const { result } = renderHook(() => useReports());

      await result.current.getIngresosReport();

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });
});
