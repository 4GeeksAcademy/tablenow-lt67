import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 

export const Navbar = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation(); 

    const isHome = location.pathname === "/";
    const isLoginPage = location.pathname === "/login-owner";

    return (
        <nav className={`navbar navbar-expand-lg ${isHome ? 'navbar-dark fixed-top' : 'navbar-light bg-white shadow-sm'} px-4 py-3 transition-all`}>
            {/* Estilos dinámicos para el Navbar */}
            <style>{`
                .transition-all { transition: all 0.4s ease-in-out; }
                .navbar-dark { background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%); }
                .nav-glass {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                .navbar-brand {
                    letter-spacing: 1px;
                    font-family: 'Playfair Display', serif;
                }
            `}</style>

            <div className="container-fluid">
                <Link to="/" className="text-decoration-none">
                    <span className={`navbar-brand mb-0 h1 fw-bold ${isHome ? 'text-white' : 'text-primary'}`}>
                        <i className="fas fa-utensils me-2"></i>TableNow
                    </span>
                </Link>

                <div className="ms-auto d-flex align-items-center">
                    {!store.authOwner || isHome || isLoginPage ? (
                        !isLoginPage && (
                            <Link to="/login-owner">
                                <button className={`btn ${isHome ? 'btn-outline-light' : 'btn-primary'} px-4 shadow-sm fw-bold`}>
                                    <i className="fas fa-user-tie me-2"></i>Login
                                </button>
                            </Link>
                        )
                    ) : (
                        <div className="d-flex align-items-center gap-3">
                            {/* Historial */}
                            <Link to="/sales" className={`btn btn-sm ${isHome ? 'btn-outline-light' : 'btn-outline-secondary'}`}>
                                <i className="fas fa-history me-1"></i> Historial
                            </Link>

                            {/* Nueva Reserva */}
                            <Link to="/new-booking" className="btn btn-success btn-sm shadow-sm px-3">
                                <i className="fas fa-plus me-1"></i> Nueva Reserva
                            </Link>
                            
                            <div className={`border-start ms-2 ps-3 d-flex align-items-center gap-3 ${isHome ? 'border-light' : 'border-secondary'}`}>
    

    {/* Dashboard - Botón más sólido */}
    <Link 
        to="/owner-dashboard" 
        className={`btn btn-sm fw-bold ${isHome ? 'btn-light text-primary' : 'btn-primary'}`}
        style={{ transition: 'all 0.3s' }}
    >
        Dashboard
    </Link>
    
    {/* Logout - Rojo sólido para que destaque la acción */}
    <button 
        className="btn btn-danger btn-sm px-3 shadow-sm" 
        style={{ transition: 'all 0.3s' }}
        onClick={() => {
            actions.logout_owner(); 
            navigate("/");
        }}
    >
        <i className="fas fa-sign-out-alt"></i>
    </button>
</div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};