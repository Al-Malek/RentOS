"use client";
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/Card';

export default function ReportesPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black italic uppercase mb-2">Reportes</h1>
          <p className="text-gray-500">Análisis y reportes del sistema</p>
        </div>

        <Card>
          <p className="text-gray-400">Módulo de reportes en desarrollo...</p>
        </Card>
      </div>
    </MainLayout>
  );
}
