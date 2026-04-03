import React, { useEffect, useState } from "react"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Booking = () => {
    const { store, actions } = useGlobalReducer();
    const [selectedRestaurantId, setSelectedRestaurantId] = useState("");

    useEffect(() => {
        const cargarRestaurantes = async () => {
            if (store.tokenOwner && (!store.restaurants || store.restaurants.length === 0)) {
                await actions.getOwnerRestaurants();
            }
        };
        cargarRestaurantes();
    }, [store.tokenOwner]);

    useEffect(() => {
        if (store.restaurants && store.restaurants.length > 0 && !selectedRestaurantId) {
            setSelectedRestaurantId(store.restaurants[0].id);
        }
    }, [store.restaurants]);

    useEffect(() => {
        if (selectedRestaurantId) {
            actions.getBookings(selectedRestaurantId);
        }
    }, [selectedRestaurantId]);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
            await actions.deleteBooking(id);
        }
    };

    return (
        <div className="container mt-5 py-4">
            {/* HEADER */}
            <div className="row mb-4 align-items-center">
                <div className="col-md-6">
                    <h2 className="fw-bold text-dark mb-1">
                        <i className="fas fa-calendar-check me-2 text-success"></i>Agenda de Reservas
                    </h2>
                    <p className="text-muted small">Gestiona las confirmaciones y asistencia de hoy.</p>
                </div>
                
                {/* SELECTOR DE RESTAURANTE */}
                <div className="col-md-4">
                    <div className="input-group shadow-sm">
                        <span className="input-group-text bg-white border-end-0">
                            <i className="fas fa-utensils text-primary"></i>
                        </span>
                        <select 
                            className="form-select border-start-0 fw-bold text-secondary"
                            value={selectedRestaurantId}
                            onChange={(e) => setSelectedRestaurantId(e.target.value)}
                        >
                            <option value="" disabled>Selecciona un restaurante...</option>
                            {store.restaurants.map((rest) => (
                                <option key={rest.id} value={rest.id}>
                                    {rest.name || rest.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="col-md-2 text-end">
                    <span className="badge rounded-pill bg-primary px-3 py-2 shadow-sm">
                        {store.bookings?.length || 0} Reservas
                    </span>
                </div>
            </div>

            {/* TABLA DE RESERVAS */}
            <div className="card shadow-sm border-0 overflow-hidden hover-shadow transition">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light text-secondary">
                                <tr>
                                    <th className="ps-4 py-3 border-0">CLIENTE</th>
                                    <th className="py-3 border-0">FECHA Y HORA</th>
                                    <th className="py-3 border-0 text-center">PAX</th>
                                    <th className="py-3 border-0">ESTADO</th>
                                    <th className="text-end pe-4 py-3 border-0">ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.bookings && store.bookings.length > 0 ? (
                                    store.bookings.map((reserva) => (
                                        <tr key={reserva.id} className="align-middle border-bottom">
                                            <td className="ps-4 py-3">
                                                <div className="fw-bold text-dark">{reserva.cliente?.name || "Sin nombre"}</div>
                                                <small className="text-muted">{reserva.cliente?.email || "Sin email"}</small>
                                            </td>
                                            <td className="py-3">
                                                <div className="text-dark fw-medium">{reserva.fecha || reserva.date}</div>
                                                <div className="badge bg-info-subtle text-info small fw-bold" style={{fontSize: '10px'}}>
                                                    {reserva.hora || reserva.time}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <span className="fw-bold text-secondary">
                                                    <i className="fas fa-user-friends me-1 small"></i>
                                                    {reserva.num_personas || reserva.pax}
                                                </span>
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge px-3 py-2 ${
                                                    (reserva.estado === 'confirmada' || reserva.status === 'confirmed') ? 'bg-success-subtle text-success' :
                                                    (reserva.estado === 'cancelada' || reserva.status === 'cancelled') ? 'bg-danger-subtle text-danger' : 
                                                    'bg-warning-subtle text-warning'
                                                }`}>
                                                    {reserva.estado?.charAt(0).toUpperCase() + reserva.estado?.slice(1) || "Pendiente"}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4 py-3">
                                                <div className="btn-group shadow-sm">
                                                    <button className="btn btn-white btn-sm border text-success" onClick={() => actions.updateBookingStatus(reserva.id, "confirmada")}><i className="fas fa-check"></i></button>
                                                    <button className="btn btn-white btn-sm border text-warning" onClick={() => actions.updateBookingStatus(reserva.id, "cancelada")}><i className="fas fa-ban"></i></button>
                                                    <button className="btn btn-white btn-sm border text-danger" onClick={() => handleDelete(reserva.id)}><i className="fas fa-trash-alt"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 border-0">
                                            <h5 className="text-muted">No hay reservas para este restaurante</h5>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .hover-shadow:hover { transform: translateY(-3px); box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,0.08) !important; }
                .transition { transition: all 0.3s ease; }
                .bg-success-subtle { background-color: #d1e7dd !important; }
                .bg-warning-subtle { background-color: #fff3cd !important; }
                .bg-info-subtle { background-color: #cff4fc !important; }
                .btn-white { background-color: #fff; }
                table thead th { letter-spacing: 0.05rem; font-size: 0.75rem; }
            `}</style>
        </div>
    );
};