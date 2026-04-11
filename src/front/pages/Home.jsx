import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

// Puedes usar una imagen de alta calidad de un restaurante para el fondo
const heroImageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");
      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_hello", payload: data.message });
    } catch (error) {
      console.error(error);
    }
  };

  const loadSales = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(backendUrl + "/api/sales", {
        headers: { "Content-Type": "application/json", "Bypass-Tunnel-Reminder": "true" }
      });
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_sales", payload: data });
    } catch (error) {
      console.error("Error loading sales", error);
    }
  };

  useEffect(() => {
    loadMessage();
    loadSales();
  }, []);

  return (
    <div className="home-container">
      {/* Estilos Inline para no complicarte con archivos CSS externos */}
      <style>{`
        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImageUrl});
          background-size: cover;
          background-position: center;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-align: center;
        }
        .hero-content {
          max-width: 800px;
          padding: 20px;
        }
        .brand-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 50px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
          display: inline-block;
        }
        .main-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 20px;
          font-family: 'Playfair Display', serif;
        }
        .sub-text {
          font-size: 1.25rem;
          margin-bottom: 40px;
          opacity: 0.9;
        }
        .action-buttons .btn {
          padding: 12px 30px;
          border-radius: 5px;
          font-weight: 600;
          margin: 10px;
          transition: all 0.3s ease;
        }
        .btn-outline-light:hover {
          background-color: white;
          color: black;
        }
        .status-bar {
          position: absolute;
          bottom: 20px;
          width: 100%;
          font-size: 0.8rem;
        }
      `}</style>

      <div className="hero-section">
        <div className="hero-content">
          <span className="brand-badge">TableNow System</span>
          <h1 className="main-title">Savor the Moment, <br /> One Click at a Time</h1>
          <p className="sub-text">
            Gestiona tu restaurante con la elegancia y precisión que tus clientes merecen. 
            Immerse yourself in a delightful management experience.
          </p>

          <div className="action-buttons">
            {/* Acciones Principales */}
            <button className="btn btn-light btn-lg shadow" onClick={() => navigate("/gerentes")}>
              Gestión de Gerentes
            </button>
            <button className="btn btn-outline-light btn-lg" onClick={() => navigate("/clients")}>
              Portal Clientes
            </button>
          </div>

          <div className="mt-4 pt-4 border-top border-secondary action-buttons">
            <h5 className="mb-3" style={{opacity: 0.7}}>Panel Administrativo</h5>
            <button className="btn btn-primary btn-sm" onClick={() => navigate("/owners")}>Owners</button>
            <button className="btn btn-success btn-sm" onClick={() => navigate("/new-sale")}>+ Nueva Venta</button>
            <button className="btn btn-info btn-sm" onClick={() => navigate("/sales")}>Historial</button>
          </div>
        </div>

        {/* Estado del Backend */}
        <div className="status-bar text-center">
          {store.message ? (
            <span className="badge bg-success">Sistema Online: {store.message}</span>
          ) : (
            <span className="badge bg-danger pulse">Conectando con el servidor...</span>
          )}
        </div>
      </div>
    </div>
  );
};