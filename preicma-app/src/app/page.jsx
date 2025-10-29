"use client";
import { useState, useEffect } from "react";
import { loginUsuario } from "@/services/authService";
import { animate } from "popmotion";

const Modal = ({ message, type, onClose }) => {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(-30);

  useEffect(() => {
    animate({
      from: { opacity: 0, y: -30 },
      to: { opacity: 1, y: 0 },
      duration: 400,
      onUpdate: (v) => {
        setOpacity(v.opacity);
        setTranslateY(v.y);
      },
    });
  }, []);

  const handleClose = () => {
    animate({
      from: { opacity: 1, y: 0 },
      to: { opacity: 0, y: -30 },
      duration: 400,
      onUpdate: (v) => {
        setOpacity(v.opacity);
        setTranslateY(v.y);
      },
      onComplete: onClose,
    });
  };

  const color =
    type === "error"
      ? "bg-red-500"
      : type === "success"
      ? "bg-green-500"
      : "bg-blue-500";

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "all 0.3s ease-out",
      }}
      className={`${color} fixed top-10 left-1/2 transform -translate-x-1/2 text-white p-4 px-8 rounded-xl shadow-lg z-50`}
    >
      <div className="flex justify-between items-center gap-4">
        <p className="font-semibold">{message}</p>
        <button
          onClick={handleClose}
          className="font-bold text-white text-xl hover:opacity-80"
        >
          ×
        </button>
      </div>
    </div>
  );
};

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
      if (error.message.includes("Invalid login credentials")) {
        mensaje = "Credenciales inválidas. Verifica tu correo y contraseña.";
      } else if (error.message.includes("Email not confirmed")) {
        mensaje = "Debes confirmar tu correo antes de iniciar sesión.";
      } else if (error.message.includes("User not found")) {
        mensaje = "No se encontró un usuario con ese correo.";
      } else if (error.message.includes("Password")) {
        mensaje = "Contraseña incorrecta.";
      }

      setModal({ show: true, message: mensaje, type: "error" });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-blue border relative">
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: "", type: "" })}
        />
      )}

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
          Iniciar Sesión
        </h2>

        <input
          name="email"
          type="email"
          onChange={handleChange}
          className="shadow-md p-2 rounded-xl w-[80%]"
          placeholder="Correo electrónico"
        />

        <input
          name="password"
          type="password"
          onChange={handleChange}
          className="shadow-md p-2 rounded-xl w-[80%]"
          placeholder="Contraseña"
        />

        <button
          type="button"
          onClick={handleLogin}
          className="bg-black/50 cursor-pointer p-2 px-6 rounded-xl text-white font-bold"
        >
          Ingresar
        </button>

        <a href="/register" className="text-white text-2xl font-bold">
          Crear una cuenta
        </a>
      </form>
    </div>
  );
}
