import { supabase } from "../lib/supabaseClient";

// --- HELPERS ---
const extraerPathDeUrl = (url) => {
  if (!url) return null;
  // Ajusta esto según la estructura exacta de tu URL de Supabase si es necesario
  // Usualmente es: .../storage/v1/object/public/BUCKET/CARPETA/ARCHIVO
  const partes = url.split('/simulacros/');
  return partes.length > 1 ? partes[1] : null;
};

const subirImagen = async (archivo, carpeta) => {
  if (!archivo) return null;
  
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

// --- LECTURA ---
export const obtenerSimulacros = async () => {
  const { data, error } = await supabase
    .from('simulacros')
    .select('id, titulo')
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

export const obtenerPreguntasPorFiltro = async (simulacroId, materiaId) => {
  const { data, error } = await supabase
    .from('preguntas')
    .select(`
      id, 
      pregunta, 
      opcion_correcta,
      id_simulacro,
      id_materia,
      enunciados (
        id, texto, imagenes_enunciados (id, url, orden)
      ),
      opciones!opciones_id_pregunta_fkey (
        id, opcion, imagenes_opciones (url)
      )
    `)
    .eq('id_simulacro', simulacroId)
    .eq('id_materia', materiaId)
    .order('id');

  if (error) throw error;
  return data;
};

// --- CREACIÓN (Sin cambios mayores, solo para mantener consistencia) ---
export const crearPreguntaCompleta = async (idSimulacro, idMateria, dataEnunciado, listaImagenesEnunciado, dataPregunta, listaOpciones, indiceCorrecta) => {
  // ... (Puedes mantener tu código de crearPreguntaCompleta original aquí)
  // Por brevedad, asumo que usas el que pegaste en el prompt.
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
        return { id_enunciado: enunciado.id, url: url, orden: parseInt(item.orden) };
      });
      const imagenesData = await Promise.all(promesasEnunciadoImg);
      await supabase.from('imagenes_enunciados').insert(imagenesData);
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
        .insert({ id_pregunta: pregunta.id, opcion: textoInsertar })
        .select()
        .single();
      if (errorOp) throw errorOp;

      if (op.tipo === 'imagen' && op.file) {
        const urlImagenOpcion = await subirImagen(op.file, 'opciones');
        await supabase.from('imagenes_opciones').insert({
            id_opcion: opcionInsertada.id,
            url: urlImagenOpcion
        }); 
      }
      return opcionInsertada; 
    });

    const resultadosOpciones = await Promise.all(opcionesPromises);
    const idOpcionCorrecta = resultadosOpciones[indiceCorrecta].id;

    await supabase
      .from('preguntas')
      .update({ opcion_correcta: idOpcionCorrecta })
      .eq('id', pregunta.id);

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// --- ACTUALIZACIÓN OPTIMIZADA (Lo que pediste) ---
export const actualizarPreguntaCompleta = async (idPregunta, idEnunciado, datos) => {
  try {
    // 1. ACTUALIZAR TEXTO DEL ENUNCIADO
    const { error: errorEnunciado } = await supabase
      .from('enunciados')
      .update({ texto: datos.enunciado })
      .eq('id', idEnunciado);

    if (errorEnunciado) throw errorEnunciado;

    // 2. GESTIÓN INTELIGENTE DE IMÁGENES DEL ENUNCIADO
    // A. Obtener IDs actuales para saber qué borrar
    const { data: imgsActuales } = await supabase
      .from('imagenes_enunciados')
      .select('id, url')
      .eq('id_enunciado', idEnunciado);

    const idsActuales = imgsActuales.map(img => img.id);
    const idsEntrantes = datos.imagenesEnunciado.filter(img => img.id).map(img => img.id);
    const idsABorrar = idsActuales.filter(id => !idsEntrantes.includes(id));

    // B. Borrar (BD y Storage) las que ya no vienen
    if (idsABorrar.length > 0) {
      const pathsBorrar = imgsActuales
        .filter(img => idsABorrar.includes(img.id))
        .map(img => extraerPathDeUrl(img.url))
        .filter(p => p);

      if (pathsBorrar.length > 0) await supabase.storage.from('simulacros').remove(pathsBorrar);
      await supabase.from('imagenes_enunciados').delete().in('id', idsABorrar);
    }

    // C. Actualizar URL (si hay archivo nuevo) o Insertar
    for (const img of datos.imagenesEnunciado) {
      if (img.id) {
        // CASO: Imagen existe. ¿Tiene archivo nuevo para reemplazar?
        const updates = { orden: parseInt(img.orden) };
        
        if (img.file) {
          // SUBIR NUEVA Y ACTUALIZAR URL
          // Opcional: Borrar la imagen anterior del storage antes de subir la nueva para ahorrar espacio
          const urlNueva = await subirImagen(img.file, 'enunciados');
          updates.url = urlNueva; 
        }

        // UPDATE DIRECTO EN LA TABLA
        await supabase
          .from('imagenes_enunciados')
          .update(updates)
          .eq('id', img.id);

      } else if (img.file) {
        // CASO: Imagen totalmente nueva (INSERT)
        const url = await subirImagen(img.file, 'enunciados');
        await supabase.from('imagenes_enunciados').insert({
          id_enunciado: idEnunciado,
          url: url,
          orden: parseInt(img.orden)
        });
      }
    }

    // 3. ACTUALIZAR DATOS BÁSICOS DE LA PREGUNTA
    // Desvinculamos opcion_correcta temporalmente para evitar conflictos FK al manipular opciones
    await supabase
      .from('preguntas')
      .update({ 
        pregunta: datos.pregunta,
        id_simulacro: datos.simulacroId,
        id_materia: datos.materiaId,
        opcion_correcta: null 
      })
      .eq('id', idPregunta);

    // 4. GESTIÓN INTELIGENTE DE OPCIONES
    // Estrategia: Actualizar las que tienen ID, Insertar las nuevas, Borrar las que faltan.
    
    // A. Identificar opciones a borrar
    const { data: opcionesViejas } = await supabase
      .from('opciones')
      .select('id, imagenes_opciones(url)')
      .eq('id_pregunta', idPregunta);

    const idsOpcionesEntrantes = datos.opciones.filter(op => op.id).map(op => op.id);
    const opcionesABorrar = opcionesViejas.filter(op => !idsOpcionesEntrantes.includes(op.id));

    // Borrar opciones eliminadas
    if (opcionesABorrar.length > 0) {
      // Limpiar storage de esas opciones
      const pathsOpsBorrar = [];
      opcionesABorrar.forEach(op => {
        if(op.imagenes_opciones && op.imagenes_opciones.length > 0) {
           const path = extraerPathDeUrl(op.imagenes_opciones[0].url);
           if(path) pathsOpsBorrar.push(path);
        }
      });
      if(pathsOpsBorrar.length > 0) await supabase.storage.from('simulacros').remove(pathsOpsBorrar);
      
      // Delete en BD
      await supabase.from('opciones').delete().in('id', opcionesABorrar.map(op => op.id));
    }

    // B. Procesar lista entrante (Update o Insert)
    const mapaNuevosIds = {}; // Para mapear indices del array a IDs reales (necesario para opcion_correcta)

    for (let i = 0; i < datos.opciones.length; i++) {
      const op = datos.opciones[i];
      let idOpcionActual = op.id;
      const textoInsertar = op.tipo === 'texto' ? op.valor : 'Imagen';

      if (idOpcionActual) {
        // --- UPDATE ---
        await supabase
          .from('opciones')
          .update({ opcion: textoInsertar })
          .eq('id', idOpcionActual);
        
        // Manejo de imagen en UPDATE
        if (op.tipo === 'imagen') {
          if (op.file) {
             // 1. Subir nueva
             const nuevaUrl = await subirImagen(op.file, 'opciones');
             
             // 2. Verificar si ya tenía imagen para hacer UPDATE o INSERT
             const { count } = await supabase
                .from('imagenes_opciones')
                .select('*', { count: 'exact', head: true })
                .eq('id_opcion', idOpcionActual);

             if (count > 0) {
                // EDITAR URL EXISTENTE
                await supabase
                  .from('imagenes_opciones')
                  .update({ url: nuevaUrl })
                  .eq('id_opcion', idOpcionActual);
             } else {
                // INSERTAR NUEVA RELACIÓN
                await supabase
                  .from('imagenes_opciones')
                  .insert({ id_opcion: idOpcionActual, url: nuevaUrl });
             }
          }
        } else {
           // Si cambió a Texto, borrar imagen asociada si existía
           await supabase.from('imagenes_opciones').delete().eq('id_opcion', idOpcionActual);
        }

      } else {
        // --- INSERT (Nueva Opción) ---
        const { data: nuevaOp, error: errNueva } = await supabase
          .from('opciones')
          .insert({ id_pregunta: idPregunta, opcion: textoInsertar })
          .select()
          .single();
        
        if (errNueva) throw errNueva;
        idOpcionActual = nuevaOp.id;

        if (op.tipo === 'imagen' && op.file) {
          const urlImg = await subirImagen(op.file, 'opciones');
          await supabase.from('imagenes_opciones').insert({
            id_opcion: idOpcionActual,
            url: urlImg
          });
        }
      }
      
      // Guardamos el ID final de esta opción en el índice correspondiente
      mapaNuevosIds[i] = idOpcionActual;
    }

    // 5. ACTUALIZAR OPCIÓN CORRECTA
    if (datos.indiceCorrecta !== null && mapaNuevosIds[datos.indiceCorrecta]) {
      const idCorrectaFinal = mapaNuevosIds[datos.indiceCorrecta];
      await supabase
        .from('preguntas')
        .update({ opcion_correcta: idCorrectaFinal })
        .eq('id', idPregunta);
    }

    return true;

  } catch (error) {
    console.error("Error en actualizarPreguntaCompleta:", error);
    throw error;
  }
};