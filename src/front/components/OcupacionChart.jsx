import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const OcupacionChart = ({ restauranteId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restauranteId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stats/${restauranteId}`);
        
        if (!response.ok) throw new Error("Error fetching statistics");
        
        const result = await response.json();
        setData(result.semana); 
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [restauranteId]);

  if (loading) return (
    <div className="text-center p-5 text-muted-gold">
      <i className="fas fa-spinner fa-spin fa-2x mb-3"></i>
      <p>Loading statistics...</p>
    </div>
  );
  
  if (!data || data.length === 0) return (
    <div className="text-center p-5 text-muted-gold">
      Not enough data for the chart.
    </div>
  );

  const diaPico = data.reduce((max, current) => (current.personas > max.personas ? current : max), data[0]);

  return (
    <div className="bg-transparent border-0">
      <div className="p-0">
        <h5 className="text-center text-white mb-4 fw-bold font-serif tracking-wide">
            <i className="fas fa-chart-bar me-2 text-gold"></i>Weekly Occupancy Analysis
        </h5>
        
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(197, 164, 126, 0.1)" />
              <XAxis 
                dataKey="dia" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#c5a47e', fontSize: 12}}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#c5a47e', fontSize: 12}}
              />
              
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ 
                    backgroundColor: '#111', 
                    borderRadius: '8px', 
                    border: '1px solid #c5a47e',
                    color: '#fff'
                }}
                itemStyle={{ color: '#c5a47e' }}
                formatter={(value, name, props) => {
                    return [
                        `${value} people (${props.payload.ocupacion}% capacity)`, 
                        "Occupancy"
                    ];
                }}
              />
              
              <Bar dataKey="personas" radius={[4, 4, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                    <Cell 
                        key={`cell-${index}`} 
                        // Gold/Luxury palette based on occupancy
                        fill={entry.ocupacion > 80 ? "#e63946" : entry.ocupacion > 50 ? "#c5a47e" : "#8a7051"} 
                    />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {diaPico && diaPico.personas > 0 ? (
            <div className="mt-4 py-3 px-4 small rounded shadow-sm" style={{ backgroundColor: 'rgba(197, 164, 126, 0.1)', border: '1px solid rgba(197, 164, 126, 0.2)' }}>
              <i className="fas fa-lightbulb me-2 text-gold fa-lg"></i>
              <span className="text-white">
                <strong className="text-gold">TableNow Insight:</strong> <strong>{diaPico.dia}</strong> shows the highest demand with <strong>{diaPico.personas} guests</strong>. Plan your staff schedule accordingly.
              </span>
            </div>
        ) : (
            <div className="mt-4 py-3 px-4 small rounded border border-gold-opacity text-muted-gold text-center">
               <i className="fas fa-info-circle me-2"></i> No reservations recorded for this week yet.
            </div>
        )}
      </div>
    </div>
  );
};

export default OcupacionChart;