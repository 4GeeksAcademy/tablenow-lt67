import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EmpleadoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();

            localStorage.setItem("token", "usuario_logeado");
            navigate("/empleado");
        } else {
            alert("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="container mt-5">
            
        </div>
    );
}

export default EmpleadoDetail;