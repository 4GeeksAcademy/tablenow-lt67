import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Owners() {
    const navigate = useNavigate();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getOwners() {
        setLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/owners");
            const data = await response.json();
            setOwners(data);
        } catch (error) {
            console.log("Error fetching owners:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getOwners();
    }, []);

    function deleteOwner(id) {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este propietario? Esta acción es irreversible.")) return;
        
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/owner/" + id, requestOptions)
            .then(() => getOwners())
            .catch((error) => console.error(error));
    }

    return (
        <div className="owners-management-wrapper">
            {/* Overlay para oscurecer la imagen de fondo, igual que en el login */}
            <div className="background-overlay"></div>
            
            <div className="container py-5 content-relative">
                <header className="management-header d-flex justify-content-between align-items-end mb-5">
                    <div className="header-title-area">
                        <div className="brand-accent-line"></div>
                        <span className="brand-badge-alt">Elite Network</span>
                        <h2 className="management-title">System <span className="text-gold">Owners</span></h2>
                    </div>
                    <button className="btn-luxury-action" onClick={() => navigate('/new_owner')}>
                        <span className="plus-icon">+</span> Register Owner
                    </button>
                </header>

                {loading ? (
                    <div className="loader-container">
                        <div className="luxury-loader"></div>
                    </div>
                ) : (
                    <div className="owners-grid">
                        {owners.map((owner) => (
                            <div key={owner.id} className="owner-card-item">
                                <div className="owner-card-inner">
                                    <div className="owner-card-body">
                                        <div className="avatar-wrapper">
                                            <div className="owner-avatar-lg">
                                                {owner.name ? owner.name.charAt(0) : "O"}
                                            </div>
                                            <div className="status-indicator"></div>
                                        </div>
                                        <div className="owner-info-main">
                                            <h4>{owner.name || "Unnamed Owner"}</h4>
                                            <div className="info-row">
                                                <i className="fas fa-envelope"></i>
                                                <p className="owner-email">{owner.email}</p>
                                            </div>
                                            <div className="info-row">
                                                <i className="fas fa-phone"></i>
                                                <p className="owner-phone">{owner.phone || "No phone provided"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="owner-card-actions">
                                        <button className="action-btn edit" onClick={() => navigate('/edit_owner/' + owner.id)}>
                                            <span>Edit Profile</span>
                                        </button>
                                        <Link to={"/owner/" + owner.id} className="action-btn details">
                                            <span>View Intel</span>
                                        </Link>
                                        <button className="action-btn delete" onClick={() => deleteOwner(owner.id)}>
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .owners-management-wrapper {
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
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 1;
                }

                .content-relative {
                    position: relative;
                    z-index: 2;
                }

                .brand-accent-line {
                    width: 40px;
                    height: 2px;
                    background: #c5a47e;
                    margin-bottom: 15px;
                }

                .brand-badge-alt {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    display: block;
                    margin-bottom: 5px;
                }

                .text-gold { color: #c5a47e; font-style: italic; }

                .management-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    font-weight: 700;
                    letter-spacing: -1px;
                }

                .btn-luxury-action {
                    background: #c5a47e;
                    border: none;
                    color: #000;
                    padding: 14px 30px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 0;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .btn-luxury-action:hover {
                    background: #fff;
                    transform: translateY(-3px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.5);
                }

                /* Cards with Glassmorphism touch */
                .owners-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 30px;
                }

                .owner-card-inner {
                    background: rgba(17, 17, 17, 0.7);
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(197, 164, 126, 0.1);
                    padding: 35px;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                }

                .owner-card-inner:hover {
                    border-color: #c5a47e;
                    background: rgba(20, 20, 20, 0.9);
                    transform: translateY(-10px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
                }

                .owner-avatar-lg {
                    width: 70px;
                    height: 70px;
                    background: rgba(26, 26, 26, 0.8);
                    border: 1px solid #c5a47e;
                    color: #c5a47e;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 2rem;
                    transition: all 0.3s ease;
                }

                .owner-card-inner:hover .owner-avatar-lg {
                    background: #c5a47e;
                    color: #000;
                }

                .status-indicator {
                    width: 12px;
                    height: 12px;
                    background: #c5a47e;
                    border: 2px solid #000;
                    position: absolute;
                    bottom: 5px;
                    left: 65px;
                    border-radius: 50%;
                }

                .owner-info-main h4 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    margin-bottom: 15px;
                    letter-spacing: 0.5px;
                }

                .info-row {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    opacity: 0.7;
                }

                .owner-card-actions {
                    display: grid;
                    grid-template-columns: 1fr 1fr auto;
                    gap: 10px;
                    margin-top: 30px;
                }

                .action-btn {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #fff;
                    font-size: 0.65rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    padding: 10px;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .action-btn.edit:hover { background: #fff; color: #000; border-color: #fff; }
                .action-btn.details:hover { border-color: #c5a47e; color: #c5a47e; }
                .action-btn.delete { color: #666; }
                .action-btn.delete:hover { color: #ff4d4d; border-color: #ff4d4d; }

                .loader-container {
                    display: flex;
                    justify-content: center;
                    padding: 100px 0;
                }

                .luxury-loader {
                    width: 50px;
                    height: 50px;
                    border: 2px solid rgba(197, 164, 126, 0.1);
                    border-top-color: #c5a47e;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 768px) {
                    .management-title { font-size: 2.2rem; }
                    .management-header { flex-direction: column; align-items: flex-start !important; gap: 20px; }
                }
            `}</style>
        </div>
    );
}

export default Owners;