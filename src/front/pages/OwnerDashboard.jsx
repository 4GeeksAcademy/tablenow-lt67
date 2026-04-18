import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import OcupacionChart from "../components/OcupacionChart.jsx";

export const OwnerDashboard = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();
    
    
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState(null);

    useEffect(() => {
        if (store.tokenOwner) {
            actions.getOwnerRestaurants();
        }
    }, [store.tokenOwner]);

    // NUEVO: Cuando los restaurantes carguen, seleccionamos el primero por defecto
    useEffect(() => {
        if (store.restaurants && store.restaurants.length > 0 && !restauranteSeleccionado) {
            setRestauranteSeleccionado(store.restaurants[0].id);
        }
    }, [store.restaurants]);

    return (
        <div className="dashboard-luxury-wrapper py-5" style={{ minHeight: "100vh" }}>
            <div className="luxury-overlay"></div>
            
            <div className="container position-relative z-index-2">
                {/* HEADER SECCIÓN */}
                <div className="d-flex justify-content-between align-items-center border-bottom border-gold-opacity pb-4 mb-5">
                    <div>
                        <h1 className="display-5 fw-bold text-white font-serif tracking-wide">Control Panel</h1>
                        <p className="text-gold mb-0 letter-spacing-1 text-uppercase small fw-bold">Welcome back, Director</p>
                    </div>
                    <div className="text-end">
                        <span className="badge-luxury-status px-3 py-2 shadow">
                            <i className="fas fa-circle me-2 pulse-icon" style={{ fontSize: "8px", color: "#4CAF50" }}></i>
                            Active Owner Session
                        </span>
                    </div>
                </div>

                <div className="row g-4">
                    {/* TARJETA: ESTADO DE RESTAURANTES */}
                    <div className="col-12 mb-2">
                        <div className="card-luxury d-flex align-items-center p-4">
                            <div className="icon-box-gold text-gold rounded-circle p-3 me-3 flex-shrink-0">
                                <i className="fas fa-store fa-lg"></i>
                            </div>
                            <div>
                                <h5 className="mb-1 text-white fw-bold">You have {store.restaurants?.length || 0} registered restaurants</h5>
                                <p className="mb-0 text-muted-gold small">Manage availability and data for your locations from here.</p>
                            </div>
                            <Link to="/crear-restaurante" className="btn-gold-solid ms-auto shadow-sm flex-shrink-0">
                                <i className="fas fa-plus me-2"></i>Add Location
                            </Link>
                        </div>
                    </div>

                    {/* SECCIÓN: GESTIÓN DE STAFF */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card-luxury h-100 hover-lift transition">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-box-gold p-2 rounded-3 me-3">
                                        <i className="fas fa-users-cog fa-xl"></i>
                                    </div>
                                    <h5 className="card-title mb-0 fw-bold text-white tracking-wide">Staff Management</h5>
                                </div>
                                <p className="text-muted-gold small mb-4">Manage access for your Managers, Hostesses, and general staff.</p>

                                <div className="d-grid gap-2 mt-auto">
                                    <button 
                                        className="btn-glass-action btn-sm text-start ps-3" 
                                        onClick={() => navigate("/empleado")}
                                    >
                                        <i className="fas fa-user-tie me-2 text-gold"></i> Employees
                                    </button>

                                    <hr className="my-2 border-gold-opacity" />

                                    <Link to="/hosts" className="btn-glass-action btn-sm text-start ps-3">
                                        <i className="fas fa-list me-2 text-gold"></i> View Team List
                                    </Link>

                                    <Link to="/create-host" className="btn-glass-outline btn-sm text-start ps-3">
                                        <i className="fas fa-user-plus me-2 text-white"></i> Create New Hostess
                                    </Link>

                                    <Link to="/new_gerente" className="btn-glass-outline btn-sm text-start ps-3">
                                        <i className="fas fa-plus me-2 text-white"></i> New Manager
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: RESERVAS Y AGENDA */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card-luxury h-100 hover-lift transition border-accent-gold">
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-box-gold p-2 rounded-3 me-3">
                                        <i className="fas fa-calendar-check fa-xl"></i>
                                    </div>
                                    <h5 className="card-title mb-0 fw-bold text-white tracking-wide">Active Bookings</h5>
                                </div>
                                <p className="text-muted-gold small mb-4">Monitor customer flow, waitlists, and confirm reservations.</p>
                                
                                <div className="mt-auto">
                                    <Link to="/booking" className="btn-gold-solid w-100 shadow-sm text-center d-block">
                                        View Today's Schedule
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: MENÚ Y CARTA */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card-luxury h-100 hover-lift transition">
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="icon-box-gold p-2 rounded-3 me-3">
                                        <i className="fas fa-utensils fa-xl"></i>
                                    </div>
                                    <h5 className="card-title mb-0 fw-bold text-white tracking-wide">Menu & Catalog</h5>
                                </div>
                                <p className="text-muted-gold small mb-4">Configure dishes, pricing, and categories for your culinary offer.</p>
                                
                                <div className="mt-auto">
                                    <Link to="/menu" className="btn-glass-outline w-100 text-center d-block">
                                        Manage Menu
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NUEVA SECCIÓN: CHAT Y SOPORTE AL CLIENTE */}
    <div className="col-md-6 col-lg-3">
        <div className="card-luxury h-100 hover-lift transition" style={{ borderBottom: "3px solid #c5a47e" }}>
            <div className="card-body p-4 d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                    <div className="icon-box-gold p-2 rounded-3 me-3" style={{ background: "rgba(197, 164, 126, 0.2)" }}>
                        <i className="fas fa-comments fa-xl"></i>
                    </div>
                    <h5 className="card-title mb-0 fw-bold text-white tracking-wide">Messages</h5>
                </div>
                <p className="text-muted-gold small mb-4">Direct communication with your clients in real-time.</p>
                
                <div className="mt-auto d-grid gap-2">
                    <button 
                        className="btn-gold-solid w-100 shadow-sm text-center d-flex align-items-center justify-content-center"
                        onClick={() => navigate(`/chat/${restauranteSeleccionado}`)}
                        disabled={!restauranteSeleccionado}
                    >
                        <i className="fas fa-comment-dots me-2"></i>
                        Open Chat
                    </button>
                    <small className="text-center text-gold opacity-75 mt-1" style={{ fontSize: '0.7rem' }}>
                        {restauranteSeleccionado ? "Connected to selected location" : "Select a location below"}
                    </small>
                </div>
            </div>
        </div>
    </div>

                    {/* SECCIÓN DE ANALÍTICA*/}
                    <div className="col-12 mb-4">
                        {store.restaurants && store.restaurants.length > 0 ? (
                            <div className="card-luxury p-4">
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom border-gold-opacity pb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1 text-white font-serif tracking-wide">Occupancy Analysis</h5>
                                        <p className="text-muted-gold small mb-0">Select a location to view its metrics</p>
                                    </div>
                                    <div className="mt-3 mt-md-0">
                                        <select 
                                            className="select-luxury shadow-sm"
                                            value={restauranteSeleccionado || ""}
                                            onChange={(e) => setRestauranteSeleccionado(e.target.value)}
                                        >
                                            {store.restaurants.map(rest => (
                                                <option key={rest.id} value={rest.id}>
                                                    {rest.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="chart-container-luxury p-3 rounded">
                                    {restauranteSeleccionado && <OcupacionChart restauranteId={restauranteSeleccionado} />}
                                </div>
                            </div>
                        ) : (
                            <div className="card-luxury p-5 text-center">
                                <div className="text-gold mb-3 opacity-50">
                                    <i className="fas fa-chart-line fa-3x"></i>
                                </div>
                                <h5 className="text-white fw-bold font-serif">No occupancy data available</h5>
                                <p className="text-muted-gold mb-0">Register your first restaurant to start viewing reservation statistics.</p>
                            </div>
                        )}  
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@300;400;600;700&display=swap');

                .dashboard-luxury-wrapper {
                    position: relative;
                    background-image: url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    font-family: 'Montserrat', sans-serif;
                }

                .luxury-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at top center, rgba(20,20,20,0.85) 0%, rgba(5,5,5,0.98) 100%);
                    z-index: 1;
                }

                .z-index-2 { z-index: 2; }
                .font-serif { font-family: 'Playfair Display', serif; }
                .tracking-wide { letter-spacing: 1px; }
                .letter-spacing-1 { letter-spacing: 2px; }
                .text-gold { color: #c5a47e !important; }
                .text-muted-gold { color: rgba(197, 164, 126, 0.7); }
                .border-gold-opacity { border-color: rgba(197, 164, 126, 0.2) !important; }
                
                .pulse-icon {
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.4; }
                    100% { opacity: 1; }
                }

                .badge-luxury-status {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(197, 164, 126, 0.3);
                    color: #fff;
                    font-size: 0.8rem;
                    border-radius: 50px;
                    display: inline-block;
                }

                .card-luxury {
                    background: rgba(15, 15, 15, 0.8);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(197, 164, 126, 0.15);
                    border-radius: 8px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.5);
                }

                .border-accent-gold {
                    border-left: 4px solid #c5a47e !important;
                }

                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.7);
                    border-color: rgba(197, 164, 126, 0.4);
                }
                .transition { transition: all 0.3s ease-in-out; }

                .icon-box-gold {
                    background: rgba(197, 164, 126, 0.1);
                    color: #c5a47e;
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-gold-solid {
                    background: #c5a47e;
                    color: #000 !important;
                    border: none;
                    padding: 10px 20px;
                    font-weight: 700;
                    text-transform: uppercase;
                    font-size: 0.85rem;
                    letter-spacing: 1px;
                    border-radius: 4px;
                    text-decoration: none;
                    transition: 0.3s;
                }
                .btn-gold-solid:hover { background: #fff; color: #000 !important; }

                .btn-glass-action {
                    background: rgba(197, 164, 126, 0.1);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    color: #fff;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    transition: 0.3s;
                    text-decoration: none;
                    display: block;
                }
                .btn-glass-action:hover { background: rgba(197, 164, 126, 0.2); color: #fff; }

                .btn-glass-outline {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #aaa;
                    padding: 10px 15px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    transition: 0.3s;
                    text-decoration: none;
                    display: block;
                }
                .btn-glass-outline:hover {
                    border-color: rgba(197, 164, 126, 0.4);
                    color: #fff;
                }

                .select-luxury {
                    background-color: rgba(10,10,10,0.8);
                    color: #c5a47e;
                    border: 1px solid rgba(197, 164, 126, 0.4);
                    padding: 10px 35px 10px 15px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23c5a47e' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 15px center;
                }
                .select-luxury:focus {
                    outline: none;
                    border-color: #fff;
                }
                .select-luxury option {
                    background: #111;
                    color: #fff;
                }

                .chart-container-luxury {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                }
            `}</style>
        </div>
    );
};