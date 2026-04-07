import { useState, useEffect } from 'react';
import { Cliente, ClientesMock } from '@/data/ClientesData';
import { ClienteInput, normalizeCliente, validateClienteInput } from '@/hooks/clientes.utils';
import { api } from '@/lib/api';

export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getClientes();
      setClientes(data.map(normalizeCliente));
    } catch (err: any) {
      console.error('Error loading clientes:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('rentos_clientes');
      if (saved) {
        const parsed = JSON.parse(saved) as Cliente[];
        setClientes(parsed.map(normalizeCliente));
      } else {
        setClientes(ClientesMock.map(normalizeCliente));
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes();
  }, []);

  const crearCliente = async (cliente: ClienteInput) => {
    try {
      // Validar documento duplicado
      if (clientes.some(c => c.numeroDocumento === cliente.numeroDocumento)) {
        throw new Error('Ya existe un cliente con este número de documento');
      }

      validateClienteInput(cliente);

      const nuevoCliente = await api.createCliente(cliente);
      setClientes([...clientes, normalizeCliente(nuevoCliente)]);
      return nuevoCliente;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const actualizarCliente = async (id: string, cambios: Partial<Cliente>) => {
    try {
      const updated = await api.updateCliente(id, cambios);
      setClientes(clientes.map(c => c.id === id ? normalizeCliente(updated) : c));
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const eliminarCliente = async (id: string) => {
    try {
      await api.deleteCliente(id);
      setClientes(clientes.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const buscarClientes = async (query: string): Promise<Cliente[]> => {
    try {
      const results = await api.searchClientes(query);
      return results.map(normalizeCliente);
    } catch (err: any) {
      // Fallback to local search
      const q = query.toLowerCase();
      return clientes.filter(c =>
        c.nombre.toLowerCase().includes(q) ||
        c.numeroDocumento.includes(q) ||
        c.telefono.includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
  };

  const calcularScore = (reservasTotales: number, cancelaciones: number): number => {
    const score = 100 - (cancelaciones * 10) + (Math.min(reservasTotales, 10) * 5);
    return Math.max(0, Math.min(100, score));
  };

  return {
    clientes,
    loading,
    error,
    crearCliente,
    actualizarCliente,
    eliminarCliente,
    buscarClientes,
    calcularScore,
    refresh: loadClientes
  };
};
