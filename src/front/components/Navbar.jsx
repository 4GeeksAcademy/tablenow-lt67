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
        <nav className={`navbar navbar-expand-lg ${isHome ? 'navbar-dark fixed-top' : 'navbar-dark bg-dark shadow-sm sticky-top'} px-4 py-3 transition-all`}>
            {/* Dynamic styles for the Navbar */}
            <style>{`
                .transition-all { transition: all 0.4s ease-in-out; }
                .navbar-dark { background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%); }
                .bg-dark { background-color: #1a1a1a !important; } 
                .navbar-brand {
                    letter-spacing: 1px;
                    font-family: 'Playfair Display', serif;
                }
                /* Custom buttons with your specific color */
                .btn-custom-gold {
                    background-color: #c5a47e !important;
                    border-color: #c5a47e !important;
                    color: #fff !important;
                    border-radius: 50px; /* Rounded pill style */
                    font-weight: 600;
                }
                .btn-custom-gold:hover {
                    filter: brightness(1.1);
                    color: #fff !important;
                }
                .btn-outline-custom {
                    border-color: #c5a47e !important;
                    color: #c5a47e !important;
                    border-radius: 50px;
                }
                .btn-outline-custom:hover {
                    background-color: #c5a47e !important;
                    color: #fff !important;
                }
                .btn-pill { border-radius: 50px; }
                .sticky-top { z-index: 1020; }
            `}</style>

            <div className="container-fluid">
                <Link to="/" className="text-decoration-none">
                    <span className="navbar-brand mb-0 h1 fw-bold text-white">
                        <i className="fas fa-utensils me-2"></i>TableNow
                    </span>
                </Link>

                <div className="ms-auto d-flex align-items-center">
                    {!store.authOwner || isHome || isLoginPage ? (
                        !isLoginPage && (
                            <Link to="/login-owner">
                                <button className="btn btn-outline-light px-4 shadow-sm fw-bold btn-pill">
                                    <i className="fas fa-user-tie me-2"></i>Login
                                </button>
                            </Link>
                        )
                    ) : (
                        <div className="d-flex align-items-center gap-3">
                            {/* History */}
                            <Link to="/sales" className="btn btn-sm btn-outline-custom">
                                <i className="fas fa-history me-1"></i> History
                            </Link>

                            {/* New Booking */}
                            <Link to="/new-booking" className="btn btn-custom-gold btn-sm shadow-sm px-3">
                                <i className="fas fa-plus me-1"></i> New Booking
                            </Link>
                            
                            <div className="border-start border-light ms-2 ps-3 d-flex align-items-center gap-3">
                                {/* Dashboard */}
                                <Link 
                                    to="/owner-dashboard" 
                                    className="btn btn-sm fw-bold btn-custom-gold"
                                    style={{ transition: 'all 0.3s' }}
                                >
                                    Dashboard
                                </Link>
                                
                                {/* Logout */}
                                <button 
                                    className="btn btn-outline-danger btn-sm px-3 shadow-sm btn-pill" 
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