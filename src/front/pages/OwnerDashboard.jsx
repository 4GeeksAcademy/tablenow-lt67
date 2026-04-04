import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const OwnerDashboard = () => {
    const { store, actions } = useGlobalReducer();

    useEffect(() => {
        if (store.tokenOwner) {
            actions.getOwnerRestaurants();
        }
    }, [store.tokenOwner]);

    return (
        <div className="container-fluid py-5 bg-light" style={{ minHeight: "100vh" }}>
            <div className="container">
                {/* HEADER SECCIÓN */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-4 mb-5">
                    <div>
                        <h1 className="display-5 fw-bold text-dark">Panel de Control</h1>
                        <p className="text-muted mb-0">Bienvenido de nuevo</p>
                    </div>
                    <div className="text-end">
                        <span className="badge rounded-pill bg-success px-3 py-2">
                            <i className="fas fa-circle me-2" style={{ fontSize: "8px" }}></i>
                            Sesión de Dueño Activa
                        </span>
                    </div>
                </div>

                <div className="row g-4">
                    {/* TARJETA: ESTADO DE RESTAURANTES */}
                    <div className="col-12 mb-2">
                        <div className="alert alert-white shadow-sm border-0 d-flex align-items-center p-4 bg-white">
                            <div className="icon-box bg-primary-subtle text-primary rounded-circle p-3 me-3">
                                <i className="fas fa-store fa-lg"></i>
                            </div>
                            <div>
                                <h5 className="mb-1">Tienes {store.restaurants?.length || 0} restaurantes registrados</h5>
                                <p className="mb-0 text-muted small">Gestiona la disponibilidad y datos de tus locales desde aquí.</p>
                            </div>
                            <Link to="/crear-restaurante" className="btn btn-primary ms-auto shadow-sm">
                                <i className="fas fa-plus me-2"></i>Añadir Local
                            </Link>
                        </div>
                    </div>

                    {/* SECCIÓN: GESTIÓN DE EQUIPO (HOSTESS Y GERENTES) */}
                    {/* SECCIÓN: GESTIÓN DE EQUIPO (HOSTESS Y GERENTES) */}
<div className="col-md-6 col-lg-4">
    <div className="card h-100 border-0 shadow-sm hover-shadow transition">
        <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
                <div className="bg-info-subtle text-info p-2 rounded-3 me-3">
                    <i className="fas fa-users-cog fa-xl"></i>
                </div>
                <h5 className="card-title mb-0 fw-bold">Gestión de Staff</h5>
            </div>
            <p className="text-muted small">Administra los accesos para tus Gerentes y personal de Hostess.</p>
            
            <div className="d-grid gap-2 mt-4">
                <Link to="/hosts" className="btn btn-primary btn-sm text-start ps-3 shadow-sm">
                    <i className="fas fa-list me-2"></i> Ver Lista de Equipo
                </Link>

                <hr className="my-2 text-muted opacity-25" />

                <Link to="/create-host" className="btn btn-outline-dark btn-sm text-start ps-3">
                    <i className="fas fa-user-plus me-2 text-info"></i> Crear Nueva Hostess
                </Link>
                
                <Link to="/new_gerente" className="btn btn-outline-dark btn-sm text-start ps-3">
                    <i className="fas fa-plus me-2 text-success"></i> Nuevo Gerente
                </Link>
            </div>
        </div>
    </div>
</div>

                    {/* SECCIÓN: RESERVAS Y AGENDA */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm border-start border-4 border-success hover-shadow transition">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-success-subtle text-success p-2 rounded-3 me-3">
                                        <i className="fas fa-calendar-check fa-xl"></i>
                                    </div>
                                    <h5 className="card-title mb-0 fw-bold">Reservas Activas</h5>
                                </div>
                                <p className="text-muted small">Controla el flujo de clientes, lista de espera y confirma las reservas.</p>
                                <Link to="/booking" className="btn btn-success w-100 mt-4 shadow-sm">
                                    Ver Agenda de Hoy
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: MENÚ Y CARTA */}
                    <div className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="bg-warning-subtle text-warning p-2 rounded-3 me-3">
                                        <i className="fas fa-utensils fa-xl"></i>
                                    </div>
                                    <h5 className="card-title mb-0 fw-bold">Menú y Carta</h5>
                                </div>
                                <p className="text-muted small">Configura platos, precios y categorías de tu oferta gastronómica.</p>
                                <Link to="/menu" className="btn btn-warning w-100 mt-4 text-dark fw-semibold">
                                    Gestionar Menú
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ESTILOS EXTRA EN LÍNEA */}
            <style>{`
                .hover-shadow:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.1) !important;
                }
                .transition {
                    transition: all 0.3s ease-in-out;
                }
                .bg-primary-subtle { background-color: #e7f1ff; }
                .bg-info-subtle { background-color: #cff4fc; }
                .bg-warning-subtle { background-color: #fff3cd; }
                .bg-success-subtle { background-color: #d1e7dd; }
                .bg-purple-subtle { background-color: #f3e5f5; }
                .border-info { border-color: #0dcafaf !important; }
            `}</style>
        </div>
    );
};