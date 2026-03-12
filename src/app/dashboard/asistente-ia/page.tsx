"use client";
import { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface Mensaje {
  id: string;
  tipo: 'usuario' | 'asistente';
  contenido: string;
  timestamp: Date;
}

export default function AsistenteIAPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const respuestasMock: Record<string, string> = {
    'comprar': 'Basándome en el análisis de tu flota actual, te recomiendo adquirir motos de tipo Adventure o Naked, ya que tienen la mayor tasa de ocupación (85%). Considera modelos como la BMW G310 GS o Yamaha MT-03, que son populares entre tus clientes y tienen bajo costo de mantenimiento.',
    'adquirir': 'Para expandir tu flota, sugiero enfocarte en vehículos de gama media (precio $45-60/día). Estos tienen el mejor balance entre demanda y rentabilidad según tus datos históricos.',
    'mantenimiento': 'Según el kilometraje promedio de tu flota (12,500 km), recomiendo programar mantenimientos preventivos cada 2,500 km. Actualmente tienes 2 vehículos cerca del límite que deberían ingresar a taller en los próximos 7 días.',
    'precio': 'Analizando tu ocupación actual del 65%, sugiero incrementar precios en un 15% durante fines de semana y mantener descuentos del 10% para alquileres de +7 días. Esto podría aumentar tus ingresos mensuales en aproximadamente $2,400.',
    'tarifa': 'Tu estrategia de tarifas actual es sólida. Sin embargo, podrías implementar precios dinámicos para temporada alta (Diciembre-Enero y Semana Santa) con incrementos del 25-30%. Esto es común en el mercado colombiano.',
    'default': 'He analizado los datos de tu negocio. Tu flota tiene una tasa de ocupación del 65%, con ingresos promedio de $8,500/mes. Los vehículos tipo Naked son los más rentables. ¿Te gustaría que profundice en algún aspecto específico como expansión, mantenimiento o estrategia de precios?'
  };

  const obtenerRespuesta = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();
    for (const [keyword, respuesta] of Object.entries(respuestasMock)) {
      if (preguntaLower.includes(keyword)) {
        return respuesta;
      }
    }
    return respuestasMock.default;
  };

  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const mensajeUsuario: Mensaje = {
      id: Date.now().toString(),
      tipo: 'usuario',
      contenido: input,
      timestamp: new Date()
    };

    setMensajes([...mensajes, mensajeUsuario]);
    setInput('');
    setLoading(true);

    // Simular delay de IA (mínimo 1.5 segundos)
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const respuesta = obtenerRespuesta(input);
    const mensajeAsistente: Mensaje = {
      id: (Date.now() + 1).toString(),
      tipo: 'asistente',
      contenido: respuesta,
      timestamp: new Date()
    };

    setMensajes(prev => [...prev, mensajeAsistente]);
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black italic uppercase mb-2">🤖 Asistente IA de Flota</h1>
          <p className="text-gray-500">Recomendaciones inteligentes para tu negocio</p>
          <div className="mt-4 inline-block bg-orange-500/10 border border-orange-500/30 rounded-lg px-4 py-2">
            <p className="text-xs text-orange-400 font-bold">⚠️ Modo Demo — IA conectada en Ciclo 2</p>
          </div>
        </div>

        {/* Sugerencias rápidas */}
        {mensajes.length === 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              '¿Qué moto debería comprar?',
              '¿Cuándo hacer mantenimiento?',
              'Analiza mis precios',
              'Estrategia de tarifas'
            ].map((sugerencia, i) => (
              <button
                key={i}
                onClick={() => setInput(sugerencia)}
                className="p-3 bg-white/5 hover:bg-white/10 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-white transition"
              >
                {sugerencia}
              </button>
            ))}
          </div>
        )}

        {/* Chat */}
        <Card className="min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 p-6">
          {mensajes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-600">
              <p className="text-center">
                👋 ¡Hola! Soy tu asistente de IA.<br/>
                Pregúntame sobre tu flota, mantenimiento o estrategias de precios.
              </p>
            </div>
          ) : (
            mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    mensaje.tipo === 'usuario'
                      ? 'bg-[#00E5FF] text-black'
                      : 'bg-white/5 text-white border border-gray-800'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{mensaje.contenido}</p>
                  <p className="text-[9px] mt-2 opacity-50">
                    {mensaje.timestamp.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-gray-800 p-4 rounded-2xl">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#00E5FF] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
            placeholder="Escribe tu pregunta aquí..."
            className="flex-1 bg-[#1A1A24] border border-gray-700 rounded-xl p-4 text-sm text-white focus:border-[#00E5FF] focus:outline-none"
            disabled={loading}
          />
          <Button onClick={enviarMensaje} disabled={loading || !input.trim()}>
            Enviar
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
