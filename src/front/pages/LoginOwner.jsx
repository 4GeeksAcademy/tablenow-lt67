import React, { useState, useContext } from "react";
import { StoreContext } from "../hooks/useGlobalReducer.jsx"; // Importación correcta
import { useNavigate } from "react-router-dom"

export const LoginOwner = () => {
    const { store, dispatch, actions } = useContext(StoreContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login-owner",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!resp.ok) {
                const data = await resp.json();
                setError(data.msg || "Error al iniciar sesión");
                return;
            }

            const data = await resp.json();
            
            dispatch({ type: 'login_owner', payload: data });
            
            navigate("/owner-dashboard");

        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2 className="text-center mb-4">Login Dueño (TableNow)</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input 
                                type="email" 
                                className="form-control" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};