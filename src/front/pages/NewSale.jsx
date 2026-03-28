import React, { useState } from "react";
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!resp.ok) throw new Error("Error al crear la venta");

            const data = await resp.json();

            // Guardamos en el store global usando tu case 'add_sale'
            dispatch({ type: "add_sale", payload: data });

            alert("¡Venta creada con éxito!");
            navigate("/sales"); // Te devuelve al home o donde quieras
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo guardar la venta.");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register New Sale</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label className="form-label">Total Amount</label>
                    <input type="number" step="0.01" name="total" className="form-control" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Payment Method</label>
                    <select name="payment_method" className="form-select" onChange={handleChange}>
                        <option value="cash">Cash</option>
                        <option value="credit card">Credit Card</option>
                        <option value="transfer">Transfer</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Booking ID</label>
                    <input type="number" name="booking_id" className="form-control" onChange={handleChange} required />
                </div>

                <div className="mb-3">
                    <label className="form-label">Restaurant ID</label>
                    <input type="number" name="restaurant_id" className="form-control" onChange={handleChange} required />
                </div>

                <button type="submit" className="btn btn-primary w-100">Save Sale</button>
            </form>
        </div>
    );
};