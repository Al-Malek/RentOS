import { useState, useEffect } from 'react';
import { Vehiculo, HU1_VehiculosMock } from '@/data/HU1_VehiculosData';
import { api } from '@/lib/api';

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVehiculos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getVehiculos();
      setVehiculos(data);
    } catch (err: any) {
      console.error('Error loading vehiculos:', err);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem('rentos_flota');
      if (saved) {
        setVehiculos(JSON.parse(saved));
      } else {
        setVehiculos(HU1_VehiculosMock);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiculos();
  }, []);

  const createVehiculo = async (vehiculo: Omit<Vehiculo, 'id'>) => {
    try {
      const newVehiculo = await api.createVehiculo(vehiculo);
      setVehiculos([...vehiculos, newVehiculo]);
      return newVehiculo;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateVehiculo = async (id: number, data: Partial<Vehiculo>) => {
    try {
      const updated = await api.updateVehiculo(id, data);
      setVehiculos(vehiculos.map(v => v.id === id ? updated : v));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteVehiculo = async (id: number) => {
    try {
      await api.deleteVehiculo(id);
      setVehiculos(vehiculos.filter(v => v.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return { 
    vehiculos, 
    loading, 
    error,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    refresh: loadVehiculos
  };
};