"use client";

import { useState } from "react";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className=" bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8 flex flex-col items-center">
      <div className="flex flex-col items-center">

      {/* BLOQUE SUPERIOR: VIDEO + TEXTO */}
      <div
        className={`
          w-full max-w-7xl flex gap-6 transition-all duration-700 ease-in-out
          ${expanded ? "flex-row items-start" : "flex-col items-center"}
        `}
      >
        {/* VIDEO */}
        <div
          className={`
            relative p-[4px] rounded-3xl overflow-hidden
            transition-all duration-700 ease-in-out
            ${expanded ? "w-[55%]" : "w-[50vw] max-w-4xl"}
          `}
        >
          {/* Borde animado */}
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg,green,white,purple)] animate-spin" />

          {/* Contenido */}
          <div className="relative rounded-3xl bg-black aspect-video w-full overflow-hidden">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/DcaDTQVlm1Q"
              allowFullScreen
            />

            {/* Capa clickeable */}
            {!expanded && (
              <div
                className="absolute inset-0 cursor-pointer z-10"
                onClick={() => setExpanded(true)}
              />
            )}
          </div>

          {/* Botón cerrar */}
          {expanded && (
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* TEXTO */}
        {expanded && (
          <div className="w-[45%] transition-all duration-700 ease-in-out">
            <div className="bg-gray-100 p-6 rounded-3xl h-full">
              <h1 className="text-xl font-bold mb-4 text-gray-900">
                Lorem ipsum dolor sit amet consectetur adipisicing elit
              </h1>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae
                et optio, iure reprehenderit in sequi ipsa commodi velit error
                ratione, officiis nobis repellendus maiores autem!
              </p>
            </div>
          </div>
        )}
      </div>
        <div className="w-200 gap-10 max-w-7xl mt-10 flex gap-6 transition-all duration-700 ease-in-out">
          <div className="flex-1 bg-slate-600 rounded-2xl p-3 flex justify-center">
            <video src="/tiktok-preicma.mp4" controls className="rounded-lg max-w-full" />
          </div>
          <div className="flex-1 bg-slate-600 rounded-2xl p-3 flex justify-center">
            <video src="/tiktok-preicma.mp4" controls className="rounded-lg max-w-full" />
          </div>
          <div className="flex-1 bg-slate-600 rounded-2xl p-3 flex justify-center">
            <video src="/tiktok-preicma.mp4" controls className="rounded-lg max-w-full" />
          </div>
          
        </div>
    </div>
    {/*Contenido videos youtube*/ }
    
    </main>
  );
}
