import { useState, useEffect } from 'react';
import { ReglaTarifa, TarifasMock } from '@/data/TarifasData';
import { api } from '@/lib/api';

export const useTarifas = () => {
  const [tarifas, setTarifas] = useState<ReglaTarifa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTarifas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getTarifas();
      setTarifas(data);
    } catch (err: any) {
      console.error('Error loading tarifas:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('rentos_tarifas');
      if (saved) {
        setTarifas(JSON.parse(saved));
      } else {
        setTarifas(TarifasMock);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTarifas();
  }, []);

  const crearTarifa = async (tarifa: Omit<ReglaTarifa, 'id'>) => {
    try {
      const nuevaTarifa = await api.createTarifa(tarifa);
      setTarifas([...tarifas, nuevaTarifa]);
      return nuevaTarifa;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const actualizarTarifa = async (id: string, cambios: Partial<ReglaTarifa>) => {
    try {
      const updated = await api.updateTarifa(id, cambios);
      setTarifas(tarifas.map(t => t.id === id ? updated : t));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const eliminarTarifa = async (id: string) => {
    try {
      await api.deleteTarifa(id);
      setTarifas(tarifas.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const calcularPrecioFinal = async (precioBase: number, fechaInicio: string, fechaFin: string, vehiculoId?: number): Promise<number> => {
    try {
      const result = await api.calcularPrecio({ precioBase, fechaInicio, fechaFin, vehiculoId });
      return result.precioFinal;
    } catch (err: any) {
      // Fallback to local calculation
      let precioFinal = precioBase;
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      const dias = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));

      tarifas.filter(t => t.activa).forEach(tarifa => {
        if (tarifa.vehiculosAplicables !== 'todos' && vehiculoId && !tarifa.vehiculosAplicables.includes(vehiculoId)) {
          return;
        }

        if (tarifa.tipo === 'descuento_largo' && dias >= 7) {
          precioFinal = precioFinal * (1 + tarifa.porcentaje / 100);
        } else if (tarifa.tipo === 'fin_semana') {
          const esFinde = inicio.getDay() === 6 || inicio.getDay() === 0 || fin.getDay() === 6 || fin.getDay() === 0;
          if (esFinde) {
            precioFinal = precioFinal * (1 + tarifa.porcentaje / 100);
          }
        } else if (tarifa.tipo === 'temporada_alta' && tarifa.fechaInicio && tarifa.fechaFin) {
          const inicioTemp = new Date(tarifa.fechaInicio);
          const finTemp = new Date(tarifa.fechaFin);
          if (inicio <= finTemp && fin >= inicioTemp) {
            precioFinal = precioFinal * (1 + tarifa.porcentaje / 100);
          }
        }
      });

      return Math.round(precioFinal * dias);
    }
  };

  return {
    tarifas,
    loading,
    error,
    crearTarifa,
    actualizarTarifa,
    eliminarTarifa,
    calcularPrecioFinal,
    refresh: loadTarifas
  };
};
