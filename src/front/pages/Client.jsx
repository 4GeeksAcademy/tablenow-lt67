import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Client() {
    const navigate = useNavigate();
    const [client, setClient] = useState({});
    const { clientId } = useParams();

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + clientId);
                const data = await response.json();
                setClient(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchClient();
    }, [clientId]);

    return (
        <div className="client-details-wrapper">
            <div className="background-overlay"></div>

            <div className="container content-relative d-flex justify-content-center align-items-center min-vh-100">
                <div className="details-card-luxury">
                    {/* Decoración superior */}
                    <div className="text-center mb-5">
                        <div className="brand-accent-line mx-auto"></div>
                        <p className="brand-badge">Client Intelligence</p>
                        <h1 className="client-display-name">
                            {client.name ? client.name.split(' ')[0] : 'Loading'} 
                            <span className="text-gold"> {client.name ? client.name.split(' ').slice(1).join(' ') : ''}</span>
                        </h1>
                    </div>

                    {/* Ficha de Información */}
                    <div className="info-grid-luxury">
                        <div className="info-box">
                            <label>Full Legal Name</label>
                            <p>{client.name || "---"}</p>
                        </div>
                        <div className="info-box">
                            <label>Digital Correspondence</label>
                            <p className="text-lowercase">{client.email || "---"}</p>
                        </div>
                        <div className="info-box">
                            <label>Contact Line</label>
                            <p>{client.phone || "No registered phone"}</p>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-5 pt-4 border-top border-secondary d-flex justify-content-between align-items-center">
                        <button 
                            onClick={() => navigate("/clients")} 
                            className="btn-back-minimal"
                        >
                            ← Return to Directory
                        </button>
                        
                        <button 
                            onClick={() => navigate('/edit_client/' + clientId)}
                            className="btn-luxury-action"
                        >
                            EDIT PROFILE
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .client-details-wrapper {
                    position: relative;
                    min-height: 100vh;
                    background-color: #000;
                    background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069');
                    background-size: cover;
                    background-position: center;
                    font-family: 'Montserrat', sans-serif;
                }

                .background-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.98) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .details-card-luxury {
                    background: rgba(15, 15, 15, 0.85);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(197, 164, 126, 0.3);
                    padding: 60px;
                    width: 100%;
                    max-width: 700px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.9);
                }

                .brand-accent-line {
                    width: 60px;
                    height: 2px;
                    background: #c5a47e;
                    margin-bottom: 25px;
                }

                .brand-badge {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 6px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .client-display-name {
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    font-size: 3rem;
                    margin-top: 10px;
                }

                .text-gold { color: #c5a47e; font-style: italic; }

                /* Grid de Información */
                .info-grid-luxury {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-top: 40px;
                }

                .info-box label {
                    display: block;
                    color: #c5a47e;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-bottom: 8px;
                }

                .info-box p {
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 200;
                    margin: 0;
                    border-left: 1px solid #333;
                    padding-left: 15px;
                }

                /* Botones */
                .btn-luxury-action {
                    background-color: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 12px 35px;
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 2px;
                    transition: all 0.3s ease;
                }

                .btn-luxury-action:hover {
                    background-color: #fff;
                    transform: scale(1.05);
                }

                .btn-back-minimal {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: 0.3s;
                }

                .btn-back-minimal:hover { color: #fff; }

                @media (max-width: 768px) {
                    .info-grid-luxury { grid-template-columns: 1fr; }
                    .details-card-luxury { padding: 30px; }
                    .client-display-name { font-size: 2rem; }
                }
            `}</style>
        </div>
    );
}

export default Client;