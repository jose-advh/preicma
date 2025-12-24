"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, ImagePlus, FileText, HelpCircle, CheckCircle2, 
  Plus, Trash2, Loader2, ImageIcon, Type, BookOpen, Layers
} from "lucide-react";
import { crearPreguntaCompleta, obtenerSimulacros, obtenerMaterias } from "../../../../services/questionService"; 

export default function CrearPregunta() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const [simulacros, setSimulacros] = useState([]); 
  const [materias, setMaterias] = useState([]);
  
  const [selectedSimulacro, setSelectedSimulacro] = useState(""); 
  const [selectedMateria, setSelectedMateria] = useState("");

  const [textoEnunciado, setTextoEnunciado] = useState("");
  const [textoPregunta, setTextoPregunta] = useState("");
  const [imagenesEnunciado, setImagenesEnunciado] = useState([]);

  const [opciones, setOpciones] = useState([
    { tipo: 'texto', valor: '', file: null, preview: null },
    { tipo: 'texto', valor: '', file: null, preview: null },
    { tipo: 'texto', valor: '', file: null, preview: null },
    { tipo: 'texto', valor: '', file: null, preview: null }
  ]);
  
  const [indiceCorrecta, setIndiceCorrecta] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [simData, matData] = await Promise.all([
            obtenerSimulacros(),
            obtenerMaterias()
        ]);
        setSimulacros(simData || []);
        setMaterias(matData || []);
      } catch (error) {
        console.error(error);
        mostrarNotificacion("Error cargando datos iniciales", "error");
      }
    };
    fetchData();
  }, []);

  const mostrarNotificacion = (msg, type) => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  const handleEnunciadoImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length === 0) return;
    const nuevosItems = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      orden: "3" 
    }));
    setImagenesEnunciado(prev => [...prev, ...nuevosItems]);
  };

  const removeEnunciadoImage = (index) => {
    setImagenesEnunciado(prev => prev.filter((_, i) => i !== index));
  };

  const updateOrdenImagen = (index, nuevoOrden) => {
    const copia = [...imagenesEnunciado];
    copia[index].orden = nuevoOrden;
    setImagenesEnunciado(copia);
  };

  const addOption = () => {
    if (opciones.length < 6) {
      setOpciones([...opciones, { tipo: 'texto', valor: '', file: null, preview: null }]);
    }
  };

  const removeOption = (index) => {
    if (opciones.length > 4) {
      const nuevas = opciones.filter((_, i) => i !== index);
      setOpciones(nuevas);
      if (indiceCorrecta === index) setIndiceCorrecta(null);
      if (indiceCorrecta > index) setIndiceCorrecta(indiceCorrecta - 1);
    }
  };

  const changeOptionType = (index, tipo) => {
    const copia = [...opciones];
    copia[index].tipo = tipo;
    copia[index].valor = "";
    copia[index].file = null;
    copia[index].preview = null;
    setOpciones(copia);
  };

  const handleOptionTextChange = (index, val) => {
    const copia = [...opciones];
    copia[index].valor = val;
    setOpciones(copia);
  };

  const handleOptionImageUpload = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const copia = [...opciones];
      copia[index].file = file;
      copia[index].preview = URL.createObjectURL(file);
      setOpciones(copia);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSimulacro) return mostrarNotificacion("Selecciona un cuadernillo", "error");
    if (!selectedMateria) return mostrarNotificacion("Selecciona una materia", "error");
    if (!textoEnunciado.trim()) return mostrarNotificacion("Falta el enunciado", "error");
    if (!textoPregunta.trim()) return mostrarNotificacion("Falta la pregunta", "error");
    if (indiceCorrecta === null) return mostrarNotificacion("Selecciona la respuesta correcta", "error");
    
    const opcionesInvalidas = opciones.some(op => 
      (op.tipo === 'texto' && !op.valor.trim()) || 
      (op.tipo === 'imagen' && !op.file)
    );
    if (opcionesInvalidas) return mostrarNotificacion("Completa todas las opciones", "error");

    setLoading(true);

    try {
      await crearPreguntaCompleta(
        selectedSimulacro,
        selectedMateria,
        textoEnunciado,
        imagenesEnunciado, 
        textoPregunta,
        opciones, 
        indiceCorrecta
      );

      mostrarNotificacion("¡Pregunta guardada correctamente!", "success");
      
      setTimeout(() => {
        window.location.reload(); 
      }, 1500);

    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al guardar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 animate-fade-in pb-20">
      
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-cyan-600/20 rounded-xl border border-cyan-500/30">
          <HelpCircle className="text-cyan-400" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white">Gestor de Preguntas</h1>
      </div>

      {notification.show && (
        <div className={`fixed top-5 right-5 z-[60] px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce-in backdrop-blur-md ${notification.type === 'success' ? 'bg-green-900/80 border-green-500' : 'bg-red-900/80 border-red-500'}`}>
          <span className="font-semibold text-white">{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-md border border-indigo-500/30 rounded-3xl p-6 flex flex-col gap-4 shadow-lg shadow-indigo-500/10">
                <div className="flex items-center gap-3 text-indigo-300">
                    <BookOpen size={24} />
                    <h3 className="text-lg font-semibold">Cuadernillo:</h3>
                </div>
                <div className="w-full relative group">
                    <select
                        value={selectedSimulacro}
                        onChange={(e) => setSelectedSimulacro(e.target.value)}
                        className="w-full appearance-none bg-black/40 text-white border border-indigo-500/30 rounded-xl px-5 py-3 pr-10 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all cursor-pointer font-medium"
                    >
                        <option value="" className="bg-slate-900 text-gray-400">-- Selecciona --</option>
                        {simulacros.map((sim) => (
                            <option key={sim.id} value={sim.id} className="bg-slate-900 text-white">
                                {sim.titulo}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 group-hover:text-indigo-200 transition-colors">
                        ▼
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-pink-500/30 rounded-3xl p-6 flex flex-col gap-4 shadow-lg shadow-pink-500/10">
                <div className="flex items-center gap-3 text-pink-300">
                    <Layers size={24} />
                    <h3 className="text-lg font-semibold">Materia:</h3>
                </div>
                <div className="w-full relative group">
                    <select
                        value={selectedMateria}
                        onChange={(e) => setSelectedMateria(e.target.value)}
                        className="w-full appearance-none bg-black/40 text-white border border-pink-500/30 rounded-xl px-5 py-3 pr-10 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all cursor-pointer font-medium"
                    >
                        <option value="" className="bg-slate-900 text-gray-400">-- Selecciona --</option>
                        {materias.map((mat) => (
                            <option key={mat.id} value={mat.id} className="bg-slate-900 text-white">
                                {mat.nombre}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-pink-400 group-hover:text-pink-200 transition-colors">
                        ▼
                    </div>
                </div>
            </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2"><FileText size={20} /> Enunciado</h3>
            <textarea
              value={textoEnunciado}
              onChange={(e) => setTextoEnunciado(e.target.value)}
              placeholder="Escribe el texto del enunciado..."
              className="flex-1 min-h-[200px] bg-black/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all resize-none"
            />
          </div>

          <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2"><ImagePlus size={20} /> Imágenes (Enunciado)</h3>
            
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-purple-500/30 rounded-xl hover:bg-purple-500/10 cursor-pointer mb-4">
              <span className="text-xs text-gray-400">Click para subir</span>
              <input type="file" className="hidden" multiple accept="image/*" onChange={handleEnunciadoImageChange} />
            </label>

            <div className="flex-1 overflow-y-auto max-h-[250px] custom-scrollbar space-y-3">
              {imagenesEnunciado.map((img, idx) => (
                <div key={idx} className="bg-black/40 p-2 rounded-lg border border-white/10 flex gap-3 items-center">
                  <img src={img.preview} alt="preview" className="w-16 h-16 object-cover rounded-md" />
                  <div className="flex-1">
                    <label className="text-[10px] text-gray-400 block mb-1">Posición:</label>
                    <select 
                      value={img.orden}
                      onChange={(e) => updateOrdenImagen(idx, e.target.value)}
                      className="w-full bg-slate-800 text-white text-xs p-1 rounded border border-white/20 focus:outline-none"
                    >
                      <option value="1">1 - Arriba</option>
                      <option value="2">2 - Centro</option>
                      <option value="3">3 - Abajo</option>
                    </select>
                  </div>
                  <button type="button" onClick={() => removeEnunciadoImage(idx)} className="text-red-400 p-1 hover:bg-white/5 rounded">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2"><HelpCircle size={20} /> Pregunta</h3>
          <input
            type="text"
            value={textoPregunta}
            onChange={(e) => setTextoPregunta(e.target.value)}
            placeholder="¿Cuál es la pregunta?"
            className="w-full bg-black/20 border border-cyan-500/30 rounded-xl px-4 py-4 text-lg text-black placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
          />
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-green-500/20 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2"><CheckCircle2 size={20} /> Opciones</h3>
            {opciones.length < 6 && (
              <button type="button" onClick={addOption} className="text-xs font-bold bg-green-600/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30 flex gap-1 items-center">
                <Plus size={14} /> AÑADIR
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opciones.map((op, idx) => (
              <div key={idx} className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col gap-2 ${indiceCorrecta === idx ? 'bg-green-500/10 border-green-500' : 'bg-black/20 border-white/10'}`}>
                
                <div className="flex items-center gap-3">
                  <div 
                    onClick={() => setIndiceCorrecta(idx)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${indiceCorrecta === idx ? 'border-green-500 bg-green-500' : 'border-gray-500'}`}
                  >
                    {indiceCorrecta === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <span className="text-xs font-bold text-gray-500">Opción {String.fromCharCode(65 + idx)}</span>

                  <div className="ml-auto flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                    <button
                      type="button"
                      onClick={() => changeOptionType(idx, 'texto')}
                      className={`p-1.5 rounded-md transition-all ${op.tipo === 'texto' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="Texto"
                    >
                      <Type size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => changeOptionType(idx, 'imagen')}
                      className={`p-1.5 rounded-md transition-all ${op.tipo === 'imagen' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}
                      title="Imagen"
                    >
                      <ImageIcon size={14} />
                    </button>
                  </div>

                  {opciones.length > 4 && (
                    <button type="button" onClick={() => removeOption(idx)} className="text-gray-600 hover:text-red-400 ml-1">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="mt-1">
                  {op.tipo === 'texto' ? (
                    <input
                      type="text"
                      value={op.valor}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder="Escribe la opcion..."
                      className="w-full bg-white rounded-lg text-black placeholder-gray-500 text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3">
                      <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs py-2 px-3 rounded border border-white/10 flex items-center justify-center gap-2 transition-colors">
                        <ImagePlus size={14} />
                        {op.file ? "Cambiar Imagen" : "Subir Imagen"}
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleOptionImageUpload(idx, e)} />
                      </label>
                      {op.preview && (
                        <div className="w-12 h-12 rounded overflow-hidden border border-white/20 bg-black">
                          <img src={op.preview} alt="preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white flex items-center gap-3 hover:scale-[1.02] transition-transform">
            {loading ? <Loader2 className="animate-spin" /> : <Save />} Guardar Pregunta
          </button>
        </div>
      </form>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #8b5cf6; border-radius: 4px; }
      `}</style>
    </div>
  );
}