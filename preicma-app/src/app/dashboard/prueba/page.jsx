"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
// IMPORTAMOS la nueva función guardarResultados y supabase para obtener el usuario
import { obtenerPreguntasSimulacro, guardarResultados } from "../../../services/cuadernilloService";
import { supabase } from "../../../lib/supabaseClient"; // Asegúrate de importar tu cliente supabase

function ContenidoPrueba() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idSimulacro = searchParams.get("id");

  const [preguntas, setPreguntas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [mostrarResultados, setMostrarResultados] = useState(false);
  
  // Estados de carga y usuario
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false); // Nuevo estado para feedback visual
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
        // Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserId(user.id);

        // Obtener preguntas
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

  // --- LÓGICA DE FINALIZACIÓN Y GUARDADO ---
  const finalizarPrueba = async () => {
    if (!userId) {
      alert("No se pudo identificar al usuario para guardar los resultados.");
      setMostrarResultados(true);
      return;
    }

    setGuardando(true);
    try {
      // Llamamos al servicio para guardar (separa por materias internamente)
      await guardarResultados(userId, idSimulacro, preguntas, respuestas);
      
      // Una vez guardado, mostramos la pantalla de resultados
      setMostrarResultados(true);
    } catch (err) {
      console.error("Error al guardar:", err);
      // Aún si falla el guardado, mostramos los resultados al usuario
      // (Podrías mostrar un toast de error aquí si quisieras)
      setMostrarResultados(true); 
    } finally {
      setGuardando(false);
    }
  };

  // --- NAVEGACIÓN ---
  const siguientePregunta = () => {
    if (indiceActual < preguntas.length - 1) {
      setIndiceActual(prev => prev + 1);
    } else {
      // Si es la última, detonamos el proceso de finalización
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

  // --- CÁLCULO DE RESULTADOS (Para visualización) ---
  const calcularResultadosGlobales = () => {
    let correctas = 0;
    preguntas.forEach(preg => {
      if (respuestas[preg.id] === preg.opcion_correcta) {
        correctas++;
      }
    });
    return { correctas, total: preguntas.length };
  };

  // --- RENDERIZADO DE CARGA / GUARDADO ---
  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Pantalla de "Guardando resultados..."
  if (guardando) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-950 text-white gap-4">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold animate-pulse">Guardando tu progreso...</h2>
        <p className="text-gray-400">Analizando respuestas por materia</p>
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

  // --- VISTA DE RESULTADOS (FINAL) ---
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
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{correctas}/{total}</span>
              <span className="text-xs text-gray-400 uppercase tracking-widest">Aciertos</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
             <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-gray-400">Porcentaje Global</p>
                <p className="text-xl font-bold text-white">{porcentaje}%</p>
             </div>
             <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <p className="text-gray-400">Respondidas</p>
                <p className="text-xl font-bold text-white">{Object.keys(respuestas).length}/{total}</p>
             </div>
          </div>

          <Link 
            href="/dashboard"
            className="block w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all duration-300"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --- VISTA DE PREGUNTAS (NORMAL) ---
  const preguntaActual = preguntas[indiceActual];
  const materiaNombre = preguntaActual.materias?.nombre || "General";
  
  const enunciadoData = preguntaActual.enunciados;
  const enunciadoTexto = enunciadoData?.texto || "";
  const listaImagenes = enunciadoData?.imagenes_enunciados || [];
  const imagenesArriba = listaImagenes.filter(img => img.orden === 1);
  const imagenIntercalada = listaImagenes.find(img => img.orden === 2);
  const imagenesAbajo = listaImagenes.filter(img => img.orden >= 3);

  const opciones = preguntaActual.opciones || [];
  const respuestaUsuario = respuestas[preguntaActual.id];
  const yaRespondido = respuestaUsuario !== undefined;

  const renderizarTextoEnunciado = () => {
    if (!enunciadoTexto) return null;
    if (imagenIntercalada && enunciadoTexto.includes("{imagen}")) {
      const partes = enunciadoTexto.split("{imagen}");
      return (
        <div className="text-gray-300 leading-relaxed text-lg">
          {partes.map((parte, index) => (
            <span key={index}>
              <span className="whitespace-pre-wrap">{parte}</span>
              {index < partes.length - 1 && (
                <div className="my-4 rounded-lg overflow-hidden border border-gray-600/50 inline-block w-full">
                   <img src={imagenIntercalada.url} alt="Contexto" className="w-full h-auto object-contain max-h-[400px]" />
                </div>
              )}
            </span>
          ))}
        </div>
      );
    }
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
            {imagenesArriba.length > 0 && (
              <div className="mb-4 flex flex-col gap-4">
                {imagenesArriba.map((img, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-600/50">
                    <img src={img.url} alt="Contexto superior" className="w-full h-auto object-contain max-h-[400px]" />
                  </div>
                ))}
              </div>
            )}
            {renderizarTextoEnunciado()}
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

        <div className="bg-slate-900/40 border border-purple-500/20 p-6 rounded-2xl shadow-lg backdrop-blur-md">
            <h3 className="text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">Pregunta</h3>
            <p className="text-xl text-white font-medium leading-relaxed">{preguntaActual.pregunta}</p>
        </div>

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
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                )}
                {yaRespondido && fueSeleccionada && !esLaCorrecta && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-1 shadow-lg z-10">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                )}

                <div className="w-full">
                    {opcion.opcion && <span className="text-white font-medium text-lg block mb-2">{opcion.opcion}</span>}
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
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
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
            {esUltimaPregunta ? (
               <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
            ) : (
               <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            )}
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