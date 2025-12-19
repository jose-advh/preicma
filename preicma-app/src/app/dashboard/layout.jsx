"use client";
import { useState } from "react";

function SidebarLink({ href = "#", icon, alt, label, color = "#a60ffa" }) {
  const isLogout = label === "Cerrar Sesión";
  const textColor = isLogout ? color : "#ffffff";

  return (
    <a
      href={href}
      className="relative w-[85%] flex items-center gap-3 rounded-xl border px-3 py-2.5 overflow-hidden transition-all duration-300 group"
      style={{ borderColor: color }}
    >
      {/* Fondo hover */}
      <span
        className="absolute inset-0 w-0 group-hover:w-full transition-all duration-500"
        style={{ backgroundColor: color, opacity: 0.15 }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex items-center gap-3">
        <img src={icon} alt={alt} className="w-6" />
        <span className="text-sm font-semibold" style={{ color: textColor }}>
          {label}
        </span>
      </div>
    </a>
  );
}

export default function LayoutDashboard({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="fixed top-5 left-5 z-[60] md:hidden"
      >
        <img
          src={menuAbierto ? "/icons/line-md--close.svg" : "/icons/jam--menu.svg"}
          alt="menu"
          className="w-8 h-8"
        />
      </button>
      <aside
        className={`fixed md:static z-50 bg-[#001F3F] w-[85%] md:w-[18rem]
        h-screen flex flex-col px-5 py-5 shadow-xl
        transition-transform duration-500
        ${menuAbierto ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 border-b border-purple-500/20 pb-2">
          <img
            src="/preicmalogo.webp"
            alt="Logo PRE-ICMA"
            className="w-10 rounded-full"
          />
          <div>
            <h2 className="font-bold text-base bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              PRE-ICMA
            </h2>
            <p className="text-gray-400 text-[11px] leading-tight">
              Cumple tus sueños
            </p>
          </div>
        </div>

        {/* iconos de navegacion */}
        <nav className="flex flex-col justify-center items-center gap-7 mt-3 py-35">
          <SidebarLink
            icon="/icons/gridicons--house.svg"
            alt="Inicio"
            label="Inicio"
          />
          <SidebarLink
            icon="/icons/mynaui--folder-solid.svg"
            alt="Mis Rutas"
            label="Mis Rutas"
          />
          <SidebarLink
            icon="/icons/game-icons--progression.svg"
            alt="Mi Progreso"
            label="Mi Progreso"
          />
          <SidebarLink
            icon="/icons/ion--rocket.svg"
            alt="Ponte a Prueba"
            label="Ponte a Prueba"
          />
        </nav>

        {/* FOOTER */}
        <div className="mt-auto pt-4 flex justify-center">
          <SidebarLink
            icon="/icons/line-md--close.svg"
            alt="Cerrar sesión"
            label="Cerrar Sesión"
            color="#ff3b3b"
          />
        </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden z-40"
        />
      )}

      {/* MAIN (SCROLLABLE) */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-950">
        {children}
      </main>
    </div>
  );
}
