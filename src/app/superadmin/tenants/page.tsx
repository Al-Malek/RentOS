"use client";
import { useMemo, useState } from 'react';
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

const DEFAULT_LIMIT_BY_PLAN: Record<Tenant['plan'], number> = {
  basico: 10,
  pro: 50,
  enterprise: 9999,
};

type TenantFormData = {
  nombreAgencia: string;
  emailAdmin: string;
  plan: Tenant['plan'];
  estado: Tenant['estado'];
  fechaSuscripcion: string;
  pais: string;
  ciudad: string;
  limiteVehiculos: number;
};

const INITIAL_FORM: TenantFormData = {
  nombreAgencia: '',
  emailAdmin: '',
  plan: 'basico',
  estado: 'prueba',
  fechaSuscripcion: new Date().toISOString().split('T')[0],
  pais: 'Colombia',
  ciudad: '',
  limiteVehiculos: DEFAULT_LIMIT_BY_PLAN.basico,
};

export default function TenantsPage() {
  const {
    tenants,
    activeTenantId,
    createTenant,
    updateTenant,
    toggleTenantStatus,
    setActiveTenant,
    obtenerEstadisticas,
  } = useTenants();

  const [mostrarModal, setMostrarModal] = useState(false);
  const [editingTenantId, setEditingTenantId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TenantFormData>(INITIAL_FORM);

  const stats = obtenerEstadisticas();

  const selectedTenant = useMemo(
    () => tenants.find((tenant) => tenant.id === activeTenantId) ?? null,
    [activeTenantId, tenants],
  );

  const openCreate = () => {
    setEditingTenantId(null);
    setFormData(INITIAL_FORM);
    setMostrarModal(true);
  };

  const openEdit = (tenant: Tenant) => {
    setEditingTenantId(tenant.id);
    setFormData({
      nombreAgencia: tenant.nombreAgencia,
      emailAdmin: tenant.emailAdmin,
      plan: tenant.plan,
      estado: tenant.estado,
      fechaSuscripcion: tenant.fechaSuscripcion,
      pais: tenant.pais,
      ciudad: tenant.ciudad,
      limiteVehiculos: tenant.limiteVehiculos,
    });
    setMostrarModal(true);
  };

  const handlePlanChange = (plan: Tenant['plan']) => {
    setFormData((current) => ({
      ...current,
      plan,
      limiteVehiculos: current.limiteVehiculos === DEFAULT_LIMIT_BY_PLAN[current.plan]
        ? DEFAULT_LIMIT_BY_PLAN[plan]
        : current.limiteVehiculos,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingTenantId) {
      updateTenant(editingTenantId, {
        ...formData,
        limiteVehiculos: Number(formData.limiteVehiculos),
      });
      toast.success('Tenant actualizado exitosamente');
    } else {
      createTenant({
        ...formData,
        limiteVehiculos: Number(formData.limiteVehiculos),
      });
      toast.success('Tenant creado exitosamente');
    }

    setMostrarModal(false);
    setEditingTenantId(null);
    setFormData(INITIAL_FORM);
  };

  const getPlanColor = (plan: Tenant['plan']) => {
    switch (plan) {
      case 'basico':
        return 'bg-gray-500/20 text-gray-400';
      case 'pro':
        return 'bg-blue-500/20 text-blue-400';
      case 'enterprise':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPlanPrecio = (plan: Tenant['plan']) => {
    switch (plan) {
      case 'basico':
        return 49;
      case 'pro':
        return 99;
      case 'enterprise':
        return 199;
      default:
        return 0;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="text-3xl font-black italic uppercase">Gestion de Tenants</h1>
            <p className="text-gray-500">Panel de Super Admin - RentOS</p>
          </div>
          <Button onClick={openCreate}>+ Nueva Agencia</Button>
        </div>

        <Card>
          <p className="text-xs text-gray-500 uppercase font-bold mb-1">Tenant activo para operacion</p>
          <p className="text-lg font-black text-[#00E5FF]">
            {selectedTenant ? `${selectedTenant.nombreAgencia} (${selectedTenant.tenantId})` : 'No seleccionado'}
          </p>
          <p className="text-xs text-gray-500 mt-1">El limite de flota se valida usando este tenant al crear vehiculos.</p>
        </Card>

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

        <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
          <Table caption="Lista de agencias suscritas">
            <TableHeader>
              <TableRow hover={false}>
                <TableHead>Agencia</TableHead>
                <TableHead>Tenant ID</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Flota (Uso / Limite)</TableHead>
                <TableHead>Suscripcion</TableHead>
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
                    <p className="text-xs font-mono text-gray-300">{tenant.tenantId}</p>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getPlanColor(tenant.plan)}`}>
                      {tenant.plan}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">${getPlanPrecio(tenant.plan)}/mes</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={tenant.estado === 'activo' ? 'success' : tenant.estado === 'prueba' ? 'warning' : 'danger'}>
                      {tenant.estado}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-black text-[#00E5FF]">
                      {tenant.vehiculosRegistrados} / {tenant.limiteVehiculos >= 9999 ? 'Ilimitado' : tenant.limiteVehiculos}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {new Date(tenant.fechaSuscripcion).toLocaleDateString('es-CO', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={tenant.estado === 'suspendido' ? 'secondary' : 'danger'}
                        onClick={() => {
                          toggleTenantStatus(tenant.id);
                          toast.success(tenant.estado === 'suspendido' ? 'Tenant activado' : 'Tenant suspendido');
                        }}
                      >
                        {tenant.estado === 'suspendido' ? 'Activar' : 'Suspender'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openEdit(tenant)}>
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant={tenant.id === activeTenantId ? 'primary' : 'secondary'}
                        onClick={() => {
                          setActiveTenant(tenant.id);
                          toast.success(`${tenant.nombreAgencia} seleccionado`);
                        }}
                        aria-label={`Seleccionar tenant ${tenant.nombreAgencia}`}
                      >
                        {tenant.id === activeTenantId ? 'Activo' : 'Seleccionar'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Modal
          isOpen={mostrarModal}
          onClose={() => {
            setMostrarModal(false);
            setEditingTenantId(null);
            setFormData(INITIAL_FORM);
          }}
          title={editingTenantId ? 'Editar Agencia' : 'Nueva Agencia'}
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre de la Agencia"
                value={formData.nombreAgencia}
                onChange={(event) => setFormData({ ...formData, nombreAgencia: event.target.value })}
                required
              />
              <Input
                label="Email del Administrador"
                type="email"
                value={formData.emailAdmin}
                onChange={(event) => setFormData({ ...formData, emailAdmin: event.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="tenant-plan" className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Plan</label>
                <select
                  id="tenant-plan"
                  className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-2.5 text-sm text-white"
                  value={formData.plan}
                  onChange={(event) => handlePlanChange(event.target.value as Tenant['plan'])}
                >
                  <option value="basico">Basico ($49/mes)</option>
                  <option value="pro">Pro ($99/mes)</option>
                  <option value="enterprise">Enterprise ($199/mes)</option>
                </select>
              </div>

              <div>
                <label htmlFor="tenant-status" className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Estado</label>
                <select
                  id="tenant-status"
                  className="w-full bg-[#1A1A24] border border-gray-700 rounded-lg p-2.5 text-sm text-white"
                  value={formData.estado}
                  onChange={(event) => setFormData({ ...formData, estado: event.target.value as Tenant['estado'] })}
                >
                  <option value="activo">Activo</option>
                  <option value="prueba">Prueba</option>
                  <option value="suspendido">Suspendido</option>
                </select>
              </div>

              <Input
                label="Pais"
                value={formData.pais}
                onChange={(event) => setFormData({ ...formData, pais: event.target.value })}
                required
              />
              <Input
                label="Ciudad"
                value={formData.ciudad}
                onChange={(event) => setFormData({ ...formData, ciudad: event.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Limite maximo de vehiculos"
                type="number"
                value={String(formData.limiteVehiculos)}
                onChange={(event) => setFormData({ ...formData, limiteVehiculos: Number(event.target.value) })}
                min={1}
                required
              />
              <Input
                label="Fecha de suscripcion"
                type="date"
                value={formData.fechaSuscripcion}
                onChange={(event) => setFormData({ ...formData, fechaSuscripcion: event.target.value })}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setMostrarModal(false);
                  setEditingTenantId(null);
                  setFormData(INITIAL_FORM);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                {editingTenantId ? 'Guardar Cambios' : 'Crear Tenant'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </MainLayout>
  );
}
