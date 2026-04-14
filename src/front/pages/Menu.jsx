import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Menu = () => {
    const { store, dispatch } = useGlobalReducer();
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [uploading, setUploading] = useState(false); 
    
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        restaurante_id: "",
        foto: "" // Cambiado a foto para coincidir con el backend
    });

    const getRestauranteNombre = (id) => {
        if (!store.restaurants) return "Cargando...";
        const resto = store.restaurants.find(r => r.id === parseInt(id));
        return resto ? (resto.nombre || resto.name) : "Desconocido";
    };

    const sincronizarRestaurante = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants");
            if (resp.ok) {
                const data = await resp.json();
                dispatch({ type: "set_restaurants", payload: data });
                
                if (data.length > 0 && !formData.restaurante_id) {
                    setFormData(prev => ({ ...prev, restaurante_id: data[0].id }));
                }
            }
        } catch (error) {
            console.error("Error al sincronizar restaurante", error);
        }
    };

    const getMenus = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/menus");
            if (!resp.ok) throw new Error("Error al obtener menús");
            const data = await resp.json();
            dispatch({ type: "set_menus", payload: data });
        } catch (error) {
            console.error("Error cargando menús", error);
        }
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
                setFormData(prev => ({ ...prev, foto: file.secure_url })); // Cambiado a foto
            }
        } catch (error) {
            alert("Error al subir la imagen a Cloudinary");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.restaurante_id) return alert("Selecciona un restaurante");

        const url = editMode 
            ? `${import.meta.env.VITE_BACKEND_URL}/api/menus/${currentId}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/menus`;
        
        try {
            const resp = await fetch(url, {
                method: editMode ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (resp.ok) {
                setFormData(prev => ({ ...prev, nombre: "", categoria: "", precio: "", foto: "" })); // Cambiado a foto
                setEditMode(false);
                setCurrentId(null);
                getMenus();
            }
        } catch (error) {
            console.error("Error al procesar plato", error);
        }
    };

    const handleEditClick = (item) => {
        setEditMode(true);
        setCurrentId(item.id);
        setFormData({
            nombre: item.nombre,
            categoria: item.categoria,
            precio: item.precio,
            restaurante_id: item.restaurante_id,
            foto: item.foto || "" // Cambiado a foto
        });
        window.scrollTo(0, 0); 
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro?")) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/menus/${id}`, {
                method: "DELETE"
            });
            if (response.ok) getMenus();
        } catch (error) {
            console.error("Error al eliminar", error);
        }
    };

    useEffect(() => {
        getMenus();
        sincronizarRestaurante(); 
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4"><i className="fas fa-utensils text-primary me-2"></i>Gestión de Menú</h1>
            
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className={`card p-4 shadow-sm border-0 ${editMode ? 'border-start border-warning border-4' : ''}`}>
                        <h5 className="fw-bold mb-3">{editMode ? 'Editar Plato' : 'Nuevo Plato'}</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-2">
                                <label className="small fw-bold text-primary">Restaurante</label>
                                <select 
                                    className="form-select form-select-sm"
                                    value={formData.restaurante_id}
                                    onChange={e => setFormData({...formData, restaurante_id: e.target.value})}
                                    required
                                >
                                    <option value="">Selecciona un local...</option>
                                    {store.restaurants?.map(res => (
                                        <option key={res.id} value={res.id}>{res.nombre || res.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="small fw-bold">Nombre del Plato</label>
                                <input 
                                    type="text" className="form-control"
                                    value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required
                                />
                            </div>
                            <div className="mb-2">
                                <label className="small fw-bold">Categoría</label>
                                <input 
                                    type="text" className="form-control"
                                    value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="small fw-bold">Precio ($)</label>
                                <input 
                                    type="number" className="form-control"
                                    value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label small fw-bold">Imagen del Plato</label>
                                <label className="btn btn-outline-primary w-100 mb-2 py-1 border-2 border-dashed shadow-sm" style={{ cursor: 'pointer', fontSize: '0.85rem' }}>
                                    {uploading ? <span><i className="fas fa-spinner fa-spin me-2"></i>Subiendo...</span> : <><i className="fas fa-camera me-2"></i>Subir desde PC</>}
                                    <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                </label>

                                <div className="text-center my-1">
                                    <small className="text-muted" style={{fontSize: '0.7rem'}}>O PEGAR URL</small>
                                </div>

                                <div className="input-group input-group-sm mb-2">
                                    <span className="input-group-text bg-white"><i className="fas fa-link text-muted"></i></span>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="https://imagen.com/foto.jpg" 
                                        value={formData.foto} 
                                        onChange={(e) => setFormData({...formData, foto: e.target.value})} 
                                    />
                                </div>

                                {formData.foto && (
                                    <div className="mt-2 text-center position-relative">
                                        <img src={formData.foto} alt="Preview" className="img-thumbnail rounded" style={{ maxHeight: "80px", width: "100%", objectFit: "cover" }} 
                                             onError={(e) => e.target.src = "https://dummyimage.com/400x200/e3e3e3/666666&text=Error+en+URL"} />
                                        <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" style={{borderRadius: "50%", padding: "0px 6px"}} onClick={() => setFormData({...formData, foto: ""})}>×</button>
                                    </div>
                                )}
                            </div>

                            <button type="submit" className={`btn w-100 ${editMode ? 'btn-warning' : 'btn-primary'}`} disabled={uploading}>
                                {editMode ? 'Actualizar' : 'Guardar'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold text-secondary">Platos en el Menú</h5>
                        </div>
                        <div className="list-group list-group-flush">
                            {store.menus?.map((item) => (
                                <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                    <div className="d-flex align-items-center">
                                        <img 
                                            src={item.foto || "https://dummyimage.com/60x60/cccccc/000000.jpg&text=Sin+Foto"} 
                                            alt={item.nombre} 
                                            className="rounded me-3 shadow-sm" 
                                            style={{ width: "60px", height: "60px", objectFit: "cover" }} 
                                        />
                                        <div>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="badge bg-info-subtle text-info">{item.categoria}</span>
                                                <span className="badge bg-secondary-subtle text-secondary small">
                                                    <i className="fas fa-store me-1"></i>
                                                    {getRestauranteNombre(item.restaurante_id)}
                                                </span>
                                            </div>
                                            <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                                            <div className="text-success fw-bold">${item.precio}</div>
                                        </div>
                                    </div>
                                    <div className="btn-group">
                                        <button className="btn btn-outline-secondary btn-sm border-0" onClick={() => handleEditClick(item)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm border-0" onClick={() => handleDelete(item.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};