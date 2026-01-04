"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { obtenerPreguntasSimulacro } from "../../../services/cuadernilloService";

function ContenidoPrueba() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idSimulacro = searchParams.get("id");

  const [preguntas, setPreguntas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idSimulacro) {
        setError("No se especificó un cuadernillo.");
        setLoading(false);
        return;
    }

    const cargarPreguntas = async () => {
      try {
        const data = await obtenerPreguntasSimulacro(idSimulacro);
        setPreguntas(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar las preguntas.");
      } finally {
        setLoading(false);
      }
    };

    cargarPreguntas();
  }, [idSimulacro]);

  const siguientePregunta = () => {
    if (indiceActual < preguntas.length - 1) {
      setIndiceActual(prev => prev + 1);
    }
  };

  const anteriorPregunta = () => {
    if (indiceActual > 0) {
      setIndiceActual(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || preguntas.length === 0) {
    return (
      <div className="p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-4">{error || "Este cuadernillo no tiene preguntas."}</h2>
        <button onClick={() => router.back()} className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700">Volver</button>
      </div>
    );
  }

  // --- LOGICA DE DATOS ACTUAL ---
  const preguntaActual = preguntas[indiceActual];
  const materiaNombre = preguntaActual.materias?.nombre || "General";
  
  // Extraemos datos del enunciado
  const enunciadoData = preguntaActual.enunciados;
  const enunciadoTexto = enunciadoData?.texto;
  const listaImagenes = enunciadoData?.imagenes_enunciados || [];

  // Filtramos las imágenes según el orden
  // Orden 1: Arriba
  const imagenesArriba = listaImagenes.filter(img => img.orden === 1);
  // Orden 3 (o cualquier otro mayor a 1): Abajo
  const imagenesAbajo = listaImagenes.filter(img => img.orden >= 3); 

  return (
    <div className="p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Pregunta {indiceActual + 1} de {preguntas.length}
          </h2>
          <p className="text-purple-300 text-sm">
            Materia: <span className="font-semibold text-white bg-purple-600/30 px-2 py-0.5 rounded border border-purple-500/30 ml-1">{materiaNombre}</span>
          </p>
        </div>
        <div className="w-full sm:w-1/3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${((indiceActual + 1) / preguntas.length) * 100}%` }}
            />
        </div>
      </header>

      {/* Contenido Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
        
        {/* ENUNCIADO COMPLETO (Si existe texto o imagenes) */}
        {(enunciadoTexto || listaImagenes.length > 0) && (
          <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-5 rounded-r-xl rounded-bl-xl backdrop-blur-sm shadow-sm">
            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">Lectura de contexto</h3>
            
            {/* 1. Imágenes Superiores (Orden 1) */}
            {imagenesArriba.length > 0 && (
              <div className="mb-4 flex flex-col gap-4">
                {imagenesArriba.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-600/50">
                    <img src={img.url} alt="Contexto superior" className="w-full h-auto object-contain max-h-[400px]" />
                  </div>
                ))}
              </div>
            )}

            {/* 2. Texto del Enunciado */}
            {enunciadoTexto && (
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
                {enunciadoTexto}
              </p>
            )}

            {/* 3. Imágenes Inferiores (Orden 3) */}
            {imagenesAbajo.length > 0 && (
              <div className="mt-4 flex flex-col gap-4">
                {imagenesAbajo.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-600/50">
                    <img src={img.url} alt="Contexto inferior" className="w-full h-auto object-contain max-h-[400px]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PREGUNTA */}
        <div className="bg-slate-900/40 border border-purple-500/20 p-6 rounded-2xl shadow-lg backdrop-blur-md">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Pregunta</h3>
            <p className="text-xl text-white font-medium leading-relaxed">
                {preguntaActual.pregunta}
            </p>
        </div>

      </div>

      {/* Footer Nav */}
      <footer className="mt-6 pt-6 border-t border-purple-500/20 flex justify-between items-center gap-4">
        <button
            onClick={anteriorPregunta}
            disabled={indiceActual === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300
                ${indiceActual === 0 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' 
                    : 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-x-1 border border-gray-700'}
            `}
        >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            Anterior
        </button>

        <button
            onClick={siguientePregunta}
            disabled={indiceActual === preguntas.length - 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300
                ${indiceActual === preguntas.length - 1
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1'}
            `}
        >
            Siguiente
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </footer>
    </div>
  );
}

export default function PaginaPrueba() {
  return (
    <Suspense fallback={<div className="text-white p-10">Cargando prueba...</div>}>
      <ContenidoPrueba />
    </Suspense>
  );
}