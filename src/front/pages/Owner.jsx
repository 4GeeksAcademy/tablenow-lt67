import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Owner() {
    const navigate = useNavigate();
    const [owner, setOwner] = useState({});
    const { ownerId } = useParams();

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/owner/" + ownerId);
                const data = await response.json();
                setOwner(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchOwner();
    }, [ownerId]);

    return (
        <div className="owner-profile-wrapper">
            {/* Overlay para oscurecer la imagen de fondo */}
            <div className="background-overlay"></div>
            
            <div className="profile-card">
                {/* Decoración superior */}
                <div className="profile-header-accent"></div>
                
                <div className="profile-content">
                    <div className="avatar-section">
                        <div className="avatar-circle">
                            {owner.name ? owner.name.charAt(0).toUpperCase() : "O"}
                        </div>
                        <span className="brand-badge-profile">Executive Partner</span>
                        <h1 className="profile-name">{owner.name || "Loading..."}</h1>
                    </div>

                    <div className="info-grid">
                        <div className="info-item">
                            <label>Email Address</label>
                            <p>{owner.email || "N/A"}</p>
                        </div>
                        <div className="info-item">
                            <label>Phone Number</label>
                            <p>{owner.phone || "N/A"}</p>
                        </div>
                        <div className="info-item">
                            <label>Account Status</label>
                            <p className="status-active">● Verified Owner</p>
                        </div>
                    </div>

                    <div className="profile-actions">
                        <button onClick={() => navigate("/owners")} className="btn-profile-back">
                            ← Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@300;400;600&display=swap');

                .owner-profile-wrapper {
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
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 1;
                }

                .profile-card {
                    position: relative;
                    z-index: 2;
                    background: rgba(17, 17, 17, 0.7);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    border-radius: 30px;
                    width: 100%;
                    max-width: 500px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.6);
                }

                .profile-header-accent {
                    height: 120px;
                    background: linear-gradient(45deg, #c5a47e, #8e7356);
                    width: 100%;
                }

                .profile-content {
                    padding: 0 40px 40px 40px;
                    margin-top: -60px;
                    text-align: center;
                }

                .avatar-section { margin-bottom: 35px; }

                .avatar-circle {
                    width: 120px;
                    height: 120px;
                    background: #111;
                    border: 4px solid #c5a47e;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Playfair Display', serif;
                    font-size: 3rem;
                    color: #c5a47e;
                    margin: 0 auto 20px;
                    box-shadow: 0 15px 30px rgba(0,0,0,0.4);
                }

                .brand-badge-profile {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    font-size: 0.65rem;
                    font-weight: 600;
                    display: block;
                    margin-bottom: 10px;
                }

                .profile-name {
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    font-size: 2.2rem;
                    margin: 0;
                }

                .info-grid {
                    text-align: left;
                    background: rgba(0,0,0,0.4);
                    padding: 25px;
                    border-radius: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                    margin-bottom: 30px;
                }

                .info-item label {
                    display: block;
                    color: #999;
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 5px;
                }

                .info-item p {
                    color: #ddd;
                    font-size: 1rem;
                    margin: 0;
                    font-weight: 400;
                }

                .status-active {
                    color: #c5a47e !important;
                    font-weight: 600 !important;
                    font-size: 0.85rem !important;
                }

                .profile-actions { margin-top: 20px; }

                .btn-profile-back {
                    background: transparent;
                    border: 1px solid rgba(197, 164, 126, 0.4);
                    color: #c5a47e;
                    padding: 12px 25px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                    width: 100%;
                    cursor: pointer;
                }

                .btn-profile-back:hover {
                    background: #c5a47e;
                    color: #000;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(197, 164, 126, 0.2);
                }

                @media (max-width: 480px) {
                    .profile-content { padding: 0 25px 30px 25px; }
                    .profile-name { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
}

export default Owner;