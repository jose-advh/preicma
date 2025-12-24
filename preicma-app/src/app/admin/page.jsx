"use client";
import { useState } from "react";
import { 
  BookPlus, 
  BookOpenCheck, 
  FileQuestion, 
  FileEdit, 
  LayoutDashboard,
  Sparkles
} from "lucide-react";

function BentoCard({ title, subtitle, icon: Icon, color, onClick, className = "" }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-md p-6 transition-all duration-300 ${className}`}
      style={{
        boxShadow: isHovered ? `0 0 30px ${color}20` : 'none',
        borderColor: isHovered ? `${color}50` : 'rgba(255,255,255,0.1)'
      }}
    >
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-20' : 'opacity-0'}`}
        style={{ background: `radial-gradient(circle at center, ${color}, transparent 70%)` }}
      />

      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full transition-all duration-500 blur-2xl
        ${isHovered ? 'opacity-40 scale-150' : 'opacity-10 scale-100'}`}
        style={{ backgroundColor: color }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div 
          className="mb-4 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon 
            size={28} 
            className="transition-colors duration-300"
            style={{ color: isHovered ? '#fff' : color }} 
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
            {title}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
            {subtitle}
          </p>
        </div>

        <div className={`absolute bottom-6 right-6 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
           <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke={color} 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const actions = [
    {
      id: "create-booklet",
      title: "Crear Cuadernillo",
      subtitle: "Diseña nuevos módulos de aprendizaje",
      icon: BookPlus,
      color: "#8b5cf6", 
      colSpan: "col-span-1 md:col-span-2 lg:col-span-2", 
      action: () => console.log("Crear cuadernillo")
    },
    {
      id: "edit-booklet",
      title: "Editar Cuadernillos",
      subtitle: "Gestiona el contenido existente",
      icon: BookOpenCheck,
      color: "#06b6d4", // Cyan
      colSpan: "col-span-1", 
      action: () => console.log("Editar cuadernillo")
    },
    {
      id: "create-question",
      title: "Crear Preguntas",
      subtitle: "Añade nuevos retos al banco",
      icon: FileQuestion,
      color: "#f59e0b", // Amber
      colSpan: "col-span-1",
      action: () => console.log("Crear preguntas")
    },
    {
      id: "edit-question",
      title: "Editar Preguntas",
      subtitle: "Actualiza o corrige reactivos",
      icon: FileEdit,
      color: "#10b981", 
      colSpan: "col-span-1 md:col-span-2 lg:col-span-2", 
      action: () => console.log("Editar preguntas")
    }
  ];

  return (
    <div className="p-6 md:p-10 min-h-full w-full max-w-7xl mx-auto space-y-8 animate-fade-in">
      
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
            <LayoutDashboard className="text-purple-500" />
            Panel de Administración
          </h1>
          <p className="text-gray-400 mt-2">Gestiona todo el contenido educativo desde aquí.</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/30 backdrop-blur-sm">
          <Sparkles size={16} className="text-yellow-400 animate-pulse" />
          <span className="text-sm font-medium text-purple-200">Modo Superusuario Activo</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[180px]">
        
        <div className="col-span-1 md:col-span-3 lg:col-span-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-blue-900/20 to-slate-900/40 border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" /> 
            <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-2">Resumen del Sistema</h2>
                <div className="flex gap-6 mt-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-purple-400">12</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Cuadernillos</p>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="text-center">
                        <p className="text-3xl font-bold text-cyan-400">850</p>
                        <p className="text-xs text-gray-400 uppercase tracking-wide">Preguntas</p>
                    </div>
                </div>
            </div>
            <div className="relative z-10 mt-6 md:mt-0 px-6 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-sm text-gray-300">Última actualización: Hoy, 10:42 AM</span>
            </div>
        </div>

        {actions.map((action) => (
          <BentoCard
            key={action.id}
            title={action.title}
            subtitle={action.subtitle}
            icon={action.icon}
            color={action.color}
            className={action.colSpan}
            onClick={action.action}
          />
        ))}

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}