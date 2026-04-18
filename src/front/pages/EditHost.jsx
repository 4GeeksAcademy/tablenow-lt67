import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaUserEdit, FaArrowLeft, FaSave, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaStickyNote } from 'react-icons/fa';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

function EditHost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store } = useGlobalReducer();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [totalVisits, setTotalVisits] = useState(0);
    const [lastVisit, setLastVisit] = useState("");
    const [specialNotes, setSpecialNotes] = useState("");

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
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
                setPassword(data.password);
                setPhone(data.phone_number);
                setTotalVisits(data.total_visits);
                setLastVisit(data.last_visit);
                setSpecialNotes(data.special_notes);
            } catch (error) {
                console.log("Error fetching host data:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hostData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone_number: phone,
            total_visits: totalVisits,
            last_visit: lastVisit,
            special_notes: specialNotes
        };
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify(hostData)
            });
            if (response.ok) {
                navigate("/hosts");
            }
        } catch (error) {
            console.error("Error updating host:", error);
        }
    };

    return (
        <div className="min-vh-100 py-5 edit-host-container">
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
                                <FaUserEdit className="gold-text display-4 mb-3" />
                                <h1 className="font-playfair display-5 mb-0">Edit Concierge Host</h1>
                                <p className="gold-text small text-uppercase mb-0" style={{ letterSpacing: '4px' }}>Modify Staff Member Details</p>
                            </div>

                            <form className="row g-4" onSubmit={handleSubmit}>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold"><FaUser className="me-2"/>First Name</label>
                                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Last Name</label>
                                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold"><FaEnvelope className="me-2"/>Email</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label gold-text small text-uppercase fw-bold"><FaPhone className="me-2"/>Phone Number</label>
                                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label gold-text small text-uppercase fw-bold"><FaCalendarAlt className="me-2"/>Total Visits</label>
                                    <input type="number" value={totalVisits} onChange={(e) => setTotalVisits(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-md-8">
                                    <label className="form-label gold-text small text-uppercase fw-bold">Last Visit Date</label>
                                    <input type="date" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} className="form-control custom-input" required />
                                </div>
                                <div className="col-12">
                                    <label className="form-label gold-text small text-uppercase fw-bold"><FaStickyNote className="me-2"/>Special Notes / Observations</label>
                                    <textarea rows="3" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="form-control custom-input" required></textarea>
                                </div>

                                <div className="col-12 mt-5">
                                    <button type="submit" className="btn btn-gold w-100 py-3 shadow-none">
                                        <FaSave className="me-2" /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .edit-host-container {
                    background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop');
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
}

export default EditHost;