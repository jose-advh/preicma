import { createBrowserClient } from '@supabase/ssr'

// 27/12/2024, José Díaz, Cliente Supabase (Browser)
// Configurado con @supabase/ssr para manejar cookies automáticamente y sincronizarse con el Middleware.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Faltan variables de entorno de Supabase");
}

// createBrowserClient maneja automáticamente la persistencia en cookies
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);