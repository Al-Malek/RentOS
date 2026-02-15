"use client";
import { useState, useEffect } from "react";
import { Vehiculo } from "@/data/HU1_VehiculosData";
import { useConfig } from "@/context/ConfigContext";

interface Props {
  vehiculo?: Vehiculo | null; 
  onSave: (v: Vehiculo) => void;
  onCancel: () => void;
  onDelete?: (id: number) => void; 
}

export const HU1_VehiculoForm = ({ vehiculo, onSave, onCancel, onDelete }: Props) => {
  const { highContrast } = useConfig();
  const [formData, setFormData] = useState<Vehiculo>({
    id: 0,
    modelo: "",
    placa: "",
    estado: "available",
    kilometraje: "0 km",
    foto: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80"
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className={`${highContrast ? 'bg-white text-black' : 'bg-[#1E1E1E] text-white'} p-8 rounded-2xl w-full max-w-md shadow-2xl border ${highContrast ? 'border-gray-300' : 'border-gray-800'}`}>
        <h2 className="text-2xl font-black mb-6 uppercase tracking-tight italic">
          {vehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Modelo de Moto</label>
            <input name="modelo" value={formData.modelo} onChange={handleChange} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-sm focus:border-[#00E5FF] outline-none transition" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Placa</label>
              <input name="placa" value={formData.placa} onChange={handleChange} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-sm focus:border-[#00E5FF] outline-none transition" required />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-sm focus:border-[#00E5FF] outline-none transition">
                <option value="available">Disponible</option>
                <option value="maintenance">Mantenimiento</option>
                <option value="rented">Alquilado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-500 text-[10px] font-bold uppercase mb-1">Kilometraje Actual</label>
            <input name="kilometraje" value={formData.kilometraje} onChange={handleChange} className="w-full bg-black/20 border border-gray-700 rounded-lg p-3 text-sm focus:border-[#00E5FF] outline-none transition" required />
          </div>

          <div className="pt-4 space-y-3">
            <button type="submit" className="w-full bg-[#00E5FF] text-black py-3 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-cyan-300 transition shadow-lg">
              Guardar Cambios
            </button>
            
            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-bold text-xs hover:bg-gray-700 transition">
                Cancelar
              </button>
              
              {vehiculo && (
                <button 
                  type="button" 
                  onClick={() => {
                    if(confirm("¿Estás seguro de eliminar este vehículo? Esta acción no se puede deshacer.")) {
                      onDelete?.(vehiculo.id);
                    }
                  }} 
                  className="flex-1 bg-red-600/20 text-red-500 border border-red-600/50 py-3 rounded-xl font-bold text-xs hover:bg-red-600 hover:text-white transition"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};