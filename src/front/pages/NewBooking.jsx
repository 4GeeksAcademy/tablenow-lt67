import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const NewBooking = () => {
    const { store, actions } = useGlobalReducer();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fecha: "",
        hora: "",
        num_personas: 1,
        restaurante_id: "",
        cliente_id: "",
        id_mesa: "",
        estado: "pendiente",
        origen: "presencial",
        notas: ""
    });

    useEffect(() => {
        if (!store.restaurants || store.restaurants.length === 0) actions.getOwnerRestaurants();
        if (!store.clients || store.clients.length === 0) actions.getOwnerClients(); 
    }, []);

useEffect(() => {
    if (store.restaurants && store.restaurants.length > 0 && formData.restaurante_id === "") {
        setFormData(prev => ({ ...prev, restaurante_id: store.restaurants[0].id }));
    }
}, [store.restaurants]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.createNewBooking(formData);
        if (success) {
            alert("¡Reserva creada con éxito!");
            navigate("/booking");
        } else {
            alert("Error al guardar la reserva. Revisa los datos.");
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow border-0 p-4">
                <h2 className="fw-bold mb-4 text-primary">
                    <i className="fas fa-plus-circle me-2"></i>Nueva Reserva
                </h2>
                
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        {/* FECHA Y HORA */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold text-secondary">Fecha *</label>
                            <input type="date" name="fecha" className="form-control" onChange={handleChange} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label fw-bold text-secondary">Hora *</label>
                            <input type="time" name="hora" className="form-control" onChange={handleChange} required />
                        </div>

                        {/* RESTAURANTE */}
                        <div className="col-md-12 mb-3">
                            <label className="form-label fw-bold text-secondary">Restaurante *</label>
                            <select name="restaurante_id" className="form-select border-primary-subtle" onChange={handleChange} required value={formData.restaurante_id}>
                                <option value="">Selecciona Restaurante...</option>
                                {store.restaurants?.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                            </select>
                        </div>

                        {/* CLIENTE (SELECTOR DINÁMICO) */}
                        <div className="col-md-8 mb-3">
                            <label className="form-label fw-bold text-secondary">Cliente *</label>
                            <select name="cliente_id" className="form-select" onChange={handleChange} required value={formData.cliente_id}>
                                <option value="">Selecciona un cliente...</option>
                                {store.clients?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                            </select>
                        </div>

                        {/* MESA E ID */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold text-secondary">ID Mesa</label>
                            <input type="number" name="id_mesa" className="form-control" placeholder="Ej: 5" onChange={handleChange} />
                        </div>

                        {/* PERSONAS Y ESTADO */}
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold text-secondary">Personas (PAX) *</label>
                            <input type="number" name="num_personas" className="form-control" min="1" onChange={handleChange} required />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold text-secondary">Estado</label>
                            <select name="estado" className="form-select" onChange={handleChange} value={formData.estado}>
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold text-secondary">Origen</label>
                            <select name="origen" className="form-select" onChange={handleChange} value={formData.origen}>
                                <option value="presencial">Presencial / Teléfono</option>
                                <option value="web">Web</option>
                                <option value="app">App</option>
                            </select>
                        </div>

                        {/* NOTAS */}
                        <div className="col-12 mb-4">
                            <label className="form-label fw-bold text-secondary">Notas / Requerimientos Especiales</label>
                            <textarea name="notas" className="form-control" rows="3" placeholder="Ej: Alérgico a los frutos secos, mesa cerca de la ventana..." onChange={handleChange}></textarea>
                        </div>
                    </div>

                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success flex-grow-1 py-2 fw-bold shadow-sm">
                            Guardar Reserva
                        </button>
                        <button type="button" className="btn btn-light border py-2 px-4" onClick={() => navigate("/booking")}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};