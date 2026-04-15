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
        if (window.confirm("¿Are you sure you want to remove this booking from your history??")) {
            const success = await actions.deleteBooking(id);
            if (success) await actions.getMyBookings();
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!store.clientInfo?.id || !selectedRest?.id) {
            alert("Invalid session or restaurant not selected.");
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
            
            alert("¡Confirmed reservation!");
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
        <div className="min-vh-100 py-5 overflow-hidden" style={{ 
        backgroundImage: "linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        margin: 0 // Aseguramos que no haya margen externo
    }}>
            <div className="container">
                {/* --- SECCIÓN DE PERFIL --- */}
                <div className="card border-0 shadow-lg mb-4 p-4 rounded-4" style={{ 
                    backgroundColor: "rgba(20, 20, 20, 0.9)", 
                    borderLeft: "5px solid #c5a47e !important" 
                }}>
                    <div className="row align-items-center">
                        <div className="col-md-3 text-center">
                            <div className="position-relative d-inline-block">
                                <img
                                    src={store.clientInfo?.image_url || "https://ui-avatars.com/api/?name=User"}
                                    className="rounded-circle shadow-sm"
                                    style={{ 
                                        width: "130px", 
                                        height: "130px", 
                                        objectFit: "cover",
                                        border: "3px solid #c5a47e"
                                    }}
                                    alt="Profile"
                                />
                                <label className="position-absolute bottom-0 end-0 p-2 rounded-circle shadow" style={{ 
                                    cursor: "pointer",
                                    backgroundColor: "#c5a47e",
                                    color: "#000"
                                }}>
                                    <i className="fas fa-camera"></i>
                                    <input type="file" hidden onChange={uploadImage} />
                                </label>
                            </div>
                        </div>
                        <div className="col-md-9 text-white">
                            {/* Cambio a Inglés: ¡Hola! -> Hello! */}
                            <h2 className="fw-bold mb-1">Hello, <span style={{ color: "#c5a47e" }}>{store.clientInfo?.name || "Client"}</span>!</h2>
                            {/* Cambio a Inglés: Bienvenido a tu panel personal... */}
                            <p className="text-white-50">Welcome to your TableNow personal dashboard.</p>
                            
                            <div className="input-group input-group-sm mt-2" style={{ maxWidth: "350px" }}>
                                <input 
                                    type="text" 
                                    className="form-control bg-transparent text-white border-secondary shadow-none custom-placeholder" 
                                    placeholder="Image URL..." 
                                    style={{ 
                                        color: "#fff",
                                        // Aplicamos un color gris claro directo al estilo si no quieres usar CSS externo
                                        fontSize: "0.85rem"
                                    }}
                                    value={tempUrl} 
                                    onChange={(e) => setTempUrl(e.target.value)} 
                                />
                                <button className="btn" style={{ 
                                    backgroundColor: "#c5a47e", 
                                    color: "#000",
                                    fontWeight: "600"
                                }} onClick={async () => {
                                    const success = await actions.updateClientImage(tempUrl);
                                    if (success) await actions.getClientInfo();
                                }}>Save</button> {/* Cambio a Inglés: Guardar -> Save */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <ConserjeChat />
                </div>
            </div>

            {/* --- GEOLOCATED SEARCH BUTTON --- */}
<div className="card shadow-lg mb-5 border-0 rounded-4 transition border-hover" style={{ 
    backgroundColor: "rgba(30, 30, 30, 0.7)", 
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(197, 164, 126, 0.2)"
}}>
    <div className="card-body text-center py-5">
        <h4 className="fw-bold text-white mb-3">
            Are you hungry, <span style={{ color: "#c5a47e" }}>{store.clientInfo?.name?.split(' ')[0] || "Client"}</span>?
        </h4>
        <p className="text-white-50 mb-4" style={{ fontSize: "1.1rem" }}>
            Find the best restaurants just a few steps away from your current location.
        </p>
        <Link to="/buscar" className="btn btn-lg px-5 shadow-sm rounded-pill transition" style={{ 
            backgroundColor: "#c5a47e", 
            color: "#000",
            fontWeight: "700",
            border: "none",
            letterSpacing: "0.5px"
        }}>
            <i className="fas fa-search-location me-2"></i>Explore Nearby Map
        </Link>
    </div>
</div>
      {/* --- BOOKING AGENDA --- */}
<div className="mb-5">
    <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
            <h3 className="fw-bold mb-0 text-white" style={{ letterSpacing: '1px' }}>
                <i className="fas fa-calendar-alt me-2" style={{ color: '#c5a47e' }}></i>BOOKING AGENDA
            </h3>
            <p className="small mb-0" style={{ color: '#a0a0a0' }}>ATTENDANCE & CONTACT MANAGEMENT</p>
        </div>
        {/* Badge contador */}
        <span className="badge rounded-pill px-3 py-2 shadow-sm" style={{ backgroundColor: 'transparent', border: '1px solid rgba(197, 164, 126, 0.3)', color: '#c5a47e' }}>
            {store.clientBookings?.length || 0} Bookings
        </span>
    </div>

    {/* Contenedor con Glassmorphism */}
    <div className="card shadow-lg border-0 overflow-hidden transition" style={{ 
        backgroundColor: 'rgba(20, 20, 20, 0.65)', 
        backdropFilter: 'blur(12px)', 
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
        <div className="table-responsive">
            <table className="table mb-0" style={{ color: '#ffffff' }}>
                <thead style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <tr>
                        <th className="ps-4 py-3 border-0 small text-uppercase fw-bold" style={{ color: '#c5a47e', backgroundColor: 'transparent' }}>Restaurant / Contact</th>
                        <th className="py-3 border-0 small text-uppercase fw-bold text-center" style={{ color: '#c5a47e', backgroundColor: 'transparent' }}>Date & Time</th>
                        <th className="py-3 border-0 small text-uppercase fw-bold text-center" style={{ color: '#c5a47e', backgroundColor: 'transparent' }}>PAX</th>
                        <th className="py-3 border-0 small text-uppercase fw-bold" style={{ color: '#c5a47e', backgroundColor: 'transparent' }}>Status</th>
                        <th className="text-end pe-4 py-3 border-0 small text-uppercase fw-bold" style={{ color: '#c5a47e', backgroundColor: 'transparent' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.clientBookings?.length > 0 ? (
                        store.clientBookings.map((reser) => (
                            <tr key={reser.id} className="align-middle" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'transparent' }}>
                                <td className="ps-4 py-3" style={{ backgroundColor: 'transparent' }}>
                                    <div className="fw-bold text-white mb-1" style={{ fontSize: '1rem' }}>{reser.nombre_restaurante}</div>
                                    <div className="d-flex flex-wrap gap-1 mb-1">
                                        {safeSplit(reser.categoria_restaurante).map((cat, i) => (
                                            <span key={`cat-${i}`} className="badge rounded-pill" style={{ fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.1)', color: '#d1d1d1', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="d-flex flex-wrap gap-1">
                                        {safeSplit(reser.tags_restaurante).map((tag, i) => (
                                            <span key={`tag-${i}`} className="d-flex align-items-center" style={{ fontSize: '0.65rem', color: '#8a8a8a' }}>
                                                <i className="fas fa-tag me-1" style={{ fontSize: '0.6rem' }}></i>{tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-3 text-center" style={{ backgroundColor: 'transparent' }}>
                                    <div className="fw-medium" style={{ color: '#c5a47e' }}>{reser.fecha}</div>
                                    <div className="badge small fw-bold mt-1" style={{ fontSize: '10px', backgroundColor: 'rgba(197, 164, 126, 0.1)', color: '#c5a47e', border: '1px solid rgba(197, 164, 126, 0.3)' }}>{reser.hora}</div>
                                </td>
                                <td className="py-3 text-center fw-bold" style={{ color: '#c5a47e', backgroundColor: 'transparent' }}>
                                    <i className="fas fa-user-friends me-1 small"></i>{reser.num_personas}
                                </td>
                                <td className="py-3" style={{ backgroundColor: 'transparent' }}>
                                    {/* Estados unificados a color #c5a47e */}
                                    <span className="badge px-3 py-2 border" style={{ 
                                        backgroundColor: 'rgba(0,0,0,0.4)', 
                                        borderColor: '#c5a47e', 
                                        color: '#c5a47e',
                                        textTransform: 'capitalize' 
                                    }}>
                                        {reser.estado === 'confirmada' ? 'Confirmed' : 
                                         reser.estado === 'cancelada' ? 'Cancelled' : 'Pending'}
                                    </span>
                                </td>
                                <td className="text-end pe-4 py-3" style={{ backgroundColor: 'transparent' }}>
                                    <div className="btn-group shadow-none gap-2">
                                        {reser.estado === "pendiente" && (
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: 'transparent', border: '1px solid #c5a47e', color: '#c5a47e', borderRadius: '4px' }}
                                                onClick={async () => {
                                                    if (window.confirm("Confirm attendance for this booking?")) {
                                                        await actions.updateBookingStatus(reser.id, "confirmada");
                                                        await actions.getMyBookings();
                                                    }
                                                }}
                                                title="Confirm booking"
                                            >
                                                <i className="fas fa-check"></i>
                                            </button>
                                        )}
                                        {reser.estado !== "cancelada" && (
                                            <button
                                                className="btn btn-sm"
                                                style={{ backgroundColor: 'transparent', border: '1px solid #c5a47e', color: '#c5a47e', borderRadius: '4px', opacity: '0.8' }}
                                                onClick={async () => {
                                                    if (window.confirm("Do you want to cancel this booking?")) {
                                                        if (actions.cancelBooking) {
                                                            await actions.cancelBooking(reser.id);
                                                        } else {
                                                            await actions.updateBookingStatus(reser.id, "cancelada");
                                                        }
                                                        await actions.getMyBookings();
                                                    }
                                                }}
                                                title="Cancel booking"
                                            >
                                                <i className="fas fa-ban"></i>
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-sm"
                                            style={{ backgroundColor: 'transparent', border: '1px solid #c5a47e', color: '#c5a47e', borderRadius: '4px' }}
                                            onClick={() => handleDelete(reser.id)}
                                            title="Delete from history"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-5 small" style={{ color: '#a0a0a0', backgroundColor: 'transparent' }}>
                                You don't have any bookings yet. Explore options below!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
</div>

            {/* --- RESTAURANT LISTING --- */}
<h3 className="fw-bold mb-4 text-white" style={{ letterSpacing: '1px' }}>
    <i className="fas fa-utensils me-2" style={{ color: '#c5a47e' }}></i>EXPLORE & BOOK
</h3>

<div className="row">
    {store.restaurants?.map((rest) => (
        <div key={rest.id} className="col-md-4 mb-4">
            <div className="card h-100 border-0 shadow-lg rounded-4 overflow-hidden transition border-hover" style={{ 
                backgroundColor: "rgba(30, 30, 30, 0.7)", 
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.05)"
            }}>
                {/* Imagen con overlay sutil */}
                <div className="position-relative">
                    <img 
                        src={rest.image_url || "https://picsum.photos/400/200"} 
                        className="card-img-top" 
                        style={{ height: "180px", objectFit: "cover", opacity: "0.9" }} 
                        alt="Restaurant" 
                    />
                    <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }}>
                        <span className="badge rounded-pill" style={{ backgroundColor: "#c5a47e", color: "#000", fontWeight: "600" }}>
                            Top Choice
                        </span>
                    </div>
                </div>

                <div className="card-body d-flex flex-column justify-content-between">
                    <h5 className="fw-bold text-white mb-3">{rest.nombre || rest.name}</h5>
                    
                    <div className="d-grid gap-2">
                        {/* Botón Principal: Reservar */}
                        <button
                            className="btn py-2 rounded-pill fw-bold transition"
                            style={{ 
                                backgroundColor: "#c5a47e", 
                                color: "#000",
                                border: "none",
                                fontSize: "0.9rem"
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#bookingModal"
                            onClick={() => setSelectedRest(rest)}
                        >
                            Book a Table
                        </button>
                        
                        {/* Botón Secundario: Detalles */}
                        <button
                            className="btn btn-outline-light py-2 rounded-pill fw-bold btn-sm transition"
                            style={{ 
                                borderColor: "rgba(197, 164, 126, 0.5)",
                                color: "#c5a47e",
                                fontSize: "0.8rem",
                                backgroundColor: "transparent"
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#infoModal"
                            onClick={() => setSelectedRest(rest)}
                        >
                            <i className="fas fa-info-circle me-2"></i>View Menu & Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ))}
</div>

  {/* --- BOOKING MODAL --- */}
<div className="modal fade" id="bookingModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4" style={{ 
            backgroundColor: "rgba(25, 25, 25, 0.95)", 
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(197, 164, 126, 0.2)" 
        }}>
            {/* Header del Modal */}
            <div className="modal-header border-0 p-4 pb-0">
                <h4 className="modal-title fw-bold text-white mb-0">
                    Book at <span style={{ color: "#c5a47e" }}>{selectedRest?.nombre || selectedRest?.name}</span>
                </h4>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form onSubmit={handleBooking}>
                <div className="modal-body p-4">
                    <div className="card border-0 p-4 rounded-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <div className="row">
                            {/* Fecha */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold small text-uppercase" style={{ color: "#c5a47e", letterSpacing: "1px" }}>
                                    <i className="fas fa-calendar-day me-2"></i>Date *
                                </label>
                                <input 
                                    type="date" 
                                    className="form-control bg-dark text-white border-secondary" 
                                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                                    required 
                                    value={bookingData.fecha} 
                                    onChange={(e) => setBookingData({ ...bookingData, fecha: e.target.value })} 
                                />
                            </div>

                            {/* Hora */}
                            <div className="col-md-6 mb-3">
                                <label className="form-label fw-bold small text-uppercase" style={{ color: "#c5a47e", letterSpacing: "1px" }}>
                                    <i className="fas fa-clock me-2"></i>Time *
                                </label>
                                <input 
                                    type="time" 
                                    className="form-control bg-dark text-white border-secondary" 
                                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                                    required 
                                    value={bookingData.hora} 
                                    onChange={(e) => setBookingData({ ...bookingData, hora: e.target.value })} 
                                />
                            </div>

                            {/* Personas (PAX) */}
                            <div className="col-md-12 mb-3">
                                <label className="form-label fw-bold small text-uppercase" style={{ color: "#c5a47e", letterSpacing: "1px" }}>
                                    <i className="fas fa-users me-2"></i>Guests (PAX) *
                                </label>
                                <input 
                                    type="number" 
                                    className="form-control bg-dark text-white border-secondary" 
                                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                                    min="1" 
                                    max={selectedRest?.capacidad_total || 20} 
                                    required 
                                    value={bookingData.num_personas} 
                                    onChange={(e) => setBookingData({ ...bookingData, num_personas: e.target.value })} 
                                />
                                <div className="form-text small" style={{ color: "rgba(255,255,255,0.4)" }}>
                                    Max capacity of venue: {selectedRest?.capacidad_total || "Not specified"}
                                </div>
                            </div>

                            {/* Notas Especiales */}
                            <div className="col-12 mb-2">
                                <label className="form-label fw-bold small text-uppercase" style={{ color: "#c5a47e", letterSpacing: "1px" }}>
                                    <i className="fas fa-pen-fancy me-2"></i>Special Requests
                                </label>
                                <textarea 
                                    className="form-control bg-dark text-white border-secondary" 
                                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                                    rows="3" 
                                    placeholder="Ex: Allergies, window table..." 
                                    value={bookingData.notas} 
                                    onChange={(e) => setBookingData({ ...bookingData, notas: e.target.value })}
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer del Modal */}
                <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-between">
                    <button 
                        type="button" 
                        className="btn rounded-pill px-4 fw-bold" 
                        style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                        data-bs-dismiss="modal"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn rounded-pill px-5 shadow fw-bold transition"
                        style={{ backgroundColor: "#c5a47e", color: "#000", border: "none" }}
                    >
                        Confirm Reservation
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

{/* --- INFO & MENU MODAL --- */}
<div className="modal fade" id="infoModal" tabIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered modal-md">
        <div className="modal-content border-0 shadow-lg rounded-4" style={{ 
            backgroundColor: "rgba(25, 25, 25, 0.98)", 
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(197, 164, 126, 0.2)" 
        }}>
            {/* Header con botón de cerrar minimalista */}
            <div className="modal-header border-0 pb-0 position-relative">
                <button type="button" className="btn-close btn-close-white position-absolute end-0 top-0 m-3" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body p-4 pt-0">
                <div className="text-center mb-4">
                    <div className="position-relative mb-3">
                        <img
                            src={selectedRest?.image_url || "https://picsum.photos/400/200"}
                            className="rounded-4 shadow-lg"
                            style={{ width: "100%", height: "220px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
                            alt="Restaurant"
                        />
                    </div>
                    
                    <h3 className="fw-bold text-white mb-2">{selectedRest?.nombre || selectedRest?.name}</h3>
                    
                    {/* Categorías estilizadas */}
                    <div className="mb-3 d-flex justify-content-center flex-wrap gap-2">
                        {safeSplit(selectedRest?.categoria_restaurante || selectedRest?.categoria || selectedRest?.categorias).length > 0 ? (
                            safeSplit(selectedRest?.categoria_restaurante || selectedRest?.categoria || selectedRest?.categorias).map((cat, i) => (
                                <span key={i} className="badge rounded-pill px-3 py-2" style={{ backgroundColor: "rgba(197, 164, 126, 0.1)", color: "#c5a47e", border: "1px solid rgba(197, 164, 126, 0.3)" }}>
                                    {cat}
                                </span>
                            ))
                        ) : (
                            <span className="badge bg-transparent text-muted rounded-pill px-3"></span>
                        )}
                    </div>

                    {/* Horario con Lógica de Estado Abierto/Cerrado */}
                    <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                        <div className="px-3 py-2 rounded-pill d-flex align-items-center" style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                            <i className="far fa-clock me-2" style={{ color: "#c5a47e" }}></i>
                            <span className="small fw-bold text-white me-2">
                                {(() => {
                                    const open = selectedRest?.horario_apertura || selectedRest?.opening_time || selectedRest?.opening_hour || selectedRest?.apertura;
                                    const close = selectedRest?.horario_cierre || selectedRest?.closing_time || selectedRest?.closing_hour || selectedRest?.cierre;
                                    return (open && close) ? `${open} - ${close}` : "Schedule N/A";
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
                                        <span className={`badge rounded-pill ${isOpen ? 'bg-success' : 'bg-danger'}`} style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                            {isOpen ? 'Open' : 'Closed'}
                                        </span>
                                    );
                                } catch (e) { return null; }
                            })()}
                        </div>
                    </div>

                    {/* Información de Contacto y Capacidad */}
                    <div className="d-flex justify-content-center gap-3 flex-wrap mt-2">
                        <small style={{ color: "rgba(255,255,255,0.6)" }}>
                            <i className="fas fa-map-marker-alt me-1" style={{ color: "#c5a47e" }}></i>
                            {selectedRest?.direccion || "No address"}
                        </small>
                        <small style={{ color: "rgba(255,255,255,0.6)" }}>
                            <i className="fas fa-phone me-1" style={{ color: "#c5a47e" }}></i>
                            {selectedRest?.telefono || "No phone"}
                        </small>
                        <small style={{ color: "rgba(255,255,255,0.6)" }}>
                            <i className="fas fa-users me-1" style={{ color: "#c5a47e" }}></i>
                            Capacity: {selectedRest?.capacidad_total || "?"} pax.
                        </small>
                    </div>
                </div>

                {/* Tags de "Ideal Para" */}
                {safeSplit(selectedRest?.tags || selectedRest?.tags_restaurante).length > 0 && (
                    <div className="mb-4 text-center">
                        <p className="small text-uppercase fw-bold mb-2" style={{ color: "#c5a47e", letterSpacing: '1px', fontSize: '0.7rem' }}>Best for:</p>
                        <div className="d-flex justify-content-center flex-wrap gap-2">
                            {safeSplit(selectedRest?.tags || selectedRest?.tags_restaurante).map((tag, i) => (
                                <span key={i} className="small text-white-50 px-2 py-1 rounded border" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.1)", fontSize: '0.75rem' }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sección de Menú */}
                <h5 className="fw-bold mb-3 border-bottom pb-2 text-white" style={{ borderBottomColor: "rgba(197, 164, 126, 0.3) !important" }}>
                    <i className="fas fa-utensils me-2" style={{ color: "#c5a47e", fontSize: "0.9rem" }}></i>Our Menu
                </h5>
                <div className="list-group list-group-flush pr-2" style={{ maxHeight: "250px", overflowY: "auto", scrollbarWidth: 'thin' }}>
                    {store.menus && store.menus.filter(m => m.restaurante_id === selectedRest?.id).length > 0 ? (
                        store.menus
                            .filter(item => item.restaurante_id === selectedRest?.id)
                            .map((plato, index) => (
                                <div key={index} className="list-group-item bg-transparent px-0 py-3 d-flex align-items-center border-0 border-bottom" style={{ borderBottomColor: "rgba(255,255,255,0.05) !important" }}>
                                    <img 
                                        src={plato.foto || "https://dummyimage.com/50x50/333/fff&text=Dish"} 
                                        alt={plato.nombre}
                                        className="rounded-3 me-3"
                                        style={{ width: "50px", height: "50px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 className="mb-0 fw-bold text-white" style={{ fontSize: '0.9rem' }}>{plato.nombre}</h6>
                                        <small style={{ color: "rgba(197, 164, 126, 0.7)", fontSize: '0.75rem' }}>{plato.categoria}</small>
                                    </div>
                                    <span className="fw-bold ms-2" style={{ color: "#c5a47e" }}>${plato.precio}</span>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-muted small italic">The chef is still preparing the menu. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer con Botón de Acción Call-to-Action */}
            <div className="modal-footer border-0 p-4 pt-0">
                <button
                    className="btn w-100 rounded-pill fw-bold py-3 shadow transition-all"
                    style={{ backgroundColor: "#c5a47e", color: "#000", border: "none" }}
                    data-bs-toggle="modal"
                    data-bs-target="#bookingModal"
                >
                    I Love It, Book Now!
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

                
                .custom-placeholder::placeholder {
                    color: rgba(255, 255, 255, 0.5) !important;
                }
                
            `}</style>
        </div>
    );
};       