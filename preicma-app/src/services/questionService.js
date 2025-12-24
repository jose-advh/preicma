import { supabase } from "../lib/supabaseClient"; 

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