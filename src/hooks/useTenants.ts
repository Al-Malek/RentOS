import { useState, useEffect } from 'react';
import { Tenant, TenantsMock } from '@/data/TenantsData';

export const useTenants = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('rentos_tenants');
    if (saved) {
      setTenants(JSON.parse(saved));
    } else {
      setTenants(TenantsMock);
      localStorage.setItem('rentos_tenants', JSON.stringify(TenantsMock));
    }
    setLoading(false);
  }, []);

  const saveToStorage = (nuevosTenants: Tenant[]) => {
    setTenants(nuevosTenants);
    localStorage.setItem('rentos_tenants', JSON.stringify(nuevosTenants));
  };

  const crearTenant = (tenant: Omit<Tenant, 'id' | 'vehiculosRegistrados' | 'ingresosGenerados'>) => {
    const nuevoTenant: Tenant = {
      ...tenant,
      id: `ten-${Date.now()}`,
      vehiculosRegistrados: 0,
      ingresosGenerados: 0
    };
    saveToStorage([...tenants, nuevoTenant]);
    return nuevoTenant;
  };

  const actualizarTenant = (id: string, cambios: Partial<Tenant>) => {
    const nuevosTenants = tenants.map(t => t.id === id ? { ...t, ...cambios } : t);
    saveToStorage(nuevosTenants);
  };

  const suspenderTenant = (id: string) => {
    actualizarTenant(id, { estado: 'suspendido' });
  };

  const activarTenant = (id: string) => {
    actualizarTenant(id, { estado: 'activo' });
  };

  const calcularMRR = (): number => {
    const precios = { basico: 49, pro: 99, enterprise: 199 };
    return tenants
      .filter(t => t.estado === 'activo')
      .reduce((total, t) => total + precios[t.plan], 0);
  };

  const obtenerEstadisticas = () => {
    const activos = tenants.filter(t => t.estado === 'activo').length;
    const suspendidos = tenants.filter(t => t.estado === 'suspendido').length;
    const prueba = tenants.filter(t => t.estado === 'prueba').length;
    const mrr = calcularMRR();
    
    // Calcular nuevos este mes
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const nuevosEsteMes = tenants.filter(t => new Date(t.fechaSuscripcion) >= inicioMes).length;

    return {
      total: tenants.length,
      activos,
      suspendidos,
      prueba,
      mrr,
      nuevosEsteMes
    };
  };

  return {
    tenants,
    loading,
    crearTenant,
    actualizarTenant,
    suspenderTenant,
    activarTenant,
    calcularMRR,
    obtenerEstadisticas
  };
};
