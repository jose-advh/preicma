"use client";
// 27/12/2024, José Díaz, Login de Usuario
// Vista principal de autenticación. Incluye corrección para sincronizar cookies con el Middleware mediante router.refresh().

import { useState } from "react";
import { loginUsuario } from "../services/authService"; // Asegúrate que esta ruta sea correcta según tu estructura
import { useRouter } from "next/navigation";
import Modal from "../components/Modal";

export default function Login() {
  const router = useRouter();
  
  // Estados para manejo de formulario y feedback visual
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false); // Estado de carga opcional pero recomendado

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Función de inicio de sesión
  const handleLogin = async (e) => {
    // Prevenir el refresh por defecto si se llama desde el submit del form
    if (e) e.preventDefault();

    if (!formData.email || !formData.password) {
        setModal({ show: true, message: "Por favor completa todos los campos.", type: "error" });
        return;
    }

    setLoading(true);

    try {
      await loginUsuario(formData.email, formData.password);
      
      setModal({
        show: true,
        message: "¡Inicio de sesión exitoso! Redirigiendo...",
        type: "success",
      });

      // --- CORRECCIÓN CRÍTICA ---
      // 1. router.refresh() obliga a Next.js a actualizar las cookies en el servidor (Middleware)
      router.refresh();

      // 2. Esperamos un momento para asegurar que las cookies se establezcan y el usuario vea el mensaje
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

    } catch (error) {
      console.error("Login Error:", error);
      let mensaje = "Ocurrió un error al iniciar sesión.";
      
      // Manejo de errores específicos de Supabase
      if (error.message.includes("Invalid login credentials"))
        mensaje = "Credenciales inválidas. Verifica tu correo y contraseña.";
      else if (error.message.includes("Email not confirmed"))
        mensaje = "Debes confirmar tu correo antes de iniciar sesión.";
      else if (error.message.includes("User not found"))
        mensaje = "No se encontró un usuario con ese correo.";
      
      setModal({ show: true, message: mensaje, type: "error" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue relative">
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false })}
        />
      )}

      <img
        src="/preicmalogo.webp"
        alt="Logo Preicma"
        className="w-[30%] md:w-[10%] rounded-full mb-6"
      />

      {/* Se cambió a onSubmit para permitir login con la tecla Enter */}
      <form
        className="flex flex-col items-center gap-5 w-[90%] md:w-[35%] h-auto p-4"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl text-center text-white font-bold">
          Iniciar Sesión
        </h2>
        
        <div className="w-[90%] md:w-[80%]">
          <div className="flex flex-col items-center gap-5 w-full">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="shadow-md p-3 rounded-xl w-[100%] input-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Correo electrónico"
              required
            />
            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="shadow-md p-3 rounded-xl w-[100%] input-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Contraseña"
              required
            />
          </div>
          <p className="text-white mt-5 text-center text-sm">
            ¿Aún no tienes una cuenta?{" "}
            <a href="/register" className="text-[#38BDF8] hover:underline">
              Crea una aquí
            </a>
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            bg-black/50 p-2 px-8 rounded-xl text-white font-bold cursor-pointer transition-all hover:bg-black/70
            ${loading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}