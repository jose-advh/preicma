import { supabase } from "../lib/supabaseClient";

export const crearUsuario = async (usuario) => {
  const { data, error } = await supabase.from("usuarios").insert(usuario);
  if (error) throw error;
  return data;
};

export const traerUsuarios = async () => {
  const { data, error } = await supabase.from("usuarios").select("*");
  if (error) throw error;
  return data;
};

/*
    Funciones sin uso actual, que en futuras actualizaciones serán utilizadas
    1. Actualizar usuarios
    2. Eliminar usuarios
*/

export const actualizarUsuario = async (id, cambios) => {
  const { data, error } = await supabase
    .from("usuarios")
    .update(cambios)
    .eq("id", id);
  if (error) throw error;
  return data;
};

export const eliminarUsuario = async (id) => {
  const { data, error } = await supabase.from("usuarios").delete().eq("id", id);
  if (error) throw error;
  return data;
};
