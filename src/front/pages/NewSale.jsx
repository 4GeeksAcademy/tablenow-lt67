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
        <div className="container mt-5">
            <h2 className="mb-4 fw-bold">Register New Sale</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
                <div className="mb-3">
                    <label className="form-label fw-medium">Total Amount</label>
                    <input type="number" step="0.01" name="total" className="form-control" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-medium">Payment Method</label>
                    <select name="payment_method" className="form-select" onChange={handleChange} value={formData.payment_method}>
                        <option value="cash">Cash</option>
                        <option value="credit card">Credit Card</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-medium">Restaurant</label>
                    <select name="restaurant_id" className="form-select" onChange={handleChange} required value={formData.restaurant_id}>
                        <option value="">Select Restaurant</option>
                        {store.restaurants?.map((rest) => (
                            <option key={rest.id} value={rest.id}>{rest.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label fw-medium">Client</label>
                    <select name="cliente_id" className="form-select" onChange={handleChange} required value={formData.cliente_id}>
                        <option value="">Select a Client</option>
                        {store.clients?.map((client) => (
    <option key={client.id} value={client.id}>
        ID: {client.id} - {client.name} ({client.email})
    </option>
))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-sm">
                    Save Sale
                </button>
            </form>
        </div>
    );
};