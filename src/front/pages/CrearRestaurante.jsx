import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CrearRestaurante = () => {
    const { store, actions } = useGlobalReducer();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.tokenOwner) {
            actions.getOwnerRestaurants();
        }
    }, [store.tokenOwner]);

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
                console.log("Imagen lista:", file.secure_url);
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
        if (!imageUrl) return alert("Por favor, sube una imagen o pega una URL primero.");

        setIsSubmitting(true);

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify({
                    nombre: nombre,
                    direccion: direccion,
                    telefono: telefono,
                    capacidad_total: parseInt(capacidad) || 0,
                    image_url: imageUrl
                })
            });

            if (response.ok) {
                setNombre("");
                setDireccion("");
                setTelefono("");
                setCapacidad("");
                setImageUrl("");
                await actions.getOwnerRestaurants();
                alert("¡Restaurante añadido con éxito!");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "No se pudo crear"));
            }
        } catch (error) {
            console.error("Error al crear:", error);
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
                <div className="col-md-4">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="fw-bold"><i className="fas fa-plus-circle text-primary me-2"></i>Nuevo Local</h4>
                        <p className="text-muted small">Completa los datos para tu nuevo restaurante.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre</label>
                                <input
                                    type="text" className="form-control"
                                    value={nombre} onChange={(e) => setNombre(e.target.value)}
                                    placeholder="Ej: Terraza del Sol" required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Dirección</label>
                                <input
                                    type="text" className="form-control"
                                    value={direccion} onChange={(e) => setDireccion(e.target.value)}
                                    placeholder="Calle Falsa 123" required
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label small fw-bold">Teléfono</label>
                                    <input
                                        type="text" className="form-control"
                                        value={telefono} onChange={(e) => setTelefono(e.target.value)}
                                        placeholder="0412..." required
                                    />
                                </div>
                                <div className="col">
                                    <label className="form-label small fw-bold">Capacidad</label>
                                    <input
                                        type="number" className="form-control"
                                        value={capacidad} onChange={(e) => setCapacidad(e.target.value)}
                                        placeholder="10" required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Imagen del Local</label>
                                
                                <input 
                                    type="text" 
                                    className="form-control mb-2 form-control-sm" 
                                    placeholder="Pega la URL de la imagen aquí..."
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                                
                                <div className="text-center mb-2">
                                    <span className="badge bg-light text-muted fw-normal">O sube un archivo:</span>
                                </div>

                                <div className="position-relative">
                                    <label className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center py-2 border-2 border-dashed shadow-sm">
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
                                        <img src={imageUrl} alt="Preview" className="img-thumbnail rounded-3 shadow-sm" style={{ maxHeight: "120px", width: "100%", objectFit: "cover" }} />
                                        <button type="button" className="btn btn-link btn-sm text-danger" onClick={() => setImageUrl("")}>Limpiar imagen</button>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 shadow-sm fw-bold py-2"
                                disabled={uploading || isSubmitting || !imageUrl}
                            >
                                {isSubmitting ? (
                                    <span><i className="fas fa-spinner fa-spin me-2"></i>Guardando...</span>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>Registrar Local
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 border-0">
                            <h5 className="mb-0 fw-bold">
                                <i className="fas fa-list text-success me-2"></i>
                                Mis Restaurantes
                                <span className="badge bg-secondary ms-2 rounded-pill">{store.restaurants?.length || 0}</span>
                            </h5>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="ps-4">RESTAURANTE</th>
                                        <th>ESTADO</th>
                                        <th className="text-end pe-4">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.restaurants && store.restaurants.length > 0 ? (
                                        store.restaurants.map((rest) => (
                                            <tr key={rest.id}>
                                                <td className="ps-4 fw-bold text-dark">
                                                    <img
                                                        src={rest.image_url || "https://via.placeholder.com/50"}
                                                        alt="thumb"
                                                        className="rounded-circle me-3"
                                                        style={{ width: "40px", height: "40px", objectFit: "cover", border: "1px solid #dee2e6" }}
                                                    />
                                                    {rest.nombre || rest.name}
                                                </td>
                                                <td>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2">Activo</span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm border-0"
                                                            onClick={() => handleEdit(rest.id, rest.nombre || rest.name)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm border-0"
                                                            onClick={() => handleDelete(rest.id)}
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center py-4 text-muted">Aún no tienes locales registrados</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};