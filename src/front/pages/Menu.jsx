import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Menu = () => {
    const { store, dispatch } = useGlobalReducer();
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
            dispatch({
                type: "set_menus",
                payload: data
            });
        } catch (error) {
            console.error("Error cargando menús", error);
        }
    };

    const createMenu = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/menus", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (resp.ok) {
                setFormData({ nombre: "", categoria: "", precio: "", restaurante_id: 1 });
                getMenus();
            }
        } catch (error) {
            console.error("Error creando menú", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/menus/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                // Esto quita el plato de la lista automáticamente sin recargar
                dispatch({ type: 'delete_menu_local', payload: id });
            } else {
                alert("No se pudo borrar el plato en el servidor.");
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
            <h1 className="text-center mb-4">🍽️ Gestión de Menú</h1>
            <div className="row">
                <div className="col-md-4">
                    <div className="card p-3 shadow-sm">
                        <h5>Nuevo Plato</h5>
                        <form onSubmit={createMenu}>
                            <input 
                                type="text" className="form-control mb-2" placeholder="Nombre"
                                value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required
                            />
                            <input 
                                type="text" className="form-control mb-2" placeholder="Categoría"
                                value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}
                            />
                            <input 
                                type="number" className="form-control mb-2" placeholder="Precio"
                                value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required
                            />
                            <button type="submit" className="btn btn-success w-100">Guardar Plato</button>
                        </form>
                    </div>
                </div>

                <div className="col-md-8">
                    <h3>Platos actuales</h3>
                    <div className="list-group">
                        {store.menus && store.menus.length > 0 ? (
                            store.menus.map((item) => (
                                <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{item.nombre}</strong> - <small className="text-muted">{item.categoria}</small>
                                        <div className="fw-bold text-primary">${item.precio}</div>
                                    </div>
                                    
                                    {/* BOTÓN AÑADIDO AQUÍ */}
                                    <button 
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-3 text-muted">No hay platos registrados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};