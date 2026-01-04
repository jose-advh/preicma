"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [hoveredTikTok, setHoveredTikTok] = useState(null);
  const [hoveredYouTube, setHoveredYouTube] = useState(null);
  
  // Estado para controlar qué videos de YouTube se han activado
  const [activeYoutubeVideos, setActiveYoutubeVideos] = useState({});
  const [mainVideoPlaying, setMainVideoPlaying] = useState(false);

  // NUEVO: Estado para controlar qué videos de TikTok se han activado
  const [activeTikTokVideos, setActiveTikTokVideos] = useState({});

  // Función para activar YouTube
  const toggleYoutubeVideo = (index) => {
    setActiveYoutubeVideos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Función para activar TikTok
  const toggleTikTokVideo = (index) => {
    setActiveTikTokVideos((prev) => ({
      ...prev,
      [index]: true, // Se queda activo una vez se le da clic
    }));
  };

  // Efecto para recargar el script de TikTok cuando se activa un video nuevo
  useEffect(() => {
    if (Object.keys(activeTikTokVideos).length > 0 && window.tiktokEmbedLoad) {
       window.tiktokEmbedLoad();
    }
  }, [activeTikTokVideos]);

  const tiktokVideos = [
    {
      id: "7582755770203114764",
      title: "Tips de estudio",
      badge: "Estrategias",
      color: "from-cyan-500 to-blue-600",
    },
    {
      id: "7583792581553802508",
      title: "Comunidad de estudio",
      badge: "Tutorías",
      color: "from-purple-500 to-pink-600",
    },
    {
      id: "7297703733486521606",
      title: "Testimonios",
      badge: "Resultados",
      color: "from-green-500 to-emerald-600",
    },
  ];

  const youtubeVideos = [
    {
      title: "Tutoría en Vivo ICFES - Sesión 1",
      icon: "/icono__camara.png",
      views: "En vivo ahora",
      embedId: "jmz9GKtLI48",
    },
    {
      title: "Tutoría en Vivo ICFES - Sesión 2",
      icon: "/icono__camara.png",
      views: "En vivo ahora",
      embedId: "QdQ3F0vjcdY",
    },
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-3 sm:p-6 md:p-8 overflow-x-hidden">
      {/* Script de TikTok optimizado */}
      <Script
        src="https://www.tiktok.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
           if (window.tiktokEmbedLoad) window.tiktokEmbedLoad();
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12 md:gap-16">
        
        {/* HEADER - STATS */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Stat 1 */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center p-2">
                  <Image src="/student.png" alt="estudiante" width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1.500+</p>
                  <p className="text-xs text-gray-400">Estudiantes</p>
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-gradient-to-br from-green-600/20 to-emerald-800/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center p-2">
                  <Image src="/icono__graficas.png" alt="graficas" width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">95%</p>
                  <p className="text-xs text-gray-400">Satisfacción</p>
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-gradient-to-br from-yellow-600/20 to-orange-800/20 backdrop-blur-sm border border-yellow-500/30 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/30 rounded-xl flex items-center justify-center p-2">
                  <Image src="/star.png" alt="estrella" width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">380+</p>
                  <p className="text-xs text-gray-400">Puntaje Prom.</p>
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-gradient-to-br from-blue-600/20 to-cyan-800/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-4 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center p-2">
                  <Image src="/icono__trofeo.png" alt="trofeo" width={40} height={40} className="object-contain" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">200+</p>
                  <p className="text-xs text-gray-400">Top 10%</p>
                </div>
              </div>
            </div>
          </div>

          {/* BANNER PRINCIPAL */}
          <div className="relative bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-6 sm:p-8 mb-8 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
                  Bienvenido a <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">PRE-ICMA</span>
                </h1>
                <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4">
                  Tu camino hacia el éxito en el ICFES comienza aquí. Prepárate con los mejores.
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <div className="bg-green-500/20 border border-green-500/50 px-4 py-2 rounded-full text-green-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Clases en vivo
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/50 px-4 py-2 rounded-full text-blue-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Image src="/icono__libro.png" alt="libro" width={16} height={16} />
                    Material exclusivo
                  </div>
                  <div className="bg-purple-500/20 border border-purple-500/50 px-4 py-2 rounded-full text-purple-400 text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <Image src="/icono__flecha.png" alt="flecha" width={16} height={16} />
                    Simulacros reales
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-yellow-500/50 overflow-hidden">
                  <Image src="/preicmalogo.webp" alt="PRE-ICMA" width={160} height={160} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VIDEO PRINCIPAL OPTIMIZADO */}
        <div className="relative">
          <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          <div className={`relative flex gap-4 sm:gap-6 md:gap-8 transition-all duration-700 ease-in-out ${expanded ? "flex-col lg:flex-row items-start" : "flex-col items-center"}`}>
            <div className={`relative p-[3px] sm:p-[4px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ease-in-out ${expanded ? "w-full lg:w-[55%]" : "w-full max-w-4xl"}`}>
              {/* Animación lenta del borde (8 segundos) */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#FCD116,#FFFFFF,#003893,#CE1126)] animate-[spin_8s_linear_infinite]" />

              <div className="relative bg-black rounded-2xl sm:rounded-3xl aspect-video overflow-hidden shadow-2xl">
                {mainVideoPlaying ? (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/DcaDTQVlm1Q?autoplay=1"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full relative cursor-pointer group" onClick={() => setMainVideoPlaying(true)}>
                    <Image 
                      src={`https://img.youtube.com/vi/DcaDTQVlm1Q/maxresdefault.jpg`}
                      alt="Thumbnail Video Principal"
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                     </div>
                  </div>
                )}

                {!expanded && !mainVideoPlaying && (
                  <div
                    className="absolute inset-0 cursor-pointer z-10 group"
                    onClick={() => setExpanded(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-blue-400 text-slate-900 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg inline-flex items-center gap-2 shadow-lg z-20 pointer-events-auto">
                        <span>▶</span>
                        <span className="hidden sm:inline">Ver contenido completo</span>
                        <span className="sm:hidden">Ver más</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-3 sm:top-6 right-3 sm:right-6 z-20 bg-white hover:bg-red-500 text-gray-800 hover:text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold shadow-lg transform hover:scale-110 transition-all text-sm sm:text-base"
                >
                  ✕
                </button>
              )}

              {!expanded && (
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-gradient-to-r from-pink-400 to-blue-500 text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 sm:gap-2 animate-bounce z-20 pointer-events-none">
                  <Image className="rounded-full" src="/preicmalogo.webp" alt="logo preicma" width={24} height={24} />
                  PRE-ICMA
                </div>
              )}
            </div>

            {expanded && (
              <div className="w-full lg:w-[45%] animate-fade-in">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl h-full border border-purple-500/30 shadow-2xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br rounded-full flex items-center justify-center text-xl sm:text-2xl overflow-hidden relative">
                      <Image className="object-cover" src="/preicmalogo.webp" alt="logo preicma" fill />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      ¿Qué es PRE-ICMA?
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                    Somos la <span className="text-purple-400 font-semibold">comunidad de preparación ICFES</span> más efectiva de Colombia. Te preparamos con:
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Tutorías en vivo </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Simulacros</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Seguimiento personalizado</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Resultados reales y medibles</span>
                    </li>
                  </ul>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-600/20 rounded-xl sm:rounded-2xl border border-purple-500/50">
                    <p className="text-purple-300 text-xs sm:text-sm font-semibold text-center">
                      ¿Qué esperas para unirte?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/*sac*/}
        <div className="relative py-12 sm:py-20 px-4">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '3s' }} />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          </div>

          <div className="relative text-center mb-16 sm:mb-24">
            <div className="inline-block mb-6 animate-bounce">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg">
                <Image src="/icono__star.png" width={20} height={20} alt="estrella" />
                <span>Nuestra Filosofía</span>
                <Image src="/icono__star.png" width={20} height={20} alt="estrella" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Metodología{" "}
              <span className="inline-block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                SAC
              </span>
            </h2>
            <p className="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto">
              El camino hacia tu éxito académico 
            </p>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 max-w-7xl mx-auto">
            
            {/* SUEÑA */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition-all duration-500 animate-pulse" />             
              <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 border-2 border-yellow-500/50 group-hover:border-yellow-400 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(251,191,36,0.3),transparent_50%)] animate-pulse" />
                </div>
                <div className="relative mb-6">
                  <div className="text-[120px] sm:text-[150px] font-black text-center leading-none">
                    <span className="inline-block bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-500" style={{ textShadow: '0 10px 30px rgba(251, 191, 36, 0.5)' }}>
                      S
                    </span>
                  </div>
                  <div className="absolute top-0 right-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '2s' }}>
                    <Image src="/star.png" width={40} height={40} alt="estrella" />
                  </div>
                  <div className="absolute bottom-0 left-1/4 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>
                    <Image src="/icono__star.png" width={32} height={32} alt="estrella" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  SUEÑA
                </h3>
                <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-yellow-400 text-xl mt-1">
                      <Image src="/icono__archery.png" width={24} height={24} alt="meta" />
                    </span>
                    <p>Visualiza tus metas y el futuro que deseas alcanzar</p>
                  </div>
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>
                    <span className="text-orange-400 text-xl mt-1">
                      <Image src="/icono__nube.png" width={24} height={24} alt="sueño" />
                    </span>
                    <p>Define tu universidad ideal y la carrera de tus sueños</p>
                  </div>
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '200ms' }}>
                    <span className="text-red-400 text-xl mt-1">
                      <Image src="/icono__cohete.png" width={24} height={24} alt="cohete" />
                    </span>
                    <p>Establece el puntaje que necesitas para lograrlo</p>
                  </div>
                </div>
              </div>
            </div>

            {/* APRENDE */}
            <div className="group relative lg:mt-12">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-fuchsia-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 rounded-3xl p-8 border-2 border-purple-500/50 group-hover:border-purple-400 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>
                <div className="relative mb-6">
                  <div className="text-[120px] sm:text-[150px] font-black text-center leading-none">
                    <span className="inline-block bg-gradient-to-br from-purple-400 via-pink-400 to-fuchsia-500 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-500" style={{ textShadow: '0 10px 30px rgba(168, 85, 247, 0.5)' }}>
                      A
                    </span>
                  </div>
                  <div className="absolute top-0 left-1/4 animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '2.2s' }}>
                    <Image src="/books.png" width={40} height={40} alt="libros" />
                  </div>
                  <div className="absolute bottom-0 right-1/4 animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '2.7s' }}>
                    <Image src="/icono__bombillo.png" width={32} height={32} alt="idea" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  APRENDE
                </h3>
                <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-purple-400 text-xl mt-1">
                      <Image src="/icono__graduado.png" width={24} height={24} alt="graduado" />
                    </span>
                    <p>Domina cada materia con nuestros tutores expertos</p>
                  </div>
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>
                    <span className="text-pink-400 text-xl mt-1">
                      <Image src="/icono__libro.png" width={24} height={24} alt="libro" />
                    </span>
                    <p>Accede a material exclusivo y métodos comprobados</p>
                  </div>
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '200ms' }}>
                    <span className="text-fuchsia-400 text-xl mt-1">
                      <Image src="/brain.png" width={24} height={24} alt="cerebro" />
                    </span>
                    <p>Desarrolla estrategias efectivas para el examen</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CRECE */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition-all duration-500 animate-pulse" style={{ animationDelay: '2s' }} />
              <div className="relative bg-gradient-to-br from-slate-900 via-emerald-900/30 to-slate-900 rounded-3xl p-8 border-2 border-green-500/50 group-hover:border-green-400 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-4 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(34,197,94,0.3),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
                <div className="relative mb-6">
                  <div className="text-[120px] sm:text-[150px] font-black text-center leading-none">
                    <span className="inline-block bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 bg-clip-text text-transparent transform group-hover:scale-110 transition-transform duration-500" style={{ textShadow: '0 10px 30px rgba(34, 197, 94, 0.5)' }}>
                      C
                    </span>
                  </div>
                  <div className="absolute top-0 right-1/4 text-green-400 text-4xl animate-bounce" style={{ animationDelay: '0.6s', animationDuration: '2.4s' }}>
                    <Image src="/icono__planta.png" width={40} height={40} alt="planta" />
                  </div>
                  <div className="absolute bottom-0 left-1/4 text-emerald-400 text-3xl animate-bounce" style={{ animationDelay: '1.1s', animationDuration: '2.9s' }}>
                    <Image src="/icono__trofeo.png" width={32} height={32} alt="trofeo" />
                  </div>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  CRECE
                </h3>
                <div className="space-y-3 text-gray-300 text-sm sm:text-base">
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300">
                    <span className="text-green-400 text-xl mt-1">
                      <Image src="/icono__estadisticas.png" width={24} height={24} alt="estadisticas" />
                    </span>
                    <p>Observa tu progreso constante en cada simulacro</p>
                  </div>
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>
                    <span className="text-emerald-400 text-xl mt-1">
                      <Image src="/icono__brazo.png" width={24} height={24} alt="fuerza" />
                    </span>
                    <p>Supera tus límites y alcanza tu máximo potencial</p>
                  </div>
                  <div className="flex items-start gap-3 transform group-hover:translate-x-2 transition-transform duration-300" style={{ transitionDelay: '200ms' }}>
                    <span className="text-teal-400 text-xl mt-1">
                      <Image src="/icono__archery.png" width={24} height={24} alt="objetivo" />
                    </span>
                    <p>Logra el puntaje que te abrirá las puertas del éxito</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-16 sm:mt-24 max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-purple-500 to-green-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
            <div className="relative bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-purple-500/50 text-center overflow-hidden">
              <div className="absolute top-4 left-8 animate-bounce" style={{ animationDuration: '3s' }}>
                <Image src="/star.png" width={32} height={32} alt="estrella" />
              </div>
              <div className="absolute top-8 right-12 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
                <Image src="/icono__star.png" width={36} height={36} alt="estrella" />
              </div>
              <div className="absolute bottom-6 left-16 animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1s' }}>
                <Image src="/stars.png" width={30} height={30} alt="estrellas" />
              </div>
              <div className="absolute bottom-8 right-20 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1.5s' }}>
                <Image src="/star.png" width={40} height={40} alt="estrella" />
              </div>

              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Con{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  SAC
                </span>
                {" "}transformamos vidas
              </h3>
              <p className="text-gray-300 text-lg sm:text-xl mb-6 max-w-3xl mx-auto">
                No solo preparamos estudiantes, creamos historias de éxito que inspiran a toda una generación
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
                <div className="bg-yellow-500/20 border border-yellow-500 px-6 py-3 rounded-full text-yellow-400 font-semibold flex gap-3 items-center">
                  <Image className="w-6 h-6 object-contain" src="/icono__archery.png" width={24} height={24} alt="icon" />
                  Metas claras
                </div>
                <div className="bg-purple-500/20 border border-purple-500 px-6 py-3 rounded-full text-purple-400 font-semibold flex gap-2 items-center">
                  <Image className="w-6 h-6 object-contain" src="/books.png" width={24} height={24} alt="icon" />
                  Conocimiento sólido
                </div>
                <div className="bg-green-500/20 border border-green-500 px-6 py-3 rounded-full text-green-400 font-semibold flex gap-2 items-center">
                  <Image className="w-6 h-6 object-contain" src="/icono__cohete.png" width={24} height={24} alt="icon" />
                  Resultados reales
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
            Videos Educativos
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">Contenido profundo para tu preparación</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {youtubeVideos.map((video, i) => (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHoveredYouTube(i)}
              onMouseLeave={() => setHoveredYouTube(null)}
            >
              <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 border-2 ${hoveredYouTube === i ? 'border-yellow-500 shadow-2xl shadow-yellow-500/30' : 'border-slate-700'}`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="w-8 h-8 relative">
                    <Image src={video.icon} alt="icon" fill className="object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg">{video.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{video.views}</p>
                  </div>
                </div>

                <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-xl relative bg-black">
                  {activeYoutubeVideos[i] ? (
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1`}
                      allow="autoplay; fullscreen"
                      allowFullScreen
                    />
                  ) : (
                    <div 
                      className="w-full h-full relative cursor-pointer" 
                      onClick={() => toggleYoutubeVideo(i)}
                    >
                      <Image 
                        src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`}
                        alt={`Miniatura ${video.title}`}
                        fill
                        className="object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 flex items-center justify-center ${hoveredYouTube === i ? 'opacity-100' : 'opacity-80'}`}>
                         <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                         </div>
                      </div>
                      <div className={`absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 pointer-events-none transition-opacity duration-300 ${hoveredYouTube === i ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-yellow-400 text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm inline-block">
                          Ver ahora →
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* TESTIMONIOS */}
        <div className="relative px-2 sm:px-0">
          <div className="absolute -top-20 left-1/4 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="inline-block mb-4">
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm animate-bounce">
                <Image src="/star.png" alt="estrella" width={16} height={16} />
                <span>Nuestros resultados hablan solos</span>
                <Image src="/star.png" alt="estrella" width={16} height={16} />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              Historias de <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Éxito</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">Lo que dicen nuestros estudiantes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {/* Testimonio 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border-2 border-pink-500/30 group-hover:border-pink-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    DH
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Dali Herrera</h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-pink-500 text-5xl opacity-50">"</span>
                  <p className="text-gray-300 text-sm leading-relaxed pl-6 italic">
                    Gracias a PRE-ICMA conseguí marido, los recomiendo
                  </p>
                  <span className="absolute -bottom-4 -right-2 text-pink-500 text-5xl opacity-50">"</span>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Estudiante 2023</span>
                  <span className="text-pink-400 text-xs font-semibold">❤️ Historia de éxito</span>
                </div>
              </div>
            </div>

            {/* Testimonio 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border-2 border-blue-500/30 group-hover:border-blue-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    JN
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Juan Guillermo Nox</h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-blue-500 text-5xl opacity-50">"</span>
                  <p className="text-gray-300 text-sm leading-relaxed pl-6 italic">
                    Soy talento Santamarta, estoy super feliz en mi carrera gracias a PRE-ICMA
                  </p>
                  <span className="absolute -bottom-4 -right-2 text-blue-500 text-5xl opacity-50">"</span>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Estudiante 2024</span>
                  <span className="text-blue-400 text-xs font-semibold">🎓 Universidad top</span>
                </div>
              </div>
            </div>

            {/* Testimonio 3 */}
            <div className="group relative md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 border-2 border-purple-500/30 group-hover:border-purple-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    S
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Sergio</h3>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -top-2 -left-2 text-purple-500 text-5xl opacity-50">"</span>
                  <p className="text-gray-300 text-sm leading-relaxed pl-6 italic">
                    Gracias a PRE-ICMA tuve novia, mosa, amante y de todo, pero también gracias a ellos me rehabilité y soy un hombre de bien
                  </p>
                  <span className="absolute -bottom-4 -right-2 text-purple-500 text-5xl opacity-50">"</span>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-700 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Estudiante 2024</span>
                  <span className="text-purple-400 text-xs font-semibold">✨ Nueva vida</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 relative z-10">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-green-500/30 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-3xl animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>★</span>
                    ))}
                  </div>
                </div>
                <div className="h-12 w-px bg-gray-700 hidden sm:block" />
                <div>
                  <p className="text-3xl sm:text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">
                    4.9/5.0
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Basado en +500 reseñas</p>
                </div>
                <div className="h-12 w-px bg-gray-700 hidden sm:block" />
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">98%</p>
                  <p className="text-gray-400 text-sm mt-1">Nos recomiendan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA FINAL */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            ¿Listo para alcanzar tu mejor puntaje?
          </h2>
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
            Únete a PRE-ICMA y prepárate con los mejores para el ICFES 
          </p>
          <a href="https://wa.me/573202106077?text=Hola%20quiero%20más%20información%"
              className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transform hover:scale-105 transition-all shadow-lg inline-flex items-center gap-3"
            >
              <Image
                src="/icono--whatsapp.png"
                alt="icono whatsapp"
                width={28}
                height={28}
                className="object-contain"
              />
              Escribe "Quiero más información" al WhatsApp
          </a>
        </div>

        {/* REDES SOCIALES */}
        <div className="relative px-2 sm:px-0">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-48 sm:h-64 bg-pink-500/20 rounded-full blur-3xl" />
          
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
              Síguenos en Redes Sociales
            </h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">Contenido diario para tu preparación</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/pre_icma"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-pink-500/50 group-hover:border-pink-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">Instagram</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">@pre_icma</p>
                    <div className="flex items-center justify-center gap-2 text-pink-400 font-semibold text-sm sm:text-base">
                      <span>Seguir</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-700 w-full">
                    <p className="text-gray-400 text-xs"> Historias diarias</p>
                    <p className="text-gray-400 text-xs"> Tips y motivación</p>
                  </div>
                </div>
              </div>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@pre_icma"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-cyan-500/50 group-hover:border-cyan-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">TikTok</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">@pre-icma</p>
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold text-sm sm:text-base">
                      <span>Seguir</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-700 w-full">
                    <p className="text-gray-400 text-xs"> Tutorías en vivo</p>
                    <p className="text-gray-400 text-xs"> Contenido viral</p>
                  </div>
                </div>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/@PREICMA"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-red-500/50 group-hover:border-red-500 transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2">
                <div className="flex flex-col items-center gap-3 sm:gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-red-600 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <h3 className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">YouTube</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">@pre-icma</p>
                    <div className="flex items-center justify-center gap-2 text-red-400 font-semibold text-sm sm:text-base">
                      <span>Suscribirse</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-700 w-full">
                    <p className="text-gray-400 text-xs"> Videos completos</p>
                    <p className="text-gray-400 text-xs"> Clases profundas</p>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="mt-8 sm:mt-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-purple-500/30">
            <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">+15K</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Seguidores</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">+500</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Videos</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">+2M</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Vistas totales</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}