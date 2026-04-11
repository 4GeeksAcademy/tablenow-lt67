import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

// Nueva imagen de alta resolución con parámetros de optimización
const sideImageUrl = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop";

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

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="home-wrapper">
      <div className="home-container">
        {/* Lado del Texto (Izquierda) */}
        <div className="text-side">
          <span className="brand-badge">Reservations Open</span>
          
          <h1 className="main-title">
            Savor the Moment, <br /> 
            <span style={{ color: "#c5a47e" }}>One Click</span> at a Time
          </h1>

          <p className="sub-text">
            Discover a journey of flavors at our exquisite restaurants. 
            Immerse yourself in a delightful dining experience crafted 
            with passion and precision.
          </p>

          <div className="d-flex flex-wrap">
            <button className="btn btn-luxury btn-fill" onClick={() => navigate("/clients")}>
              Book a Table
            </button>
            <button className="btn btn-luxury btn-outline" onClick={() => navigate("/gerentes")}>
              Explore System
            </button>
          </div>

          <div className="mt-5 pt-4 admin-access-section">
             <p className="admin-label">Admin Access</p>
             <button 
                className="btn p-0 text-white admin-btn" 
                onClick={() => navigate("/owners")}
             >
                Dashboard Owners →
             </button>
          </div>
        </div>

        {/* Lado de la Imagen (Derecha) */}
        <div className="image-side"></div>
      </div>

      {/* Indicador de Conexión Estilizado */}
      <div className="status-pill">
        <span className="dot" style={{ backgroundColor: store.message ? "#4CAF50" : "#F44336" }}></span>
        <span>{store.message ? `System Online: ${store.message}` : "Connecting to API..."}</span>
      </div>

      {/* ESTILOS AL FINAL COMO PEDISTE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300;400;600&display=swap');

        .home-wrapper {
          background-color: #111;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .home-container {
          display: flex;
          height: 100vh;
          width: 100%;
          align-items: center;
        }

        .text-side {
          flex: 1;
          padding: 0 8%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          z-index: 2;
        }

        .image-side {
          flex: 1;
          height: 90vh;
          background-image: url('${sideImageUrl}');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          margin-right: 40px;
          border-radius: 12px;
          box-shadow: -20px 20px 60px rgba(0,0,0,0.7);
          transition: transform 0.5s ease;
        }

        .image-side:hover {
          transform: scale(1.02);
        }

        .brand-badge {
          font-family: 'Montserrat', sans-serif;
          color: #c5a47e;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-size: 0.8rem;
          margin-bottom: 20px;
          display: block;
        }

        .main-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          line-height: 1.1;
          margin-bottom: 30px;
        }

        .sub-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          line-height: 1.8;
          color: #aaa;
          max-width: 500px;
          margin-bottom: 40px;
        }

        .btn-luxury {
          padding: 15px 35px;
          border-radius: 0;
          font-family: 'Montserrat', sans-serif;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          transition: all 0.4s ease;
        }

        .btn-fill {
          background-color: #c5a47e;
          color: white;
          border: none;
          margin-right: 15px;
        }

        .btn-fill:hover {
          background-color: #e2c29d;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(197, 164, 126, 0.2);
        }

        .btn-outline {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .btn-outline:hover {
          border-color: #fff;
          background: #fff;
          color: #000;
        }

        .admin-access-section {
          border-top: 1px solid #333;
          max-width: 400px;
        }

        .admin-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 5px;
        }

        .admin-btn {
          font-size: 0.8rem;
          opacity: 0.5;
          transition: opacity 0.3s;
          background: none;
          border: none;
        }

        .admin-btn:hover {
          opacity: 1;
        }

        .status-pill {
          position: fixed;
          bottom: 30px;
          left: 8%;
          font-family: 'Montserrat', sans-serif;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 15px;
          background: rgba(255,255,255,0.05);
          border-radius: 50px;
          backdrop-filter: blur(5px);
        }

        .dot {
          height: 8px;
          width: 8px;
          border-radius: 50%;
        }

        @media (max-width: 992px) {
          .image-side { display: none; }
          .text-side { text-align: center; padding: 0 5%; align-items: center; }
          .sub-text { margin: 0 auto 40px auto; }
          .status-pill { left: 50%; transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};