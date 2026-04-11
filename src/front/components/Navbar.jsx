import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 


export const Navbar = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();
    const location = useLocation(); 

    const isHome = location.pathname === "/";
    const isLoginPage = location.pathname === "/login-owner";

    return (
        <nav className="navbar navbar-light bg-light mb-3 px-3 shadow-sm">
            <Link to="/">
                <span className="navbar-brand mb-0 h1 fw-bold text-primary">TableNow</span>
            </Link>

            <div className="ml-auto">
                {!store.authOwner || isHome || isLoginPage ? (
                    !isLoginPage && (
                        <Link to="/login-owner">
                            <button className="btn btn-primary shadow-sm">Login Owner</button>
                        </Link>
                    )
                ) : (
                    <div className="d-flex align-items-center gap-2">
                        <Link to="/sales" className="btn btn-outline-secondary btn-sm">
                            <i className="fas fa-history me-1"></i> Historial
                        </Link>

                        <Link to="/new-booking" className="btn btn-outline-success btn-sm shadow-sm">
                            <i className="fas fa-plus me-1"></i> Nueva Reserva
                        </Link>
                        
                        <div className="border-start ms-2 ps-2 d-flex align-items-center gap-3">
                            <span className="text-muted small d-none d-md-inline">
                                {store.ownerInfo?.name || store.ownerInfo?.email}
                            </span>

                            <Link to="/owner-dashboard" className="btn btn-outline-primary btn-sm">Dashboard</Link>
                            
                            <button 
                                className="btn btn-danger btn-sm" 
                                onClick={() => {
                                    actions.logout_owner(); 
                                    navigate("/");
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};