import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Booking = () => {
    const { store, actions } = useGlobalReducer();
    const [selectedRes, setSelectedRes] = useState("");

    useEffect(() => {
        // Al cargar, nos aseguramos de tener los restaurantes
        if (store.tokenOwner && store.restaurants.length === 0) {
            actions.getOwnerRestaurants();
        }
    }, []);

    const handleSelectRestaurant = (e) => {
        const resId = e.target.value;
        setSelectedRes(resId);
        if (resId) {
            actions.getRestaurantBookings(resId);
        }
    };

    const changeStatus = async (bookingId, status) => {
        const success = await actions.updateBookingStatus(bookingId, status);
        if (success && selectedRes) {
            actions.getRestaurantBookings(selectedRes); // Refrescar lista
        }
    };

    return (
        <div className="container-fluid py-5 bg-light" style={{ minHeight: "100vh" }}>
            <div className="container">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
                    <div>
                        <h2 className="fw-bold text-dark">📅 Gestión de Reservas</h2>
                        <p className="text-muted">Administra las llegadas de tus clientes en tiempo real.</p>
                    </div>
                    
                    {/* SELECTOR DE RESTAURANTE */}
                    <div className="col-12 col-md-4">
                        <label className="form-label small fw-bold">Selecciona un local:</label>
                        <select 
                            className="form-select shadow-sm border-0" 
                            value={selectedRes} 
                            onChange={handleSelectRestaurant}
                        >
                            <option value="">Elegir restaurante...</option>
                            {store.restaurants.map(res => (
                                <option key={res.id} value={res.id}>{res.nombre}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* TABLA DE RESERVAS */}
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-dark text-white">
                                <tr>
                                    <th className="ps-4">Cliente</th>
                                    <th>Fecha y Hora</th>
                                    <th>Personas</th>
                                    <th>Estado</th>
                                    <th className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.bookings.length > 0 ? (
                                    store.bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold">{booking.client}</div>
                                                <div className="text-muted small">{booking.client_phone || "Sin teléfono"}</div>
                                            </td>
                                            <td>
                                                <div>{new Date(booking.date).toLocaleDateString()}</div>
                                                <div className="badge bg-light text-dark border">{booking.time}</div>
                                            </td>
                                            <td>
                                                <span className="fw-semibold"><i className="fas fa-users me-2"></i>{booking.num_personas}</span>
                                            </td>
                                            <td>
                                                <span className={`badge px-3 py-2 ${
        booking.estado === 'confirmed' ? 'bg-success-subtle text-success' :
        booking.estado === 'cancelled' ? 'bg-danger-subtle text-danger' : 
        'bg-warning-subtle text-warning'
    }`}>
        {booking.estado ? booking.estado.toUpperCase() : "PENDIENTE"}
    </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <div className="btn-group shadow-sm">
                                                    <button 
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={() => changeStatus(booking.id, 'confirmed')}
                                                        title="Confirmar"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => changeStatus(booking.id, 'cancelled')}
                                                        title="Cancelar"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted">
                                            <i className="fas fa-calendar-times fa-3x mb-3 d-block"></i>
                                            {selectedRes ? "No hay reservas para este restaurante." : "Selecciona un restaurante para ver las reservas."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .bg-success-subtle { background-color: #d1e7dd; color: #0f5132; }
                .bg-danger-subtle { background-color: #f8d7da; color: #842029; }
                .bg-warning-subtle { background-color: #fff3cd; color: #664d03; }
                .rounded-4 { border-radius: 1rem; }
                .table thead th { font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
            `}</style>
        </div>
    );
};