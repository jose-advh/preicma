"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(false);
  const [hoveredTikTok, setHoveredTikTok] = useState(null);
  const [hoveredYouTube, setHoveredYouTube] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const tiktokVideos = [
    {
      title: "Comunidad ICFES Marzo",
      badge: "Estrategias",
      color: "from-cyan-500 to-blue-600"
    },
    {
      title: "Tips de Estudio",
      badge: "Tutorías",
      color: "from-purple-500 to-pink-600"
    },
    {
      title: "Testimonios",
      badge: "Resultados",
      color: "from-green-500 to-emerald-600"
    }
  ];

  const youtubeVideos = [
    {
      title: "Estrategias para Lectura Crítica",
      icon: "📖 ",
      views: "2.5K vistas"
    },
    {
      title: "Matemáticas ICFES - Tips Esenciales",
      icon: "🔢",
      views: "3.2K vistas"
    }
  ];

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-3 sm:p-6 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-10 sm:gap-12 md:gap-16">
        
        {/* HERO SECTION - VIDEO PRINCIPAL */}
        <div className="relative">
          {/* Elemento decorativo de fondo */}
          <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <div
            className={`relative flex gap-4 sm:gap-6 md:gap-8 transition-all duration-700 ease-in-out
              ${expanded ? "flex-col lg:flex-row items-start" : "flex-col items-center"}
            `}
          >
            {/* VIDEO PRINCIPAL */}
            <div
              className={`relative p-[3px] sm:p-[4px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-700 ease-in-out
                ${expanded ? "w-full lg:w-[55%]" : "w-full max-w-4xl"}
              `}
            >
              {/* Borde animado con colores de Colombia */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#FCD116,#FFFFFF,#003893,#CE1126)] animate-spin" />

              <div className="relative bg-black rounded-2xl sm:rounded-3xl aspect-video overflow-hidden shadow-2xl">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/DcaDTQVlm1Q"
                  allowFullScreen
                />

                {!expanded && (
                  <div
                    className="absolute inset-0 cursor-pointer z-10 group"
                    onClick={() => setExpanded(true)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="bg-yellow-400 text-slate-900 px-3 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg inline-flex items-center gap-2 shadow-lg">
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
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-gradient-to-r from-yellow-400 to-yellow-500 text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg flex items-center gap-1.5 sm:gap-2 animate-bounce">
                  <img className="w-8 rounded-full object-cover" src="/preicmalogo.webp" alt="preicma logo" />
                  PRE-ICMA
                </div>
              )}
            </div>

            {/* TEXTO VIDEO*/}
            {expanded && (
              <div className="w-full lg:w-[45%] animate-fade-in">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl h-full border border-purple-500/30 shadow-2xl">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-xl sm:text-2xl">
                      <img className="w-8 rounded-full object-cover" src="/preicmalogo.webp" alt="preicma logo" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      ¿Qué es PRE-ICMA?
                    </h1>
                  </div>
                  <p className="text-sm sm:text-base text-gray-300 leading-relaxed mb-3 sm:mb-4">
                    Somos la <span className="text-yellow-400 font-semibold">comunidad de preparación ICFES</span> más efectiva de Colombia. Te preparamos con:
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-300">
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Clases en vivo</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Simulacros</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Seguimineto personalizado</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3">
                      <span className="text-green-400 text-lg sm:text-xl">✓</span>
                      <span>Resultados reales y medibles</span>
                    </li>
                  </ul>
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-purple-600/20 rounded-xl sm:rounded-2xl border border-purple-500/50">
                    <p className="text-purple-300 text-xs sm:text-sm font-semibold text-center">
                      ¿Que esperas para unirte?
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TEXTO TIK TOK */}
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-yellow-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Contenido Destacado
          </h2>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Aprende con nosotros</p>
        </div>

        {/* VIDEOS TIKTOK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tiktokVideos.map((video, i) => (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHoveredTikTok(i)}
              onMouseLeave={() => setHoveredTikTok(null)}
            >
              
              <div className={`absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 z-10 bg-gradient-to-r ${video.color} text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg transform transition-all duration-300 ${hoveredTikTok === i ? 'scale-110' : 'scale-100'}`}>
                {video.badge}
              </div>
              
              <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 border-2 ${hoveredTikTok === i ? 'border-purple-500 shadow-2xl shadow-purple-500/50 scale-105' : 'border-slate-700'}`}>
                <div className="aspect-[9/16] max-h-[450px] sm:max-h-[540px] w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-black">
                  <blockquote 
                    className="tiktok-embed w-full h-full" 
                    cite="https://www.tiktok.com/@pre_icma/video/7583792581553802508" 
                    data-video-id="7583792581553802508"
                  > 
                    <section className="flex items-center justify-center h-full">
                      <a 
                        target="_blank" 
                        href="https://www.tiktok.com/@pre_icma?refer=embed"
                        className="text-white text-base sm:text-lg"
                      >
                        @pre_icma
                      </a> 
                    </section> 
                  </blockquote>
                </div>
                <h3 className="text-white font-bold text-base sm:text-lg mt-3 sm:mt-4 text-center">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* TEXTO YOUTUBE */}
        <div className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">
            Nustras clases
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">Contenido profundo para tu preparación</p>
        </div>

        {/* VIDEOS YOUTUBE INFERIORES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {youtubeVideos.map((video, i) => (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHoveredYouTube(i)}
              onMouseLeave={() => setHoveredYouTube(null)}
            >
              <div className={`bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 transition-all duration-300 border-2 ${hoveredYouTube === i ? 'border-yellow-500 shadow-2xl shadow-yellow-500/30' : 'border-slate-700'}`}>
                {/* Título sobre el video */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-2xl sm:text-3xl">{video.icon}</span>
                  <div>
                    <h3 className="text-white font-bold text-base sm:text-lg">{video.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">{video.views}</p>
                  </div>
                </div>
                
                <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden shadow-xl relative">
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/DcaDTQVlm1Q"
                    allowFullScreen
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none transition-opacity duration-300 ${hoveredYouTube === i ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                      <div className="bg-yellow-400 text-slate-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm inline-block">
                        Ver ahora →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            ¿Listo para alcanzar tu mejor puntaje?
          </h2>
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
            Únete a PRE-ICMA y prepárate con los mejores para el ICFES 
          </p>
          <a href="https://wa.me/573202106077?text=Hola%20quiero%20más%20información
              " target="_blank" className="bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg transform hover:scale-105 transition-all shadow-lg">
            📲 Escribe "Quiero más información" al WhatsApp
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
              href="https://www.instagram.com/preicma/"
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
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">@preicma</p>
                    <div className="flex items-center justify-center gap-2 text-pink-400 font-semibold text-sm sm:text-base">
                      <span>Seguir</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-700 w-full">
                    <p className="text-gray-400 text-xs">📸 Historias diarias</p>
                    <p className="text-gray-400 text-xs">✨ Tips y motivación</p>
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
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">@pre_icma</p>
                    <div className="flex items-center justify-center gap-2 text-cyan-400 font-semibold text-sm sm:text-base">
                      <span>Seguir</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-700 w-full">
                    <p className="text-gray-400 text-xs">🎥 Tutorías en vivo</p>
                    <p className="text-gray-400 text-xs">🚀 Contenido viral</p>
                  </div>
                </div>
              </div>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/channel/UCo5t1bnC1KDEZwxuKTou1Ew"
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
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">@preicma</p>
                    <div className="flex items-center justify-center gap-2 text-red-400 font-semibold text-sm sm:text-base">
                      <span>Suscribirse</span>
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-center pt-3 sm:pt-4 border-t border-gray-700 w-full">
                    <p className="text-gray-400 text-xs">📺 Videos completos</p>
                    <p className="text-gray-400 text-xs">🎓 Clases profundas</p>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Stats de redes */}
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