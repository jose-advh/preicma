import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

// 27/12/2024, José Díaz, Middleware de Autenticación y Roles
// Este archivo intercepta las peticiones a rutas protegidas para validar sesión y permisos de administrador.

export async function middleware(request) {
  // 1. Inicializar la respuesta base de Next.js
  // Necesitamos esto para poder manipular las cookies y pasarlas a Supabase
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Crear el cliente de Supabase para el servidor (Middleware)
  // Este cliente es diferente al de 'src/lib' porque tiene acceso a las cookies de la petición
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value
        },
        set(name, value, options) {
          // Si Supabase necesita refrescar el token, actualizamos la cookie en la respuesta
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Obtener la sesión del usuario de manera segura
  // getUser es más seguro que getSession para validaciones de servidor
  const { data: { user } } = await supabase.auth.getUser()

  // Definir las rutas y URL actual
  const url = request.nextUrl.clone()
  const path = url.pathname

  // --- LÓGICA DE PROTECCIÓN ---

  // CASO A: Protección de Dashboard (Cualquier usuario logueado)
  if (path.startsWith('/dashboard')) {
    // Si no hay usuario, mandar al login
    if (!user) {
      url.pathname = '/' // O '/login' si tienes una ruta específica
      return NextResponse.redirect(url)
    }
    // Si hay usuario, permite continuar (NextResponse.next())
  }

  // CASO B: Protección de Admin (Usuario logueado + Rol 'admin')
  if (path.startsWith('/admin')) {
    
    // Primero: Si no está logueado, fuera
    if (!user) {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Segundo: Validar rol en base de datos
    // Consultamos la tabla 'usuarios' donde el ID coincida con el ID de autenticación
    const { data: perfil, error } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id', user.id)
      .single()

    // Si hay error en la consulta o el rol NO es admin
    if (error || perfil?.rol !== 'admin') {
      console.warn(`Intento de acceso no autorizado a Admin por: ${user.email}`)
      
      // Lo redirigimos a su dashboard normal
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Si pasa todas las validaciones, devolver la respuesta con las cookies actualizadas
  return response
}

// 4. Configuración del Matcher
// Esto le dice a Next.js en qué rutas debe ejecutarse este middleware.
// Excluimos api, estáticos (_next/static), imágenes, favicon, etc. para mejor rendimiento.
export const config = {
  matcher: [
    /*
     * Coincidir con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono del navegador)
     * - Archivos públicos (imágenes en public/, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}