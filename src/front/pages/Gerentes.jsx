import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Gerentes = () => {
    const [gerentes, setGerentes] = useState([]);
    const navigate = useNavigate()

    // GET
    const getGerentes = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes")
            .then(res => res.json())
            .then(data => setGerentes(data));
    };

    useEffect(() => {
        getGerentes();
    }, []);
    console.log(gerentes)

    // DELETE
    const deleteGerente = (id) => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id, {
            method: "DELETE"
        })
            .then(() => getGerentes());
    };

    // FUNCIÓN PARA FORMATEAR LA FECHA
    const formatDate = (dateString) => {
        if (!dateString) return "Sin fecha";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };


    return (
        <div className="gerentes-management-wrapper">
            {/* Fondo con overlay oscuro coherente con los demás componentes */}
            <div className="background-overlay"></div>
            
            <div className="container py-5 content-relative">
                <header className="management-header d-flex justify-content-between align-items-end mb-5">
                    <div className="header-title-area">
                        <div className="brand-accent-line"></div>
                        <span className="brand-badge-alt">Management Team</span>
                        <h2 className="management-title">System <span className="text-gold">Managers</span></h2>
                    </div>
                    <button className="btn-luxury-action" onClick={() => navigate("/new_gerente")}>
                        <span className="plus-icon">+</span> Crear gerente
                    </button>
                </header>

                <div className="gerentes-grid">
                    {gerentes.map(gerente => (
                        <div key={gerente.id} className="manager-card-item">
                            <div className="manager-card-inner">
                                <div className="manager-card-body">
                                    <div className="avatar-wrapper">
                                        <div className="manager-avatar-lg">
                                            {gerente.name ? gerente.name.charAt(0) : "G"}
                                        </div>
                                    </div>
                                    <div className="manager-info-main">
                                        <h4>{gerente.name} {gerente.lastname}</h4>
                                        <div className="info-row">
                                            <i className="fas fa-phone"></i>
                                            <p>{gerente.phone}</p>
                                        </div>
                                        <div className="info-row">
                                            <i className="fas fa-envelope"></i>
                                            <p className="manager-email">{gerente.email}</p>
                                        </div>
                                        <div className="info-row">
                                            <i className="fas fa-calendar"></i>
                                            {/* CAMBIO AQUÍ: Ahora usa formatDate */}
                                            <p>{formatDate(gerente.date)}</p>
                                        </div>
                                        <div className="info-row">
                                            <i className="fas fa-lock"></i>
                                            <p className="manager-pass">PWD: {gerente.password}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="manager-card-actions">
                                    <button 
                                        className="action-btn edit" 
                                        onClick={() => navigate(`/edit_gerente/${gerente.id}`)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        className="action-btn details" 
                                        onClick={() => navigate(`/gerente/${gerente.id}`)}
                                    >
                                        See Details
                                    </button>
                                    <button 
                                        className="action-btn delete" 
                                        onClick={() => deleteGerente(gerente.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .gerentes-management-wrapper {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    background-image: url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color: #fff;
                    font-family: 'Montserrat', sans-serif;
                    overflow-x: hidden;
                }

                .background-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.98) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .brand-accent-line { width: 40px; height: 2px; background: #c5a47e; margin-bottom: 15px; }
                .brand-badge-alt { color: #c5a47e; text-transform: uppercase; letter-spacing: 4px; font-size: 0.7rem; font-weight: 600; display: block; }
                .management-title { font-family: 'Playfair Display', serif; font-size: 3rem; font-weight: 700; margin: 0; }
                .text-gold { color: #c5a47e; font-style: italic; }

                .btn-luxury-action {
                    background: #c5a47e; border: none; color: #000; padding: 14px 30px;
                    text-transform: uppercase; letter-spacing: 2px; font-size: 0.75rem; font-weight: 700;
                    transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; cursor: pointer;
                }

                .btn-luxury-action:hover { background: #fff; transform: translateY(-3px); }

                .gerentes-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                }

                .manager-card-inner {
                    background: rgba(17, 17, 17, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(197, 164, 126, 0.1);
                    padding: 30px;
                    transition: all 0.4s ease;
                }

                .manager-card-inner:hover {
                    border-color: #c5a47e;
                    transform: translateY(-10px);
                    background: rgba(20, 20, 20, 0.9);
                }

                .manager-avatar-lg {
                    width: 60px; height: 60px;
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid #c5a47e;
                    color: #c5a47e;
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Playfair Display', serif; font-size: 1.8rem;
                    margin-bottom: 20px;
                }

                .manager-info-main h4 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 15px; }
                
                .info-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; opacity: 0.7; font-size: 0.85rem; }
                .manager-email { font-size: 0.8rem; word-break: break-all; }
                .manager-pass { color: #888; font-family: monospace; }

                .manager-card-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr auto;
                    gap: 10px;
                    margin-top: 25px;
                }

                .action-btn {
                    background: transparent; border: 1px solid rgba(255,255,255,0.1);
                    color: #fff; font-size: 0.65rem; text-transform: uppercase;
                    padding: 8px; cursor: pointer; transition: all 0.3s ease;
                    display: flex; align-items: center; justify-content: center;
                }

                .action-btn.edit:hover { background: #fff; color: #000; border-color: #fff; }
                .action-btn.details:hover { border-color: #c5a47e; color: #c5a47e; }
                .action-btn.delete { color: #666; }
                .action-btn.delete:hover { color: #ff4d4d; border-color: #ff4d4d; }

                @media (max-width: 768px) {
                    .management-title { font-size: 2.2rem; }
                    .management-header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
                }
            `}</style>
        </div>
    )
};