"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Save, ImagePlus, FileText, HelpCircle, CheckCircle2, 
  Plus, Trash2, Loader2, ImageIcon, Type, ArrowLeft,
  Search, Edit3, RefreshCw
} from "lucide-react";

// Importamos tus servicios actualizados
import { 
  obtenerSimulacros, 
  obtenerMaterias, 
  obtenerPreguntasPorFiltro, 
  actualizarPreguntaCompleta 
} from "../../../../services/questionService"; 

export default function EditarPregunta() {
  const router = useRouter();
  
  // --- Estados Generales ---
  const [loading, setLoading] = useState(false);
  const [loadingPreguntas, setLoadingPreguntas] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  // --- Estados de Búsqueda ---
  const [simulacros, setSimulacros] = useState([]); 
  const [materias, setMaterias] = useState([]);
  const [listaPreguntas, setListaPreguntas] = useState([]);
  
  const [selectedSimulacro, setSelectedSimulacro] = useState(""); 
  const [selectedMateria, setSelectedMateria] = useState("");
  const [selectedPreguntaId, setSelectedPreguntaId] = useState(""); 

  // --- Estados del Formulario (Edición) ---
  const [idEnunciado, setIdEnunciado] = useState(null);
  const [textoEnunciado, setTextoEnunciado] = useState("");
  const [textoPregunta, setTextoPregunta] = useState("");
  
  // Estructura: { id: number|null, preview: string, file: File|null, orden: number }
  const [imagenesEnunciado, setImagenesEnunciado] = useState([]); 

  const [opciones, setOpciones] = useState([]);
  const [indiceCorrecta, setIndiceCorrecta] = useState(null);

  // --- 1. Carga Inicial de Filtros ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [simData, matData] = await Promise.all([obtenerSimulacros(), obtenerMaterias()]);
        setSimulacros(simData || []);
        setMaterias(matData || []);
      } catch (error) {
        mostrarNotificacion("Error cargando filtros", "error");
      }
    };
    fetchData();
  }, []);

  // --- 2. Cargar Lista de Preguntas ---
  useEffect(() => {
    const fetchPreguntas = async () => {
      if (selectedSimulacro && selectedMateria) {
        setLoadingPreguntas(true);
        setListaPreguntas([]);
        setSelectedPreguntaId("");
        try {
          const data = await obtenerPreguntasPorFiltro(selectedSimulacro, selectedMateria);
          setListaPreguntas(data || []);
        } catch (error) {
          console.error(error);
          mostrarNotificacion("Error cargando preguntas", "error");
        } finally {
          setLoadingPreguntas(false);
        }
      }
    };
    fetchPreguntas();
  }, [selectedSimulacro, selectedMateria]);

  // --- 3. Cargar Datos de la Pregunta Seleccionada ---
  useEffect(() => {
    if (!selectedPreguntaId) return;

    const preguntaData = listaPreguntas.find(p => p.id === parseInt(selectedPreguntaId));
    if (!preguntaData) return;

    // A. Enunciado
    const enunciado = preguntaData.enunciados;
    setIdEnunciado(enunciado?.id);
    setTextoEnunciado(enunciado?.texto || "");

    // B. Imágenes Enunciado
    const imgsEnunciado = enunciado?.imagenes_enunciados?.map(img => ({
      id: img.id,       // Mantenemos ID para que el servicio sepa que existe
      preview: img.url, // URL actual para mostrar
      file: null,       // No hay archivo nuevo por defecto
      orden: img.orden.toString()
    })) || [];
    // Ordenamos por orden visualmente
    imgsEnunciado.sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
    setImagenesEnunciado(imgsEnunciado);

    // C. Pregunta
    setTextoPregunta(preguntaData.pregunta);

    // D. Opciones
    const opcionesMapeadas = preguntaData.opciones.map((op, index) => {
        if (op.id === preguntaData.opcion_correcta) {
            setIndiceCorrecta(index);
        }
        const esImagen = op.imagenes_opciones && op.imagenes_opciones.length > 0;
        return {
            id: op.id, // ID vital para el servicio
            tipo: esImagen ? 'imagen' : 'texto',
            valor: esImagen ? '' : op.opcion,
            preview: esImagen ? op.imagenes_opciones[0].url : null,
            file: null
        };
    });
    
    // Ordenar opciones por ID (o algún criterio si lo tuvieras) para mantener consistencia visual
    opcionesMapeadas.sort((a, b) => a.id - b.id);
    setOpciones(opcionesMapeadas);

  }, [selectedPreguntaId, listaPreguntas]);


  // --- MANEJADORES ---

  const mostrarNotificacion = (msg, type) => {
    setNotification({ show: true, message: msg, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 4000);
  };

  // --- Lógica Imágenes Enunciado ---

  // Agregar NUEVA imagen al final
  const handleAddEnunciadoImages = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    const nuevosItems = validFiles.map(file => ({
      id: null, // Sin ID = Servicio hará INSERT
      file,     // Archivo presente = Servicio hará UPLOAD
      preview: URL.createObjectURL(file),
      orden: "3" 
    }));
    
    setImagenesEnunciado(prev => [...prev, ...nuevosItems]);
  };

  // Reemplazar imagen EXISTENTE (Nueva lógica clave)
  const handleReplaceEnunciadoImage = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const copia = [...imagenesEnunciado];
      // Mantenemos el ID si existe, pero agregamos el file
      copia[index].file = file; 
      copia[index].preview = URL.createObjectURL(file);
      setImagenesEnunciado(copia);
    }
  };

  const removeEnunciadoImage = (index) => {
    // Al quitarla del array, el servicio detectará que el ID falta y la borrará de BD
    setImagenesEnunciado(prev => prev.filter((_, i) => i !== index));
  };

  const updateOrdenImagen = (index, nuevoOrden) => {
    const copia = [...imagenesEnunciado];
    copia[index].orden = nuevoOrden;
    setImagenesEnunciado(copia);
  };

  // --- Lógica Opciones ---

  const addOption = () => {
    if (opciones.length < 6) {
      setOpciones([...opciones, { id: null, tipo: 'texto', valor: '', file: null, preview: null }]);
    }
  };

  const removeOption = (index) => {
    if (opciones.length > 2) {
      const nuevas = opciones.filter((_, i) => i !== index);
      setOpciones(nuevas);
      // Ajustar índice de respuesta correcta si se borra una anterior
      if (indiceCorrecta === index) setIndiceCorrecta(null);
      else if (indiceCorrecta > index) setIndiceCorrecta(indiceCorrecta - 1);
    }
  };

  const changeOptionType = (index, tipo) => {
    const copia = [...opciones];
    copia[index].tipo = tipo;
    copia[index].valor = "";
    // Si cambiamos tipo, mantenemos el ID pero limpiamos file/preview
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
      copia[index].file = file; // ID se mantiene, file se agrega -> Servicio hace UPDATE de imagen
      copia[index].preview = URL.createObjectURL(file);
      setOpciones(copia);
    }
  };

  // --- ENVÍO ---
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedPreguntaId) return;
    if (!textoEnunciado.trim()) return mostrarNotificacion("Falta el enunciado", "error");
    if (!textoPregunta.trim()) return mostrarNotificacion("Falta la pregunta", "error");
    if (indiceCorrecta === null) return mostrarNotificacion("Selecciona la respuesta correcta", "error");

    setLoading(true);

    try {
      const datosUpdate = {
        simulacroId: selectedSimulacro,
        materiaId: selectedMateria,
        enunciado: textoEnunciado,
        pregunta: textoPregunta,
        // Pasamos el array tal cual. El servicio decide qué hacer según si hay ID o File.
        imagenesEnunciado: imagenesEnunciado, 
        opciones: opciones,
        indiceCorrecta: indiceCorrecta
      };

      await actualizarPreguntaCompleta(selectedPreguntaId, idEnunciado, datosUpdate);
      
      mostrarNotificacion("¡Actualizado correctamente!", "success");
      
      // Opcional: limpiar selección o recargar
      // setSelectedPreguntaId(""); 
      
    } catch (error) {
      console.error(error);
      mostrarNotificacion("Error al actualizar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 pb-20">
      
      <button 
        onClick={() => router.push('/admin')}
        className="group flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-all"
      >
        <ArrowLeft size={20} className="group-hover:text-cyan-400" />
        <span className="text-sm font-medium">Volver al Panel</span>
      </button>

      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-amber-600/20 rounded-xl border border-amber-500/30">
          <Edit3 className="text-amber-400" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-white">Editar Preguntas</h1>
      </div>

      {notification.show && (
        <div className={`fixed top-5 right-5 z-[60] px-6 py-4 rounded-xl shadow-2xl border flex items-center gap-3 animate-bounce-in backdrop-blur-md ${notification.type === 'success' ? 'bg-green-900/80 border-green-500' : 'bg-red-900/80 border-red-500'}`}>
          <span className="font-semibold text-white">{notification.message}</span>
        </div>
      )}

      {/* --- FILTROS --- */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-6 mb-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Cuadernillo</label>
                <select
                    value={selectedSimulacro}
                    onChange={(e) => setSelectedSimulacro(e.target.value)}
                    className="w-full bg-black/40 text-white border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                >
                    <option value="">-- Selecciona --</option>
                    {simulacros.map((sim) => <option key={sim.id} value={sim.id}>{sim.titulo}</option>)}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Materia</label>
                <select
                    value={selectedMateria}
                    onChange={(e) => setSelectedMateria(e.target.value)}
                    className="w-full bg-black/40 text-white border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-cyan-500"
                >
                    <option value="">-- Selecciona --</option>
                    {materias.map((mat) => <option key={mat.id} value={mat.id}>{mat.nombre}</option>)}
                </select>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">Pregunta</label>
                <div className="relative">
                    <select
                        value={selectedPreguntaId}
                        onChange={(e) => setSelectedPreguntaId(e.target.value)}
                        disabled={!selectedSimulacro || !selectedMateria || loadingPreguntas}
                        className="w-full bg-black/40 text-white border border-amber-500/50 rounded-xl px-4 py-3 outline-none focus:border-amber-400 disabled:opacity-50"
                    >
                        <option value="">
                            {loadingPreguntas ? "Cargando..." : "-- Elige una pregunta --"}
                        </option>
                        {listaPreguntas.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.id} - {p.pregunta.substring(0, 40)}...
                            </option>
                        ))}
                    </select>
                    {loadingPreguntas && <Loader2 className="absolute right-3 top-3 animate-spin text-amber-500" size={20} />}
                </div>
            </div>
        </div>
      </div>

      {/* --- FORMULARIO --- */}
      {selectedPreguntaId && (
        <form onSubmit={handleUpdate} className="space-y-6 animate-fade-in">
            
            {/* ENUNCIADO + IMÁGENES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2"><FileText size={20} /> Editar Enunciado</h3>
                    <textarea
                        value={textoEnunciado}
                        onChange={(e) => setTextoEnunciado(e.target.value)}
                        className="flex-1 min-h-[200px] bg-black/20 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                    />
                </div>

                <div className="lg:col-span-1 bg-slate-900/50 backdrop-blur-md border border-purple-500/20 rounded-3xl p-6 flex flex-col">
                    <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2"><ImagePlus size={20} /> Imágenes</h3>
                    
                    {/* Botón AGREGAR NUEVA */}
                    <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-purple-500/30 rounded-xl hover:bg-purple-500/10 cursor-pointer mb-4 transition-colors">
                        <span className="text-xs text-gray-400">+ Agregar Nueva Imagen</span>
                        <input type="file" className="hidden" multiple accept="image/*" onChange={handleAddEnunciadoImages} />
                    </label>

                    <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar space-y-3">
                    {imagenesEnunciado.map((img, idx) => (
                        <div key={idx} className="bg-black/40 p-2 rounded-lg border border-white/10 flex gap-3 items-start">
                            
                            {/* Previsualización */}
                            <div className="relative w-20 h-20 rounded-md overflow-hidden border border-white/10 bg-black flex-shrink-0">
                                <img src={img.preview} alt="preview" className="w-full h-full object-cover" />
                                {/* Botón CAMBIAR IMAGEN (Manteniendo ID) */}
                                <label className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                    <RefreshCw size={16} className="text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleReplaceEnunciadoImage(idx, e)} />
                                </label>
                            </div>

                            <div className="flex-1 flex flex-col justify-between h-20 py-1">
                                <div>
                                    {img.id ? (
                                        <span className="text-[10px] text-green-400 font-mono bg-green-900/30 px-1 rounded inline-block mb-1">ID: {img.id} {img.file ? "(Editada)" : ""}</span>
                                    ) : (
                                        <span className="text-[10px] text-amber-400 font-mono bg-amber-900/30 px-1 rounded inline-block mb-1">NUEVA</span>
                                    )}
                                    
                                    <select 
                                        value={img.orden}
                                        onChange={(e) => updateOrdenImagen(idx, e.target.value)}
                                        className="w-full bg-slate-800 text-white text-xs p-1 rounded border border-white/20 outline-none focus:border-purple-500"
                                    >
                                        <option value="1">1 - Arriba</option>
                                        <option value="2">2 - Centro</option>
                                        <option value="3">3 - Abajo</option>
                                    </select>
                                </div>
                                
                                <button type="button" onClick={() => removeEnunciadoImage(idx)} className="self-end text-red-400 text-xs flex items-center gap-1 hover:text-red-300">
                                    <Trash2 size={14} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
            </div>

            {/* PREGUNTA */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-cyan-500/20 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2"><HelpCircle size={20} /> Editar Pregunta</h3>
                <input
                    type="text"
                    value={textoPregunta}
                    onChange={(e) => setTextoPregunta(e.target.value)}
                    className="w-full bg-black/20 border border-cyan-500/30 rounded-xl px-4 py-4 text-lg text-white focus:outline-none focus:border-cyan-500"
                />
            </div>

            {/* OPCIONES */}
            <div className="bg-slate-900/50 backdrop-blur-md border border-green-500/20 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2"><CheckCircle2 size={20} /> Editar Opciones</h3>
                    <button type="button" onClick={addOption} className="text-xs font-bold bg-green-600/20 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/30 flex gap-1 items-center hover:bg-green-600/30 transition-colors">
                        <Plus size={14} /> AÑADIR
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opciones.map((op, idx) => (
                    <div key={idx} className={`relative p-3 rounded-xl border transition-all duration-300 flex flex-col gap-2 ${indiceCorrecta === idx ? 'bg-green-500/10 border-green-500' : 'bg-black/20 border-white/10'}`}>
                        {/* Cabecera Opción */}
                        <div className="flex items-center gap-3">
                            <div 
                                onClick={() => setIndiceCorrecta(idx)}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${indiceCorrecta === idx ? 'border-green-500 bg-green-500' : 'border-gray-500'}`}
                            >
                                {indiceCorrecta === idx && <div className="w-2 h-2 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold text-gray-500">Opción {String.fromCharCode(65 + idx)}</span>
                            
                            <div className="ml-auto flex bg-black/40 rounded-lg p-0.5 border border-white/10">
                                <button type="button" onClick={() => changeOptionType(idx, 'texto')} className={`p-1.5 rounded-md ${op.tipo === 'texto' ? 'bg-green-600 text-white' : 'text-gray-400'}`}><Type size={14} /></button>
                                <button type="button" onClick={() => changeOptionType(idx, 'imagen')} className={`p-1.5 rounded-md ${op.tipo === 'imagen' ? 'bg-green-600 text-white' : 'text-gray-400'}`}><ImageIcon size={14} /></button>
                            </div>
                            <button type="button" onClick={() => removeOption(idx)} className="text-gray-600 hover:text-red-400 ml-1"><Trash2 size={16} /></button>
                        </div>

                        {/* Contenido Opción */}
                        <div className="mt-1">
                        {op.tipo === 'texto' ? (
                            <input
                            type="text"
                            value={op.valor}
                            onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                            placeholder="Escribe la respuesta..."
                            className="w-full bg-white rounded-lg text-black text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                        ) : (
                            <div className="flex items-center gap-3">
                                <label className="flex-1 cursor-pointer bg-slate-800 hover:bg-slate-700 text-gray-300 text-xs py-2 px-3 rounded border border-white/10 flex items-center justify-center gap-2 transition-colors">
                                    <ImagePlus size={14} />
                                    {op.preview ? "Reemplazar Img" : "Subir Imagen"}
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

            {/* GUARDAR */}
            <div className="flex justify-end pt-4">
                <button type="submit" disabled={loading} className="px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? <Loader2 className="animate-spin" /> : <Save />} Actualizar Pregunta
                </button>
            </div>
        </form>
      )}
    </div>
  );
}