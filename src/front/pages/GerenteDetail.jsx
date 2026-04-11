import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

function GerenteDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [gerente, setGerente] = useState(null)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id)
            .then(res => res.json())
            .then(data => setGerente(data))
    }, [id])

    if (!gerente) return (
        <div className="loader-container">
            <div className="luxury-spinner"></div>
        </div>
    )

    // Función para formatear la fecha de ISO a algo legible
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="detail-page-wrapper">
            <div className="background-overlay"></div>
            
            <div className="detail-card-luxury content-relative">
                <div className="card-accent-gold"></div>
                
                <div className="container mt-2">
                    <div className="profile-header-section text-center">
                        <div className="avatar-circle-lg mx-auto">
                            {gerente.name ? gerente.name.charAt(0).toUpperCase() : "G"}
                        </div>
                        <span className="detail-subtitle">Manager Profile</span>
                        <h2>{gerente.name}</h2>
                    </div>

                    <div className="info-grid-luxury">
                        <div className="info-block">
                            <label>Last Name</label>
                            <p>{gerente.lastname}</p>
                        </div>
                        <div className="info-block">
                            <label>Phone Contact</label>
                            <p>{gerente.phone}</p>
                        </div>
                        <div className="info-block">
                            <label>Email Address</label>
                            <p className="email-text">{gerente.email}</p>
                        </div>
                        <div className="info-block">
                            <label>Registration Date</label>
                            <p>{formatDate(gerente.date)}</p>
                        </div>
                    </div>

                    <div className="detail-footer text-center mt-4">
                        <button onClick={() => navigate("/gerentes")} className="btn-back-luxury">
                            Return to List
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .detail-page-wrapper {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    background-image: url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    font-family: 'Montserrat', sans-serif;
                }

                .background-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .detail-card-luxury {
                    background: rgba(18, 18, 18, 0.85);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    width: 100%;
                    max-width: 550px;
                    padding-bottom: 30px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.8);
                }

                .card-accent-gold { height: 6px; background: #c5a47e; width: 100%; margin-bottom: 20px; }

                .profile-header-section { margin-bottom: 35px; }

                .avatar-circle-lg {
                    width: 90px; height: 90px;
                    background: #111; border: 1px solid #c5a47e;
                    color: #c5a47e; display: flex; align-items: center; justify-content: center;
                    font-family: 'Playfair Display', serif; font-size: 2.5rem; margin-bottom: 20px;
                }

                .detail-subtitle {
                    color: #c5a47e; text-transform: uppercase; letter-spacing: 4px;
                    font-size: 0.7rem; font-weight: 600; display: block; margin-bottom: 10px;
                }

                h2 { font-family: 'Playfair Display', serif; color: #fff; font-size: 2.8rem; margin: 0; }

                .info-grid-luxury {
                    background: rgba(255, 255, 255, 0.03);
                    padding: 30px;
                    margin: 0 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                }

                .info-block { margin-bottom: 20px; border-bottom: 1px solid rgba(197, 164, 126, 0.1); padding-bottom: 10px; }
                .info-block:last-child { margin-bottom: 0; border: none; }

                .info-block label {
                    color: #c5a47e; font-size: 0.65rem; text-transform: uppercase;
                    letter-spacing: 2px; font-weight: 600; display: block; margin-bottom: 5px;
                }

                .info-block p { color: #fff; font-size: 1.1rem; margin: 0; font-weight: 300; }
                .email-text { font-size: 1rem !important; color: rgba(255,255,255,0.8) !important; }

                .btn-back-luxury {
                    background: transparent; border: 1px solid #c5a47e; color: #c5a47e;
                    padding: 12px 40px; text-transform: uppercase; letter-spacing: 2px;
                    font-size: 0.7rem; cursor: pointer; transition: all 0.3s ease;
                }

                .btn-back-luxury:hover { background: #c5a47e; color: #000; }

                .loader-container { min-height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; }
                .luxury-spinner {
                    width: 50px; height: 50px;
                    border: 3px solid rgba(197, 164, 126, 0.1);
                    border-top-color: #c5a47e; border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 600px) {
                    h2 { font-size: 2rem; }
                    .info-grid-luxury { padding: 20px; }
                }
            `}</style>
        </div>
    )
}

export default GerenteDetail;