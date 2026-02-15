import { useState } from 'react';
import { vehiculosMock } from '../data/vehiculos';

export const useVehiculos = () => {
  const [vehiculos] = useState(vehiculosMock);

  return { vehiculos };
};