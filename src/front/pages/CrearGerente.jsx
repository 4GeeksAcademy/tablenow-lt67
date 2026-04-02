import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const CrearGerente = () => {
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
        
        const resp = await fetch(process.env.BACKEND_URL + "/api/gerentes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if (resp.ok) {
            alert("Gerente creado con éxito");
            navigate("/owner-dashboard");
        } else {
            alert("Error al crear gerente");
        }
    };

    return (
        <div className="container mt-5">
            <h3>Registrar Nuevo Gerente</h3>
            <form onSubmit={handleSubmit} className="row g-3 mt-3">
                <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Apellido</label>
                    <input type="text" className="form-control" onChange={e => setFormData({...formData, lastname: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label">Contraseña</label>
                    <input type="password" className="form-control" onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <div className="col-md-12">
                    <button type="submit" className="btn btn-primary w-100">Crear Cuenta de Gerente</button>
                </div>
            </form>
        </div>
    );
};