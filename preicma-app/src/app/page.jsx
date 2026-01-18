"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUsuario } from "../services/authService";
import Modal from "../components/Modal";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setModal({
        show: true,
        message: "Por favor completa todos los campos.",
        type: "error",
      });
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

      router.refresh();

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      let mensaje = "Ocurrió un error al iniciar sesión.";

      if (error.message?.includes("Invalid login credentials"))
        mensaje = "Credenciales inválidas.";
      else if (error.message?.includes("Email not confirmed"))
        mensaje = "Debes confirmar tu correo.";
      else if (error.message?.includes("User not found"))
        mensaje = "Usuario no encontrado.";

      setModal({ show: true, message: mensaje, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="relative flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 overflow-hidden">

    {/* Fondo animado */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Burbujas grandes */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "3s" }} />
      <div className="absolute top-1/2 -right-20 w-[600px] h-[600px] bg-cyan-400/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
      <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />

      {/* Partículas (sin emojis) */}
      <div className="absolute top-24 left-24 w-4 h-4 bg-blue-400 rounded-full animate-bounce" />
      <div className="absolute top-40 right-32 w-3 h-3 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
      <div className="absolute bottom-40 left-40 w-5 h-5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.8s" }} />
      <div className="absolute bottom-24 right-24 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "1.2s" }} />

      {/* Rayos */}
      <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-pulse" />
      <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent animate-pulse" />
    </div>

    {/* LOGO animado */}
    <div className="relative z-10 mb-8 animate-float">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse" />
      <div className="relative">
        <img
          src="/preicmalogo.webp"
          alt="PRE-ICMA Logo"
          className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover"
        />
        {/* Anillo giratorio */}
        <div
          className="absolute inset-0 border-4 border-transparent border-t-blue-400 border-r-cyan-400 rounded-full animate-spin"
          style={{ animationDuration: "3s" }}
        />
      </div>
    </div>

    {/* CARD */}
    <div className="relative z-10 w-[90%] md:w-[500px] animate-slide-up">
      <div className="relative p-[3px] rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#3B82F6,#06B6D4,#8B5CF6,#EC4899,#3B82F6)] animate-[spin_4s_linear_infinite]" />
        
        <div className="relative bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900 rounded-3xl p-8 md:p-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-black text-white mb-2">
              Iniciar Sesión
            </h2>
            <p className="text-gray-300 text-sm">
              Bienvenido de nuevo
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <input
              name="email"
              type="email"
              onChange={handleChange}
              className="w-full bg-slate-800/80 border-2 border-gray-700 focus:border-blue-400 text-white p-4 rounded-2xl outline-none transition-all placeholder-gray-500"
              placeholder="Correo electrónico"
            />

            <input
              name="password"
              type="password"
              onChange={handleChange}
              className="w-full bg-slate-800/80 border-2 border-gray-700 focus:border-purple-400 text-white p-4 rounded-2xl outline-none transition-all placeholder-gray-500"
              placeholder="Contraseña"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 text-white font-bold py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl"
          >
            Ingresar
          </button>

          <p className="text-center text-gray-300 text-sm mt-6">
            ¿No tienes una cuenta?{" "}
            <a href="/register" className="text-cyan-400 font-semibold hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

}
