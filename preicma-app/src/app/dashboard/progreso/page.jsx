"use client";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function ProgressDashboard() {
  const [progressData] = useState([
    { fecha: '27 oct', cuadernillos: 2 },
    { fecha: '28 oct', cuadernillos: 3 },
    { fecha: '29 oct', cuadernillos: 1 },
    { fecha: '30 oct', cuadernillos: 4 },
    { fecha: '31 oct', cuadernillos: 2 },
    { fecha: '1 nov', cuadernillos: 5 },
    { fecha: '2 nov', cuadernillos: 3 },
  ]);

  const [subjectData] = useState([
    { materia: 'Matemáticas', completados: 12, total: 20, icon: '📐', color: 'from-blue-500 to-cyan-600' },
    { materia: 'Lectura Crítica', completados: 15, total: 20, icon: '📚', color: 'from-purple-500 to-pink-600' },
    { materia: 'Ciencias', completados: 8, total: 20, icon: '🔬', color: 'from-green-500 to-emerald-600' },
    { materia: 'Sociales', completados: 10, total: 20, icon: '🌍', color: 'from-orange-500 to-red-600' },
    { materia: 'Inglés', completados: 14, total: 20, icon: '🗣️', color: 'from-yellow-500 to-amber-600' },
  ]);

  const [radarData] = useState([
    { materia: 'Matemáticas', puntaje: 60 },
    { materia: 'Lectura', puntaje: 75 },
    { materia: 'Ciencias', puntaje: 40 },
    { materia: 'Sociales', puntaje: 50 },
    { materia: 'Inglés', puntaje: 70 },
  ]);

  const totalCuadernillos = progressData.reduce((acc, day) => acc + day.cuadernillos, 0);
  const promedioSemanal = (totalCuadernillos / progressData.length).toFixed(1);
  const rachaActual = 7;
  const totalCompletados = subjectData.reduce((acc, subject) => acc + subject.completados, 0);
  const totalGeneral = subjectData.reduce((acc, subject) => acc + subject.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-xl" />
          <div className="relative flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text"
                placeholder ="¿Qué deseas aprender hoy?"
                className="w-full text-white placeholder-white-400 outline-none border-none text-sm sm:text-base"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  WebkitAppearance: "none",
                }}
              />
            </div>
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transform group-hover:scale-110 transition-transform">
                  <span className="text-2xl sm:text-3xl">🔥</span>
                  <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-gray-900 shadow-lg animate-bounce">
                    {rachaActual}
                  </span>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg transform group-hover:scale-110 transition-transform">
                  <span className="text-xl sm:text-2xl">👤</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Título animado */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2 animate-pulse">
            Mi Progreso
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">Sigue tu evolución y alcanza tus metas</p>
        </div>

        {/* Cards de estadísticas mejoradas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 border border-purple-400/30 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white/80 text-xs font-semibold">Esta semana</span>
                </div>
              </div>
              <h3 className="text-white/70 text-sm mb-2">Total Cuadernillos</h3>
              <p className="text-white text-4xl font-bold mb-1">{totalCuadernillos}</p>
              <div className="flex items-center gap-2 text-green-300 text-sm">
                <span>↗</span>
                <span>+12% vs anterior</span>
              </div>
            </div>
          </div>

          {/* Promedio Diario */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 border border-blue-400/30 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">📈</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white/80 text-xs font-semibold">Promedio</span>
                </div>
              </div>
              <h3 className="text-white/70 text-sm mb-2">Cuadernillos/día</h3>
              <p className="text-white text-4xl font-bold mb-1">{promedioSemanal}</p>
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <span>⭐</span>
                <span>¡Excelente ritmo!</span>
              </div>
            </div>
          </div>

          {/* Racha actual */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-6 border border-orange-400/30 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-pulse">
                  <span className="text-2xl">🔥</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white/80 text-xs font-semibold">Días</span>
                </div>
              </div>
              <h3 className="text-white/70 text-sm mb-2">Racha Actual</h3>
              <p className="text-white text-4xl font-bold mb-1">{rachaActual}</p>
              <div className="flex items-center gap-2 text-yellow-300 text-sm">
                <span>🎯</span>
                <span>¡Sigue así!</span>
              </div>
            </div>
          </div>

          {/* Progreso global */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl p-6 border border-green-400/30 transform group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 shadow-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl">🎓</span>
                </div>
                <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-white/80 text-xs font-semibold">Total</span>
                </div>
              </div>
              <h3 className="text-white/70 text-sm mb-2">Progreso Global</h3>
              <p className="text-white text-4xl font-bold mb-1">{Math.round((totalCompletados/totalGeneral)*100)}%</p>
              <div className="flex items-center gap-2 text-blue-300 text-sm">
                <span>📚</span>
                <span>{totalCompletados}/{totalGeneral} completados</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de progreso semanal mejorado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="lg:col-span-2 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-purple-500/30 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Progreso Semanal</h2>
                  <p className="text-gray-400 text-sm">Cuadernillos completados por día</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 bg-purple-600/20 px-4 sm:px-6 py-3 rounded-xl border border-purple-500/30">
                  <span className="text-white/60 text-sm">Total vistos</span>
                  <span className="text-white text-2xl sm:text-3xl font-bold">{totalCuadernillos}</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#EC4899" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="fecha" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #8B5CF6',
                      borderRadius: '12px',
                      color: '#fff',
                      boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                    }}
                  />
                  <Bar 
                    dataKey="cuadernillos" 
                    fill="url(#barGradient)"
                    radius={[12, 12, 0, 0]}
                    name="Cuadernillos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de radar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-pink-500/30 shadow-2xl h-full">
              <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Rendimiento</h2>
              <p className="text-gray-400 text-sm mb-4">Por materia</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis 
                    dataKey="materia" 
                    stroke="#9CA3AF"
                    style={{ fontSize: '10px' }}
                  />
                  <PolarRadiusAxis stroke="#9CA3AF" />
                  <Radar 
                    name="Puntaje" 
                    dataKey="puntaje" 
                    stroke="#EC4899" 
                    fill="#EC4899" 
                    fillOpacity={0.6} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Progreso por materia mejorado */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl" />
          <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-purple-500/30 shadow-2xl">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div>
                <h2 className="text-white text-xl sm:text-2xl font-bold mb-2">Progreso por Materia</h2>
                <p className="text-gray-400 text-sm">Cuadernillos completados en cada área</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-green-600/20 px-4 py-2 rounded-full border border-green-500/30">
                <span className="text-green-400 text-sm font-semibold">Meta: 100%</span>
              </div>
            </div>
            
            <div className="grid gap-4 sm:gap-6">
              {subjectData.map((subject, index) => {
                const percentage = (subject.completados / subject.total) * 100;
                return (
                  <div key={index} className="group/item relative">
                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover/item:opacity-10 rounded-xl blur-xl transition-opacity duration-300"
                         style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
                    <div className={`relative bg-gradient-to-r ${subject.color} p-[2px] rounded-xl sm:rounded-2xl transform group-hover/item:scale-[1.02] transition-all duration-300`}>
                      <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${subject.color} rounded-xl flex items-center justify-center text-2xl shadow-lg transform group-hover/item:rotate-12 transition-transform duration-300`}>
                              {subject.icon}
                            </div>
                            <div>
                              <span className="text-white font-bold text-base sm:text-lg block">{subject.materia}</span>
                              <span className="text-gray-400 text-xs sm:text-sm">
                                {subject.completados}/{subject.total} cuadernillos
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-transparent bg-gradient-to-r ${subject.color} bg-clip-text text-xl sm:text-2xl font-bold`}>
                              {percentage.toFixed(0)}%
                            </span>
                            {percentage >= 75 && <span className="text-xl">🏆</span>}
                            {percentage >= 50 && percentage < 75 && <span className="text-xl">⭐</span>}
                            {percentage < 50 && <span className="text-xl">💪</span>}
                          </div>
                        </div>
                        
                        <div className="relative w-full bg-gray-700/50 rounded-full h-3 sm:h-4 overflow-hidden backdrop-blur-sm">
                          <div 
                            className={`h-full bg-gradient-to-r ${subject.color} rounded-full transition-all duration-700 ease-out relative overflow-hidden group-hover/item:shadow-lg`}
                            style={{ width: `${percentage}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center justify-between">
                          <span className={`text-transparent bg-gradient-to-r ${subject.color} bg-clip-text text-xs sm:text-sm font-semibold`}>
                            {percentage >= 75 ? '¡Excelente progreso!' : percentage >= 50 ? 'Buen avance' : '¡Sigue adelante!'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            Faltan {subject.total - subject.completados} cuadernillos
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Motivación final */}
        <div className="mt-6 sm:mt-8 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl blur-2xl animate-pulse" />
          <div className="relative bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <span className="text-4xl sm:text-5xl">🎯</span>
              <div>
                <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">¡Vas por buen camino!</h3>
                <p className="text-white/80 text-sm sm:text-base">Sigue así y alcanzarás tus metas más rápido de lo que piensas</p>
              </div>
              <span className="text-4xl sm:text-5xl">🚀</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}