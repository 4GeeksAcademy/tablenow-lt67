import React, { useEffect, useState } from "react";

export const Home = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //  cargar mensaje test
  const loadMessage = async () => {
    try {
      const res = await fetch(backendUrl + "/api/hello");
      const data = await res.json();
      setMensaje(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  //  cargar restaurantes
  const loadRestaurantes = async () => {
    try {
      const res = await fetch(backendUrl + "/api/restaurantes");
      const data = await res.json();
      setRestaurantes(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMessage();
    loadRestaurantes();
  }, []);

  return (
    <div className="container mt-5 text-center">
      <h1>🍽️ PANEL DE GESTIÓN - TABLENOW</h1>

      {/*  mensaje backend */}
      <div className="alert alert-success mt-3">
        {mensaje ? mensaje : "Cargando backend..."}
      </div>

      {/*  lista */}
      <ul className="list-group mt-4">
        {restaurantes.length > 0 ? (
          restaurantes.map((r) => (
            <li key={r.id} className="list-group-item">
              {r.nombre}
            </li>
          ))
        ) : (
          <li className="list-group-item">No hay restaurantes</li>
        )}
      </ul>
    </div>
  );
};