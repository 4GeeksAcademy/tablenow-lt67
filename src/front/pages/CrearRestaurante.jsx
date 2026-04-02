import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const CrearRestaurante = () => {
    const { store } = useGlobalReducer();
    console.log("CONTENIDO DEL STORE:", store);
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

   const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!store.tokenOwner) {
        alert("No hay sesión activa.");
        return;
    }

        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.tokenOwner}`
            },
            body: JSON.stringify({ 
                nombre: nombre
            })
        });

        if (response.ok) {
            alert("¡Restaurante configurado con éxito!");
            navigate("/owner-dashboard");
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.msg);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: "500px" }}>
                <h2>🏠 Configurar Mi Local</h2>
                <p className="text-muted">Define el nombre de tu restaurante para empezar a operar.</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nombre del Restaurante</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            value={nombre} 
                            onChange={(e) => setNombre(e.target.value)} 
                            placeholder="Ej: Terraza del Sol"
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Guardar Cambios</button>
                </form>
            </div>
        </div>
    );
};