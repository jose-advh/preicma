"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { crearUsuario } from "@/services/usuarioService";
import Modal from "@/components/Modal";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
  });

  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      const userId = authData?.user?.id;
      if (!userId) throw new Error("No se pudo obtener el ID del usuario.");

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

      setModal({
        show: true,
        message: "¡Cuenta creada! Revisa tu correo para confirmar.",
        type: "success",
      });

      setFormData({
        nombre: "",
        email: "",
        password: "",
        rol: "",
      });
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
      />

      <form
        className="flex flex-col items-center gap-5 w-[90%] md:w-[35%] h-[60vh] p-4"
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
              className="shadow-md p-2 rounded-xl w-full"
              placeholder="Usuario"
            />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow-md p-2 rounded-xl w-full"
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow-md p-2 rounded-xl w-full"
              placeholder="Contraseña"
            />
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="shadow-md bg-white rounded-xl p-2 w-full"
            >
              <option value="">Elige tu Rol</option>
              <option value="Estudiante">Estudiante</option>
              <option value="Educador">Educador</option>
            </select>
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
          className="bg-black/50 p-2 px-6 rounded-xl text-white font-bold cursor-pointer"
        >
          Confirmar
        </button>
      </form>
    </div>
  );
}
