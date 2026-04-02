import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CrearHost = () => {
    const { store } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        phone: ""
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const resp = await fetch(process.env.BACKEND_URL + "/api/hosts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (resp.ok) {
            alert("Host registrado con éxito");
            navigate("/owner-dashboard");
        } else {
            alert("Error al registrar el Host. Revisa si el email ya existe.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow-sm p-4">
                <h3 className="text-secondary">🎭 Registrar Nuevo Host</h3>
                <p className="text-muted small">Crea la cuenta para el personal de recepción.</p>
                <form onSubmit={handleSubmit} className="row g-3 mt-2">
                    <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input type="text" className="form-control" placeholder="Nombre" onChange={e => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Apellido</label>
                        <input type="text" className="form-control" placeholder="Apellido" onChange={e => setFormData({...formData, lastname: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email de acceso</label>
                        <input type="email" className="form-control" placeholder="ejemplo@tablenow.com" onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Contraseña Temporal</label>
                        <input type="password" className="form-control" placeholder="********" onChange={e => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div className="col-12 mt-4">
                        <button type="submit" className="btn btn-dark w-100">Finalizar Registro de Host</button>
                    </div>
                </form>
            </div>
        </div>
    );
};