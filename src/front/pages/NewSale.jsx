import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const NewSale = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    // Estado local para el formulario
    const [formData, setFormData] = useState({
        total: "",
        payment_method: "cash",
        status: "pending",
        booking_id: "",
        restaurant_id: ""
    });

    // 1. Definimos las cabeceras reutilizables para Codespaces
    const headers = {
        "Content-Type": "application/json",
        "Bypass-Tunnel-Reminder": "true" 
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Traer Restaurantes
                const respRest = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/restaurant`, { headers });
                if (respRest.ok) {
                    const data = await respRest.json();
                    dispatch({ type: "set_restaurants", payload: data });
                }

                // Traer Bookings (Reservaciones)
                const respBook = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/booking`, { headers });
                if (respBook.ok) {
                    const data = await respBook.json();
                    dispatch({ type: "set_bookings", payload: data });
                }
            } catch (error) {
                console.error("Error cargando datos para selectores:", error);
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
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/sales", {
                method: "POST",
                headers: headers, // <--- IMPORTANTE: Usamos los mismos headers aquí
                body: JSON.stringify(formData)
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
                    <select name="payment_method" className="form-select" onChange={handleChange}>
                        <option value="cash">Cash</option>
                        <option value="credit card">Credit Card</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-medium">Restaurant</label>
                    <select 
                        name="restaurant_id" 
                        className="form-select" 
                        onChange={handleChange} 
                        required
                        value={formData.restaurant_id}
                    >
                        <option value="">Select Restaurant</option>
                        {store.restaurants && store.restaurants.map((rest) => (
                            <option key={rest.id} value={rest.id}>
                                {rest.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="form-label fw-medium">Booking (Reservation)</label>
                    <select 
                        name="booking_id" 
                        className="form-select" 
                        onChange={handleChange} 
                        required
                        value={formData.booking_id}
                    >
                        <option value="">Select Booking</option>
                        {store.bookings && store.bookings.map((book) => (
                            <option key={book.id} value={book.id}>
                                Reserva de {book.cliente_nombre}
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