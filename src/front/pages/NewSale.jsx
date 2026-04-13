import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const NewSale = () => {
    const { store, dispatch } = useGlobalReducer(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        total: "",
        payment_method: "cash",
        status: "pending", 
        cliente_id: "", 
        restaurant_id: ""
    });

    const headers = {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true" 
    };

    useEffect(() => {
        const loadInitialData = async () => {
            const endpoints = [
                { name: "restaurants", url: "/api/restaurants", action: "set_restaurants" },
                { name: "clients", url: "/api/clients", action: "set_clients" }
            ];

            for (let endpoint of endpoints) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${endpoint.url}`, { headers });
                    
                    const contentType = response.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        console.error(`ERROR: El endpoint ${endpoint.url} devolvió HTML.`);
                        continue; 
                    }

                    if (response.ok) {
                        const data = await response.json();
                        dispatch({ type: endpoint.action, payload: data });
                    }
                } catch (error) {
                    console.error(`Error cargando ${endpoint.name}:`, error);
                }
            }
        };
        loadInitialData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                total: parseFloat(formData.total),
                payment_method: formData.payment_method,
                status: formData.status,
                cliente_id: formData.cliente_id ? Number(formData.cliente_id) : null,
                restaurante_id: formData.restaurant_id ? Number(formData.restaurant_id) : null
            };

            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/ventas`, {
                method: "POST",
                headers: headers, 
                body: JSON.stringify(dataToSend) 
            });

            if (!resp.ok) throw new Error("Error al crear la venta");

            const data = await resp.json();
            dispatch({ type: "add_sale", payload: data });

            alert("¡Venta creada con éxito!");
            navigate("/sales"); 
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo guardar la venta.");
        }
    };

    return (
        <div className="new-sale-wrapper">
            <div className="background-overlay"></div>

            <div className="container content-relative py-5">
                <div className="form-container-luxury mx-auto">
                    <div className="form-header text-center">
                        <div className="brand-accent-line mx-auto"></div>
                        <p className="brand-badge-alt">Financial Operations</p>
                        <h2 className="form-title">New <span className="text-gold">Receipt</span></h2>
                    </div>

                    <form onSubmit={handleSubmit} className="luxury-form-body">
                        {/* Amount Field */}
                        <div className="input-group-custom">
                            <label>Total Amount ($)</label>
                            <input 
                                type="number" 
                                step="0.01" 
                                name="total" 
                                placeholder="0.00" 
                                onChange={handleChange} 
                                required 
                            />
                        </div>

                        <div className="row g-3">
                            {/* Payment Method */}
                            <div className="col-md-6">
                                <div className="input-group-custom">
                                    <label>Payment Method</label>
                                    <select name="payment_method" onChange={handleChange} value={formData.payment_method}>
                                        <option value="cash">Cash</option>
                                        <option value="credit card">Credit Card</option>
                                        <option value="transfer">Transfer</option>
                                    </select>
                                </div>
                            </div>

                            {/* Restaurant Select */}
                            <div className="col-md-6">
                                <div className="input-group-custom">
                                    <label>Restaurant Location</label>
                                    <select name="restaurant_id" onChange={handleChange} required value={formData.restaurant_id}>
                                        <option value="">Select Location</option>
                                        {store.restaurants?.map((rest) => (
                                            <option key={rest.id} value={rest.id}>{rest.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Client Select */}
                        <div className="input-group-custom">
                            <label>Client Reference</label>
                            <select name="cliente_id" onChange={handleChange} required value={formData.cliente_id}>
                                <option value="">Identify Client</option>
                                {store.clients?.map((client) => (
                                    <option key={client.id} value={client.id}>
                                        {client.name} — {client.email}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mt-4 pt-3 border-top border-dark">
                            <button type="submit" className="btn-luxury-submit w-100">
                                AUTHORIZE & SAVE SALE
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate("/sales")} 
                                className="btn-back-minimal w-100 mt-3"
                            >
                                ← CANCEL TRANSACTION
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600;700&display=swap');

                .new-sale-wrapper {
                    position: relative;
                    min-height: 100vh;
                    background-image: url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1974');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    font-family: 'Montserrat', sans-serif;
                }

                .background-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.98) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .form-container-luxury {
                    background: rgba(10, 10, 10, 0.85);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    padding: 50px;
                    max-width: 600px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.8);
                }

                .brand-accent-line {
                    width: 40px;
                    height: 2px;
                    background: #c5a47e;
                    margin-bottom: 20px;
                }

                .brand-badge-alt {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 5px;
                    font-size: 0.7rem;
                    font-weight: 700;
                }

                .form-title {
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    font-size: 2.8rem;
                    margin-bottom: 35px;
                }

                .text-gold { color: #c5a47e; font-style: italic; }

                .input-group-custom {
                    margin-bottom: 20px;
                    display: flex;
                    flex-direction: column;
                }

                .input-group-custom label {
                    color: #c5a47e;
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 8px;
                    font-weight: 600;
                }

                .input-group-custom input, 
                .input-group-custom select {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    color: #fff;
                    transition: all 0.3s ease;
                }

                /* Estilo especial para el select (flecha dorada) */
                .input-group-custom select {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23c5a47e' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 15px center;
                }

                .input-group-custom input:focus, 
                .input-group-custom select:focus {
                    outline: none;
                    border-color: #c5a47e;
                    background: rgba(255, 255, 255, 0.08);
                }

                .btn-luxury-submit {
                    background: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 18px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.85rem;
                    transition: all 0.4s;
                }

                .btn-luxury-submit:hover {
                    background: #fff;
                    transform: scale(1.02);
                }

                .btn-back-minimal {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #666;
                    padding: 12px;
                    font-size: 0.75rem;
                    letter-spacing: 1px;
                    transition: 0.3s;
                }

                .btn-back-minimal:hover {
                    color: #fff;
                    border-color: #fff;
                }

                option { background: #111; color: #fff; }
            `}</style>
        </div>
    );
};