"use client";
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function ProgressDashboard() {
  // Datos de ejemplo para cuadernillos completados por fecha
  const [progressData] = useState([
    { fecha: '27 oct', cuadernillos: 2 },
    { fecha: '28 oct', cuadernillos: 3 },
    { fecha: '29 oct', cuadernillos: 1 },
    { fecha: '30 oct', cuadernillos: 4 },
    { fecha: '31 oct', cuadernillos: 2 },
    { fecha: '1 nov', cuadernillos: 5 },
    { fecha: '2 nov', cuadernillos: 3 },
  ]);

  // Datos por materia
  const [subjectData] = useState([
    { materia: 'Matemáticas', completados: 12, total: 20 },
    { materia: 'Lectura Crítica', completados: 15, total: 20 },
    { materia: 'Ciencias', completados: 8, total: 20 },
    { materia: 'Sociales', completados: 10, total: 20 },
    { materia: 'Inglés', completados: 14, total: 20 },
  ]);

  const totalCuadernillos = progressData.reduce((acc, day) => acc + day.cuadernillos, 0);
  const promedioSemanal = (totalCuadernillos / progressData.length).toFixed(1);
  const rachaActual = 7;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
          <div className="flex items-center gap-4 flex-1">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
                <input
                    type="text"
                    placeholder="¿Qué deseas aprender?"
                    className="w-full text-white placeholder-gray-400 outline-none border-none"
                    style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                    WebkitAppearance: "none",
                    }}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center relative shadow-lg">
                <span className="text-2xl">🔥</span>
                <span className="absolute -bottom-1 -right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-gray-900">
                  {rachaActual}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-600 transition">
              👤
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-8">Mi progreso</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6">
            <h3 className="text-white/80 text-sm mb-2">Total Cuadernillos</h3>
            <p className="text-white text-4xl font-bold">{totalCuadernillos}</p>
            <p className="text-white/60 text-sm mt-2">Esta semana</p>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
            <h3 className="text-white/80 text-sm mb-2">Promedio Diario</h3>
            <p className="text-white text-4xl font-bold">{promedioSemanal}</p>
            <p className="text-white/60 text-sm mt-2">Cuadernillos/día</p>
          </div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-2xl font-bold">Progreso Semanal</h2>
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm">Cuadernillos vistos</span>
              <span className="text-white text-3xl font-bold">{totalCuadernillos}</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={progressData}>
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
                  border: '1px solid #6B7280',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar 
                dataKey="cuadernillos" 
                fill="#8B5CF6" 
                radius={[8, 8, 0, 0]}
                name="Cuadernillos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
          <h2 className="text-white text-2xl font-bold mb-6">Progreso por Materia</h2>
          
          <div className="space-y-4">
            {subjectData.map((subject, index) => {
              const percentage = (subject.completados / subject.total) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">{subject.materia}</span>
                    <span className="text-gray-400 text-sm">
                      {subject.completados}/{subject.total} cuadernillos
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-purple-400 text-sm font-semibold">
                    {percentage.toFixed(0)}% completado
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}