"use client";
import { useState } from "react";

function SidebarLink({ href, icon, alt, label, color = "#a60ffa" }) {
  const isLogout = label === "Cerrar Sesión";
  const textColor = isLogout ? color : "#ffffff";

  return (
    <a
      href={href}
      className="relative rounded-4xl border py-2 px-2 w-[75%] flex items-center mb-3 overflow-hidden transition-all duration-300 group"
      style={{ borderColor: color }}
    >
      {/* Fondo animado */}
      <span
        className="absolute left-0 top-0 h-full w-0 transition-all duration-500 ease-out group-hover:w-full"
        style={{
          backgroundColor: color,
          opacity: 0.2,
        }}
      ></span>

      {/* Contenido alineado */}
      <div className="z-10 flex items-center gap-[5px]">
        <img src={icon} alt={alt} className="w-[28px] md:w-[32px] px-1" />
        <span
          className="font-bold text-sm md:text-base"
          style={{ color: textColor }}
        >
          {label}
        </span>
      </div>
    </a>
  );
}

export default function LayoutDashboard({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex relative">
      {/* Botón para abrir menu */}
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="fixed top-5 left-5 z-[60] md:hidden"
      >
        <img
          src={
            menuAbierto ? "/icons/line-md--close.svg" : "/icons/jam--menu.svg"
          }
          alt={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          className="w-[32px] h-[32px] transition-transform duration-300 hover:scale-110"
        />
      </button>

      <aside
        className={`fixed md:static bg-[#001F3F] flex flex-col justify-around items-center gap-10 py-8 min-h-screen shadow-xl transition-all duration-500 ease-in-out
        ${menuAbierto ? "translate-x-0 w-[90%]" : "-translate-x-full w-[90%]"} 
        md:w-[20%] md:translate-x-0 z-[50]`}
      >
        <div className="flex gap-5 items-center justify-center">
          <img
            src="/preicmalogo.webp"
            alt="Logo de preicma"
            className="w-[60px] md:w-[25%] rounded-full"
          />
          <h2 className="text-white text-lg md:text-1xl font-bold">
            @PRE-ICMA
          </h2>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          <SidebarLink
            href="#"
            icon="/icons/gridicons--house.svg"
            alt="Icono de una casa"
            label="Inicio"
          />
          <SidebarLink
            href="#"
            icon="/icons/mynaui--folder-solid.svg"
            alt="Icono de un folder"
            label="Mis Rutas"
          />
          <SidebarLink
            href="#"
            icon="/icons/game-icons--progression.svg"
            alt="Icono de progresión"
            label="Mi Progreso"
          />
          <SidebarLink
            href="#"
            icon="/icons/ion--rocket.svg"
            alt="Icono de cohete"
            label="Ponte a Prueba"
          />
        </div>

        <SidebarLink
          href="#"
          icon="/icons/line-md--close.svg"
          alt="Icono de cerrar sesión"
          label="Cerrar Sesión"
          color="#ff3b3b"
        />
      </aside>

      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-[40] transition-opacity duration-500"
        ></div>
      )}

      {children}
    </div>
  );
}
