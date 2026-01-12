"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { supabase } from "../../lib/supabaseClient";
import Modal from "../../components/Modal";

export default function Register() {
  const router = useRouter(); 

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
    adminCode: "", // Nuevo campo para el código
  });

  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    // 1. Validación de campos vacíos básicos
    if (!formData.nombre || !formData.email || !formData.password || !formData.rol) {
      setModal({
        show: true,
        message: "Por favor completa todos los campos",
        type: "error",
      });
      return;
    }

    // 2. Validación ESPECÍFICA para Educador (Admin)
    if (formData.rol === "admin") {
      if (formData.adminCode !== "03262730") {
        setModal({
          show: true,
          message: "Código de educador inválido. Acceso denegado.",
          type: "error",
        });
        return; // Detenemos la ejecución si el código no coincide
      }
    }

    try {
      // 3. Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      const userId = authData?.user?.id;
      if (!userId) throw new Error("No se pudo obtener el ID del usuario.");

      // 4. Crear registro en tu tabla de usuarios personalizada
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          nombre: formData.nombre,
          correo: formData.email,
          rol: formData.rol,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // 5. Mostrar mensaje de éxito
      setModal({
        show: true,
        message: "Cuenta creada con éxito. Redirigiendo...",
        type: "success",
      });

      // Limpiar formulario
      setFormData({
        nombre: "",
        email: "",
        password: "",
        rol: "",
        adminCode: "",
      });

      // Redirigir al Login después de 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error) {
      setModal({
        show: true,
        message: `Error: ${error.message}`,
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center gap-3 items-center min-h-screen bg-blue">
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false })}
        />
      )}

      <img
        src="/preicmalogo.webp"
        className="w-[30%] md:w-[10%] rounded-full"
        alt="Logo Preicma"
      />

      <form
        className="flex flex-col items-center gap-5 w-[90%] md:w-[35%] h-auto py-10 p-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl text-center text-white font-bold">
          ¡Bienvenido!
        </h2>
        <div className="w-[90%] md:w-[80%]">
          <div className="flex flex-col gap-5 w-full">
            <input
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              className="shadow-md p-2 rounded-xl w-full input-white"
              placeholder="Usuario"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow-md p-2 rounded-xl w-full input-white" 
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow-md p-2 rounded-xl w-full input-white"
              placeholder="Contraseña"
            />
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="shadow-md bg-white rounded-xl p-2 w-full input-white"
            >
              <option value="">Elige tu Rol</option>
              <option value="Estudiante">Estudiante</option>
              <option value="admin">Educador</option>
            </select>

            {/* INPUT CONDICIONAL: Solo aparece si el rol es admin */}
            {formData.rol === "admin" && (
              <div className="animate-fade-in-down">
                <input
                  name="adminCode"
                  type="text" // Tipo texto para evitar flechas de número, o "password" si quieres ocultarlo
                  value={formData.adminCode}
                  onChange={handleChange}
                  className="shadow-md p-2 rounded-xl w-full border-2 border-yellow-400 bg-yellow-50 text-black placeholder-gray-500"
                  placeholder="Ingresa código de Educador"
                />
                <p className="text-xs text-yellow-300 mt-1 ml-1">* Código requerido para este rol</p>
              </div>
            )}

          </div>
          <p className="text-white mt-5">
            ¿Ya tienes una cuenta?{" "}
            <a href="/" className="text-[#38BDF8]">
              Inicia Sesión aquí
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={handleRegister}
          className="bg-black/50 p-2 px-6 rounded-xl text-white font-bold cursor-pointer hover:bg-black/70 transition-colors"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}