import { supabase } from "../lib/supabaseClient"; 

export const obtenerSimulacros = async () => {
  // Pedimos id, titulo y descripcion
  const { data, error } = await supabase
    .from('simulacros')
    .select('id, titulo, descripcion')
    .eq('estado', 'activo'); // Asegúrate que 'estado' exista en tu tabla, si no, quita esta línea.

  if (error) throw error;
  return data;
};

// Función auxiliar para extraer el path del archivo desde la URL completa de Supabase
const extraerPathDeUrl = (urlCompleta) => {
  // La URL suele ser: .../storage/v1/object/public/simulacros/enunciados/archivo.png
  // Queremos lo que está DESPUÉS del nombre del bucket ("simulacros/")
  if (!urlCompleta) return null;
  const partes = urlCompleta.split('/simulacros/');
  if (partes.length > 1) {
    // Retorna "enunciados/archivo.png" (decodificado por si tiene espacios %20)
    return decodeURIComponent(partes[1]);
  }
  return null;
};

export const obtenerPreguntasSimulacro = async (idSimulacro) => {
  // 1. Traemos la data cruda de la base de datos
  const { data, error } = await supabase
    .from('preguntas')
    .select(`
      id,
      pregunta,
      id_materia,
      id_enunciado,
      enunciados (
        id,
        texto,
        imagenes_enunciados (
          url,
          orden
        )
      ),
      materias ( nombre )
    `)
    .eq('id_simulacro', idSimulacro)
    .order('id', { ascending: true });

  if (error) throw error;

  const preguntasProcesadas = await Promise.all(data.map(async (pregunta) => {
    
    if (pregunta.enunciados?.imagenes_enunciados?.length > 0) {
      
      // Procesamos cada imagen del enunciado
      const imagenesActualizadas = await Promise.all(pregunta.enunciados.imagenes_enunciados.map(async (img) => {
        const pathArchivo = extraerPathDeUrl(img.url);

        if (pathArchivo) {
          // Generamos la URL firmada por 1 semana (604800 segundos)
          const { data: signedData, error: signedError } = await supabase
            .storage
            .from('simulacros') // Nombre de tu bucket
            .createSignedUrl(pathArchivo, 604800); 

          if (!signedError && signedData) {
            return { ...img, url: signedData.signedUrl }; // Reemplazamos la URL
          }
        }
        return img; 
      }));

      // Asignamos las imágenes con las nuevas URLs al objeto
      pregunta.enunciados.imagenes_enunciados = imagenesActualizadas;
    }

    return pregunta;
  }));

  return preguntasProcesadas;
};