import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import RestaurantMap from "./RestaurantMap.jsx"; 

export const CrearRestaurante = () => {
    const { store, actions } = useGlobalReducer();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    
    // Estados para coordenadas
    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.tokenOwner) {
            actions.getOwnerRestaurants();
        }
    }, [store.tokenOwner]);

    const getLocation = () => {
        if (!navigator.geolocation) {
            return alert("Tu navegador no soporta geolocalización");
        }
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitud(position.coords.latitude);
                setLongitud(position.coords.longitude);
                setLoadingLocation(false);
                alert("📍 Ubicación capturada correctamente");
            },
            (error) => {
                setLoadingLocation(false);
                const msg = error.code === 1 
                    ? "Permiso denegado. Activa la ubicación en tu navegador." 
                    : "No se pudo obtener la ubicación.";
                alert(msg);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;
        setUploading(true);
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
                setImageUrl(file.secure_url);
            }
        } catch (error) {
            console.error("Error subiendo imagen:", error);
            alert("Error al subir la imagen");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!store.tokenOwner) return alert("No hay sesión activa.");
        if (!imageUrl) return alert("Por favor, sube una imagen o pega una URL.");
        if (!latitud || !longitud) return alert("Por favor, captura la ubicación GPS.");

        setIsSubmitting(true);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify({
                    nombre,
                    direccion,
                    telefono,
                    capacidad_total: parseInt(capacidad, 10) || 0,
                    image_url: imageUrl,
                    latitud,
                    longitud
                })
            });

            if (response.ok) {
                setNombre(""); setDireccion(""); setTelefono(""); setCapacidad("");
                setImageUrl(""); setLatitud(null); setLongitud(null);
                await actions.getOwnerRestaurants();
                alert("¡Restaurante añadido con éxito!");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "No se pudo crear"));
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este restaurante?")) {
            const exito = await actions.deleteRestaurant(id);
            if (exito) alert("Restaurante eliminado correctamente");
        }
    };

    const handleEdit = async (id, nombreActual) => {
        const nuevoNombre = prompt("Nuevo nombre para el restaurante:", nombreActual);
        if (nuevoNombre && nuevoNombre !== nombreActual) {
            await actions.updateRestaurant(id, { nombre: nuevoNombre });
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* COLUMNA FORMULARIO */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="fw-bold mb-1"><i className="fas fa-plus-circle text-primary me-2"></i>Nuevo Local</h4>
                        <p className="text-muted small mb-4">Completa los datos para tu nuevo restaurante.</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre</label>
                                <input type="text" className="form-control" placeholder="Ej: Terraza del Sol" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Dirección</label>
                                <input type="text" className="form-control" placeholder="Calle Falsa 123" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label small fw-bold">Teléfono</label>
                                    <input type="text" className="form-control" placeholder="0412..." value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                </div>
                                <div className="col">
                                    <label className="form-label small fw-bold">Capacidad</label>
                                    <input type="number" className="form-control" placeholder="10" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                                </div>
                            </div>

                            {/* UBICACIÓN GPS */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Ubicación GPS</label>
                                <button type="button" className={`btn ${latitud ? 'btn-success' : 'btn-outline-dark'} w-100 btn-sm mb-2`} onClick={getLocation} disabled={loadingLocation}>
                                    {loadingLocation ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-map-marker-alt me-2"></i>}
                                    {latitud ? "Ubicación Capturada" : "Capturar Ubicación Actual"}
                                </button>
                                {latitud && longitud && (
                                    <div className="mb-2 rounded overflow-hidden border" style={{ height: "120px" }}>
                                        <RestaurantMap lat={latitud} lng={longitud} nombre={nombre || "Local"} />
                                    </div>
                                )}
                            </div>

                            {/* IMAGEN: URL + SUBIDA */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Imagen del Local</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm mb-2" 
                                    placeholder="Pega la URL de la imagen aquí..." 
                                    value={imageUrl} 
                                    onChange={(e) => setImageUrl(e.target.value)} 
                                />
                                
                                <div className="position-relative">
                                    <label className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center py-2 border-2 border-dashed shadow-sm" style={{ cursor: 'pointer' }}>
                                        {uploading ? (
                                            <span><i className="fas fa-spinner fa-spin me-2"></i>Subiendo...</span>
                                        ) : (
                                            <>
                                                <i className="fas fa-camera me-2"></i>
                                                Subir desde PC
                                            </>
                                        )}
                                        <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                    </label>
                                </div>

                                {imageUrl && (
                                    <div className="mt-2 text-center">
                                        <img src={imageUrl} alt="Preview" className="img-thumbnail rounded shadow-sm" style={{ maxHeight: "100px", width: "100%", objectFit: "cover" }} />
                                        <button type="button" className="btn btn-link btn-sm text-danger" onClick={() => setImageUrl("")}>Eliminar imagen</button>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm" disabled={isSubmitting || uploading}>
                                {isSubmitting ? "Guardando..." : "Registrar Local"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA LISTADO */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 border-0 d-flex align-items-center">
                            <h5 className="mb-0 fw-bold"><i className="fas fa-list text-success me-2"></i>Mis Restaurantes</h5>
                            <span className="badge bg-secondary ms-2">{store.restaurants?.length || 0}</span>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">RESTAURANTE / UBICACIÓN</th>
                                        <th className="text-end pe-4">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.restaurants?.map((rest) => (
                                        <tr key={rest.id}>
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-center mb-2">
                                                    <img src={rest.image_url || "https://via.placeholder.com/40"} alt="thumb" className="rounded-circle me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                                                    <span className="fw-bold">{rest.nombre}</span>
                                                </div>
                                                {rest.latitud ? (
                                                    <div className="rounded border" style={{ width: "180px", height: "80px" }}>
                                                        <RestaurantMap lat={rest.latitud} lng={rest.longitud} nombre={rest.nombre} zoom={13} />
                                                    </div>
                                                ) : (
                                                    <span className="text-muted small">Sin ubicación GPS</span>
                                                )}
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm text-secondary" onClick={() => handleEdit(rest.id, rest.nombre)}><i className="fas fa-edit"></i></button>
                                                <button className="btn btn-sm text-danger" onClick={() => handleDelete(rest.id)}><i className="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};