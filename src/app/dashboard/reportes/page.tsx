"use client";
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { useReports } from '@/hooks/useReports';
import { useConfig } from '@/context/ConfigContext';

type ReportType = 'ingresos' | 'vehiculos' | 'clientes' | 'ocupacion';

export default function ReportesPage() {
  const { t } = useConfig();
  const { loading, error, getIngresosReport, getVehiculosReport, getClientesReport, getOcupacionReport } = useReports();
  
  const [activeReport, setActiveReport] = useState<ReportType>('ingresos');
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    vehiculoId: undefined as number | undefined,
  });

  const [ingresosData, setIngresosData] = useState<any>(null);
  const [vehiculosData, setVehiculosData] = useState<any>(null);
  const [clientesData, setClientesData] = useState<any>(null);
  const [ocupacionData, setOcupacionData] = useState<any>(null);

  useEffect(() => {
    loadReportData();
  }, [activeReport, filters]);

  const loadReportData = async () => {
    switch (activeReport) {
      case 'ingresos':
        const ingresos = await getIngresosReport(filters);
        setIngresosData(ingresos);
        break;
      case 'vehiculos':
        const vehiculos = await getVehiculosReport();
        setVehiculosData(vehiculos);
        break;
      case 'clientes':
        const clientes = await getClientesReport();
        setClientesData(clientes);
        break;
      case 'ocupacion':
        const ocupacion = await getOcupacionReport({
          startDate: filters.startDate,
          endDate: filters.endDate,
        });
        setOcupacionData(ocupacion);
        break;
    }
  };

  const reportTabs = [
    { id: 'ingresos' as ReportType, label: 'Ingresos', icon: '💰' },
    { id: 'vehiculos' as ReportType, label: 'Vehículos', icon: '🏍️' },
    { id: 'clientes' as ReportType, label: 'Clientes', icon: '👥' },
    { id: 'ocupacion' as ReportType, label: 'Ocupación', icon: '📊' },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase mb-2">Reportes Empresariales</h1>
          <p className="text-gray-500">Análisis detallado de ingresos, vehículos, clientes y ocupación</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {reportTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all whitespace-nowrap ${
                activeReport === tab.id
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {(activeReport === 'ingresos' || activeReport === 'ocupacion') && (
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Fecha Inicial"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
              <Input
                label="Fecha Final"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
              <div className="flex items-end">
                <Button onClick={loadReportData} className="w-full">
                  Actualizar Reporte
                </Button>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <Card>
            <div className="text-red-400 text-sm">Error: {error}</div>
          </Card>
        )}

        {loading && (
          <Card>
            <div className="text-center text-gray-500">Cargando reporte...</div>
          </Card>
        )}

        {!loading && activeReport === 'ingresos' && ingresosData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Ingresos</p>
                <p className="text-3xl font-black text-[#00E5FF]">
                  ${ingresosData.totalIngresos?.toLocaleString() || 0}
                </p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Reservas</p>
                <p className="text-3xl font-black text-white">{ingresosData.totalReservas || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Promedio por Reserva</p>
                <p className="text-3xl font-black text-white">
                  ${ingresosData.promedioIngreso?.toLocaleString() || 0}
                </p>
              </Card>
            </div>

            <Card>
              <h2 className="text-sm font-black uppercase mb-4 text-[#00E5FF]">Ingresos por Mes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {ingresosData.ingresosPorMes?.map((item: any) => (
                  <div key={item.mes} className="rounded-lg bg-white/5 p-4 border border-white/10">
                    <p className="text-xs uppercase text-gray-500 font-bold">{item.mes}</p>
                    <p className="text-2xl font-black text-[#00E5FF]">${item.ingresos.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{item.reservas} reservas</p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {!loading && activeReport === 'vehiculos' && vehiculosData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Vehículos</p>
                <p className="text-3xl font-black text-white">{vehiculosData.totalVehiculos || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Disponibles</p>
                <p className="text-3xl font-black text-green-400">{vehiculosData.disponibles || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Rentados</p>
                <p className="text-3xl font-black text-[#00E5FF]">{vehiculosData.rentados || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">En Mantenimiento</p>
                <p className="text-3xl font-black text-yellow-400">{vehiculosData.enMantenimiento || 0}</p>
              </Card>
            </div>

            <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
              <Table caption="Estadísticas por vehículo">
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Vehículo</TableHead>
                    <TableHead>Total Reservas</TableHead>
                    <TableHead>Reservas Activas</TableHead>
                    <TableHead>Total Ingresos</TableHead>
                    <TableHead>Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehiculosData.vehiculos?.map((v: any) => (
                    <TableRow key={v.id}>
                      <TableCell>
                        <p className="font-bold">{v.marca} {v.modelo}</p>
                      </TableCell>
                      <TableCell>{v.estadisticas.totalReservas}</TableCell>
                      <TableCell className="text-[#00E5FF] font-bold">
                        {v.estadisticas.reservasActivas}
                      </TableCell>
                      <TableCell className="font-black text-[#00E5FF]">
                        ${v.estadisticas.totalIngresos.toLocaleString()}
                      </TableCell>
                      <TableCell>${v.estadisticas.promedioIngreso.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && activeReport === 'clientes' && clientesData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Clientes</p>
                <p className="text-3xl font-black text-white">{clientesData.totalClientes || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Top Clientes</p>
                <p className="text-3xl font-black text-[#00E5FF]">{clientesData.topClientes?.length || 0}</p>
              </Card>
            </div>

            <div className="bg-[#1E1E1E] border border-gray-800 rounded-xl overflow-hidden">
              <Table caption="Top clientes por ingresos">
                <TableHeader>
                  <TableRow hover={false}>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Total Reservas</TableHead>
                    <TableHead>Total Gastado</TableHead>
                    <TableHead>Promedio</TableHead>
                    <TableHead>Cancelaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesData.topClientes?.map((c: any) => (
                    <TableRow key={c.id}>
                      <TableCell>
                        <p className="font-bold">{c.nombre}</p>
                        <p className="text-xs text-gray-500">{c.id}</p>
                      </TableCell>
                      <TableCell>{c.estadisticas.totalReservas}</TableCell>
                      <TableCell className="font-black text-[#00E5FF]">
                        ${c.estadisticas.totalGastado.toLocaleString()}
                      </TableCell>
                      <TableCell>${c.estadisticas.promedioGasto.toLocaleString()}</TableCell>
                      <TableCell className={c.estadisticas.cancelaciones > 0 ? 'text-red-400' : ''}>
                        {c.estadisticas.cancelaciones}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {!loading && activeReport === 'ocupacion' && ocupacionData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Tasa de Ocupación</p>
                <p className="text-3xl font-black text-[#00E5FF]">
                  {ocupacionData.tasaOcupacion?.toFixed(1) || 0}%
                </p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Días Ocupados</p>
                <p className="text-3xl font-black text-green-400">{ocupacionData.diasOcupados || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Días Disponibles</p>
                <p className="text-3xl font-black text-white">{ocupacionData.diasDisponibles || 0}</p>
              </Card>
              <Card>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Total Reservas</p>
                <p className="text-3xl font-black text-white">{ocupacionData.reservasTotales || 0}</p>
              </Card>
            </div>

            <Card>
              <h2 className="text-sm font-black uppercase mb-4 text-[#00E5FF]">Análisis de Ocupación</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold">Ocupación</span>
                      <span className="text-sm font-bold text-[#00E5FF]">
                        {ocupacionData.tasaOcupacion?.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-[#00E5FF] h-full rounded-full transition-all"
                        style={{ width: `${ocupacionData.tasaOcupacion || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Vehículos Totales</p>
                    <p className="text-2xl font-black">{ocupacionData.vehiculosTotales || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">Reservas Totales</p>
                    <p className="text-2xl font-black">{ocupacionData.reservasTotales || 0}</p>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
