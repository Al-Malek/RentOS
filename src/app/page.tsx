import { vehiculosMock } from '../data/vehiculos';
export default function GestionVehiculos() {
  return (
    <main className="min-h-screen bg-[#121212] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header inspirado en Figma */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#00E5FF]">MIS VEHICULOS</h1>
          <button className="bg-[#00E5FF] text-black font-bold py-2 px-6 rounded-full hover:bg-cyan-400 transition">
            + AGREGAR NUEVO VEHICULO
          </button>
        </div>

        {/* Tabla Desktop [cite: 211] */}
        <div className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <table className="w-full text-left">
            <thead className="bg-[#252525] text-gray-400 uppercase text-sm">
              <tr>
                <th className="p-4">Foto</th>
                <th className="p-4">Modelo</th>
                <th className="p-4">Placa</th>
                <th className="p-4">Kilometraje</th>
                <th className="p-4 text-center">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {vehiculosMock.map((moto) => (
                <tr key={moto.id} className="hover:bg-[#2A2A2A] transition">
                  <td className="p-4">
                    <img src={moto.foto} alt={moto.modelo} className="w-20 h-12 object-cover rounded-md border border-gray-700" />
                  </td>
                  <td className="p-4 font-semibold">{moto.modelo}</td>
                  <td className="p-4 text-gray-300">{moto.placa}</td>
                  <td className="p-4 text-gray-300">{moto.kilometraje}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      moto.estado === 'Disponible' ? 'bg-green-900 text-green-400' : 'bg-orange-900 text-orange-400'
                    }`}>
                      {moto.estado}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button className="bg-gray-700 px-4 py-1 rounded text-sm hover:bg-gray-600 transition">Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}