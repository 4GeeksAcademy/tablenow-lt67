import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditEmpleado = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // -- ESTADOS  --
    const [Name, setName] = useState("");
    const [Email, setEmail] = useState(""); 
    const [Phone, setPhone] = useState("");
    const [Rol, setRol] = useState("");
    const [State, setState] = useState("");
    const [Password, setPassword] = useState(""); 

    // -- FETCH DATA (LÓGICA INTACTA) --
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/empleado/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                
                setName(data.full_name || ""); 
                setEmail(data.email || "");    
                setPhone(data.phone || "");
                setRol(data.rol || "");
                setState(data.state || "");
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id]);

    // -- HANDLE SUBMIT  --
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const empleado = { 
            name: Name, 
            email: Email, 
            phone: Phone, 
            rol: Rol, 
            state: State, 
            password: Password 
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/empleado/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(empleado)
            });

            if (response.ok) {
                navigate("/empleado");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error al actualizar");
            }
        } catch (error) {
            console.error("Error updating empleado:", error);
        }
    };

    // -- RENDERIZADO (ESTILOS ELÉGANTES) --
    return (
        <div className="min-vh-100 py-5 d-flex align-items-center" style={{
            // Fondo elegante de bar/restaurante con overlay oscuro
            background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
            {/* ESTILOS CSS INLINE PARA EL FORMULARIO */}
            <style>{`
                .gold-text { color: #c5a47e !important; }
                .edit-card {
                    background: rgba(255, 255, 255, 0.03); /* Efecto Glass */
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(197, 164, 126, 0.2); /* Borde dorado sutil */
                    border-radius: 20px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .form-control-custom {
                    background: rgba(0, 0, 0, 0.2) !important;
                    border: 1px solid rgba(197, 164, 126, 0.2) !important;
                    color: #fff !important;
                    border-radius: 10px;
                    padding: 12px 15px;
                    transition: all 0.3s;
                }
                .form-control-custom:focus {
                    border-color: #c5a47e !important;
                    box-shadow: 0 0 0 0.25rem rgba(197, 164, 126, 0.2);
                    background: rgba(0, 0, 0, 0.4) !important;
                }
                .form-label-gold {
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    color: #c5a47e; /* Texto de etiquetas en dorado */
                    font-size: 0.85rem;
                    text-transform: uppercase;
                }
                .btn-gold-pill { 
                    background-color: #c5a47e !important; 
                    color: #000 !important; 
                    font-weight: 700; 
                    border-radius: 50px;
                    padding: 12px 35px;
                    transition: all 0.3s ease;
                    border: none;
                    font-size: 0.9rem;
                }
                .btn-gold-pill:hover { transform: translateY(-2px); filter: brightness(1.1); }
                .btn-outline-pill {
                    border-radius: 50px;
                    padding: 12px 35px;
                    font-size: 0.9rem;
                }
                .font-playfair { font-family: 'Playfair Display', serif; }
                /* Ajuste para el placeholder de password */
                .form-control-custom::placeholder { color: rgba(255,255,255,0.3); }
            `}</style>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        <div className="edit-card p-5">
                            {/* Cabecera del Formulario */}
                            <div className="text-center mb-5 border-bottom border-secondary pb-4">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '70px', height: '70px', border: '1px solid #c5a47e', background: 'rgba(197, 164, 126, 0.05)' }}>
                                    <i className="bi bi-person-badge gold-text fs-2"></i>
                                </div>
                                <h1 className="display-5 font-playfair mb-1">Edit Employee Profile</h1>
                                <p className="text-secondary small">Update system access and personal details for <span className="gold-text fw-bold">{Name || 'Employee'}</span></p>
                            </div>

                            {/* Formulario  */}
                            <form className="row g-4 needs-validation" noValidate onSubmit={handleSubmit} autoComplete="off">
                                
                                {/* NAME */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Full Name</label>
                                    <input type="text" value={Name} onChange={(e) => setName(e.target.value)} className="form-control form-control-custom" id="name" required />
                                </div> 

                                {/* EMAIL */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Email Address</label>
                                    <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className="form-control form-control-custom" id="email" required />
                                </div>

                                {/* PASSWORD  */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Security (New Password)</label>
                                    <input 
                                        type="password" 
                                        value={Password} 
                                        onChange={(e) => setPassword(e.target.value)} 
                                        className="form-control form-control-custom" 
                                        id="password" 
                                        placeholder="Leave blank to keep current"
                                    />
                                </div>

                                {/* PHONE */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Contact Phone</label>
                                    <input type="text" value={Phone} onChange={(e) => setPhone(e.target.value)} className="form-control form-control-custom" id="phone" required />
                                </div>

                                {/* ROLE */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">System Role</label>
                                    <input type="text" value={Rol} onChange={(e) => setRol(e.target.value)} className="form-control form-control-custom" id="rol" required />
                                </div>

                                {/* STATE */}
                                <div className="col-md-6">
                                    <label className="form-label-gold">Account Status</label>
                                    <input type="text" value={State} onChange={(e) => setState(e.target.value)} className="form-control form-control-custom" id="state" required />
                                </div>

                                {/* Botones de Acción Estilizados */}
                                <div className="col-12 mt-5 text-center d-flex gap-3 justify-content-center">
                                    <Link to="/empleado">
                                        <button type="button" className="btn btn-outline-light btn-outline-pill px-5">
                                            <i className="bi bi-arrow-left me-2"></i>Cancel
                                        </button>
                                    </Link>
                                    <button type="submit" className="btn btn-gold-pill px-5 shadow">
                                        Update Employee
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditEmpleado;