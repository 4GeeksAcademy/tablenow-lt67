import React, { useState, useContext } from "react";
import { StoreContext } from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const LoginOwner = () => {
    const { dispatch } = useContext(StoreContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("owner"); // "owner" o "client"
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const endpoint = role === "owner" ? "/api/login-owner" : "/api/login-client";

        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!resp.ok) {
                const data = await resp.json();
                setError(data.msg || "Credenciales incorrectas");
                return;
            }

            const data = await resp.json();
            
            if (role === "owner") {
                dispatch({ 
                    type: 'login_owner', 
                    payload: {
                        token: data.token,
                        user: data.owner // Mapeo para el storeReducer
                    } 
                });
                navigate("/owner-dashboard");
            } else {
                dispatch({ 
                    type: 'login_client', 
                    payload: {
                        token: data.token,
                        user: data.client // Mapeo para el storeReducer
                    } 
                });
                navigate("/client-dashboard"); 
            }

        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5 card shadow p-4 border-0">
                    {/* Título dinámico */}
                    <h2 className="text-center mb-4 fw-bold">
                        TableNow {role === "owner" ? "(Owner)" : "(Cliente)"}
                    </h2>
                    
                    <div className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${role === 'owner' ? 'active bg-primary' : 'text-dark'}`}
                                onClick={() => setRole("owner")}
                            >
                                Soy Owner
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${role === 'client' ? 'active bg-success' : 'text-dark'}`}
                                onClick={() => setRole("client")}
                            >
                                Soy Cliente
                            </button>
                        </li>
                    </div>

                    {error && <div className="alert alert-danger text-center py-2">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">Email</label>
                            <input 
                                type="email" className="form-control form-control-lg" 
                                value={email} onChange={(e) => setEmail(e.target.value)} required 
                            />
                        </div>
                        <div className="mb-4">
                            <label className="form-label small fw-bold">Contraseña</label>
                            <input 
                                type="password" className="form-control form-control-lg" 
                                value={password} onChange={(e) => setPassword(e.target.value)} required 
                            />
                        </div>
                        <button type="submit" className={`btn btn-lg w-100 fw-bold ${role === 'owner' ? 'btn-primary' : 'btn-success'}`}>
                            Entrar como {role === "owner" ? "Owner" : "Cliente"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small">¿Eres un cliente nuevo? 
                            <span 
                                className="text-primary ms-1 fw-bold" style={{cursor: "pointer"}}
                                onClick={() => navigate("/signup-client")}
                            > 
                                Regístrate aquí
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};