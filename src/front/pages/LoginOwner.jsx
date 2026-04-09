import React, { useState, useContext } from "react";
import { StoreContext } from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const LoginOwner = () => {
    const { dispatch } = useContext(StoreContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("owner"); 
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        let endpoint = "";
        if (role === "owner") endpoint = "/api/login-owner";
        else if (role === "client") endpoint = "/api/login-client";
        else endpoint = "/api/login-empleado"; 

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
                    payload: { token: data.token, user: data.owner } 
                });
                navigate("/owner-dashboard");
            } else if (role === "client") {
                dispatch({ 
                    type: 'login_client', 
                    payload: { token: data.token, user: data.client } 
                });
                navigate("/client-dashboard"); 
            } else {
                dispatch({ 
                    type: 'login_empleado', 
                    payload: { token: data.token, user: data.empleado } 
                });
                navigate("/empleado-dashboard"); 
            }

        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    const getBtnColor = () => {
        if (role === 'owner') return 'btn-primary';
        if (role === 'client') return 'btn-success';
        return 'btn-warning'; 
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 card shadow p-4 border-0">
                    <h2 className="text-center mb-4 fw-bold">
                        TableNow {role === "owner" ? "(Owner)" : role === "client" ? "(Cliente)" : "(Empleado)"}
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
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${role === 'empleado' ? 'active bg-warning text-dark' : 'text-dark'}`}
                                onClick={() => setRole("empleado")}
                            >
                                Soy Empleado
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
                        <button type="submit" className={`btn btn-lg w-100 fw-bold ${getBtnColor()}`}>
                            Entrar como {role === "owner" ? "Owner" : role === "client" ? "Cliente" : "Empleado"}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <p className="text-muted small">
                            {role === "client" ? (
                                <>¿Eres un cliente nuevo? 
                                    <span 
                                        className="text-primary ms-1 fw-bold" style={{cursor: "pointer"}}
                                        onClick={() => navigate("/signup-client")}
                                    > 
                                        Regístrate aquí
                                    </span>
                                </>
                            ) : (
                                "Acceso restringido para personal autorizado"
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};