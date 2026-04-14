import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ConserjeChat } from "../components/ConserjeChat.jsx";


export const ClientDashboard = () => {
    const { store, actions } = useGlobalReducer();
    const location = useLocation();
    const navigate = useNavigate();
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

    // --- ARREGLO 1: FUNCIÓN DE LIMPIEZA SEGURA (Tu lógica original) ---
    const forceCleanupModal = () => {
        const backdrops = document.getElementsByClassName('modal-backdrop');
        while (backdrops[0]) {
            backdrops[0].parentNode.removeChild(backdrops[0]);
        }
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    };

    // Carga inicial de datos
    useEffect(() => {
        const initDashboard = async () => {
            await actions.getAllRestaurantsPublic();
            await actions.getMyBookings();
            if (actions.getMenus) await actions.getMenus();
            if (actions.getClientInfo) await actions.getClientInfo();
        };
        initDashboard();
    }, []);

    // --- ARREGLO 2: ESCUCHAR CIERRE DE MODALES (Tu lógica original) ---
    useEffect(() => {
        const handleHidden = () => {
            forceCleanupModal();
        };

        const infoM = document.getElementById('infoModal');
        const bookM = document.getElementById('bookingModal');

        infoM?.addEventListener('hidden.bs.modal', handleHidden);
        bookM?.addEventListener('hidden.bs.modal', handleHidden);

        return () => {
            infoM?.removeEventListener('hidden.bs.modal', handleHidden);
            bookM?.removeEventListener('hidden.bs.modal', handleHidden);
        };
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const restId = queryParams.get("reservaRestId");

        if (restId && store.restaurants?.length > 0) {
            const restParaMostrar = store.restaurants.find(r => r.id === parseInt(restId));
            
            if (restParaMostrar) {
                setSelectedRest(restParaMostrar);
                const modalElement = document.getElementById('infoModal');
                if (modalElement) {
                    const modal = new window.bootstrap.Modal(modalElement);
                    modal.show();
                    navigate(location.pathname, { replace: true });
                }
            }
        }
    }, [location.search, store.restaurants, navigate]);


    const handleDelete = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva de tu historial?")) {
            const success = await actions.deleteBooking(id);
            if (success) await actions.getMyBookings();
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!store.clientInfo?.id || !selectedRest?.id) {
            alert("Sesión no válida o restaurante no seleccionado.");
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
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
            
            setTimeout(forceCleanupModal, 150);
            
            alert("¡Reserva confirmada!");
            setSelectedRest(null);
            setBookingData({ fecha: "", hora: "", num_personas: 2, notas: "", origen: "web", estado: "pendiente" });
            await actions.getMyBookings(); 
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
                if (success) {
                    alert("¡Imagen actualizada!");
                    await actions.getClientInfo();
                }
            }
        } catch (error) {
            console.error("Error subiendo imagen:", error);
        }
    };

    const safeSplit = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data;
        if (typeof data === 'string') return data.split(',').map(item => item.trim());
        return [];
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
                            <button className="btn btn-outline-primary" onClick={async () => {
                                const success = await actions.updateClientImage(tempUrl);
                                if (success) await actions.getClientInfo();
                            }}>Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <ConserjeChat />
            </div>

            {/* --- BOTÓN DE BÚSQUEDA GEOLOCALIZADA --- */}
            <div className="card shadow-sm mb-5 border-0 bg-light rounded-4">
                <div className="card-body text-center py-4">
                    <h4 className="fw-bold text-dark">¿Tienes hambre, {store.clientInfo?.name?.split(' ')[0] || "Cliente"}?</h4>
                    <p className="text-muted">Encuentra los mejores restaurantes a pocos pasos de tu ubicación actual.</p>
                    <Link to="/buscar" className="btn btn-primary btn-lg px-5 shadow rounded-pill">
                        <i className="fas fa-search-location me-2"></i>Explorar Mapa Cercano
                    </Link>
                </div>
            </div>

            {/* --- AGENDA DE RESERVAS --- */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-end mb-3">
                    <div>
                        <h3 className="fw-bold text-dark mb-0">
                            <i className="fas fa-calendar-alt me-2 text-primary"></i>Mi Agenda de Reservas
                        </h3>
                        <p className="text-muted small mb-0">Gestiona tus próximas visitas y contactos.</p>
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
                                    <th className="ps-4 py-3 border-0 small text-uppercase fw-bold">Restaurante / Contacto</th>
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
                                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '1rem' }}>{reser.nombre_restaurante}</div>
                                                <div className="d-flex flex-wrap gap-1 mb-1">
                                                    {safeSplit(reser.categoria_restaurante).map((cat, i) => (
                                                        <span key={`cat-${i}`} className="badge rounded-pill bg-info-subtle text-info border border-info-subtle" style={{ fontSize: '0.65rem' }}>
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {safeSplit(reser.tags_restaurante).map((tag, i) => (
                                                        <span key={`tag-${i}`} className="text-muted d-flex align-items-center" style={{ fontSize: '0.65rem' }}>
                                                            <i className="fas fa-tag me-1" style={{ fontSize: '0.6rem' }}></i>{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="py-3 text-center">
                                                <div className="text-dark fw-medium">{reser.fecha}</div>
                                                <div className="badge bg-info-subtle text-info small fw-bold" style={{ fontSize: '10px' }}>{reser.hora}</div>
                                            </td>
                                            <td className="py-3 text-center fw-bold text-secondary">
                                                <i className="fas fa-user-friends me-1 small"></i>{reser.num_personas}
                                            </td>
                                            <td className="py-3">
                                                <span className={`badge px-3 py-2 ${reser.estado === 'confirmada' ? 'bg-success-subtle text-success' :
                                                    reser.estado === 'cancelada' ? 'bg-danger-subtle text-danger' :
                                                        'bg-warning-subtle text-warning'
                                                    }`}>
                                                    {reser.estado?.charAt(0).toUpperCase() + reser.estado?.slice(1)}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4 py-3">
                                                <div className="btn-group shadow-sm">
                                                    {reser.estado === "pendiente" && (
                                                        <button
                                                            className="btn btn-white btn-sm border text-success"
                                                            onClick={async () => {
                                                                if (window.confirm("¿Confirmar asistencia a esta reserva?")) {
                                                                    await actions.updateBookingStatus(reser.id, "confirmada");
                                                                    await actions.getMyBookings();
                                                                }
                                                            }}
                                                            title="Confirmar reserva"
                                                        >
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    )}
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
                                                                    await actions.getMyBookings();
                                                                }
                                                            }}
                                                            title="Cancelar reserva"
                                                        >
                                                            <i className="fas fa-ban"></i>
                                                        </button>
                                                    )}
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
                                <div className="d-grid gap-2">
                                    <button
                                        className="btn btn-primary rounded-pill fw-bold"
                                        data-bs-toggle="modal"
                                        data-bs-target="#bookingModal"
                                        onClick={() => setSelectedRest(rest)}
                                    >
                                        Reservar Mesa
                                    </button>
                                    <button
                                        className="btn btn-outline-dark rounded-pill fw-bold btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#infoModal"
                                        onClick={() => setSelectedRest(rest)}
                                    >
                                        <i className="fas fa-utensils me-2"></i>Ver Detalles y Menú
                                    </button>
                                </div>
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
                                            <input type="date" className="form-control bg-light border-0" required value={bookingData.fecha} onChange={(e) => setBookingData({ ...bookingData, fecha: e.target.value })} />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-bold text-secondary">Hora *</label>
                                            <input type="time" className="form-control bg-light border-0" required value={bookingData.hora} onChange={(e) => setBookingData({ ...bookingData, hora: e.target.value })} />
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label fw-bold text-secondary">Personas (PAX) *</label>
                                            <input 
                                                type="number" 
                                                className="form-control bg-light border-0" 
                                                min="1" 
                                                max={selectedRest?.capacidad_total || 20} 
                                                required 
                                                value={bookingData.num_personas} 
                                                onChange={(e) => setBookingData({ ...bookingData, num_personas: e.target.value })} 
                                            />
                                            <div className="form-text small text-muted">
                                                Capacidad máxima del local: {selectedRest?.capacidad_total || "No especificada"}
                                            </div>
                                        </div>
                                        <div className="col-12 mb-2">
                                            <label className="form-label fw-bold text-secondary">Notas Especiales</label>
                                            <textarea className="form-control bg-light border-0" rows="3" placeholder="Ej: Alergias, mesa exterior..." value={bookingData.notas} onChange={(e) => setBookingData({ ...bookingData, notas: e.target.value })}></textarea>
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

{/* --- MODAL DE INFO Y MENÚ --- */}
<div className="modal fade" id="infoModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body p-4 pt-0">
                <div className="text-center mb-4">
                    <img
                        src={selectedRest?.image_url || "https://picsum.photos/400/200"}
                        className="rounded-4 mb-3 shadow-sm"
                        style={{ width: "100%", height: "200px", objectFit: "cover" }}
                        alt="Resto"
                    />
                    <h3 className="fw-bold text-dark mb-1">{selectedRest?.nombre || selectedRest?.name}</h3>
                    
                    <div className="mb-2">
                        {safeSplit(selectedRest?.categoria_restaurante || selectedRest?.categoria || selectedRest?.categorias).length > 0 ? (
                            safeSplit(selectedRest?.categoria_restaurante || selectedRest?.categoria || selectedRest?.categorias).map((cat, i) => (
                                <span key={i} className="badge bg-primary-subtle text-primary border border-primary-subtle mx-1 rounded-pill px-3">
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className="badge bg-light text-muted rounded-pill px-3"></span>
                        )}
                    </div>

                    {/* --- SECCIÓN DE HORARIO ULTRA-COMPATIBLE --- */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                        <div className="bg-light px-3 py-1 rounded-pill border shadow-sm d-flex align-items-center">
                            <i className="far fa-clock me-2 text-primary"></i>
                            <span className="small fw-bold text-dark me-2">
                                {(() => {
                                    const open = selectedRest?.horario_apertura || selectedRest?.opening_time || selectedRest?.opening_hour || selectedRest?.apertura;
                                    const close = selectedRest?.horario_cierre || selectedRest?.closing_time || selectedRest?.closing_hour || selectedRest?.cierre;
                                    if (open && close) return `${open} - ${close}`;
                                    return "Horario no disponible";
                                })()}
                            </span>
                            {(() => {
                                const openField = selectedRest?.horario_apertura || selectedRest?.opening_time || selectedRest?.opening_hour || selectedRest?.apertura;
                                const closeField = selectedRest?.horario_cierre || selectedRest?.closing_time || selectedRest?.closing_hour || selectedRest?.cierre;
                                if (!openField || !closeField) return null;
                                try {
                                    const now = new Date();
                                    const currentTime = now.getHours() * 100 + now.getMinutes();
                                    const open = parseInt(openField.toString().replace(/\D/g, ''));
                                    const close = parseInt(closeField.toString().replace(/\D/g, ''));
                                    const isOpen = currentTime >= open && currentTime <= close;
                                    return (
                                        <span className={`badge rounded-pill ${isOpen ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.7rem' }}>
                                            <i className={`fas ${isOpen ? 'fa-check-circle' : 'fa-times-circle'} me-1`}></i>
                                            {isOpen ? 'Abierto' : 'Cerrado'}
                                        </span>
                                    );
                                } catch (e) { return null; }
                            })()}
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 flex-wrap mt-2">
                        <small className="text-muted">
                            <i className="fas fa-map-marker-alt me-1 text-primary"></i>
                            {selectedRest?.direccion || "Dirección no disponible"}
                        </small>
                        <small className="text-muted">
                            <i className="fas fa-phone me-1 text-primary"></i>
                            {selectedRest?.telefono || "Sin teléfono"}
                        </small>
                        <small className="text-muted">
                            <i className="fas fa-users me-1 text-primary"></i>
                            Aforo: {selectedRest?.capacidad_total || "Consultar"} pers.
                        </small>
                    </div>
                </div>

                {/* Tags */}
                {safeSplit(selectedRest?.tags || selectedRest?.tags_restaurante).length > 0 && (
                    <div className="mb-4 text-center">
                        <p className="small text-uppercase fw-bold text-secondary mb-2" style={{ letterSpacing: '1px' }}>Ideal para:</p>
                        <div className="d-flex justify-content-center flex-wrap gap-2">
                            {safeSplit(selectedRest?.tags || selectedRest?.tags_restaurante).map((tag, i) => (
                                <span key={i} className="small text-dark bg-light px-2 py-1 rounded border shadow-xs">
                                    <i className="fas fa-tag me-1 text-warning small"></i>{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <h5 className="fw-bold mb-3 border-bottom pb-2">
                    <i className="fas fa-utensils me-2 small text-secondary"></i>Nuestro Menú
                </h5>
                <div className="list-group list-group-flush" style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {store.menus && store.menus.filter(m => m.restaurante_id === selectedRest?.id).length > 0 ? (
                        store.menus
                            .filter(item => item.restaurante_id === selectedRest?.id)
                            .map((plato, index) => (
                                <div key={index} className="list-group-item px-0 py-3 d-flex align-items-center">
                                    {/* IMAGEN DEL PLATO */}
                                    <img 
                                        src={plato.foto || "https://dummyimage.com/50x50/eeeeee/999999&text=Plato"} 
                                        alt={plato.nombre}
                                        className="rounded-3 me-3 shadow-sm"
                                        style={{ width: "55px", height: "55px", objectFit: "cover" }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-bold">{plato.nombre}</h6>
                                        <small className="text-muted">{plato.categoria}</small>
                                    </div>
                                    <span className="fw-bold text-success ms-2">${plato.precio}</span>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted small">Este restaurante aún no ha cargado platos al menú.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="modal-footer border-0">
                <button
                    className="btn btn-primary w-100 rounded-pill fw-bold py-3 shadow-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#bookingModal"
                >
                    ¡Me encanta, Reservar Mesa!
                </button>
            </div>
        </div>
    </div>
</div>
            <style>{`
                .modal-backdrop {
                    background-color: rgba(0, 0, 0, 0.5) !important;
                    opacity: 1 !important;
                }
                
                .modal {
                    background: rgba(0, 0, 0, 0.2);
                }

                .border-hover:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
                .transition { transition: all 0.3s ease; }
                .bg-success-subtle { background-color: #d1e7dd !important; color: #0f5132 !important; }
                .bg-warning-subtle { background-color: #fff3cd !important; color: #664d03 !important; }
                .bg-danger-subtle { background-color: #f8d7da !important; color: #842029 !important; }
                .bg-info-subtle { background-color: #cff4fc !important; color: #055160 !important; }
                .bg-primary-subtle { background-color: #e7f1ff !important; color: #0d6efd !important; }
                .shadow-xs { box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
                .border-primary-subtle { border-color: #cfe2ff !important; }
                .btn-white { background-color: #fff; }
                table thead th { letter-spacing: 0.05rem; font-size: 0.75rem; }
            `}</style>
        </div>
    );
};       