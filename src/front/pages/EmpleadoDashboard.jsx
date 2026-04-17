import React, { useState, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css'

const EmpleadoDashboard = () => {
    const [reservas, setReservas] = useState([]);
    const [busqueda, setBusqueda] = useState("");

    const estiloElite = {
        fondo: "#0a0a0a",
        tarjeta: "#111111",
        dorado: "#d4a373",
        textoGris: "#a0a0a0",
        borde: "#2a2a2a"
    };

    const fechaHoy = new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    const reservasFiltradas = reservas.filter((res) =>
        res.cliente.name.toLowerCase().includes(busqueda.toLowerCase())
    );

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "api/reserva/pendiente", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("tokenOwner")}`
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setReservas(data);
            })
            .catch((error) => console.error("Error al cargar reservas:", error));
    }, []);

    const handleStatusUpdate = (reservaId, nuevoEstado) => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}api/reserva/${reservaId}/estado`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("tokenOwner")}`
            },
            body: JSON.stringify({ estado: nuevoEstado }),
        })
            .then((response) => {
                if (response.ok) {
                    setReservas((prevReservas) =>
                        prevReservas.filter((res) => res.id !== reservaId)
                    );
                }
            })
            .catch((error) => console.error("Error en la solicitud:", error));
    };

    return (
        <div style={{ backgroundColor: estiloElite.fondo, color: "white", minHeight: "100vh", paddingBottom: "50px" }}>
            <div className="container pt-5">
                <header className="mb-5 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="fw-bold" style={{ color: estiloElite.dorado, fontFamily: 'serif' }}>Today's Reservations</h1>
                        <p style={{ color: estiloElite.textoGris }}>Daily management of tables and customers</p>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                        <span className="badge rounded-pill bg-dark p-2 border"
                            style={{ color: estiloElite.dorado, fontFamily: 'serif' }}>
                            <i className="fas fa-calendar-alt me-2"></i>
                            {fechaHoy}
                        </span>
                        <span className="badge p-2" style={{ backgroundColor: "#1a2a1a", color: "#4ade80", border: "1px solid #22543d" }}>
                            ● Active Employee Session
                        </span>
                    </div>
                </header>

                <div className="card shadow-sm mb-5 border-0" style={{ backgroundColor: estiloElite.tarjeta, border: `1px solid ${estiloElite.borde}` }}>
                    <div className="card-body d-flex justify-content-between align-items-center p-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle p-3 shadow" style={{ backgroundColor: estiloElite.dorado, color: "black" }}>
                                <i className="fas fa-receipt fs-4"></i>
                            </div>
                            <div>
                                <h5 className="mb-0 fw-bold" style={{ color: "white" }}>You have {reservas?.length || 0} reservations to manage</h5>
                                <small style={{ color: estiloElite.textoGris }}>Confirm or reject your customers' requests.</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <div className="input-group">
                        <span className="input-group-text border-0" style={{ backgroundColor: estiloElite.tarjeta, color: estiloElite.textoGris }}>
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control border-0"
                            style={{ backgroundColor: estiloElite.tarjeta, color: "white" }}
                            placeholder="Buscar cliente por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <h3 className="fw-bold mb-4" style={{ color: estiloElite.dorado }}>
                    <i className="fas fa-list-ul me-2"></i>Pending Requests
                </h3>

                <div className="row g-4">
                    {reservasFiltradas && reservasFiltradas.length > 0 ? (
                        reservasFiltradas.map((res) => (
                            <div className="col-md-6 col-lg-4" key={res.id}>
                                <div className="card h-100 border-0 shadow" style={{ backgroundColor: estiloElite.tarjeta, borderLeft: `4px solid ${estiloElite.dorado}` }}>
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h6 style={{ color: estiloElite.textoGris }} className="mb-0 small">ID RESERVATION</h6>
                                                <span className="fw-bold fs-5" style={{ color: estiloElite.dorado }}>#{res.id}</span>
                                            </div>
                                            <span className="badge" style={{ backgroundColor: res.estado === 'pendiente' ? '#332b00' : '#064e3b', color: res.estado === 'pendiente' ? '#fbbf24' : '#34d399' }}>
                                                {res.estado.toUpperCase()}
                                            </span>
                                        </div>

                                        <hr style={{ borderColor: estiloElite.borde }} />

                                        <div className="row g-2 mb-4">
                                            <div className="col-6 small" style={{ color: estiloElite.textoGris }}>
                                                <i className="fas fa-clock me-1"></i> {res.hora}
                                            </div>
                                            <div className="col-6 small" style={{ color: estiloElite.textoGris }}>
                                                <i class="bi bi-calendar-fill"></i> {res.fecha}
                                            </div>
                                            <div className="col-6 small" style={{ color: estiloElite.textoGris }}>
                                                <i className="fas fa-chair me-1"></i> Table {res.id_mesa}
                                            </div>
                                            <div className="col-6 small" style={{ color: estiloElite.textoGris }}>
                                                <i className="fas fa-user-friends me-1"></i> {res.num_personas} pers.
                                            </div>
                                            <div className="col-6 small" style={{ color: estiloElite.textoGris }}>
                                                <i className="fas fa-user me-1"></i> {res.cliente.name}
                                            </div>
                                        </div>

                                        {res.estado === 'pendiente' && (
                                            <div className="d-grid gap-2 mt-auto">
                                                <div className="row g-2">
                                                    <div className="col-6">
                                                        <button
                                                            className="btn btn-sm w-100 text-dark fw-bold"
                                                            style={{ backgroundColor: estiloElite.dorado, border: "none" }}
                                                            onClick={() => handleStatusUpdate(res.id, "confirmado")}
                                                        >
                                                            Confirm
                                                        </button>
                                                    </div>
                                                    <div className="col-6">
                                                        <button
                                                            className="btn btn-outline-danger btn-sm w-100"
                                                            onClick={() => handleStatusUpdate(res.id, "rechazado")}
                                                        >
                                                            Decline
                                                        </button>

                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5">
                            <i class="bi bi-check2-square fs-1 mb-8" style={{ color: estiloElite.dorado }}></i>
                            <p style={{ color: estiloElite.textoGris }}>No hay más reservas pendientes por el momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmpleadoDashboard;