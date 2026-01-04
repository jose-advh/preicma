"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // 1. Importar useRouter
import { obtenerSimulacros } from "../../../services/cuadernilloService"; 

export default function Rutas() {
  const [simulacros, setSimulacros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter(); // 2. Inicializar router

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerSimulacros();
        setSimulacros(data);
      } catch (err) {
        console.error("Error cargando simulacros:", err);
        setError("No se pudieron cargar los simulacros.");
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  const handleSeleccionarSimulacro = (id) => {
    // 3. Redirigir a la página de prueba pasando el ID como parámetro
    router.push(`/dashboard/prueba?id=${id}`);
  };

  if (loading) {
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg font-[family-name:var(--font-geist-sans)] text-purple-200 animate-pulse">
            Cargando rutas...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2 tracking-tight bg-gradient-to-r from-white via-purple-100 to-gray-300 bg-clip-text text-transparent">
            Cuadernillos Disponibles
          </h1>
          <p className="text-gray-400 text-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Selecciona un cuadernillo para comenzar tu práctica.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-red-200 bg-red-900/30 border border-red-500/50 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulacros.length > 0 ? (
            simulacros.map((sim) => (
              <article
                key={sim.id}
                className="group relative bg-slate-900/40 backdrop-blur-md border border-purple-500/20 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {sim.titulo}
                    </h2>
                    <div className="bg-purple-500/20 p-2 rounded-lg">
                      <img src="/icons/mynaui--folder-solid.svg" className="w-6 h-6 invert opacity-70" alt="icon" />
                    </div>
                  </div>
                  
                  <p className="text-gray-400 mb-6 text-sm leading-relaxed border-l-2 border-purple-500/30 pl-3">
                    {sim.descripcion || "Sin descripción disponible para este simulacro."}
                  </p>
                </div>

                <button
                  onClick={() => handleSeleccionarSimulacro(sim.id)}
                  className="relative z-10 w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300
                    bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500
                    text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-500/40
                    transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Iniciar Cuadernillo
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-gray-700">
              <p className="text-gray-500 text-lg">No hay cuadernillos disponibles en este momento.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}