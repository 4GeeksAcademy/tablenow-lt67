import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Menu = () => {
    const { store, dispatch } = useGlobalReducer();
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        restaurante_id: 1 
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editMode 
            ? `${import.meta.env.VITE_BACKEND_URL}/api/menus/${currentId}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/menus`;
        
        const method = editMode ? "PUT" : "POST";

        try {
            const resp = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (resp.ok) {
                setFormData({ nombre: "", categoria: "", precio: "", restaurante_id: 1 });
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
            restaurante_id: item.restaurante_id
        });
        window.scrollTo(0, 0); 
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este plato?")) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/menus/${id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                dispatch({ type: 'delete_menu_local', payload: id });
            }
        } catch (error) {
            console.error("Error al eliminar", error);
        }
    };

    useEffect(() => {
        getMenus();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4"><i className="fas fa-utensils text-primary me-2"></i>Gestión de Menú</h1>
            
            <div className="row">
                <div className="col-md-4">
                    <div className={`card p-4 shadow-sm border-0 ${editMode ? 'border-start border-warning border-4' : ''}`}>
                        <h5 className="fw-bold mb-3">{editMode ? 'Editar Plato' : 'Nuevo Plato'}</h5>
                        <form onSubmit={handleSubmit}>
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
                            <button type="submit" className={`btn w-100 shadow-sm ${editMode ? 'btn-warning' : 'btn-primary'}`}>
                                <i className={`fas ${editMode ? 'fa-sync' : 'fa-plus'} me-2`}></i>
                                {editMode ? 'Actualizar Plato' : 'Guardar Plato'}
                            </button>
                            {editMode && (
                                <button type="button" className="btn btn-link btn-sm w-100 mt-2 text-muted" onClick={() => {
                                    setEditMode(false);
                                    // 3. CAMBIADO DE 33 A 1 EN EL BOTÓN CANCELAR
                                    setFormData({ nombre: "", categoria: "", precio: "", restaurante_id: 1 });
                                }}>Cancelar</button>
                            )}
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold text-secondary">Platos actuales</h5>
                        </div>
                        <div className="list-group list-group-flush">
                            {store.menus && store.menus.length > 0 ? (
                                store.menus.map((item) => (
                                    <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                        <div>
                                            <span className="badge bg-info-subtle text-info mb-1">{item.categoria}</span>
                                            <h6 className="mb-0 fw-bold">{item.nombre}</h6>
                                            <div className="text-success fw-bold">${item.precio}</div>
                                        </div>
                                        <div className="btn-group">
                                            <button 
                                                className="btn btn-outline-secondary btn-sm border-0" 
                                                onClick={() => handleEditClick(item)}
                                                title="Editar plato"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="btn btn-outline-danger btn-sm border-0" 
                                                onClick={() => handleDelete(item.id)}
                                                title="Eliminar plato"
                                            >
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <p className="text-muted mb-0">No hay platos registrados en el menú.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};