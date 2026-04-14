import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserPlus, FaArrowLeft, FaUndoAlt, FaSuitcase } from "react-icons/fa";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const NewHost = () => {
    const { store, actions } = useGlobalReducer();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [totalVisits, setTotalVisits] = useState(0);
    const [lastVisit, setLastVisit] = useState("");
    const [specialNotes, setSpecialNotes] = useState("");

    useEffect(() => {
        actions.getAllRestaurantsPublic();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const restaurantId = store.restaurants && store.restaurants.length > 0 
            ? store.restaurants[0].id 
            : null;

        if (!restaurantId) {
            alert("Error: No partner restaurant was found. Please wait while the data loads.");
            return;
        }

        const hostData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_number: phone,
            total_visits: parseInt(totalVisits),
            last_visit: lastVisit || null,
            special_notes: specialNotes,
            restaurante_id: restaurantId 
        };

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify(hostData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Host saved successfully");
                handleReset();
            } else {
                // ALERTA ESPECÍFICA PARA CORREO YA REGISTRADO
                if (data.message && data.message.toLowerCase().includes("email")) {
                    alert("This email address is already registered. Please use a different one.");
                } else {
                    alert("Error: " + (data.message || "Internal Server Error"));
                }
            }
        } catch (error) {
            console.error("Error creating host:", error);
            alert("There was a connection problem while trying to create the host.");
        }
    };

    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setTotalVisits(0);
        setLastVisit("");
        setSpecialNotes("");
    };

    return (
        <div className="min-vh-100 py-5 create-host-container">
            <div className="container">
                <div className="mb-4">
                    <Link to="/hosts" className="text-decoration-none">
                        <button className="btn btn-back shadow-none">
                            <FaArrowLeft className="me-2" /> Back to Registry
                        </button>
                    </Link>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="glass-panel shadow-lg p-5">
                            <div className="text-center mb-5">
                                <FaSuitcase className="gold-text display-4 mb-3" />
                                <h1 className="font-playfair display-5 mb-0">New Concierge Host</h1>
                                <p className="gold-text small text-uppercase mb-0" style={{ letterSpacing: '4px' }}>Register staff member</p>
                            </div>

                            <form className="row g-4" onSubmit={handleSubmit}>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold">First Name</label>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control custom-input" placeholder="Enter first name" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Last Name</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control custom-input" placeholder="Enter last name" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Email Address</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control custom-input" placeholder="email@tablenow.com" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Access Password</label>
                                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control custom-input" placeholder="••••••••" required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Phone Number</label>
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control custom-input" placeholder="+1..." required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Initial Visits</label>
                                    <input type="number" value={totalVisits} onChange={(e) => setTotalVisits(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Last Visit</label>
                                    <input type="date" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Special Notes / Observations</label>
                                    <textarea rows="3" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="form-control custom-input" placeholder="Add any specific staff notes here..." required></textarea>
                                </div>
                                
                                <div className="col-12 mt-5">
                                    <div className="d-flex flex-column flex-md-row gap-3">
                                        <button type="submit" className="btn btn-gold flex-grow-1 py-3 shadow-none">
                                            <FaUserPlus className="me-2" /> Create Host Account
                                        </button>
                                        <button type="button" className="btn btn-outline-light rounded-pill px-4 shadow-none" onClick={handleReset}>
                                            <FaUndoAlt className="me-2" /> Reset
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .create-host-container {
                    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color: #fff;
                }
                .font-playfair { font-family: 'Playfair Display', serif; }
                .gold-text { color: #c5a47e !important; }
                .glass-panel {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    border-radius: 30px;
                }
                .custom-input {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #fff !important;
                    border-radius: 12px;
                    padding: 12px 15px;
                }
                .custom-input:focus {
                    background: rgba(255, 255, 255, 0.08) !important;
                    border-color: #c5a47e !important;
                    box-shadow: none !important;
                    outline: none;
                }
                .btn-gold {
                    background: #c5a47e !important;
                    color: #000 !important;
                    font-weight: 700;
                    text-transform: uppercase;
                    border-radius: 50px;
                    border: none !important;
                    transition: 0.3s;
                }
                .btn-gold:hover {
                    background: #e2c29d !important;
                    transform: translateY(-3px);
                }
                
                /* BOTÓN BACK CORREGIDO */
                .btn-back {
                    background: rgba(255, 255, 255, 0.05);
                    color: #fff;
                    border-radius: 50px;
                    padding: 8px 20px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }
                .btn-back:hover, .btn-back:focus, .btn-back:active {
                    background: rgba(197, 164, 126, 0.2) !important;
                    color: #e2c29d !important;
                    border-color: #e2c29d !important;
                    box-shadow: none !important;
                    outline: none !important;
                }
                
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.5;
                }
            `}</style>
        </div>
    );
};

export default NewHost;