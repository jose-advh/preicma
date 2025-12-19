"use client";

import { useState } from "react";

export default function Dashboard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-14">

        {/* ================= VIDEO PRINCIPAL ================= */}
        <div
          className={`flex gap-8 transition-all duration-700
            ${expanded ? "flex-row items-start" : "flex-col items-center"}
          `}
        >
          {/* VIDEO */}
          <div
            className={`relative p-[4px] rounded-3xl overflow-hidden transition-all duration-700
              ${expanded ? "w-[55%]" : "w-full max-w-4xl"}
            `}
          >
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,green,white,purple)] animate-spin" />

            <div className="relative bg-black rounded-3xl aspect-video overflow-hidden">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/DcaDTQVlm1Q"
                allowFullScreen
              />

              {!expanded && (
                <div
                  className="absolute inset-0 cursor-pointer z-10"
                  onClick={() => setExpanded(true)}
                />
              )}
            </div>

            {expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4 z-20 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* TEXTO */}
          {expanded && (
            <div className="w-[45%]">
              <div className="bg-gray-100 p-6 rounded-3xl h-full">
                <h1 className="text-xl font-bold mb-4 text-gray-900">
                  ¿Qué es PRE-ICMA?
                </h1>
                <p className="text-gray-700">
                  Aquí puedes colocar la descripción del contenido, objetivos,
                  beneficios y lo que verá el estudiante al avanzar.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ================= VIDEOS TIKTOK ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="bg-slate-700 rounded-3xl p-6 flex justify-center"
            >
              <div className="aspect-[9/16] h-[540px] w-full max-w-[320px] rounded-2xl overflow-hidden shadow-xl">
                <video
                  src="/tiktok-preicma.mp4"
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ================= VIDEOS YOUTUBE INFERIORES ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[1, 2].map((_, i) => (
            <div
              key={i}
              className="bg-slate-700 rounded-3xl p-6"
            >
              <div className="aspect-video rounded-2xl overflow-hidden">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/DcaDTQVlm1Q"
                  allowFullScreen
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
