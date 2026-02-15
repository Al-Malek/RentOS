"use client";
import React, { createContext, useContext, useState } from 'react';

const dictionary = {
  es: {
    nav: { vehiculos: 'Vehículos', reservas: 'Reservas', clientes: 'Clientes', reportes: 'Reportes', taller: 'Taller', tarifas: 'Tarifas' },
    header: { search: 'Buscar placa...', ticket: 'ABRIR NUEVO TICKET' },
    home: { title: 'Gestión de Flota', subtitle: 'Administración y control de inventario' },
    card: { km: 'Kilometraje', maint: 'Mantenimiento', btn_details: 'Detalles' },
    status: { available: 'Disponible', maintenance: 'En Taller', rented: 'Alquilado' },
    a11y: { dark: 'Modo Oscuro 🌙', light: 'Modo Claro ☀️' }
  },
  en: {
    nav: { vehiculos: 'Vehicles', reservas: 'Bookings', clientes: 'Clients', reportes: 'Reports', taller: 'Workshop', tarifas: 'Rates' },
    header: { search: 'Search plate...', ticket: 'OPEN NEW TICKET' },
    home: { title: 'Fleet Management', subtitle: 'Inventory control and administration' },
    card: { km: 'Mileage', maint: 'Maintenance', btn_details: 'Details' },
    status: { available: 'Available', maintenance: 'In Shop', rented: 'Rented' },
    a11y: { dark: 'Dark Mode 🌙', light: 'Light Mode ☀️' }
  }
};

const ConfigContext = createContext<any>(null);

export const ConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<'es' | 'en'>('es');
  const [highContrast, setHighContrast] = useState(false);

  const t = (section: string, key: string) => {
    // @ts-ignore
    return dictionary[lang][section]?.[key] || key;
  };

  return (
    <ConfigContext.Provider value={{ 
      lang, 
      highContrast, 
      t,
      toggleLang: () => setLang(l => l === 'es' ? 'en' : 'es'),
      toggleContrast: () => setHighContrast(c => !c)
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => useContext(ConfigContext);