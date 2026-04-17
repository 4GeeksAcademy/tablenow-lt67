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

    const handleMapChange = (newLat, newLng) => {
        setLatitud(newLat);
        setLongitud(newLng);
    };

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
            },
            (error) => {
                setLoadingLocation(false);
                const msg = error.code === 1
                    ? "Permiso denegado. Activa la ubicación."
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
        if (!imageUrl) return alert("Por favor, sube una imagen.");
        if (!latitud || !longitud) return alert("Por favor, selecciona una ubicación en el mapa.");

        setIsSubmitting(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify({
                    nombre,
                    direccion,
                    telefono,
                    capacidad_total: parseInt(capacidad, 10),
                    image_url: imageUrl,
                    latitud: parseFloat(latitud),
                    longitud: parseFloat(longitud)
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

    return (
        <div className="container mt-5">
            <div className="row">
                {/* FORMULARIO */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="fw-bold mb-1"><i className="fas fa-plus-circle text-primary me-2"></i>Nuevo Local</h4>
                        <p className="text-muted small mb-4">Ingresa los detalles de tu establecimiento.</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre</label>
                                <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Dirección</label>
                                <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                            </div>
                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label small fw-bold">Teléfono</label>
                                    <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                </div>
                                <div className="col">
                                    <label className="form-label small fw-bold">Capacidad</label>
                                    <input type="number" className="form-control" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                                </div>
                            </div>

                            {/* SECCIÓN MAPA */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Ubicación GPS</label>
                                <button type="button" className={`btn ${latitud ? 'btn-success' : 'btn-outline-dark'} w-100 btn-sm mb-2`} onClick={getLocation} disabled={loadingLocation}>
                                    {loadingLocation ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-map-marker-alt me-2"></i>}
                                    {latitud ? "Ubicación Fijada" : "Usar mi ubicación actual"}
                                </button>

                                {/* El contenedor siempre existe para evitar errores de renderizado del mapa */}
                                <div className="mb-2 rounded border bg-light d-flex align-items-center justify-content-center" style={{ height: "200px", position: "relative", overflow: "hidden" }}>
                                    {latitud && longitud ? (
                                        <RestaurantMap
                                            lat={latitud}
                                            lng={longitud}
                                            nombre={nombre || "Nuevo Local"}
                                            onLocationChange={handleMapChange}
                                        />
                                    ) : (
                                        <span className="text-muted small p-3 text-center">Captura tu ubicación para ver el mapa</span>
                                    )}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Imagen</label>
                                <input type="file" className="form-control form-control-sm mb-2" onChange={handleFileUpload} accept="image/*" />
                                {imageUrl && <img src={imageUrl} alt="Preview" className="img-thumbnail w-100" style={{ height: "100px", objectFit: "cover" }} />}
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold" disabled={isSubmitting || uploading}>
                                {isSubmitting ? "Registrando..." : "Registrar Local"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* LISTADO */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">Mis Restaurantes ({store.restaurants?.length || 0})</h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">Local</th>
                                        <th className="text-end pe-4">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.restaurants?.map((rest) => (
                                        <tr key={rest.id}>
                                            <td className="ps-4">
                                                <div className="d-flex align-items-center">
                                                    <img src={rest.image_url || "https://via.placeholder.com/40"} alt="thumb" className="rounded-circle me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                                                    <div>
                                                        <div className="fw-bold">{rest.nombre}</div>
                                                        <small className="text-muted">{rest.direccion}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm text-danger" onClick={() => actions.deleteRestaurant(rest.id)}><i className="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}