"use client";
// 27/12/2024, Jose Díaz, Vista para creación de cuadernillos con asignación de materias
// Esta vista permite crear un nuevo registro de cuadernillo y relacionarlo con materias existentes mediante checkboxes.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, 
  BookOpen, 
  Layers, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  ArrowLeft 
} from "lucide-react";
import { obtenerMaterias, crearCuadernillo } from "../../../../services/bookletService"; 

export default function CrearCuadernillo() {
  const router = useRouter();
  
  // Estados de carga y datos
  // loading: Controla el estado visual de carga durante peticiones asíncronas
  const [loading, setLoading] = useState(false);
  const [materiasDisponibles, setMateriasDisponibles] = useState([]);
  
  // notification: Gestiona la visualización de mensajes de éxito o error (Toast)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // Estado del formulario
  // Mantiene los valores de los inputs controlados
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    estado: "activo", // Valor por defecto para nuevos registros
  });
  
  // Estado para materias seleccionadas (Array de IDs)
  const [selectedMaterias, setSelectedMaterias] = useState([]);

  // 27/12/2024, Jose Díaz, Fetch inicial de datos
  // Carga las materias disponibles al montar el componente para poblar el selector
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const data = await obtenerMaterias();
        setMateriasDisponibles(data || []);
      } catch (error) {
        console.error("Error al cargar materias:", error);
        mostrarNotificacion("Error al cargar las materias disponibles", "error");
      }
    };
    fetchMaterias();
  }, []);

  // --- Manejadores de Eventos (Handlers) ---

  // Actualiza el estado del formulario cuando el usuario escribe en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Navegación hacia atrás
  // Redirige al usuario al panel principal de administración
  const handleBack = () => {
    router.push('/admin');
  };

  // Gestiona la selección múltiple de materias
  // Si el ID ya existe en el array, lo elimina; si no, lo agrega.
  const toggleMateria = (id) => {
    setSelectedMaterias(prev => 
      prev.includes(id) 
        ? prev.filter(mId => mId !== id)
        : [...prev, id]
    );
  };

  // Muestra una notificación temporal en la interfaz
  const mostrarNotificacion = (msg, type) => {
    setNotification({ show: true, message: msg, type });
    // Oculta la notificación automáticamente después de 3 segundos
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  // Procesa el envío del formulario
  // Realiza validaciones y llama al servicio de creación
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones de campos requeridos
    if (!formData.titulo.trim()) return mostrarNotificacion("El nombre es obligatorio", "error");
    if (!formData.descripcion.trim()) return mostrarNotificacion("La descripción es obligatoria", "error");
    if (selectedMaterias.length === 0) return mostrarNotificacion("Selecciona al menos una materia", "error");

    setLoading(true);
    try {
      // Llamada al servicio externo
      await crearCuadernillo(formData, selectedMaterias);
      mostrarNotificacion("¡Cuadernillo creado con éxito!", "success");
      
      // Reset del formulario tras éxito
      setTimeout(() => {
        setFormData({ titulo: "", descripcion: "", estado: "activo" });
        setSelectedMaterias([]);
      }, 2000);
      
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al guardar en base de datos", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 animate-fade-in">
      
      {/* Botón Volver */}
      <button 
        onClick={handleBack}
        className="group flex cursor-pointer items-center gap-2 text-gray-400 hover:text-white mb-6 transition-all duration-200 hover:-translate-x-1"
      >
        <ArrowLeft size={20} className="group-hover:text-purple-400 cursor-pointer transition-colors" />
        <span className="text-sm font-medium">Volver al Panel de Administración</span>
      </button>

      {/* Encabezado */}
      <div className="mb-8 flex items-center gap-3">
        <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-500/30">
          <BookOpen className="text-purple-400" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Nuevo Cuadernillo</h1>
          <p className="text-gray-400 text-sm">Configura los detalles generales y asigna materias.</p>
        </div>
      </div>

      {/* Notificación flotante */}
      {notification.show && (
        <div className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce-in
          ${notification.type === 'success' ? 'bg-green-900/80 border-green-500 text-green-200' : 'bg-red-900/80 border-red-500 text-red-200'}
        `}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="font-semibold">{notification.message}</span>
        </div>
      )}

      {/* Formulario Estilo Bento Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Columna Izquierda: Datos Generales */}
        <div className="space-y-6">
          {/* Tarjeta Nombre y Estado */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
              <FileText size={20} /> Información Básica
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Titulo del Cuadernillo</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Ej: Cuadernillo 2024"
                  className="w-full bg-black/20 border border-purple-500/30 rounded-xl px-4 py-3 text-black placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-white" 
                  // Nota: Corregí text-black a text-white para asegurar visibilidad en fondo oscuro
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 ml-1 uppercase">Estado</label>
                <div className="relative">
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full appearance-none bg-black/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="activo" className="bg-slate-900 text-white">Activo (Visible)</option>
                    <option value="borrador" className="bg-slate-900 text-gray-400">Borrador (Oculto)</option>
                    <option value="archivado" className="bg-slate-900 text-red-400">Archivado</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-purple-500">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta Descripción */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 h-fit">
            <label className="block text-xs font-bold text-gray-400 mb-2 ml-1 uppercase">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="4"
              placeholder="Describe el objetivo de este cuadernillo..."
              className="w-full bg-black/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Columna Derecha: Materias y Acción */}
        <div className="flex flex-col gap-6">
          
          {/* Selector de Materias */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-cyan-300 mb-2 flex items-center gap-2">
              <Layers size={20} /> Materias Asociadas
            </h3>
            <p className="text-xs text-gray-400 mb-4">Selecciona una o más materias para este cuadernillo.</p>
            
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
              {materiasDisponibles.length > 0 ? (
                materiasDisponibles.map((materia) => {
                  const isSelected = selectedMaterias.includes(materia.id);
                  return (
                    <div
                      key={materia.id}
                      onClick={() => toggleMateria(materia.id)}
                      className={`
                        cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between group
                        ${isSelected 
                          ? 'bg-cyan-500/20 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                          : 'bg-black/20 border-white/10 hover:border-cyan-500/50 hover:bg-white/5'}
                      `}
                    >
                      <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {materia.nombre}
                      </span>
                      {isSelected && <CheckCircle size={16} className="text-cyan-400" />}
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm col-span-2 text-center py-4">Cargando materias...</p>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs text-gray-400">Seleccionadas:</span>
              <span className="text-sm font-bold text-cyan-400 bg-cyan-900/30 px-3 py-1 rounded-full border border-cyan-500/30">
                {selectedMaterias.length}
              </span>
            </div>
          </div>

          {/* Botón de Guardar */}
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300
              ${loading 
                ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-[1.02] cursor-pointer active:scale-95'}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save size={24} /> Crear Cuadernillo
              </>
            )}
          </button>

        </div>
      </form>

      {/* Estilos locales para scrollbar y animaciones */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.6);
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}