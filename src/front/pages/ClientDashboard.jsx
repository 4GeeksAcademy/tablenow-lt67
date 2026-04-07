import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ClientDashboard = () => {
    const { store, actions } = useGlobalReducer();
    const [tempUrl, setTempUrl] = useState("");
    const [selectedRest, setSelectedRest] = useState(null);
    
    const [bookingData, setBookingData] = useState({
        fecha: "",
        hora: "",
        num_personas: 2, 
        notas: "",
        origen: "web", 
        estado: "pendiente" 
    });

    useEffect(() => {
        actions.getAllRestaurantsPublic();
        actions.getMyBookings(); 
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva de tu historial?")) {
            await actions.deleteBooking(id);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!store.clientInfo?.id || !selectedRest?.id) {
            alert("Sesión no válida. Por favor, reingresa.");
            return;
        }

        const fullData = {
            ...bookingData,
            restaurante_id: selectedRest.id,
            cliente_id: store.clientInfo.id
        };
        
        const success = await actions.createNewBooking(fullData);
        if (success) {
            const modalElement = document.getElementById('bookingModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            alert("¡Reserva confirmada!");
            setSelectedRest(null);
            setBookingData({ fecha: "", hora: "", num_personas: 2, notas: "", origen: "web", estado: "pendiente" });
        }
    };

    const uploadImage = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "TableNow");

        try {
            const resp = await fetch("https://api.cloudinary.com/v1_1/dfq0tzllo/image/upload", { 
                method: "POST", 
                body: data 
            });
            const file = await resp.json();
            if (file.secure_url) {
                const success = await actions.updateClientImage(file.secure_url);
                if (success) alert("¡Imagen actualizada!");
            }
        } catch (error) { 
            console.error("Error subiendo imagen:", error); 
        }
    };

    return (
        <div className="container mt-5 pb-5">
            {/* --- SECCIÓN DE PERFIL --- */}
            <div className="card border-0 shadow-sm mb-4 p-4 bg-white rounded-4">
                <div className="row align-items-center">
                    <div className="col-md-3 text-center">
                        <div className="position-relative d-inline-block">
                            <img 
                                src={store.clientInfo?.image_url || "https://ui-avatars.com/api/?name=User"} 
                                className="rounded-circle img-thumbnail shadow-sm"
                                style={{ width: "130px", height: "130px", objectFit: "cover" }}
                                alt="Profile"
                            />
                            <label className="position-absolute bottom-0 end-0 bg-primary text-white p-2 rounded-circle shadow" style={{ cursor: "pointer" }}>
                                <i className="fas fa-camera"></i>
                                <input type="file" hidden onChange={uploadImage} />
                            </label>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <h2 className="fw-bold mb-1">¡Hola, {store.clientInfo?.name || "Cliente"}!</h2>
                        <p className="text-muted">Bienvenido a tu panel personal de TableNow.</p>
                        <div className="input-group input-group-sm mt-2" style={{ maxWidth: "350px" }}>
                            <input type="text" className="form-control" placeholder="URL de imagen..." value={tempUrl} onChange={(e) => setTempUrl(e.target.value)} />
                            <button className="btn btn-outline-primary" onClick={() => actions.updateClientImage(tempUrl)}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- AGENDA DE RESERVAS --- */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-end mb-3">
                    <div>
                        <h3 className="fw-bold text-dark mb-0">
                            <i className="fas fa-calendar-alt me-2 text-primary"></i>Mi Agenda de Reservas
                        </h3>
                        <p className="text-muted small mb-0">Gestiona el estado y asistencia de tus mesas.</p>
                    </div>
                    <span className="badge rounded-pill bg-primary px-3 py-2 shadow-sm">
                        {store.clientBookings?.length || 0} Reservas
                    </span>
                </div>

                <div className="card shadow-sm border-0 overflow-hidden transition">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="bg-light text-secondary">
                                <tr>
                                    <th className="ps-4 py-3 border-0 small text-uppercase fw-bold">Restaurante</th>
                                    <th className="py-3 border-0 small text-uppercase fw-bold text-center">Fecha y Hora</th>
                                    <th className="py-3 border-0 small text-uppercase fw-bold text-center">Personas</th>
                                    <th className="py-3 border-0 small text-uppercase fw-bold">Estado</th>
                                    <th className="text-end pe-4 py-3 border-0 small text-uppercase fw-bold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {store.clientBookings?.length > 0 ? (
                                    store.clientBookings.map((reser) => (
                                        <tr key={reser.id} className="align-middle border-bottom">
                                            <td className="ps-4 py-3">
                                                <div className="fw-bold text-dark">{reser.nombre_restaurante}</div>
                                                <small className="text-muted"><i className="fas fa-map-marker-alt me-1"></i>{reser.restaurant_address || "Dirección no disponible"}</small>
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="text-dark fw-medium">{reser.fecha}</div>
                                                <div className="badge bg-info-subtle text-info small fw-bold" style={{fontSize: '10px'}}>{reser.hora}</div>
                                            </td>
                                            <td className="py-3 text-center fw-bold text-secondary">
                                                <i className="fas fa-user-friends me-1 small"></i>{reser.num_personas}
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge px-3 py-2 ${
                                                    reser.estado === 'confirmada' ? 'bg-success-subtle text-success' : 
                                                    reser.estado === 'cancelada' ? 'bg-danger-subtle text-danger' : 
                                                    'bg-warning-subtle text-warning'
                                                }`}>
                                                    {reser.estado?.charAt(0).toUpperCase() + reser.estado?.slice(1)}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4 py-3">
                                                <div className="btn-group shadow-sm">
                                                    {/* BOTÓN CONFIRMAR*/}
                                                    {reser.estado === "pendiente" && (
                                                        <button 
                                                            className="btn btn-white btn-sm border text-success" 
                                                            onClick={async () => {
                                                                if (window.confirm("¿Confirmar asistencia a esta reserva?")) {
                                                                    await actions.updateBookingStatus(reser.id, "confirmada");
                                                                }
                                                            }}
                                                            title="Confirmar reserva"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    )}

                                                    {/* BOTÓN CANCELAR */}
                                                    {reser.estado !== "cancelada" && (
                                                        <button 
                                                            className="btn btn-white btn-sm border text-warning" 
                                                            onClick={async () => {
                                                                if (window.confirm("¿Deseas cancelar esta reserva?")) {
                                                                    if (actions.cancelBooking) {
                                                                        await actions.cancelBooking(reser.id);
                                                                    } else {
                                                                        await actions.updateBookingStatus(reser.id, "cancelada");
                                                                    }
                                                                }
                                                            }}
                                                            title="Cancelar reserva"
                                                        >
                                                            <i className="fas fa-ban"></i>
                                                        </button>
                                                    )}
                                                    
                                                    {/* BOTÓN ELIMINAR */}
                                                    <button 
                                                        className="btn btn-white btn-sm border text-danger" 
                                                        onClick={() => handleDelete(reser.id)}
                                                        title="Eliminar del historial"
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-muted small">
                                            No tienes reservas todavía. ¡Explora opciones abajo!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- LISTADO DE RESTAURANTES --- */}
            <h3 className="fw-bold mb-4">Explora y Reserva</h3>
            <div className="row">
                {store.restaurants?.map((rest) => (
                    <div key={rest.id} className="col-md-4 mb-4">
                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden border-hover transition">
                            <img src={rest.image_url || "https://picsum.photos/400/200"} className="card-img-top" style={{ height: "160px", objectFit: "cover" }} alt="Restaurante" />
                            <div className="card-body">
                                <h5 className="fw-bold text-dark">{rest.nombre || rest.name}</h5>
                                <button 
                                    className="btn btn-primary w-100 rounded-pill fw-bold"
                                    data-bs-toggle="modal" 
                                    data-bs-target="#bookingModal"
                                    onClick={() => setSelectedRest(rest)}
                                >
                                    Reservar Mesa
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- MODAL DE RESERVA --- */}
            <div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content border-0 shadow-lg rounded-4">
                        <div className="modal-header bg-dark text-white rounded-top-4 p-4">
                            <h4 className="modal-title fw-bold mb-0">Reservar en {selectedRest?.nombre || selectedRest?.name}</h4>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <form onSubmit={handleBooking}>
                            <div className="modal-body p-4 bg-light">
                                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold text-secondary">Fecha *</label>
                                            <input type="date" className="form-control bg-light border-0" required value={bookingData.fecha} onChange={(e) => setBookingData({...bookingData, fecha: e.target.value})} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold text-secondary">Hora *</label>
                                            <input type="time" className="form-control bg-light border-0" required value={bookingData.hora} onChange={(e) => setBookingData({...bookingData, hora: e.target.value})} />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label fw-bold text-secondary">Personas (PAX) *</label>
                                            <input type="number" className="form-control bg-light border-0" min="1" max="20" required value={bookingData.num_personas} onChange={(e) => setBookingData({...bookingData, num_personas: e.target.value})} />
                                        </div>
                                        <div className="col-12 mb-2">
                                            <label className="form-label fw-bold text-secondary">Notas Especiales</label>
                                            <textarea className="form-control bg-light border-0" rows="3" placeholder="Ej: Alergias, mesa exterior..." value={bookingData.notas} onChange={(e) => setBookingData({...bookingData, notas: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer bg-light border-0 p-4 pt-0 rounded-bottom-4 d-flex justify-content-between">
                                <button type="button" className="btn btn-outline-secondary rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Cancelar</button>
                                <button type="submit" className="btn btn-primary rounded-pill px-5 shadow fw-bold">Confirmar Reserva</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .border-hover:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
                .transition { transition: all 0.3s ease; }
                .bg-success-subtle { background-color: #d1e7dd !important; color: #0f5132 !important; }
                .bg-warning-subtle { background-color: #fff3cd !important; color: #664d03 !important; }
                .bg-danger-subtle { background-color: #f8d7da !important; color: #842029 !important; }
                .bg-info-subtle { background-color: #cff4fc !important; color: #055160 !important; }
                .btn-white { background-color: #fff; }
                table thead th { letter-spacing: 0.05rem; font-size: 0.75rem; }
            `}</style>
        </div>
    );
};