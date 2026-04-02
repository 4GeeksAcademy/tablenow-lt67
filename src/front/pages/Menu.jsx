import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Menu = () => {
    const { store, dispatch } = useGlobalReducer();
    
    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        restaurante_id: 33 
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

    const getBookings = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/booking");
            if (!resp.ok) throw new Error("Error al obtener reservas");
            const data = await resp.json();
            // AQUÍ USAMOS EL TYPE QUE DEFINISTE EN EL REDUCER
            dispatch({ type: "set_bookings", payload: data });
        } catch (error) {
            console.error("Error cargando reservas", error);
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
                setFormData({ nombre: "", categoria: "", precio: "", restaurante_id: 33 });
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
                dispatch({ type: 'delete_menu_local', payload: id });
            }
        } catch (error) {
            console.error("Error al eliminar", error);
        }
    };

    useEffect(() => {
        getMenus();
        getBookings(); 
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">🍽️ Gestión de Menú</h1>
            
            {/* SECCIÓN DE MENÚ (Ya la tenías) */}
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
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Eliminar</button>
                                </div>
                            ))
                        ) : <p className="text-muted">No hay platos.</p>}
                    </div>
                </div>
            </div>

            <hr className="my-5" />

            {/* --- NUEVA SECCIÓN DE RESERVAS --- */}
            <div className="mt-5 pb-5">
                <h3 className="mb-3">📅 Reservas Activas</h3>
                <div className="row">
                    {store.bookings && store.bookings.length > 0 ? (
                        store.bookings.map((reserva) => (
                            <div key={reserva.id} className="col-md-4 mb-3">
                                <div className="card shadow-sm border-start border-primary border-4">
                                    <div className="card-body">
                                        <h5 className="card-title">👤 Cliente #{reserva.cliente_id}</h5>
                                        <p className="card-text mb-0"><strong>Fecha:</strong> {reserva.fecha}</p>
                                        <p className="card-text"><small className="text-muted">Mesa ID: {reserva.mesa_id || "N/A"}</small></p>
                                        <span className="badge bg-success">Confirmada</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-4 bg-light rounded">
                            <p className="text-muted">No hay reservas registradas hoy.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};