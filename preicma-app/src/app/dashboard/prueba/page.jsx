"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { obtenerPreguntasSimulacro, guardarResultados } from "../../../services/cuadernilloService";
import { supabase } from "../../../lib/supabaseClient"; 
import { CheckCircle } from 'lucide-react'; // Asegúrate de tener instalado lucide-react o elimina esta línea e icono

function ContenidoPrueba() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idSimulacro = searchParams.get("id");

  const [preguntas, setPreguntas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // 1. Cargar Usuario y Preguntas
  useEffect(() => {
    const initData = async () => {
      if (!idSimulacro) {
        setError("No se especificó un cuadernillo.");
        setLoading(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);

        const data = await obtenerPreguntasSimulacro(idSimulacro);
        setPreguntas(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [idSimulacro]);

  // --- LOGICA DE FINALIZACIÓN ---
  const finalizarPrueba = async () => {
    if (!userId) {
      alert("No se pudo identificar al usuario para guardar los resultados.");
      setMostrarResultados(true);
      return;
    }

    setGuardando(true);
    try {
      await guardarResultados(userId, idSimulacro, preguntas, respuestas);
      setMostrarResultados(true);
    } catch (err) {
      console.error("Error al guardar:", err);
      setMostrarResultados(true); 
    } finally {
      setGuardando(false);
    }
  };

  const siguientePregunta = () => {
    if (indiceActual < preguntas.length - 1) {
      setIndiceActual(prev => prev + 1);
    } else {
      finalizarPrueba();
    }
  };

  const anteriorPregunta = () => {
    if (indiceActual > 0) setIndiceActual(prev => prev - 1);
  };

  const handleSeleccionarOpcion = (idPregunta, idOpcion) => {
    if (respuestas[idPregunta]) return; 
    setRespuestas(prev => ({ ...prev, [idPregunta]: idOpcion }));
  };

  const calcularResultadosGlobales = () => {
    let correctas = 0;
    preguntas.forEach(preg => {
      if (respuestas[preg.id] === preg.opcion_correcta) {
        correctas++;
      }
    });
    return { correctas, total: preguntas.length };
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (guardando) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-950 text-white gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold animate-pulse">Guardando tu progreso...</h2>
      </div>
    );
  }

  if (error || preguntas.length === 0) {
    return (
      <div className="p-8 text-center text-white">
        <h2 className="text-xl font-bold mb-4">{error || "Sin preguntas."}</h2>
        <button onClick={() => router.back()} className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700">Volver</button>
      </div>
    );
  }

  if (mostrarResultados) {
    const { correctas, total } = calcularResultadosGlobales();
    const porcentaje = Math.round((correctas / total) * 100);
    
    let mensaje = "¡Sigue practicando!";
    let colorTexto = "text-gray-300";
    if (porcentaje === 100) { mensaje = "¡Perfecto! Eres un maestro."; colorTexto = "text-yellow-400"; }
    else if (porcentaje >= 80) { mensaje = "¡Excelente trabajo!"; colorTexto = "text-green-400"; }
    else if (porcentaje >= 60) { mensaje = "Buen intento, vas por buen camino."; colorTexto = "text-cyan-400"; }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-[family-name:var(--font-geist-sans)]">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-purple-500/30 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500" />
          <h2 className="text-3xl font-bold text-white mb-2">Resultados</h2>
          <p className={`text-lg font-medium mb-8 ${colorTexto}`}>{mensaje}</p>
          
          <div className="relative w-40 h-40 mx-auto mb-8 flex items-center justify-center">
             <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white">
                {porcentaje}%
             </div>
             <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-gray-800" />
              <circle 
                cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" 
                strokeDasharray={440} 
                strokeDashoffset={440 - (440 * porcentaje) / 100} 
                className={`transition-all duration-1000 ease-out ${porcentaje >= 60 ? 'text-green-500' : 'text-purple-500'}`} 
                strokeLinecap="round"
              />
            </svg>
          </div>

          <Link 
            href="/dashboard"
            className="block w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --- VARIABLES PREGUNTA ACTUAL ---
  const preguntaActual = preguntas[indiceActual];
  const materiaNombre = preguntaActual.materias?.nombre || "General";
  
  const enunciadoData = preguntaActual.enunciados;
  const enunciadoTexto = enunciadoData?.texto || "";
  const listaImagenes = enunciadoData?.imagenes_enunciados || [];

  // =======================================================
  // NUEVA LÓGICA DIVIDIDA (Externas vs Intercalada)
  // =======================================================

  // 1. Imágenes EXTERNAS: Cualquier imagen que NO sea orden 2 (ej: 1, 3, 4)
  // Estas se mostrarán siempre juntas en un bloque antes del texto.
  const imagenesExternas = listaImagenes
    .filter(img => img.orden !== 2)
    .sort((a, b) => a.orden - b.orden);

  // 2. Imagen INTERCALADA: Exclusivamente Orden 2
  const imagenIntercalada = listaImagenes.find(img => img.orden === 2);
  const usaIntercaladaEnTexto = imagenIntercalada && enunciadoTexto.includes("{imagen}");

  const opciones = preguntaActual.opciones || [];
  const respuestaUsuario = respuestas[preguntaActual.id];
  const yaRespondido = respuestaUsuario !== undefined;

  // Renderizado del texto reemplazando {imagen} por la imagen orden 2
  const renderizarTextoEnunciado = () => {
    if (!enunciadoTexto) return null;
    
    // Solo si aplica, hacemos el split
    if (usaIntercaladaEnTexto) {
      const partes = enunciadoTexto.split("{imagen}");
      return (
        <div className="text-gray-300 leading-relaxed text-lg">
          {partes.map((parte, index) => (
            <span key={index}>
              <span className="whitespace-pre-wrap">{parte}</span>
              {/* Insertamos imagen orden 2 en los huecos */}
              {index < partes.length - 1 && (
                <div className="my-4 rounded-lg overflow-hidden border border-gray-600/50 inline-block w-full">
                   <img 
                     src={imagenIntercalada.url} 
                     alt="Contexto visual" 
                     className="w-full h-auto object-contain max-h-[400px]" 
                   />
                </div>
              )}
            </span>
          ))}
        </div>
      );
    }
    // Texto normal si no hay imagen orden 2
    return <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{enunciadoTexto}</p>;
  };

  const esUltimaPregunta = indiceActual === preguntas.length - 1;

  return (
    <div className="p-4 sm:p-8 font-[family-name:var(--font-geist-sans)] max-w-5xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
      
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Pregunta {indiceActual + 1} de {preguntas.length}</h2>
          <p className="text-purple-300 text-sm">
            Materia: <span className="font-semibold text-white bg-purple-600/30 px-2 py-0.5 rounded border border-purple-500/30 ml-1">{materiaNombre}</span>
          </p>
        </div>
        <div className="w-full sm:w-1/3 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-300" style={{ width: `${((indiceActual + 1) / preguntas.length) * 100}%` }} />
        </div>
      </header>

      {/* Contenido Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-6">
        
        {(enunciadoTexto || listaImagenes.length > 0) && (
          <div className="bg-slate-800/50 border-l-4 border-cyan-500 p-5 rounded-r-xl rounded-bl-xl backdrop-blur-sm shadow-sm">
            <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">Lectura de contexto</h3>
            
            {/* ---------------------------------------------------------
                PASO 1: Insertar TODAS las imágenes externas (1, 3, etc.)
               --------------------------------------------------------- */}
            {imagenesExternas.length > 0 && (
              <div className="mb-4 flex flex-col gap-4">
                {imagenesExternas.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-600/50">
                    <img 
                      src={img.url} 
                      alt={`Contexto ${img.orden}`} 
                      className="w-full h-auto object-contain max-h-[400px]" 
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ---------------------------------------------------------
                PASO 2: Insertar el TEXTO (con la imagen 2 intercalada)
               --------------------------------------------------------- */}
            {renderizarTextoEnunciado()}
            
          </div>
        )}

        {/* Tarjeta de Pregunta */}
        <div className="bg-slate-900/40 border border-purple-500/20 p-6 rounded-2xl shadow-lg backdrop-blur-md">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Pregunta</h3>
            <p className="text-xl text-white font-medium leading-relaxed">{preguntaActual.pregunta}</p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {opciones.map((opcion) => {
            const esLaCorrecta = opcion.id === preguntaActual.opcion_correcta;
            const fueSeleccionada = respuestaUsuario === opcion.id;
            
            let clasesBoton = "bg-slate-800 border-gray-700 hover:bg-slate-700 hover:border-gray-500";
            if (yaRespondido) {
                if (esLaCorrecta) clasesBoton = "bg-green-900/40 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
                else if (fueSeleccionada && !esLaCorrecta) clasesBoton = "bg-red-900/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]";
                else clasesBoton = "bg-slate-900/50 border-gray-800 opacity-50 cursor-not-allowed";
            }

            return (
              <button
                key={opcion.id}
                onClick={() => handleSeleccionarOpcion(preguntaActual.id, opcion.id)}
                disabled={yaRespondido}
                className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-300 text-left group ${clasesBoton}`}
              >
                {yaRespondido && esLaCorrecta && (
                    <div className="absolute top-3 right-3 bg-green-500 text-black rounded-full p-1 shadow-lg z-10">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                )}
                {yaRespondido && fueSeleccionada && !esLaCorrecta && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 shadow-lg z-10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                )}

                <div className="w-full">
                    {opcion.opcion && opcion.opcion !== "Imagen" && (
                      <span className="text-white font-medium text-lg block mb-2">{opcion.opcion}</span>
                    )}
                    {opcion.imagenes_opciones && opcion.imagenes_opciones.length > 0 && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                            <img src={opcion.imagenes_opciones[0].url} alt="Opción" className="w-full h-48 object-contain bg-black/40" />
                        </div>
                    )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="mt-4 pt-4 border-t border-purple-500/20 flex justify-between items-center gap-4">
        <button
            onClick={anteriorPregunta}
            disabled={indiceActual === 0}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base ${indiceActual === 0 ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50' : 'bg-slate-800 text-white hover:bg-slate-700 hover:-translate-x-1 border border-gray-700'}`}
        >
            Anterior
        </button>

        <button
            onClick={siguientePregunta}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all duration-300 text-sm sm:text-base 
              ${esUltimaPregunta 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-green-500/30 text-white hover:-translate-y-1 shadow-lg' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-purple-500/30 hover:-translate-y-1 shadow-lg'
              }
            `}
        >
            {esUltimaPregunta ? "Finalizar" : "Siguiente"}
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