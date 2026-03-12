"use client";
import MainLayout from '@/components/MainLayout';
import { useDashboard } from '@/hooks/useDashboard';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DashboardPage() {
  const metricas = useDashboard();

  const estadoFlotaData = [
    { name: 'Disponibles', value: metricas.disponibles, color: '#00C851' },
    { name: 'Alquilados', value: metricas.alquilados, color: '#00E5FF' },
    { name: 'En Taller', value: metricas.enTaller, color: '#FF6D00' }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black italic uppercase mb-2">Dashboard Financiero</h1>
          <p className="text-gray-500">Métricas clave y análisis operativo</p>
        </div>

        {/* KPIs Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5FF]/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative">
              <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">💰 Ingresos del Mes</p>
              <p className="text-3xl font-black text-white mb-2">${metricas.ingresosMesActual.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold ${metricas.cambioIngresos >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {metricas.cambioIngresos >= 0 ? '↑' : '↓'} {Math.abs(metricas.cambioIngresos).toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500">vs mes anterior</span>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">🏍️ Estado de Flota</p>
            <p className="text-3xl font-black text-white mb-2">{metricas.flotaTotal}</p>
            <div className="flex gap-2 text-xs">
              <span className="text-green-400">{metricas.disponibles} disp.</span>
              <span className="text-orange-400">{metricas.enTaller} taller</span>
              <span className="text-cyan-400">{metricas.alquilados} rent.</span>
            </div>
          </Card>

          <Card>
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">📅 Reservas Activas Hoy</p>
            <p className="text-3xl font-black text-[#00E5FF] mb-2">{metricas.reservasActivasHoy}</p>
            <p className="text-xs text-gray-500">Vehículos en circulación</p>
          </Card>

          <Card>
            <p className="text-[10px] font-bold uppercase text-gray-500 mb-2">👥 Clientes Registrados</p>
            <p className="text-3xl font-black text-white mb-2">{metricas.clientesTotales}</p>
            <p className="text-xs text-gray-500">Base de datos activa</p>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos por Semana */}
          <Card>
            <h3 className="text-sm font-black uppercase mb-4 text-[#00E5FF]">Ingresos por Semana (Últimas 8)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metricas.ingresosPorSemana}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="semana" stroke="#8B8FA8" style={{ fontSize: '12px' }} />
                <YAxis stroke="#8B8FA8" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #00E5FF', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="ingresos" fill="#00E5FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Distribución de Flota */}
          <Card>
            <h3 className="text-sm font-black uppercase mb-4 text-[#00E5FF]">Distribución de Estado de Flota</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={estadoFlotaData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {estadoFlotaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #00E5FF', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Tasa de Ocupación</p>
              <p className="text-2xl font-black text-[#00E5FF]">{metricas.tasaOcupacion.toFixed(1)}%</p>
            </div>
          </Card>
        </div>

        {/* Top Vehicles and Recent Reservations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Vehículos */}
          <Card>
            <h3 className="text-sm font-black uppercase mb-4 text-[#00E5FF]">Top 5 Vehículos Más Rentados</h3>
            <div className="space-y-3">
              {metricas.topVehiculos.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img src={item.vehiculo?.foto} alt={item.vehiculo?.modelo} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{item.vehiculo?.modelo}</p>
                    <p className="text-xs text-gray-500">{item.vehiculo?.placa}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#00E5FF]">{item.alquileres}</p>
                    <p className="text-[9px] text-gray-500 uppercase">alquileres</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Últimas Reservas */}
          <Card>
            <h3 className="text-sm font-black uppercase mb-4 text-[#00E5FF]">Últimas 5 Reservas</h3>
            <div className="space-y-3">
              {metricas.ultimasReservas.map((reserva) => (
                <div key={reserva.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-bold text-sm">{reserva.cliente}</p>
                    <p className="text-xs text-gray-500">{reserva.fechaInicio} → {reserva.fechaFin}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      reserva.estado === 'confirmada' ? 'info' :
                      reserva.estado === 'finalizada' ? 'success' : 'danger'
                    }>
                      {reserva.estado}
                    </Badge>
                    <p className="text-xs font-bold text-white mt-1">${reserva.totalFinal}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
