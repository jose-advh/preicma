"use client";
import { useState } from "react";
import { loginUsuario } from "@/services/authService";
import Modal from "@/components/Modal";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({ show: false, message: "", type: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      const data = await loginUsuario(formData.email, formData.password);
      setModal({
        show: true,
        message: "¡Inicio de sesión exitoso!",
        type: "success",
      });
      console.log("Usuario:", data.user);
    } catch (error) {
      let mensaje = "Ocurrió un error al iniciar sesión.";
      if (error.message.includes("Invalid login credentials"))
        mensaje = "Credenciales inválidas. Verifica tu correo y contraseña.";
      else if (error.message.includes("Email not confirmed"))
        mensaje = "Debes confirmar tu correo antes de iniciar sesión.";
      else if (error.message.includes("User not found"))
        mensaje = "No se encontró un usuario con ese correo.";
      else if (error.message.includes("Password"))
        mensaje = "Contraseña incorrecta.";

      setModal({ show: true, message: mensaje, type: "error" });
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

      <img src="/preicmalogo.webp" className="w-[30%] md:w-[10%] rounded-full" />

      <form
        className="flex flex-col items-center gap-5 w-[90%] md:w-[35%] h-[60vh] p-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <h2 className="text-3xl text-center text-white font-bold">
          Iniciar Sesión
        </h2>
        <div className="w-[80%]">
          <div className="flex flex-col items-center gap-5 w-full">
            <input name="email" type="email" onChange={handleChange} className="shadow-md p-2 rounded-xl w-[100%]" placeholder="Correo electrónico"/>
            <input name="password" type="password" onChange={handleChange} className="shadow-md p-2 rounded-xl w-[100%]" placeholder="Contraseña"/>
          </div>
          <p className="text-white mt-5">¿Aún no tienes una cuenta? <a href="/register" className="text-[#38BDF8]">Crea una aquí</a></p>
        </div>
        <button type="button" onClick={handleLogin} className="bg-black/50 p-2 px-6 rounded-xl text-white font-bold cursor-pointer">
          Ingresar
        </button>
      </form>
    </div>
  );
}
