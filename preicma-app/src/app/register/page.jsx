"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { crearUsuario } from "@/services/usuarioService";

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const userId = authData?.user?.id;
      if (!userId) throw new Error("No se pudo obtener el ID del usuario.");

      const usuario = {
        id: userId,
        nombre: formData.nombre,
        correo: formData.email,
        rol: formData.rol,
      };

      await crearUsuario(usuario);

      alert("¡Cuenta creada! Revisa tu correo para confirmar.");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="flex flex-col justify-center gap-3 items-center min-h-screen bg-blue border">
      <img
        src="/preicmalogo.webp"
        className="w-[30%] md:w-[10%] rounded-full"
        alt="Preicma logo"
      />
      <form
        className="flex flex-col justify-around items-center gap-5 w-[90%] md:w-[35%] h-[60vh] p-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl text-center text-white font-bold">
          ¡Bienvenido!
        </h2>
        <input
          name="nombre"
          type="text"
          onChange={handleChange}
          className="shadow-md p-2 rounded-xl w-[80%]"
          placeholder="Usuario"
        />
        <input
          name="email"
          type="text"
          onChange={handleChange}
          className="shadow-md p-2 rounded-xl w-[80%]"
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          className="shadow-md p-2 rounded-xl w-[80%]"
          placeholder="Contraseña"
        />
        <select
          name="rol"
          onChange={handleChange}
          className="shadow-md bg-white border-gray-300 rounded-xl p-2 w-[80%]"
        >
          <option value="">Elige tu Rol</option>
          <option value="Estudiante">Estudiante</option>
          <option value="Educador">Educador</option>
        </select>

        <button
          type="button"
          onClick={handleRegister}
          className="bg-black/50 cursor-pointer p-2 px-6 rounded-xl text-white font-bold"
        >
          Confirmar
        </button>
        <a href="/" className="text-white text-2xl font-bold">
          Iniciar Sesión
        </a>
      </form>
    </div>
  );
}
