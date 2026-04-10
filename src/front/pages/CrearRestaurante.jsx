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
    
    // --- CAMPOS DE CATEGORIZACIÓN MÚLTIPLE (Chips) ---
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState(""); 
    
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState(""); 

    // --- ESTADOS DE UBICACIÓN ---
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
        if (!navigator.geolocation) return alert("Tu navegador no soporta geolocalización");
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
                alert("No se pudo obtener la ubicación automáticamente.");
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
            if (file.secure_url) setImageUrl(file.secure_url);
        } catch (error) {
            alert("Error al subir la imagen a Cloudinary");
        } finally {
            setUploading(false);
        }
    };

    // --- LÓGICA PARA AGREGAR/ELIMINAR CHIPS ---
    const handleAddChip = (e, state, setState, inputState, setInputState) => {
        // Prevenir que al dar Enter se envíe el formulario
        if (e.key === 'Enter') {
            e.preventDefault();
        }
        // Agregar chip si es Enter o Coma
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = inputState.trim();
            // Evitar vacíos y duplicados
            if (val && !state.some(item => item.toLowerCase() === val.toLowerCase())) {
                setState([...state, val]);
            }
            setInputState("");
        }
    };

    const removeChip = (indexToRemove, state, setState) => {
        setState(state.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!store.tokenOwner) return alert("No hay sesión activa.");
        if (!imageUrl) return alert("Por favor, sube una imagen o pega una URL.");
        if (!latitud || !longitud) return alert("Por favor, captura la ubicación GPS.");

        // Por si el usuario escribió algo y no le dio Enter antes de guardar
        const finalCategories = [...categories];
        if (categoryInput.trim()) finalCategories.push(categoryInput.trim());
        
        const finalTags = [...tags];
        if (tagInput.trim()) finalTags.push(tagInput.trim());

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
                    longitud,
                    // Se envían como un solo string separado por comas
                    category: finalCategories.length > 0 ? finalCategories.join(", ") : "General",
                    tags: finalTags.length > 0 ? finalTags.join(", ") : "Estándar"
                })
            });

            if (response.ok) {
                setNombre(""); setDireccion(""); setTelefono(""); setCapacidad("");
                setImageUrl(""); setLatitud(null); setLongitud(null);
                setCategories([]); setCategoryInput("");
                setTags([]); setTagInput(""); 
                await actions.getOwnerRestaurants();
                alert("¡Restaurante añadido con éxito!");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "No se pudo crear"));
            }
        } catch (error) {
            alert("Error de conexión");
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
                {/* FORMULARIO DE CREACIÓN */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="fw-bold mb-1"><i className="fas fa-plus-circle text-primary me-2"></i>Nuevo Local</h4>
                        <p className="text-muted small mb-4">Define tu estilo y ubicación.</p>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Nombre</label>
                                <input type="text" className="form-control" placeholder="Ej: La Trattoria Premium" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                            </div>

                            {/* INPUT DE CATEGORÍAS MÚLTIPLES */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold mb-1">Categorías</label>
                                <div className="d-flex flex-wrap gap-1 mb-2">
                                    {categories.map((cat, index) => (
                                        <span key={index} className="badge bg-primary text-white d-flex align-items-center">
                                            {cat}
                                            <i className="fas fa-times ms-2" style={{cursor: 'pointer', fontSize: '0.65rem'}} onClick={() => removeChip(index, categories, setCategories)}></i>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    placeholder="Escribe y presiona Enter..." 
                                    value={categoryInput} 
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    onKeyDown={(e) => handleAddChip(e, categories, setCategories, categoryInput, setCategoryInput)}
                                />
                                <div className="form-text" style={{fontSize: '0.65rem'}}>Ej: Italiana, Sushi, Parrilla</div>
                            </div>

                            {/* INPUT DE ETIQUETAS MÚLTIPLES */}
                            <div className="mb-3">
                                <label className="form-label small fw-bold mb-1">Etiquetas / Ambiente (IA)</label>
                                <div className="d-flex flex-wrap gap-1 mb-2">
                                    {tags.map((tag, index) => (
                                        <span key={index} className="badge bg-secondary text-white d-flex align-items-center">
                                            {tag}
                                            <i className="fas fa-times ms-2" style={{cursor: 'pointer', fontSize: '0.65rem'}} onClick={() => removeChip(index, tags, setTags)}></i>
                                        </span>
                                    ))}
                                </div>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    placeholder="Escribe y presiona Enter..." 
                                    value={tagInput} 
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => handleAddChip(e, tags, setTags, tagInput, setTagInput)}
                                />
                                <div className="form-text" style={{fontSize: '0.65rem'}}>Ej: Romántico, Familiar, Terraza</div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Dirección</label>
                                <input type="text" className="form-control" placeholder="Av. Principal Local 5" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                            </div>

                            <div className="row mb-3">
                                <div className="col">
                                    <label className="form-label small fw-bold">Teléfono</label>
                                    <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                </div>
                                <div className="col">
                                    <label className="form-label small fw-bold">Mesas</label>
                                    <input type="number" className="form-control" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Ubicación GPS</label>
                                <button type="button" className={`btn ${latitud ? 'btn-success' : 'btn-outline-dark'} w-100 btn-sm mb-2`} onClick={getLocation} disabled={loadingLocation}>
                                    {loadingLocation ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-map-marker-alt me-2"></i>}
                                    {latitud ? "Ubicación Capturada" : "Capturar Ubicación Actual"}
                                </button>
                                {latitud && longitud && (
                                    <div className="mb-2 rounded border" style={{ height: "120px", overflow: "visible" }}>
                                        <RestaurantMap lat={latitud} lng={longitud} nombre={nombre || "Local"} onLocationChange={handleMapChange} />
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Imagen del Local</label>
                                
                                <label className="btn btn-outline-primary w-100 mb-2 py-2 border-2 border-dashed shadow-sm" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                                    {uploading ? <span><i className="fas fa-spinner fa-spin me-2"></i>Subiendo...</span> : <><i className="fas fa-camera me-2"></i>Subir desde PC</>}
                                    <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                </label>

                                <div className="text-center my-2">
                                    <small className="text-muted">O PEGAR URL</small>
                                </div>

                                <div className="input-group input-group-sm mb-2">
                                    <span className="input-group-text bg-white"><i className="fas fa-link text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="https://imagen.com/foto.jpg" 
                                        value={imageUrl} 
                                        onChange={(e) => setImageUrl(e.target.value)} 
                                    />
                                </div>

                                {imageUrl && (
                                    <div className="mt-2 text-center position-relative">
                                        <img src={imageUrl} alt="Preview" className="img-thumbnail rounded" style={{ maxHeight: "80px", width: "100%", objectFit: "cover" }} 
                                             onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=URL+No+Valida"} />
                                        <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" style={{borderRadius: "50%", padding: "0px 6px"}} onClick={() => setImageUrl("")}>×</button>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm" disabled={isSubmitting || uploading}>
                                {isSubmitting ? "Guardando..." : "Registrar Local"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* LISTADO DE RESTAURANTES */}
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
                                        <th className="ps-4">RESTAURANTE / CATEGORÍAS / MAPA</th>
                                        <th className="text-end pe-4">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.restaurants?.map((rest) => (
                                        <tr key={rest.id}>
                                            <td className="ps-4 py-3">
                                                <div className="d-flex align-items-start mb-2">
                                                    <img src={rest.image_url || "https://via.placeholder.com/40"} className="rounded-circle me-3 mt-1" style={{ width: "45px", height: "45px", objectFit: "cover" }} />
                                                    <div>
                                                        <div className="fw-bold mb-1">{rest.nombre}</div>
                                                        
                                                        {/* RENDERIZADO DE MÚLTIPLES CATEGORÍAS */}
                                                        <div className="d-flex flex-wrap gap-1">
                                                            {rest.category && rest.category.split(',').map((cat, i) => (
                                                                <span key={`cat-${i}`} className="badge bg-info text-dark" style={{ fontSize: '0.7rem' }}>
                                                                    {cat.trim()}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* RENDERIZADO DE MÚLTIPLES TAGS */}
                                                        <div className="text-muted small mt-2 d-flex flex-wrap gap-1 align-items-center">
                                                            <i className="fas fa-tags"></i> 
                                                            {rest.tags && rest.tags.split(',').map((tag, i) => (
                                                                <span key={`tag-${i}`} className="badge border text-secondary" style={{ backgroundColor: '#f8f9fa' }}>
                                                                    {tag.trim()}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                {rest.latitud && (
                                                    <div className="rounded border mt-2" style={{ width: "200px", height: "80px" }}>
                                                        <RestaurantMap lat={rest.latitud} lng={rest.longitud} nombre={rest.nombre} zoom={13} />
                                                    </div>
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