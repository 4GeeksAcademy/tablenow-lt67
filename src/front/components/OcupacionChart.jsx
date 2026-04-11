import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

// 1. Recibimos el restauranteId que le envía el OwnerDashboard
const OcupacionChart = ({ restauranteId }) => {
  // 2. Estados para guardar los datos reales y el estado de carga
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3. Efecto para buscar los datos en el backend cuando carga el componente
  useEffect(() => {
    if (!restauranteId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        // Hacemos la petición a tu ruta de Flask
        // Ajusta la variable de entorno según como la tengas en tu proyecto (VITE_BACKEND_URL, process.env, etc.)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stats/${restauranteId}`);
        
        if (!response.ok) throw new Error("Error al obtener estadísticas");
        
        const result = await response.json();
        
        // El backend devuelve { aforo_maximo: X, semana: [...], esta_abierto: true }
        // Solo necesitamos el arreglo "semana" para el gráfico
        setData(result.semana); 
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [restauranteId]);

  // Pantalla de carga mientras trae los datos
  if (loading) return <div className="text-center p-5 text-muted"><i className="fas fa-spinner fa-spin fa-2x mb-3"></i><p>Cargando estadísticas...</p></div>;
  if (!data || data.length === 0) return <div className="text-center p-5 text-muted">No hay datos suficientes para el gráfico.</div>;

  // 4. Lógica para el Tip: Encontrar dinámicamente el día con más reservas
  const diaPico = data.reduce((max, current) => (current.personas > max.personas ? current : max), data[0]);

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-body p-4">
        <h5 className="card-title text-center text-primary mb-4 fw-bold">
            <i className="fas fa-chart-bar me-2"></i>Análisis de Ocupación Semanal
        </h5>
        
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              
              {/* Tooltip personalizado para mostrar Personas y % de Ocupación */}
              <Tooltip 
                cursor={{fill: '#f8f9fa'}}
                contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                formatter={(value, name, props) => {
                    return [
                        `${value} personas (${props.payload.ocupacion}% aforo)`, 
                        "Ocupación"
                    ];
                }}
              />
              
              {/* Cambiamos dataKey a "personas" porque así lo manda tu backend */}
              <Bar dataKey="personas" radius={[5, 5, 0, 0]} barSize={45}>
                {data.map((entry, index) => (
                    // 5. ¡Magia visual! Coloreamos la barra según el % de ocupación que calculó tu backend
                    <Cell 
                        key={`cell-${index}`} 
                        fill={entry.ocupacion > 80 ? "#dc3545" : entry.ocupacion > 50 ? "#ffc107" : "#0d6efd"} 
                    />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Tip dinámico basado en los datos reales */}
        {diaPico && diaPico.personas > 0 ? (
            <div className="alert alert-info mt-4 py-3 small border-0 shadow-sm" role="alert">
              <i className="fas fa-lightbulb me-2 text-warning fa-lg"></i>
              <strong>Tip TableNow:</strong> El día <strong>{diaPico.dia}</strong> presenta tu mayor pico de demanda con <strong>{diaPico.personas} personas</strong>. Asegúrate de tener staff suficiente.
            </div>
        ) : (
            <div className="alert alert-light mt-4 py-3 small border" role="alert">
               <i className="fas fa-info-circle me-2 text-muted"></i> Aún no hay reservas esta semana.
            </div>
        )}
      </div>
    </div>
  );
};

export default OcupacionChart;