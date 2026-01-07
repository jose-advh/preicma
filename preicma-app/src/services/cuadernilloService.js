import { supabase } from "../lib/supabaseClient"; 

// --- FUNCIÓN AUXILIAR ---
const extraerPathDeUrl = (urlCompleta) => {
  if (!urlCompleta || typeof urlCompleta !== 'string') return null;
  const bucketName = 'simulacros'; 
  const partes = urlCompleta.split(`/${bucketName}/`);
  if (partes.length > 1) {
    return decodeURIComponent(partes[1]);
  }
  return null;
};

// --- TUS FUNCIONES EXPORTADAS ---

export const obtenerSimulacros = async () => {
  const { data, error } = await supabase
    .from('simulacros')
    .select('id, titulo, descripcion')
    .eq('estado', 'activo');
  if (error) throw error;
  return data;
};

export const obtenerMaterias = async () => {
  const { data, error } = await supabase
    .from('materias')
    .select('id, nombre')
    .order('nombre');
  if (error) throw error;
  return data;
};

// Función para guardar resultados con upsert
export const guardarResultados = async (idUsuario, idSimulacro, preguntas, respuestas) => {
  try {
    const idsMateriasRaw = preguntas.map(p => p.id_materia);
    const idsMaterias = [...new Set(idsMateriasRaw)].filter(id => id !== null && id !== undefined);
    
    if (idsMaterias.length === 0) return false;

    const registrosAInsertar = [];

    idsMaterias.forEach(idMateria => {
      const preguntasMateria = preguntas.filter(p => p.id_materia === idMateria);
      const totalPreguntas = preguntasMateria.length;
      if (totalPreguntas === 0) return;

      let aciertos = 0;
      preguntasMateria.forEach(preg => {
        if (String(respuestas[preg.id]) === String(preg.opcion_correcta)) {
          aciertos++;
        }
      });

      const resultadoCalculado = Math.round((aciertos / totalPreguntas) * 100);

      registrosAInsertar.push({
        id_usuario: idUsuario,
        id_simulacro: idSimulacro,
        id_materia: idMateria,
        resultado: resultadoCalculado
      });
    });

    const { data, error } = await supabase
      .from('resultados')
      .upsert(registrosAInsertar, { onConflict: 'id_usuario, id_simulacro, id_materia' }) 
      .select();

    if (error) throw error;
    return true;

  } catch (error) {
    console.error("Error guardando resultados:", error);
    throw error;
  }
};

// --- FUNCIÓN PRINCIPAL DE PREGUNTAS (MODIFICADA) ---
export const obtenerPreguntasSimulacro = async (idSimulacro) => {
  try {
    // 1. Consulta a Supabase
    // IMPORTANTE: Agregamos 'orden' en la selección de imagenes_enunciados
    const { data, error } = await supabase
      .from('preguntas')
      .select(`
        id,
        pregunta,
        id_materia,
        id_enunciado,
        opcion_correcta, 
        enunciados (
          id,
          texto,
          imagenes_enunciados ( url, orden ) 
        ),
        materias ( nombre ),
        opciones!opciones_id_pregunta_fkey (
          id,
          opcion,
          imagenes_opciones ( url )
        )
      `)
      .eq('id_simulacro', idSimulacro)
      .order('id', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    // 2. Procesamiento de URLs firmadas
    const preguntasProcesadas = await Promise.all(data.map(async (pregunta) => {
      
      // A. Procesar imágenes de Enunciados (MANTENIENDO EL ORDEN)
      if (pregunta.enunciados?.imagenes_enunciados?.length > 0) {
        const imgsEnunciado = await Promise.all(pregunta.enunciados.imagenes_enunciados.map(async (img) => {
          if (!img.url) return img;
          
          const path = extraerPathDeUrl(img.url);
          if (path) {
            const { data: signed } = await supabase.storage.from('simulacros').createSignedUrl(path, 604800);
            if (signed) {
              // AQUÍ ESTÁ LA CLAVE: Retornamos el objeto con la nueva URL pero mantenemos el 'orden' original
              return { 
                ...img, 
                url: signed.signedUrl,
                orden: img.orden // Aseguramos que el orden viaje al frontend
              };
            }
          }
          return img;
        }));
        
        // Ordenamos el array localmente por si acaso viene desordenado de la BD
        pregunta.enunciados.imagenes_enunciados = imgsEnunciado.sort((a, b) => a.orden - b.orden);
      }

      // B. Procesar imágenes de Opciones
      if (pregunta.opciones?.length > 0) {
        const opcionesProcesadas = await Promise.all(pregunta.opciones.map(async (opcion) => {
          if (opcion.imagenes_opciones?.length > 0) {
              const imgsOpcion = await Promise.all(opcion.imagenes_opciones.map(async (imgOp) => {
                  if (!imgOp.url) return imgOp;
                  const pathOp = extraerPathDeUrl(imgOp.url);
                  if (pathOp) {
                      const { data: signedOp } = await supabase.storage.from('simulacros').createSignedUrl(pathOp, 604800);
                      if (signedOp) return { ...imgOp, url: signedOp.signedUrl };
                  }
                  return imgOp;
              }));
              return { ...opcion, imagenes_opciones: imgsOpcion };
          }
          return opcion;
        }));
        pregunta.opciones = opcionesProcesadas;
      }

      return pregunta;
    }));

    return preguntasProcesadas;

  } catch (error) {
    console.error("Error obteniendo preguntas:", error);
    throw error;
  }
};
