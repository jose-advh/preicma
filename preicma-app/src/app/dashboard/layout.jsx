"use client";
import { useState } from "react";
import Link from "next/link"; // Importamos Link para navegación optimizada
import { usePathname } from "next/navigation"; // Importamos hook para saber la ruta actual

function SidebarLink({ href = "#", icon, alt, label, color = "#a60ffa", isActive = false, badge = null }) {
  const [isHovered, setIsHovered] = useState(false);
  const isLogout = label === "Cerrar Sesión";
  const textColor = isLogout ? color : "#ffffff";

  return (
    <Link
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 overflow-hidden transition-all duration-300 group
        ${isActive ? 'bg-purple-600/20 border-purple-500 shadow-lg shadow-purple-500/30' : 'border-transparent hover:border-purple-500/50'}
        ${isHovered ? 'scale-105 -translate-x-1' : 'scale-100'}
      `}
      style={{ 
        borderColor: isActive ? color : (isHovered ? color : 'transparent'),
        boxShadow: isActive ? `0 0 20px ${color}40` : 'none'
      }}
    >
      <span
        className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'w-full' : 'w-0'}`}
        style={{ 
          backgroundColor: color, 
          opacity: isLogout ? 0.2 : 0.15 
        }}
      />
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
          style={{ backgroundColor: color }}
        />
      )}
      <div className="relative z-10 flex items-center gap-3 w-full">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
          ${isHovered ? 'rotate-12 scale-110' : 'rotate-0 scale-100'}
        `}
        style={{ 
          backgroundColor: isHovered || isActive ? `${color}30` : 'transparent' 
        }}
        >
          <img 
            src={icon} 
            alt={alt} 
            className={`w-6 transition-all duration-300 ${isHovered ? 'brightness-125' : 'brightness-100'}`}
          />
        </div>

        {/* Texto */}
        <span 
          className={`text-sm font-bold transition-all duration-300 ${isHovered ? 'translate-x-1' : 'translate-x-0'}`}
          style={{ color: textColor }}
        >
          {label}
        </span>

        {badge && (
          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
            {badge}
          </span>
        )}

        {isHovered && !isLogout && (
          <svg 
            className="ml-auto w-4 h-4 animate-pulse" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{ color: color }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
      {isHovered && (
        <>
          <span className="absolute top-2 right-4 w-1 h-1 rounded-full bg-white/60 animate-ping" />
          <span className="absolute bottom-2 right-8 w-1 h-1 rounded-full bg-white/40 animate-ping" style={{ animationDelay: '0.2s' }} />
        </>
      )}
    </Link>
  );
}

export default function LayoutDashboard({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const pathname = usePathname(); // Obtenemos la ruta actual (ej: /dashboard/rutas)

  // Configuración de rutas (Ajusta los href según tus carpetas reales en /app)
  const navLinks = [
    { 
      href: "/dashboard", 
      icon: "/icons/gridicons--house.svg", 
      label: "Inicio", 
      color: "#8b5cf6", 
      badge: null 
    },
    { 
      href: "/dashboard/rutas", 
      icon: "/icons/mynaui--folder-solid.svg", 
      label: "Mis Rutas", 
      color: "#06b6d4", 
      badge: "3" 
    },
    { 
      href: "/dashboard/progreso", 
      icon: "/icons/game-icons--progression.svg", 
      label: "Mi Progreso", 
      color: "#10b981", 
      badge: null 
    },
    { 
      href: "/dashboard/cuadernillos", 
      icon: "/icons/ion--rocket.svg", 
      label: "Ponte a Prueba", 
      color: "#f59e0b", 
      badge: "NEW" 
    },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 text-white overflow-hidden">
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="fixed top-5 left-5 z-[60] md:hidden bg-purple-600 hover:bg-purple-700 p-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-110"
      >
        <img
          src={menuAbierto ? "/icons/line-md--close.svg" : "/icons/jam--menu.svg"}
          alt="menu"
          className="w-6 h-6"
        />
      </button>

      <aside
        className={`fixed md:static z-50 bg-gradient-to-b from-[#001F3F] via-[#001a35] to-[#00152b]
        w-[85%] md:w-[20rem] h-screen flex flex-col px-6 py-6 shadow-2xl
        border-r border-purple-500/20
        transition-transform duration-500 ease-in-out
        ${menuAbierto ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <div className="relative bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          
          <div className="relative flex items-center gap-3">
            <div className="relative">
              <img
                src="/preicmalogo.webp"
                alt="Logo PRE-ICMA"
                className="w-14 h-14 rounded-full ring-2 ring-purple-400/50 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#001F3F] rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-lg bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                PRE-ICMA
              </h2>
              <p className="text-gray-400 text-xs leading-tight flex items-center gap-1">
                <img className="w-5" src="/star.png" alt="estrella" />
                Cumple tus sueños
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-purple-600/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
            <p className="text-2xl font-bold text-purple-400">7</p>
            <p className="text-xs text-gray-400">Racha</p>
          </div>
          <div className="bg-cyan-600/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-3 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
            <p className="text-2xl font-bold text-cyan-400">24</p>
            <p className="text-xs text-gray-400">Lecciones</p>
          </div>
        </div>

        <nav className="flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">
            Navegación
          </p>
          {navLinks.map((link) => (
            // Ya no necesitamos onClick para setActiveLink, usamos pathname
            <div key={link.label}>
              <SidebarLink
                href={link.href}
                icon={link.icon}
                alt={link.label}
                label={link.label}
                color={link.color}
                // isActive se calcula automáticamente comparando la URL actual con el href del link
                isActive={pathname === link.href}
                badge={link.badge}
              />
            </div>
          ))}
        </nav>

        <div className="mt-6 mb-4 bg-gradient-to-br from-green-600/20 to-emerald-600/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-300">Progreso Diario</p>
            <p className="text-xs font-bold text-green-400">75%</p>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: '75%' }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">3 de 4 lecciones completadas</p>
        </div>

        <div className="pt-4 border-t border-purple-500/20">
          <SidebarLink
            href="/" // Redirige al inicio (landing page) al cerrar sesión
            icon="/icons/line-md--close.svg"
            alt="Cerrar sesión"
            label="Cerrar Sesión"
            color="#ff3b3b"
          />
        </div>
      </aside>

      {menuAbierto && (
        <div
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40 animate-fade-in"
        />
      )}

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8b5cf688;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #8b5cf6;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}