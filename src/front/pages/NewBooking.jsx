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
        <div className="booking-page-container">
            <div className="luxury-overlay"></div>
            
            <div className="container position-relative z-index-2 py-5">
                <div className="booking-card-premium mx-auto shadow-lg">
                    {/* Encabezado con Estilo Elite */}
                    <div className="text-center mb-5">
                        <div className="gold-divider mb-3 mx-auto"></div>
                        <h6 className="text-gold tracking-widest uppercase small fw-bold">Reservation Management</h6>
                        <h2 className="display-5 fw-bold text-white font-serif">New <span className="text-gold">Booking</span></h2>
                    </div>

                    <form onSubmit={handleSubmit} className="booking-form">
                        <div className="row g-4">
                            {/* FECHA Y HORA */}
                            <div className="col-md-6">
                                <label className="label-gold">Arrival Date *</label>
                                <input 
                                    type="date" 
                                    name="fecha" 
                                    className="input-luxury color-scheme-light" 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="label-gold">Service Time *</label>
                                <input 
                                    type="time" 
                                    name="hora" 
                                    className="input-luxury color-scheme-light" 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            {/* RESTAURANTE */}
                            <div className="col-md-12">
                                <label className="label-gold">Establishment *</label>
                                <select 
                                    name="restaurante_id" 
                                    className="select-luxury" 
                                    onChange={handleChange} 
                                    required 
                                    value={formData.restaurante_id}
                                >
                                    <option value="">Select Restaurant...</option>
                                    {store.restaurants?.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                                </select>
                            </div>

                            {/* CLIENTE */}
                            <div className="col-md-8">
                                <label className="label-gold">VIP Client *</label>
                                <select 
                                    name="cliente_id" 
                                    className="select-luxury" 
                                    onChange={handleChange} 
                                    required 
                                    value={formData.cliente_id}
                                >
                                    <option value="">Search Client Registry...</option>
                                    {store.clients?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
                                </select>
                            </div>

                            {/* MESA */}
                            <div className="col-md-4">
                                <label className="label-gold">Table Assignment</label>
                                <input 
                                    type="number" 
                                    name="id_mesa" 
                                    className="input-luxury" 
                                    placeholder="Table ID" 
                                    onChange={handleChange} 
                                />
                            </div>

                            {/* PERSONAS Y ESTADO */}
                            <div className="col-md-4">
                                <label className="label-gold">Guests (PAX) *</label>
                                <input 
                                    type="number" 
                                    name="num_personas" 
                                    className="input-luxury" 
                                    min="1" 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="label-gold">Booking Status</label>
                                <select name="estado" className="select-luxury" onChange={handleChange} value={formData.estado}>
                                    <option value="pendiente">Pending</option>
                                    <option value="confirmada">Confirmed</option>
                                    <option value="cancelada">Cancelled</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="label-gold">Source Origin</label>
                                <select name="origen" className="select-luxury" onChange={handleChange} value={formData.origen}>
                                    <option value="presencial">Direct / Phone</option>
                                    <option value="web">Online Portal</option>
                                    <option value="app">Management App</option>
                                </select>
                            </div>

                            {/* NOTAS */}
                            <div className="col-12">
                                <label className="label-gold">Special Requirements / Concierge Notes</label>
                                <textarea 
                                    name="notas" 
                                    className="input-luxury" 
                                    rows="3" 
                                    placeholder="Allergies, seating preferences, anniversary..." 
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        {/* ACCIONES FINALIZADAS */}
                        <div className="d-flex gap-3 mt-5">
                            <button type="submit" className="btn-gold-submit flex-grow-1">
                                AUTHORIZE RESERVATION
                            </button>
                            <button 
                                type="button" 
                                className="btn-outline-gold px-4" 
                                onClick={() => navigate("/booking")}
                            >
                                DISCARD
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@300;400;600&display=swap');

                .booking-page-container {
                    position: relative;
                    min-height: 100vh;
                    background-image: url('https://images.unsplash.com/photo-1550966841-391ad2ad685e?q=80&w=2070');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    font-family: 'Montserrat', sans-serif;
                }

                .luxury-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.85) 100%);
                    z-index: 1;
                }

                .z-index-2 { z-index: 2; }

                .booking-card-premium {
                    background: rgba(10, 10, 10, 0.8);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    padding: 4rem;
                    max-width: 900px;
                    border-radius: 4px;
                }

                .gold-divider {
                    width: 60px;
                    height: 2px;
                    background: #c5a47e;
                }

                .text-gold { color: #c5a47e !important; }
                .font-serif { font-family: 'Playfair Display', serif; }
                .tracking-widest { letter-spacing: 0.2em; }

                .label-gold {
                    color: #c5a47e;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                }

                /* Inputs y Selects */
                .input-luxury, .select-luxury {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 0;
                    color: #fff;
                    padding: 12px 15px;
                    width: 100%;
                    transition: all 0.3s;
                }

                /* Color scheme light para forzar iconos claros en inputs nativos */
                .color-scheme-light {
                    color-scheme: dark; /* Esto hace que el calendario/reloj de Chrome sea claro sobre fondo oscuro */
                }

                .input-luxury:focus, .select-luxury:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.08);
                    border-color: #c5a47e;
                    box-shadow: 0 0 15px rgba(197, 164, 126, 0.1);
                }

                .select-luxury option {
                    background: #111;
                    color: #fff;
                }

                /* Botones */
                .btn-gold-submit {
                    background: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 15px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    transition: 0.4s;
                }

                .btn-gold-submit:hover {
                    background: #fff;
                    transform: translateY(-2px);
                }

                .btn-outline-gold {
                    background: transparent;
                    border: 1px solid rgba(197, 164, 126, 0.4);
                    color: #c5a47e;
                    text-transform: uppercase;
                    font-weight: 600;
                    letter-spacing: 1px;
                    transition: 0.3s;
                }

                .btn-outline-gold:hover {
                    border-color: #c5a47e;
                    background: rgba(197, 164, 126, 0.1);
                    color: #fff;
                }

                @media (max-width: 768px) {
                    .booking-card-premium { padding: 2rem; }
                }
            `}</style>
        </div>
    );
};