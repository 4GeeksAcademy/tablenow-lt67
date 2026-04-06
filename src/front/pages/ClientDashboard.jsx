import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const ClientDashboard = () => {
    const { store, actions } = useGlobalReducer();

    useEffect(() => {
        actions.getAllRestaurantsPublic();
    }, []);

    // Función "mágica" que llamaremos cuando configuremos Cloudinary
    const uploadImage = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;

    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "TableNow"); // El nombre exacto que creaste

    try {
        console.log("Subiendo a Cloudinary...");
        const resp = await fetch(
            "https://api.cloudinary.com/v1_1/dfq0tzllo/image/upload",
            {
                method: "POST",
                body: data,
            }
        );
        const file = await resp.json();
        
        if (file.secure_url) {
            console.log("¡Éxito! URL de la imagen:", file.secure_url);
            
            // 2. Aquí llamamos a la acción que guarda la URL en tu base de datos de Python
            actions.updateClientImage(file.secure_url);
            
            alert("¡Imagen actualizada!");
        } else {
            console.error("Error de Cloudinary:", file);
            alert("Error al subir: " + (file.error?.message || "Desconocido"));
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
};

    return (
        <div className="container mt-5">
            {/* --- SECCIÓN DE PERFIL (NUEVA) --- */}
            <div className="row mb-5 p-4 bg-light rounded shadow-sm align-items-center">
                <div className="col-md-2 text-center">
                    <img 
                        src={store.clientInfo?.image_url || "https://via.placeholder.com/150"} 
                        className="rounded-circle img-thumbnail"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                        alt="Avatar"
                    />
                </div>
                <div className="col-md-6">
                    <h3 className="mb-1">Hola, {store.clientInfo?.name || "Manuel"}</h3>
                    <p className="text-muted">Gestiona tu perfil y tus reservas desde aquí.</p>
                    
                    {/* El input que pidió el profe: Fase 1 (Texto) */}
                    <div className="input-group mb-2">
                        <input 
                            type="text" 
                            className="form-control form-control-sm" 
                            placeholder="Pega aquí la URL de tu foto..." 
                            onChange={(e) => actions.updateClientImage(e.target.value)}
                        />
                        <button className="btn btn-sm btn-primary">Guardar URL</button>
                    </div>

                    {/* El botón de Cloudinary: Fase 2 (Subir archivo) */}
                    <div className="mt-2">
                        <label className="btn btn-sm btn-outline-secondary">
                            <i className="fas fa-camera me-1"></i> Subir foto desde PC
                            <input type="file" hidden onChange={uploadImage} />
                        </label>
                    </div>
                </div>
            </div>

            <hr />

            {/* --- LISTADO DE RESTAURANTES (TU CÓDIGO) --- */}
            <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
                <h2 className="fw-bold">Explora Restaurantes</h2>
                <span className="badge bg-success p-2">
                    {store.restaurants?.length || 0} Lugares disponibles
                </span>
            </div>

            <div className="row">
                {store.restaurants && store.restaurants.length > 0 ? (
                    store.restaurants.map((rest) => (
                        <div key={rest.id} className="col-md-4 mb-4">
                            <div className="card h-100 shadow-sm border-0 card-hover">
                                <img 
                                    src={rest.image_url || `https://picsum.photos/seed/${rest.id}/400/200`} 
                                    className="card-img-top" 
                                    alt={rest.name}
                                    style={{ height: "200px", objectFit: "cover" }}
                                    onError={(e) => {
                                        if (e.target.src !== `https://placehold.jp/400x200.png?text=${rest.name}`) {
                                            e.target.src = `https://placehold.jp/400x200.png?text=${rest.name}`;
                                        }
                                    }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title fw-bold">{rest.name || rest.nombre}</h5>
                                    <p className="card-text text-muted small">
                                        {rest.direccion || rest.address || "Dirección no disponible"}
                                    </p>
                                    <div className="d-grid">
                                        <button className="btn btn-primary fw-bold" onClick={() => console.log("Abriendo reserva...")}>
                                            Reservar Mesa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-5 w-100">
                        <div className="spinner-border text-primary" role="status"></div>
                        <p className="mt-2 text-muted">Buscando los mejores lugares para ti...</p>
                    </div>
                )}
            </div>
        </div>
    );
};