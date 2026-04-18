import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStickyNote, FaArrowLeft, FaIdCard } from 'react-icons/fa';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const HostDetail = () => {
    const { id } = useParams();
    const [hostData, setHostData] = useState({});
    const { store } = useGlobalReducer();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.tokenOwner}`
                    }
                });
                const data = await response.json();
                setHostData(data);
            } catch (error) {
                console.log("Error fetching host data:", error);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="min-vh-100 py-5 detail-host-container">
            <div className="container">
                <div className="mb-4">
                    <Link to="/hosts" className="text-decoration-none">
                        <button className="btn btn-back shadow-none">
                            <FaArrowLeft className="me-2" /> Back to Registry
                        </button>
                    </Link>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <div className="glass-panel shadow-lg p-0 overflow-hidden">
                            {/* Header del Panel */}
                            <div className="panel-header-gold p-4 text-center">
                                <FaIdCard className="display-4 mb-2 text-dark" />
                                <h1 className="font-playfair mb-0 text-dark fw-bold">Host Profile</h1>
                                <p className="text-dark small text-uppercase mb-0 fw-semibold" style={{ letterSpacing: '2px' }}>Staff Information</p>
                            </div>

                            {/* Contenido */}
                            <div className="p-5">
                                <div className="detail-item mb-4">
                                    <label className="gold-text small text-uppercase fw-bold d-block mb-1">Full Name</label>
                                    <div className="d-flex align-items-center info-box">
                                        <FaUser className="me-3 gold-text" />
                                        <span className="fs-4 fw-light">{hostData.first_name} {hostData.last_name}</span>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-7 mb-4">
                                        <label className="gold-text small text-uppercase fw-bold d-block mb-1">Email Address</label>
                                        <div className="d-flex align-items-center info-box">
                                            <FaEnvelope className="me-3 gold-text" />
                                            <span>{hostData.email}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-5 mb-4">
                                        <label className="gold-text small text-uppercase fw-bold d-block mb-1">Phone</label>
                                        <div className="d-flex align-items-center info-box">
                                            <FaPhone className="me-3 gold-text" />
                                            <span>{hostData.phone_number}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="gold-text small text-uppercase fw-bold d-block mb-1">Total Visits Managed</label>
                                        <div className="d-flex align-items-center info-box">
                                            <FaCalendarAlt className="me-3 gold-text" />
                                            <span className="fs-5">{hostData.total_visits}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-4">
                                        <label className="gold-text small text-uppercase fw-bold d-block mb-1">Last Activity</label>
                                        <div className="d-flex align-items-center info-box">
                                            <FaCalendarAlt className="me-3 gold-text" />
                                            <span>{hostData.last_visit || "No recorded date"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 mt-2">
                                    <label className="gold-text small text-uppercase fw-bold d-block mb-1">Special Notes</label>
                                    <div className="info-box-large p-3">
                                        <FaStickyNote className="gold-text me-2" />
                                        <p className="mb-0 text-white-50 mt-2">{hostData.special_notes || "No additional notes provided for this host."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .detail-host-container {
                    background: linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color: #fff;
                }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .gold-text { color: #c5a47e !important; }
                
                .glass-panel {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(197, 164, 126, 0.3);
                    border-radius: 40px;
                }

                .panel-header-gold {
                    background: #c5a47e;
                }

                .info-box {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 12px 20px;
                    border-radius: 15px;
                    border-left: 3px solid #c5a47e;
                }

                .info-box-large {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    border: 1px dashed rgba(197, 164, 126, 0.4);
                }

                .btn-back {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                    border-radius: 50px;
                    padding: 10px 25px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }

                /* PREVENIR EL AZUL Y USAR DORADO */
                .btn-back:hover, .btn-back:focus, .btn-back:active {
                    background: rgba(197, 164, 126, 0.2) !important;
                    color: #e2c29d !important;
                    border-color: #e2c29d !important;
                    box-shadow: none !important;
                    outline: none !important;
                }
            `}</style>
        </div>
    );
};

export default HostDetail;