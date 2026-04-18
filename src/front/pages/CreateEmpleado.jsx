import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const CreateEmpleado = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [phone, setPhone] = useState("");
    const [rol, setRol] = useState("");
    const [state, setState] = useState("");
    const [password, setPassword] = useState(""); 

    // -- LÓGICA DE ENVÍO --
    const handleSubmit = (e) => {
        e.preventDefault();
        const empleado = { name, email, phone, rol, state, password };
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ""); 

        fetch(baseUrl + '/api/empleado', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(empleado)
        }).then((response) => {
            if (response.ok) {
                navigate("/empleado");
            } else {
                response.json().then(data => alert(data.message || "Error al crear empleado"));
            }
        }).catch(error => {
            alert("Error de conexión con el servidor");
        });
    }

    // -- LÓGICA DE RESET  --
    const handleReset = (e) => {
        e.preventDefault();
        setName(""); setEmail(""); setPhone(""); setRol(""); setState(""); setPassword(""); 
    }

    return (
        <div className="min-vh-100 py-5 d-flex align-items-center" style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
            {/* ESTILOS CSS PERSONALIZADOS */}
            <style>{`
                .gold-text { color: #c5a47e !important; }
                .create-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                }
                .form-control-custom {
                    background: rgba(0, 0, 0, 0.3) !important;
                    border: 1px solid rgba(197, 164, 126, 0.2) !important;
                    color: #fff !important;
                    border-radius: 12px;
                    padding: 12px 15px;
                    transition: all 0.3s ease;
                }
                .form-control-custom:focus {
                    border-color: #c5a47e !important;
                    box-shadow: 0 0 0 0.25rem rgba(197, 164, 126, 0.15);
                    background: rgba(0, 0, 0, 0.5) !important;
                }
                .form-label-gold {
                    color: #c5a47e;
                    font-weight: 600;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 8px;
                }
                .btn-gold-pill { 
                    background-color: #c5a47e !important; 
                    color: #000 !important; 
                    font-weight: 700; 
                    border-radius: 50px;
                    padding: 12px 30px;
                    border: none;
                    transition: all 0.3s ease;
                }
                .btn-gold-pill:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: 0 5px 15px rgba(197, 164, 126, 0.3); }
                .btn-outline-pill {
                    border-radius: 50px;
                    padding: 12px 25px;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    transition: all 0.3s;
                }
                .btn-outline-pill:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="create-card p-4 p-md-5">
                            {/* Header del Formulario */}
                            <div className="text-center mb-5">
                                <span className="gold-text fw-bold text-uppercase" style={{ letterSpacing: '3px', fontSize: '0.75rem' }}>Administration</span>
                                <h1 className="display-5 font-playfair mt-2 mb-0">New Staff Registry</h1>
                                <div className="mx-auto mt-3" style={{ width: '50px', height: '2px', background: '#c5a47e' }}></div>
                            </div>

                            <form className="row g-4" onSubmit={handleSubmit} autoComplete="off">
                                {/* Inputs invisibles para evitar autofill molesto */}
                                <input style={{ display: "none" }} type="text" name="fake_user" />
                                <input style={{ display: "none" }} type="password" name="fake_pass" />

                                {/* 1. NAME */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Full Name</label>
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            value={name} 
                                            onChange={(e) => setName(e.target.value)} 
                                            className="form-control form-control-custom" 
                                            placeholder="Enter full name"
                                            required 
                                        />
                                    </div>
                                </div>

                                {/* 2. EMAIL */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Access Email</label>
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        className="form-control form-control-custom" 
                                        placeholder="email@tablenow.com"
                                        required 
                                    />
                                </div>

                                {/* 3. PASSWORD */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Temporary Password</label>
                                    <input 
                                        type="password" 
                                        value={password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="form-control form-control-custom" 
                                        placeholder="Set security key"
                                        required 
                                    />
                                </div>

                                {/* 4. PHONE */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Phone Number</label>
                                    <input 
                                        type="text" 
                                        value={phone} 
                                        onChange={(e) => setPhone(e.target.value)} 
                                        className="form-control form-control-custom" 
                                        placeholder="+1 234 567 890"
                                        required 
                                    />
                                </div>

                                {/* 5. ROL */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Position / Role</label>
                                    <input 
                                        type="text" 
                                        value={rol} 
                                        onChange={(e) => setRol(e.target.value)} 
                                        className="form-control form-control-custom" 
                                        placeholder="Ej: Executive Chef" 
                                        required 
                                    />
                                </div>

                                {/* 6. STATE */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Initial State</label>
                                    <input 
                                        type="text" 
                                        value={state} 
                                        onChange={(e) => setState(e.target.value)} 
                                        className="form-control form-control-custom" 
                                        placeholder="Ej: Active" 
                                        required 
                                    />
                                </div>
                                
                                {/* BOTONES DE ACCIÓN */}
                                <div className="col-12 mt-5">
                                    <div className="d-flex flex-wrap justify-content-center gap-3">
                                        <button type="submit" className="btn btn-gold-pill shadow-lg px-5 order-last order-md-first">
                                            <i className="bi bi-check2-circle me-2"></i>Create Member
                                        </button>
                                        
                                        <button type="button" className="btn btn-outline-pill" onClick={handleReset}>
                                            <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
                                        </button>

                                        <button type="button" className="btn btn-link text-white text-decoration-none opacity-50 px-3 hover-opacity-100" onClick={() => navigate("/empleado")}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateEmpleado;