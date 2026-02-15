import { useState } from 'react';
import { HU1_VehiculosMock, Vehiculo } from '@/data/HU1_VehiculosData';

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(HU1_VehiculosMock);

  const agregarVehiculo = (nuevoVehiculo: Vehiculo) => {
    const existe = vehiculos.some((v) => v.placa.toUpperCase() === nuevoVehiculo.placa.toUpperCase());
    
    if (existe) {
      alert(`Error: La placa ${nuevoVehiculo.placa} ya existe en la flota.`);
      return false; 
    }

    setVehiculos([...vehiculos, { ...nuevoVehiculo, id: Date.now() }]); 
    return true; 
  };

  const editarVehiculo = (vehiculoActualizado: Vehiculo) => {
    setVehiculos((prev) => 
      prev.map((v) => (v.id === vehiculoActualizado.id ? vehiculoActualizado : v))
    );
  };

  const eliminarVehiculo = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      setVehiculos((prev) => prev.filter((v) => v.id !== id));
    }
  };

  return { vehiculos, agregarVehiculo, editarVehiculo, eliminarVehiculo };
};