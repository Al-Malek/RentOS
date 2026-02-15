export interface TarifaExtra {
  id: string;
  nombre: string;
  precio: number; 
  esPorDia: boolean; 
}

export interface Reserva {
  id: string;
  vehiculoId: number;
  cliente: string;
  documento: string;
  fechaInicio: string;
  fechaFin: string;
  desglose: {
    dias: number;
    precioDia: number;
    totalExtras: number;
  };
  totalFinal: number;
  estado: 'confirmada' | 'finalizada' | 'cancelada';
}

export const TarifasIniciales: TarifaExtra[] = [
  { id: '1', nombre: 'Seguro Básico', precio: 10, esPorDia: true },
  { id: '2', nombre: 'Lavado Post-Renta', precio: 15, esPorDia: false },
];

export const ReservasMock: Reserva[] = [
  {
    id: 'res-001',
    vehiculoId: 1, 
    cliente: 'Juan Perez',
    documento: '12345678',
    fechaInicio: '2026-03-10',
    fechaFin: '2026-03-15',
    desglose: { dias: 5, precioDia: 50, totalExtras: 50 },
    totalFinal: 300,
    estado: 'confirmada'
  }
];