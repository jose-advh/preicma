import { supabase } from "../lib/supabaseClient";

// Obtener listado de materias disponibles para el selector
export const obtenerMaterias = async () => {
  const { data, error } = await supabase
    .from("materias")
    .select("id, nombre") // Asumiendo que tiene id y nombre
    .order("nombre", { ascending: true });
    
  if (error) throw error;
  return data;
};

// Crear el cuadernillo y sus relaciones
export const crearCuadernillo = async (datosCuadernillo, idsMaterias) => {
  try {
    // 1. Insertar el Cuadernillo (Simulacro)
    const { data: simulacro, error: errorSimulacro } = await supabase
      .from("simulacros")
      .insert(datosCuadernillo)
      .select()
      .single(); // Importante: .select().single() para obtener el ID generado

    if (errorSimulacro) throw errorSimulacro;

    if (!simulacro) throw new Error("No se pudo crear el simulacro");

    // 2. Preparar la relación con materias
    // Tabla: simulacros_materias (id_materia, id_simulacro)
    const relaciones = idsMaterias.map((idMateria) => ({
      id_simulacro: simulacro.id,
      id_materia: idMateria,
    }));

    // 3. Insertar las relaciones
    const { error: errorRelacion } = await supabase
      .from("simulacros_materias")
      .insert(relaciones);

    if (errorRelacion) {
      // Opcional: Si falla la relación, podrías borrar el simulacro creado para no dejar datos huérfanos
      // await supabase.from("simulacros").delete().eq("id", simulacro.id);
      throw errorRelacion;
    }

    return simulacro;
  } catch (error) {
    throw error;
  }
};