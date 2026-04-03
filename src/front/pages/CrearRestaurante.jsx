import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CrearRestaurante = () => {
    const { store, actions } = useGlobalReducer();
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (store.tokenOwner) {
            actions.getOwnerRestaurants();
        }
    }, [store.tokenOwner]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!store.tokenOwner) return alert("No hay sesión activa.");

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.tokenOwner}`
            },
            body: JSON.stringify({ nombre: nombre })
        });

        if (response.ok) {
            setNombre(""); 
            actions.getOwnerRestaurants(); 
            alert("¡Restaurante añadido!");
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
                {/* COLUMNA IZQUIERDA: Formulario de Creación */}
                <div className="col-md-4">
                    <div className="card shadow-sm p-4 border-0">
                        <h4 className="fw-bold"><i className="fas fa-plus-circle text-primary me-2"></i>Nuevo Local</h4>
                        <p className="text-muted small">Define el nombre para empezar a operar.</p>
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
                            <button type="submit" className="btn btn-primary w-100 shadow-sm">
                                <i className="fas fa-save me-2"></i>Registrar Local
                            </button>
                        </form>
                    </div>
                </div>

                {/* COLUMNA DERECHA: Lista de Restaurantes */}
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
                                        <th className="ps-4">NOMBRE</th>
                                        <th>ESTADO</th>
                                        <th className="text-end pe-4">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {store.restaurants && store.restaurants.length > 0 ? (
                                        store.restaurants.map((rest) => (
                                            <tr key={rest.id}>
                                                <td className="ps-4 fw-bold text-dark">{rest.name || rest.nombre}</td>
                                                <td>
                                                    <span className="badge bg-success-subtle text-success border border-success-subtle px-2">Activo</span>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="btn-group">
                                                       <button 
                                                            className="btn btn-outline-secondary btn-sm border-0" 
                                                                title="Editar"
                                                                onClick={() => handleEdit(rest.id, rest.name || rest.nombre)}
                                                                >
                                                                <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button 
                                                            className="btn btn-outline-danger btn-sm border-0" 
                                                            onClick={() => handleDelete(rest.id)}
                                                            title="Eliminar"
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