import React, { useEffect, useState } from "react"; // AGREGA EL useState AQUÍ
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const OwnerDashboard = () => {
    const { store, actions } = useGlobalReducer();
    const [myRestaurants, setMyRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const response = await fetch(process.env.BACKEND_URL + "/api/owner/restaurants", {
                headers: { "Authorization": "Bearer " + store.token }
            });
            if (response.ok) {
                const data = await response.json();
                setMyRestaurants(data);
            }
        };
        if (store.token) fetchRestaurants();
    }, [store.token]);

    return (
        <div className="container mt-5">
            <div className="border-bottom pb-3 mb-4">
                <h1>Panel de Control: {store.ownerInfo?.name || "Dueño"}</h1>
                <span className="badge bg-success">Sesión Iniciada como Owner</span>
            </div>

            <div className="row g-4">
                {/* SECCIÓN: MI NEGOCIO */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">🏠 Mi Restaurante</h5>
                            <p className="card-text text-muted">Configura el nombre y detalles de tu local.</p>
                            <Link to="/crear-restaurante" className="btn btn-primary w-100">Configurar</Link>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: PERSONAL */}
<div className="col-md-6 col-lg-4">
    <div className="card h-100 shadow-sm">
        <div className="card-body">
            <h5 className="card-title">👥 Gestionar Equipo</h5>
            <p className="card-text text-muted">Crea cuentas para tus Gerentes y Hosts.</p>
            
            {/* Botones principales */}
            <div className="d-grid gap-2">
                <Link to="/gerentes" className="btn btn-outline-primary">
                    📂 Ver Lista de Gerentes
                </Link>
                <Link to="/new_gerente" className="btn btn-success">
                    ➕ Crear Nuevo Gerente
                </Link>
                <Link to="/crear-host" className="btn btn-outline-secondary">
                    🎧 Crear Hostess
                </Link>
            </div>
        </div>
    </div>
</div>

                {/* SECCIÓN: PRODUCTOS (Tu CRUD de ventas/items) */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">🍴 Menú y Ventas</h5>
                            <p className="card-text text-muted">Administra los platos y revisa lo vendido.</p>
                            <Link to="/menu" className="btn btn-info w-100 text-white">Ir al Menú</Link>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN: RESERVAS */}
                <div className="col-md-6 col-lg-4">
                    <div className="card h-100 shadow-sm border-warning">
                        <div className="card-body">
                            <h5 className="card-title text-warning">📅 Reservas</h5>
                            <p className="card-text text-muted">Mira quién viene a comer hoy.</p>
                            <Link to="/booking" className="btn btn-warning w-100">Ver Reservas</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};