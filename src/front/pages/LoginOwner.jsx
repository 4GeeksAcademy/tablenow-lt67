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

        let endpoint = role === "owner" ? "/api/login-owner" : 
                       role === "client" ? "/api/login-client" : "/api/login-empleado"; 

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
                dispatch({ type: 'login_owner', payload: { token: data.token, user: data.owner } });
                navigate("/owner-dashboard");
            } else if (role === "client") {
                dispatch({ type: 'login_client', payload: { token: data.token, user: data.client } });
                navigate("/client-dashboard"); 
            } else {
                dispatch({ type: 'login_empleado', payload: { token: data.token, user: data.empleado } });
                navigate("/empleado-dashboard"); 
            }
        } catch (err) {
            setError("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="login-hero-wrapper">
            {/* Overlay para oscurecer la imagen de fondo */}
            <div className="background-overlay"></div>
            
            <div className="login-box-container">
                <div className="login-box">
                    <div className="login-header">
                        <span className="brand-badge-login">TableNow System</span>
                        <h2 className="login-title">Savor the Moment</h2>
                        <p className="login-subtitle">Access your personalized management panel</p>
                    </div>
                    
                    <div className="role-selector">
                        <button 
                            className={`role-btn ${role === 'owner' ? 'active' : ''}`}
                            onClick={() => setRole("owner")}
                        >
                            Owner
                        </button>
                        <button 
                            className={`role-btn ${role === 'client' ? 'active' : ''}`}
                            onClick={() => setRole("client")}
                        >
                            Client
                        </button>
                        <button 
                            className={`role-btn ${role === 'empleado' ? 'active' : ''}`}
                            onClick={() => setRole("empleado")}
                        >
                            Staff
                        </button>
                    </div>

                    {error && <div className="login-error-msg">{error}</div>}

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group-custom">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                placeholder="name@example.com"
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="input-group-custom">
                            <label>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        
                        <button type="submit" className="btn-login-submit">
                            Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            {role === "client" ? (
                                <>New client? <span onClick={() => navigate("/signup-client")}>Create account</span></>
                            ) : role === "owner" ? (
                                <>Want to join? <span onClick={() => navigate("/owners")}>Register Restaurant</span></>
                            ) : (
                                "Restricted access for authorized personnel only."
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300;400;600&display=swap');

                .login-hero-wrapper {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    /* Aquí usamos la imagen de fondo como en tu Home */
                    background-image: url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    overflow: hidden;
                }

                /* Efecto de oscurecimiento similar al Home de la imagen */
                .background-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%);
                    z-index: 1;
                }

                .login-box-container {
                    position: relative;
                    z-index: 2;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    padding: 20px;
                }

                .login-box {
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 50px 40px;
                    border-radius: 20px;
                    width: 100%;
                    max-width: 450px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                    animation: fadeInUp 0.8s ease-out;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .login-header { text-align: center; margin-bottom: 35px; }
                
                .brand-badge-login {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    font-size: 0.65rem;
                    margin-bottom: 12px;
                    display: block;
                    font-weight: 600;
                }

                .login-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.2rem;
                    color: #fff;
                    margin-bottom: 8px;
                }

                .login-subtitle { color: #aaa; font-size: 0.85rem; font-weight: 300; }

                /* Selector de roles */
                .role-selector {
                    display: flex;
                    background: rgba(255,255,255,0.05);
                    padding: 4px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .role-btn {
                    flex: 1;
                    padding: 10px;
                    border: none;
                    background: transparent;
                    color: #888;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    border-radius: 9px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .role-btn.active {
                    background: #c5a47e;
                    color: #fff;
                    box-shadow: 0 4px 15px rgba(197, 164, 126, 0.3);
                }

                /* Formulario */
                .input-group-custom { margin-bottom: 20px; text-align: left; }
                .input-group-custom label {
                    display: block;
                    color: #c5a47e;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    margin-bottom: 10px;
                    font-weight: 600;
                }

                .input-group-custom input {
                    width: 100%;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 14px 18px;
                    border-radius: 12px;
                    color: #fff;
                    outline: none;
                    font-family: 'Montserrat', sans-serif;
                    transition: all 0.3s;
                }

                .input-group-custom input:focus {
                    border-color: #c5a47e;
                    background: rgba(255,255,255,0.07);
                    box-shadow: 0 0 0 4px rgba(197, 164, 126, 0.1);
                }

                .btn-login-submit {
                    width: 100%;
                    padding: 16px;
                    background: #c5a47e;
                    border: none;
                    border-radius: 12px;
                    color: #fff;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.8rem;
                    margin-top: 15px;
                    cursor: pointer;
                    transition: all 0.4s;
                }

                .btn-login-submit:hover {
                    background: #d4b895;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px rgba(197, 164, 126, 0.3);
                }

                .login-footer {
                    text-align: center;
                    margin-top: 35px;
                    font-size: 0.8rem;
                    color: #777;
                }

                .login-footer span {
                    color: #c5a47e;
                    font-weight: 600;
                    cursor: pointer;
                    margin-left: 5px;
                    transition: color 0.3s;
                }

                .login-footer span:hover { color: #fff; text-decoration: underline; }

                @media (max-width: 480px) {
                    .login-box { padding: 40px 25px; }
                    .login-title { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
};