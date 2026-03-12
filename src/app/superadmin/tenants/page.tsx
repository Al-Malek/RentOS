"use client";
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { useTenants } from '@/hooks/useTenants';
import { Tenant } from '@/data/TenantsData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import toast from 'react-hot-toast';

export default function TenantsPage() {
  const { tenants, crearTenant, suspenderTenant, activarTenant, obtenerEstadisticas } = useTenants();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formData, setFormData] = useState({
    nombreAgencia: '',
    emailAdmin: '',
    plan: 'basico' as 'basico' | 'pro' | 'enterprise',
    estado: 'prueba' as 'activo' | 'suspendido' | 'prueba',
    fechaSuscripcion: new Date().toISOString().split('T')[0],
    pais: 'Colombia',
    ciudad: ''
  });

  const stats = obtenerEstadisticas();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    crearTenant(formData);
    toast.success('Tenant creado exitosamente');
    setMostrarModal(false);
    setFormData({
      nombreAgencia: '',
      emailAdmin: '',
      plan: 'basico',
      estado: 'prueba',
      fechaSuscripcion: new Date().toISOString().split('T')[0],
      pais: 'Colombia',
      ciudad: ''
    });
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'basico': return 'bg-gray-500/20 text-gray-400';
      case 'pro': return 'bg-blue-500/20 text-blue-400';
      case 'enterprise': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPlanPrecio = (plan: string) => {
    switch (plan) {
      case 'basico': return 49;
      case 'pro': return 99;
      case 'enterprise': return 199;
      default: return 0;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black italic uppercase">🌐 Gestión de Tenants</h1>
            <p className="text-gray-500">Panel de Super Admin - RentOS</p>
          </div>
          <Button onClick={() => setMostrarModal(true)}>
            + Nueva Agencia
          </Button>
        </div>

        {/* Métricas Globales */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Agencias</p>
            <p className="text-3xl font-black text-white">{stats.total}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Activas</p>
            <p className="text-3xl font-black text-green-400">{stats.activos}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">En Prueba</p>
            <p className="text-3xl font-black text-orange-400">{stats.prueba}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">MRR Total</p>
            <p className="text-3xl font-black text-[#00E5FF]">${stats.mrr}</p>
          </Card>
          <Card>
            <p className="text-xs text-gray-500 uppercase font-bold mb-2">Nuevas Este Mes</p>
            <p className="text-3xl font-black text-white">{stats.nuevosEsteMes}</p>
          </Card>
        </div>

        {/* Tabla de Tenants */}
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
          <Table caption="Lista de agencias suscritas">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Agencia</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Suscripción</TableHead>
                <TableHead>Vehículos</TableHead>
                <TableHead>Ingresos RentOS</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {tenant.logo ? (
                        <img src={tenant.logo} alt={tenant.nombreAgencia} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] font-black text-xs">
                          {tenant.nombreAgencia.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold">{tenant.nombreAgencia}</p>
                        <p className="text-xs text-gray-500">{tenant.emailAdmin}</p>
                        <p className="text-xs text-gray-600">{tenant.ciudad}, {tenant.pais}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getPlanColor(tenant.plan)}`}>
                      {tenant.plan}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">${getPlanPrecio(tenant.plan)}/mes</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      tenant.estado === 'activo' ? 'success' :
                      tenant.estado === 'prueba' ? 'warning' : 'danger'
                    }>
                      {tenant.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {new Date(tenant.fechaSuscripcion).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-lg font-black text-[#00E5FF]">{tenant.vehiculosRegistrados}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-bold">${tenant.ingresosGenerados.toLocaleString()}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {tenant.estado === 'activo' ? (
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => {
                            if (confirm(`¿Suspender ${tenant.nombreAgencia}?`)) {
                              suspenderTenant(tenant.id);
                              toast.success('Tenant suspendido');
                            }
                          }}
                        >
                          Suspender
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            activarTenant(tenant.id);
                            toast.success('Tenant activado');
                          }}
                        >
                          Activar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Modal Nuevo Tenant */}
        <Modal isOpen={mostrarModal} onClose={() => setMostrarModal(false)} title="➕ Nueva Agencia" size="lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre de la Agencia"
                value={formData.nombreAgencia}
                onChange={(e) => setFormData({ ...formData, nombreAgencia: e.target.value })}
                required
              />
              <Input
                label="Email del Administrador"
                type="email"
                value={formData.emailAdmin}
                onChange={(e) => setFormData({ ...formData, emailAdmin: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Plan</label>
                <select
                  className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-2.5 text-sm text-white"
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value as any })}
                >
                  <option value="basico">Básico ($49/mes)</option>
                  <option value="pro">Pro ($99/mes)</option>
                  <option value="enterprise">Enterprise ($199/mes)</option>
                </select>
              </div>
              <Input
                label="País"
                value={formData.pais}
                onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                required
              />
              <Input
                label="Ciudad"
                value={formData.ciudad}
                onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setMostrarModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">Crear Tenant</Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}
