import { renderHook, act, waitFor } from '@testing-library/react';
import { useTenants } from '@/hooks/useTenants';

describe('useTenants', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates unique tenant IDs', async () => {
    const { result } = renderHook(() => useTenants());

    await waitFor(() => expect(result.current.loading).toBe(false));

    let firstTenantId = '';
    let secondTenantId = '';

    act(() => {
      firstTenantId = result.current.createTenant({
        nombreAgencia: 'Tenant Uno',
        emailAdmin: 'uno@test.com',
        plan: 'basico',
        estado: 'activo',
        fechaSuscripcion: '2026-03-01',
        pais: 'Colombia',
        ciudad: 'Bogota',
      }).tenantId;

      secondTenantId = result.current.createTenant({
        nombreAgencia: 'Tenant Dos',
        emailAdmin: 'dos@test.com',
        plan: 'basico',
        estado: 'activo',
        fechaSuscripcion: '2026-03-01',
        pais: 'Colombia',
        ciudad: 'Medellin',
      }).tenantId;
    });

    expect(firstTenantId).not.toBe(secondTenantId);
    expect(firstTenantId).toContain('TEN-');
  });

  it('toggles tenant status between active and suspended', async () => {
    const { result } = renderHook(() => useTenants());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const target = result.current.tenants.find((tenant) => tenant.estado === 'activo');
    expect(target).toBeTruthy();

    act(() => {
      result.current.toggleTenantStatus(target!.id);
    });

    expect(result.current.tenants.find((tenant) => tenant.id === target!.id)?.estado).toBe('suspendido');
  });

  it('validates fleet limit per tenant plan', async () => {
    const { result } = renderHook(() => useTenants());

    await waitFor(() => expect(result.current.loading).toBe(false));

    const basicoOverLimit = result.current.tenants.find((tenant) => tenant.plan === 'basico' && tenant.vehiculosRegistrados > tenant.limiteVehiculos);
    expect(basicoOverLimit).toBeTruthy();

    const validation = result.current.canAddVehicleToTenant(basicoOverLimit!.id);
    expect(validation.allowed).toBe(false);
    expect(validation.reason).toContain('Límite');
  });
});
