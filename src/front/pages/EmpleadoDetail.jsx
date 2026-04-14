import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const EmpleadoDetail = () => {
    const { id } = useParams(); 
    const [empleado, setEmpleado] = useState(null);

    useEffect(() => {
        const getEmpleadoInfo = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/empleado/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEmpleado(data);
                } else {
                    console.error("No se pudo obtener la información del empleado");
                }
            } catch (error) {
                console.error("Error en el fetch:", error);
            }
        };

        getEmpleadoInfo();
    }, [id]);

    // -- SPINNER ESTILIZADO --
    if (!empleado) {
        return (
            <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ background: '#000' }}>
                <div className="spinner-border" style={{ color: '#c5a47e' }} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 py-5 d-flex align-items-center" style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('https://images.unsplash.com/photo-1550966841-3ee32c3f8702?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
            {/* ESTILOS PERSONALIZADOS */}
            <style>{`
                .gold-text { color: #c5a47e !important; }
                .profile-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    border-radius: 25px;
                    overflow: hidden;
                }
                .profile-header {
                    background: rgba(197, 164, 126, 0.05);
                    border-bottom: 1px solid rgba(197, 164, 126, 0.1);
                    padding: 40px 20px;
                }
                .info-label {
                    color: #c5a47e;
                    font-weight: 600;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                }
                .info-value {
                    font-size: 1.1rem;
                    color: #e0e0e0;
                }
                .btn-gold-pill { 
                    background-color: #c5a47e !important; 
                    color: #000 !important; 
                    font-weight: 700; 
                    border-radius: 50px;
                    padding: 10px 25px;
                    border: none;
                    transition: all 0.3s;
                }
                .btn-gold-pill:hover { transform: translateY(-2px); filter: brightness(1.1); }
                .btn-outline-pill {
                    border-radius: 50px;
                    padding: 10px 25px;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    transition: all 0.3s;
                    text-decoration: none;
                }
                .btn-outline-pill:hover { background: rgba(255,255,255,0.1); color: #fff; }
                .font-playfair { font-family: 'Playfair Display', serif; }
                hr { border-top: 1px solid rgba(197, 164, 126, 0.1); }
            `}</style>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="profile-card shadow-lg">
                            
                            {/* CABECERA DE PERFIL */}
                            <div className="profile-header text-center">
                                <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                     style={{ width: '100px', height: '100px', border: '2px solid #c5a47e', background: 'rgba(0,0,0,0.3)' }}>
                                    <i className="bi bi-person-circle gold-text display-3"></i>
                                </div>
                                <h1 className="font-playfair h2 mb-1">{empleado.full_name}</h1>
                                <span className="badge rounded-pill px-3 py-2" 
                                      style={{ background: 'rgba(197, 164, 126, 0.15)', color: '#c5a47e', letterSpacing: '1px' }}>
                                    {empleado.rol}
                                </span>
                            </div>

                            {/* CUERPO DE DETALLES */}
                            <div className="card-body p-4 p-md-5">
                                
                                {/* EMAIL */}
                                <div className="d-flex align-items-center mb-4">
                                    <div className="me-3 fs-4 gold-text"><i className="bi bi-envelope-at"></i></div>
                                    <div>
                                        <div className="info-label">Email Address</div>
                                        <div className="info-value">{empleado.email}</div>
                                    </div>
                                </div>
                                <hr />

                                {/* PHONE */}
                                <div className="d-flex align-items-center my-4">
                                    <div className="me-3 fs-4 gold-text"><i className="bi bi-telephone"></i></div>
                                    <div>
                                        <div className="info-label">Contact Number</div>
                                        <div className="info-value">{empleado.phone}</div>
                                    </div>
                                </div>
                                <hr />

                                {/* STATUS */}
                                <div className="d-flex align-items-center mt-4">
                                    <div className="me-3 fs-4 gold-text"><i className="bi bi-shield-check"></i></div>
                                    <div>
                                        <div className="info-label">Account Status</div>
                                        <div className={`fw-bold ${empleado.state === 'Active' ? 'text-success' : 'text-warning'}`}>
                                            <i className="bi bi-dot fs-3 align-middle"></i>
                                            {empleado.state || "No State"}
                                        </div>
                                    </div>
                                </div>

                                {/* BOTONES DE ACCIÓN */}
                                <div className="d-flex gap-3 justify-content-center mt-5">
                                    <Link to="/empleado" className="btn-outline-pill">
                                        <i className="bi bi-arrow-left me-2"></i>Back
                                    </Link>
                                    <Link to={`/edit-empleado/${id}`} className="btn-gold-pill text-decoration-none">
                                        <i className="bi bi-pencil-square me-2"></i>Edit Profile
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpleadoDetail;