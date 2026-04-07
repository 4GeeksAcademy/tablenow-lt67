import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CrearRestaurante = () => {
    const { store, actions } = useGlobalReducer();
    const [nombre, setNombre] = useState("");
    const [imageUrl, setImageUrl] = useState(""); 
    const [uploading, setUploading] = useState(false); 
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
            // Usamos la misma lógica que en ClientDashboard
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
        if (!imageUrl) return alert("Por favor, sube una imagen primero.");

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.tokenOwner}`
            },
            body: JSON.stringify({ 
                nombre: nombre,
                image_url: imageUrl 
            })
        });

        if (response.ok) {
            setNombre("");
            setImageUrl(""); 
            actions.getOwnerRestaurants(); 
            alert("¡Restaurante añadido con éxito!");
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.msg);
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
            await actions.updateRestaurant(id, nuevoNombre);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="fw-bold"><i className="fas fa-plus-circle text-primary me-2"></i>Nuevo Local</h4>
                        <p className="text-muted small">Define el nombre e imagen para empezar.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre del Restaurante</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-lg" 
                                    value={nombre} 
                                    onChange={(e) => setNombre(e.target.value)} 
                                    placeholder="Ej: Terraza del Sol"
                                    required 
                                />
                            </div>
                            
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Imagen del Local</label>
                                
                                {/* BOTÓN ESTILO CLIENT DASHBOARD */}
                                <div className="position-relative">
                                    <label className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center py-3 border-2 border-dashed">
                                        {uploading ? (
                                            <span><i className="fas fa-spinner fa-spin me-2"></i>Subiendo...</span>
                                        ) : (
                                            <>
                                                <i className="fas fa-camera me-2"></i> 
                                                {imageUrl ? "Cambiar Imagen" : "Seleccionar Archivo"}
                                            </>
                                        )}
                                        <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                    </label>
                                </div>

                                {imageUrl && (
                                    <div className="mt-2 text-center animate__animated animate__fadeIn">
                                        <img src={imageUrl} alt="Preview" className="img-thumbnail rounded-3 shadow-sm" style={{maxHeight: "150px", width: "100%", objectFit: "cover"}} />
                                        <p className="small text-success mt-1 fw-bold"><i className="fas fa-check-circle"></i> ¡Imagen cargada!</p>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-100 shadow-sm fw-bold py-2" disabled={uploading || !imageUrl}>
                                <i className="fas fa-save me-2"></i>Registrar Local
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
                                                    {rest.name || rest.nombre}
                                                </td>
                                                <td>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2">Activo</span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="btn-group">
                                                        <button 
                                                            className="btn btn-outline-secondary btn-sm border-0" 
                                                            onClick={() => handleEdit(rest.id, rest.name || rest.nombre)}
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