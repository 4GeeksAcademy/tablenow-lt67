import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 

export const Navbar = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-light bg-light mb-3 px-3">
            <Link to="/">
                <span className="navbar-brand mb-0 h1">TableNow</span>
            </Link>

            <div className="ml-auto">
                {!store.authOwner ? (
                    <Link to="/login-owner">
                        <button className="btn btn-primary">Login Owner</button>
                    </Link>
                ) : (
                    <div className="d-flex align-items-center gap-3">
                    
                        <span className="text-muted">
                                Hola, {store.ownerInfo?.name || store.ownerInfo?.email}
                                </span>
                            <Link to="/owner-dashboard" className="btn btn-outline-primary">Dashboard</Link>
                        <button 
                            className="btn btn-danger" 
                            onClick={() => {
                                actions.logout_owner(); 
                                navigate("/");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};