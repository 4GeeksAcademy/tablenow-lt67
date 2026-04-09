import React, { useContext } from "react";
import { StoreContext } from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

const EmpleadoDashboard = () => {
    const { store, dispatch } = useContext(StoreContext);
    const navigate = useNavigate();

    const empleado = store.user; 

    const handleLogout = () => {
        dispatch({ type: "logout" }); 
        navigate("/login");
    };

    return (
        <div className="container mt-5 text-center">
            <h1 className="display-3 fw-bold text-warning mb-4">
                EmpleadoDashboard.jsx
            </h1>
            
            <div className="card shadow border-0 p-5">
                <i className="bi bi-person-badge text-warning" style={{ fontSize: "5rem" }}></i>
                <h2 className="mt-3">Bienvenido, {empleado?.full_name || "Empleado"}</h2>
                <p className="text-muted">Esta es tu zona de trabajo en TableNow.</p>
                
                <div className="alert alert-info mt-4">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Aquí agregaremos las funciones de gestión de mesas y pedidos más adelante.
                </div>

                <button  
                    className="btn btn-outline-danger mt-4 w-25 mx-auto"
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

export default EmpleadoDashboard;