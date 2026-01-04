import { supabase } from "../lib/supabaseClient"; 

// --- FUNCIÓN AUXILIAR (Debe estar afuera de las exportaciones) ---
const extraerPathDeUrl = (urlCompleta) => {
  if (!urlCompleta || typeof urlCompleta !== 'string') return null;
  
  // Ajusta 'simulacros' si tu bucket se llama diferente
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
    .select('id, titulo, descripcion') // Asegúrate de traer descripción
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

// Función interna para subir imágenes (usada en crearPreguntaCompleta)
const subirImagen = async (archivo, carpeta) => {
  const fileExt = archivo.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `${carpeta}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('simulacros')
    .upload(filePath, archivo);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('simulacros')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

export const crearPreguntaCompleta = async (idSimulacro, idMateria, dataEnunciado, listaImagenesEnunciado, dataPregunta, listaOpciones, indiceCorrecta) => {
  try {
    const { data: enunciado, error: errorEnunciado } = await supabase
      .from('enunciados')
      .insert({ texto: dataEnunciado })
      .select()
      .single();

    if (errorEnunciado) throw errorEnunciado;

    if (listaImagenesEnunciado.length > 0) {
      const promesasEnunciadoImg = listaImagenesEnunciado.map(async (item) => {
        const url = await subirImagen(item.file, 'enunciados');
        return {
          id_enunciado: enunciado.id,
          url: url,
          orden: parseInt(item.orden) 
        };
      });

      const imagenesData = await Promise.all(promesasEnunciadoImg);
      const { error: errorImgBD } = await supabase
        .from('imagenes_enunciados')
        .insert(imagenesData);

      if (errorImgBD) throw errorImgBD;
    }

    const { data: pregunta, error: errorPregunta } = await supabase
      .from('preguntas')
      .insert({
        id_enunciado: enunciado.id,
        id_simulacro: idSimulacro,
        id_materia: idMateria,
        pregunta: dataPregunta,
        opcion_correcta: null
      })
      .select()
      .single();

    if (errorPregunta) throw errorPregunta;

    const opcionesPromises = listaOpciones.map(async (op) => {
      const textoInsertar = op.tipo === 'texto' ? op.valor : 'Imagen'; 
      
      const { data: opcionInsertada, error: errorOp } = await supabase
        .from('opciones')
        .insert({
          id_pregunta: pregunta.id,
          opcion: textoInsertar
        })
        .select()
        .single();

      if (errorOp) throw errorOp;

      if (op.tipo === 'imagen' && op.file) {
        const urlImagenOpcion = await subirImagen(op.file, 'opciones');
        const { error: errorImgOp } = await supabase
          .from('imagenes_opciones')
          .insert({
            id_opcion: opcionInsertada.id,
            url: urlImagenOpcion
          }); 
        if (errorImgOp) throw errorImgOp;
      }

      return opcionInsertada; 
    });

    const resultadosOpciones = await Promise.all(opcionesPromises);

    const idOpcionCorrecta = resultadosOpciones[indiceCorrecta].id;

    const { error: errorUpdate } = await supabase
      .from('preguntas')
      .update({ opcion_correcta: idOpcionCorrecta })
      .eq('id', pregunta.id);

    if (errorUpdate) throw errorUpdate;

    return true;

  } catch (error) {
    console.error(error);
    throw error;
  }
};

// --- AQUÍ ESTÁ LA FUNCIÓN CORREGIDA Y ACTUALIZADA ---
export const obtenerPreguntasSimulacro = async (idSimulacro) => {
  try {
    // 1. Consulta a Supabase con la relación explícita
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

    if (error) {
      console.error("🚨 Error SQL Supabase:", error.message, error.details);
      throw error;
    }

    if (!data) return [];

    // 2. Procesamiento de URLs firmadas
    const preguntasProcesadas = await Promise.all(data.map(async (pregunta) => {
      
      // A. Procesar imágenes de Enunciados
      if (pregunta.enunciados?.imagenes_enunciados?.length > 0) {
        const imgsEnunciado = await Promise.all(pregunta.enunciados.imagenes_enunciados.map(async (img) => {
          if (!img.url) return img;
          
          const path = extraerPathDeUrl(img.url);
          if (path) {
            const { data: signed } = await supabase.storage.from('simulacros').createSignedUrl(path, 604800);
            if (signed) return { ...img, url: signed.signedUrl };
          }
          return img;
        }));
        pregunta.enunciados.imagenes_enunciados = imgsEnunciado;
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
    console.error("🔥 Error CRÍTICO en obtenerPreguntasSimulacro:", error);
    throw error;
  }
};