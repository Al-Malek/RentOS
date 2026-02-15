"use client";
import { useState, useEffect } from "react";
import { Vehiculo } from "@/data/HU1_VehiculosData";

interface Props {
  vehiculo?: Vehiculo | null; 
  onSave: (v: Vehiculo) => void;
  onCancel: () => void;
}

export const HU1_VehiculoForm = ({ vehiculo, onSave, onCancel }: Props) => {
  const [formData, setFormData] = useState<Vehiculo>({
    id: 0,
    modelo: "",
    placa: "",
    estado: "available",
    kilometraje: "0 km",
    foto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80" // Foto por defecto
  });

  useEffect(() => {
    if (vehiculo) setFormData(vehiculo);
  }, [vehiculo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1E1E1E] p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">
          {vehiculo ? "Editar Vehículo" : "Nuevo Vehículo"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">Modelo</label>
            <input name="modelo" value={formData.modelo} onChange={handleChange} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700 focus:border-[#00E5FF] outline-none" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs mb-1">Placa (Única)</label>
              <input name="placa" value={formData.placa} onChange={handleChange} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" required disabled={!!vehiculo} />
            </div>
            <div>
              <label className="block text-gray-400 text-xs mb-1">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700">
                <option value="available">Disponible</option>
                <option value="maintenance">En Taller</option>
                <option value="rented">Alquilado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">Kilometraje</label>
            <input name="kilometraje" value={formData.kilometraje} onChange={handleChange} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" required />
          </div>

          <div>
            <label className="block text-gray-400 text-xs mb-1">URL Foto (Simulación Multi-imagen)</label>
            <input name="foto" value={formData.foto} onChange={handleChange} className="w-full bg-gray-800 text-white rounded p-2 text-sm border border-gray-700" />
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-700 text-white py-2 rounded font-bold hover:bg-gray-600">Cancelar</button>
            <button type="submit" className="flex-1 bg-[#00E5FF] text-black py-2 rounded font-bold hover:bg-cyan-300">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};