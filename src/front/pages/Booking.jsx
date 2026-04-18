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
        <div className="booking-page-wrapper min-vh-100 py-5">
            <div className="container py-4">
                {/* HEADER */}
                <div className="row mb-4 align-items-center">
                    <div className="col-md-6">
                        <h2 className="fw-bold mb-1 text-white title-luxury">
                            <i className="fas fa-calendar-check me-2" style={{ color: "#c5a47e" }}></i>
                            AGENDA DE RESERVAS
                        </h2>
                        <p className="text-white-50 small letter-spacing-1">CONCIERGE DASHBOARD | GESTIÓN DE ASISTENCIA</p>
                    </div>
                    
                    {/* SELECTOR DE RESTAURANTE */}
                    <div className="col-md-4">
                        <div className="input-group glass-selector shadow-lg">
                            <span className="input-group-text border-0 bg-transparent text-white">
                                <i className="fas fa-utensils" style={{ color: "#c5a47e" }}></i>
                            </span>
                            <select 
                                className="form-select border-0 text-white custom-glass-select"
                                value={selectedRestaurantId}
                                onChange={(e) => setSelectedRestaurantId(e.target.value)}
                            >
                                <option value="" disabled className="bg-dark text-white">Selecciona un restaurante...</option>
                                {store.restaurants.map((rest) => (
                                    <option key={rest.id} value={rest.id} className="bg-dark text-white">
                                        {rest.name || rest.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-2 text-end">
                        <span className="badge rounded-pill px-3 py-2 badge-luxury">
                            {store.bookings?.length || 0} Reservas
                        </span>
                    </div>
                </div>

                {/* TABLA DE RESERVAS GLASS - CORREGIDA SIN FONDO BLANCO */}
                <div className="card glass-card border-0 overflow-hidden shadow-2xl">
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0 luxury-table">
                                <thead>
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
                                            <tr key={reserva.id} className="align-middle luxury-row">
                                                <td className="ps-4 py-3 border-bottom-glass bg-transparent">
                                                    <div className="fw-bold text-white">{reserva.cliente?.name || "Sin nombre"}</div>
                                                    <small className="text-white-50">{reserva.cliente?.email || "Sin email"}</small>
                                                </td>
                                                <td className="py-3 border-bottom-glass bg-transparent">
                                                    <div className="text-white fw-medium">{reserva.fecha || reserva.date}</div>
                                                    <div className="badge border border-info-subtle text-info small mt-1" style={{fontSize: '9px', background: 'rgba(13, 202, 240, 0.1)'}}>
                                                        {reserva.hora || reserva.time}
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center border-bottom-glass bg-transparent">
                                                    <span className="fw-bold text-white">
                                                        <i className="fas fa-user-friends me-1 small" style={{ color: "#c5a47e" }}></i>
                                                        {reserva.num_personas || reserva.pax}
                                                    </span>
                                                </td>
                                                <td className="py-3 border-bottom-glass bg-transparent">
                                                    <span className={`badge px-3 py-2 status-pill ${
                                                        (reserva.estado === 'confirmada' || reserva.status === 'confirmed') ? 'status-confirmed' :
                                                        (reserva.estado === 'cancelada' || reserva.status === 'cancelled') ? 'status-cancelled' : 
                                                        'status-pending'
                                                    }`}>
                                                        {reserva.estado?.toUpperCase() || "PENDIENTE"}
                                                    </span>
                                                </td>
                                                <td className="text-end pe-4 py-3 border-bottom-glass bg-transparent">
                                                    <div className="btn-group gap-2">
                                                        <button className="btn btn-luxury-action" onClick={() => actions.updateBookingStatus(reserva.id, "confirmada")} title="Confirmar">
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                        <button className="btn btn-luxury-action" onClick={() => actions.updateBookingStatus(reserva.id, "cancelada")} title="Cancelar">
                                                            <i className="fas fa-ban"></i>
                                                        </button>
                                                        <button className="btn btn-luxury-action" onClick={() => handleDelete(reserva.id)} title="Eliminar">
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center py-5 border-0 bg-transparent">
                                                <h5 className="text-white-50 fw-light">No hay reservas programadas para este restaurante</h5>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <style>{`
                    .booking-page-wrapper {
                        background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), 
                                    url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop');
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                    }

                    .title-luxury {
                        letter-spacing: 3px;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    }

                    .letter-spacing-1 { letter-spacing: 1px; }

                    .glass-card {
                        background: rgba(255, 255, 255, 0.03) !important;
                        backdrop-filter: blur(15px);
                        -webkit-backdrop-filter: blur(15px);
                        border: 1px solid rgba(255, 255, 255, 0.08) !important;
                        border-radius: 20px;
                    }

                    .luxury-table {
                        background: transparent !important;
                    }

                    .luxury-table thead th {
                        background: rgba(0, 0, 0, 0.4) !important;
                        color: #c5a47e;
                        font-size: 0.75rem;
                        letter-spacing: 1.5px;
                        padding: 1.2rem 1rem;
                    }

                    .border-bottom-glass {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                    }

                    .luxury-row:hover {
                        background: rgba(255, 255, 255, 0.03) !important;
                        transition: 0.3s ease;
                    }

                    .glass-selector {
                        background: rgba(255, 255, 255, 0.05);
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(197, 164, 126, 0.3);
                        border-radius: 12px;
                    }

                    .custom-glass-select {
                        background: transparent !important;
                        color: white !important;
                    }

                    .badge-luxury {
                        background: rgba(197, 164, 126, 0.15);
                        color: #c5a47e;
                        border: 1px solid rgba(197, 164, 126, 0.4);
                    }

                    .btn-luxury-action {
                        background: transparent;
                        border: 1px solid #c5a47e;
                        color: #c5a47e;
                        border-radius: 10px;
                        width: 35px;
                        height: 35px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: 0.3s;
                    }

                    .btn-luxury-action:hover {
                        background: #c5a47e;
                        color: black;
                        box-shadow: 0 0 15px rgba(197, 164, 126, 0.4);
                    }

                    .status-pill {
                        font-size: 0.65rem;
                        font-weight: 700;
                        padding: 6px 12px;
                        border-radius: 6px;
                    }

                    .status-confirmed { background: rgba(75, 211, 123, 0.1); color: #4bd37b; border: 1px solid rgba(75, 211, 123, 0.3); }
                    .status-cancelled { background: rgba(255, 107, 107, 0.1); color: #ff6b6b; border: 1px solid rgba(255, 107, 107, 0.3); }
                    .status-pending { background: rgba(197, 164, 126, 0.1); color: #c5a47e; border: 1px solid rgba(197, 164, 126, 0.3); }
                `}</style>
            </div>
        </div>
    );
};