import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

function Clients() {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);

    async function getClients() {
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/clients");
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getClients();
        console.log("la pagina cargo");
    }, []);

    function deleteClient(id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                getClients();
            })
            .catch((error) => console.error(error));
    }

    return (
        <div className="clients-page-wrapper">
            <div className="background-overlay"></div>

            <div className="container content-relative py-5">
                {/* Header de la sección */}
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <p className="brand-badge">Elite Network</p>
                        <h1 className="display-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            System <span className="text-gold">Clients</span>
                        </h1>
                    </div>
                    <button 
                        className="btn-luxury-action" 
                        onClick={() => navigate('/new_client')}
                    >
                        + REGISTER CLIENT
                    </button>
                </div>

                {/* Grid de Clientes */}
                <div className="row g-4">
                    {clients.map((client) => (
                        <div className="col-12 col-md-6 col-lg-4" key={client.id}>
                            <div className="client-card-luxury">
                                <div className="card-accent-line"></div>
                                
                                <div className="d-flex align-items-center mb-4">
                                    <div className="client-avatar-placeholder">
                                        {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="client-name-title m-0 ms-3">{client.name}</h3>
                                </div>

                                <div className="client-info-section mb-4">
                                    <div className="info-item">
                                        <span className="info-label">Email</span>
                                        <p className="info-value text-truncate">{client.email}</p>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Phone</span>
                                        <p className="info-value">{client.phone || "Not provided"}</p>
                                    </div>
                                </div>

                                <div className="card-actions-grid">
                                    <button 
                                        className="btn-outline-gold w-100" 
                                        onClick={() => navigate('/edit_client/' + client.id)}
                                    >
                                        EDIT PROFILE
                                    </button>
                                    <Link 
                                        to={"/client/" + client.id} 
                                        className="btn-outline-white w-100 text-center text-decoration-none"
                                    >
                                        VIEW INTEL
                                    </Link>
                                    <button 
                                        className="btn-delete-minimal" 
                                        onClick={() => deleteClient(client.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .clients-page-wrapper {
                    position: relative;
                    min-height: 100vh;
                    background-color: #0a0a0a;
                    background-image: url('https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1974');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    font-family: 'Montserrat', sans-serif;
                }

                .background-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .brand-badge {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    margin-bottom: 0;
                }

                .text-gold { color: #c5a47e; font-style: italic; }

                /* Botón Principal */
                .btn-luxury-action {
                    background-color: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 12px 25px;
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }
                .btn-luxury-action:hover {
                    background-color: #fff;
                    transform: translateY(-2px);
                }

                /* Tarjeta de Cliente */
                .client-card-luxury {
                    background: rgba(25, 25, 25, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    padding: 30px;
                    transition: all 0.4s ease;
                    height: 100%;
                }
                .client-card-luxury:hover {
                    border-color: #c5a47e;
                    transform: translateY(-5px);
                    background: rgba(30, 30, 30, 0.9);
                }

                .card-accent-line {
                    width: 30px;
                    height: 2px;
                    background: #c5a47e;
                    margin-bottom: 20px;
                }

                .client-avatar-placeholder {
                    width: 50px;
                    height: 50px;
                    border: 1px solid #c5a47e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #c5a47e;
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                }

                .client-name-title {
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    font-size: 1.4rem;
                }

                .info-label {
                    display: block;
                    color: #666;
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .info-value {
                    color: #bbb;
                    font-size: 0.9rem;
                    margin-bottom: 15px;
                }

                /* Acciones dentro de la tarjeta */
                .card-actions-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 40px;
                    gap: 10px;
                }

                .btn-outline-gold {
                    background: transparent;
                    border: 1px solid #c5a47e;
                    color: #c5a47e;
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 8px;
                    transition: 0.3s;
                }
                .btn-outline-gold:hover { background: #c5a47e; color: #000; }

                .btn-outline-white {
                    background: transparent;
                    border: 1px solid #444;
                    color: #fff;
                    font-size: 0.7rem;
                    font-weight: 600;
                    padding: 8px;
                    transition: 0.3s;
                }
                .btn-outline-white:hover { border-color: #fff; }

                .btn-delete-minimal {
                    background: #1a1a1a;
                    border: 1px solid #333;
                    color: #666;
                    transition: 0.3s;
                }
                .btn-delete-minimal:hover { background: #800; color: #fff; border-color: #800; }
            `}</style>
        </div>
    );
}

export default Clients;