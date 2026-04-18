import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateClient() {
    const { clientId } = useParams()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + clientId)
            .then(response => response.json())
            .then(data => {
                setName(data.name)
                setEmail(data.email)
                setPhone(data.phone)
                setPassword(data.password)
            })
            .catch((error) => console.log(error))
    }, [])

    function sendData(e) {
        e.preventDefault()
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "password": password
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + clientId, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
            })
            .catch((error) => console.error(error));

        navigate("/clients")
    }

    return (
        <div className="update-client-wrapper">
            <div className="background-overlay"></div>

            <div className="form-container-luxury content-relative">
                <div className="form-header text-center">
                    <div className="brand-accent-line mx-auto"></div>
                    <span className="brand-badge-alt">System Update</span>
                    <h1 className="form-title">Edit <span className="text-gold">Client</span> Profile</h1>
                    <p className="text-muted small mt-2">ID Reference: #{clientId.padStart(4, '0')}</p>
                </div>

                <form className="luxury-form" onSubmit={sendData}>
                    <div className="input-group-custom">
                        <label>Name & Surname</label>
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            placeholder="Update full name..."
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Corporate Email</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            placeholder="Update email address..."
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Phone Line</label>
                        <input 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            type="tel" 
                            placeholder="Update contact number..."
                        />
                    </div>

                    <div className="form-actions-vertical mt-4">
                        <button type="submit" className="btn-luxury-submit">
                            Save Changes
                        </button>
                        <button type="button" onClick={() => navigate("/clients")} className="btn-back-minimal">
                            ← Cancel and go back
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .update-client-wrapper {
                    position: relative;
                    min-height: 100vh;
                    width: 100%;
                    background-image: url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069');
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

                .form-container-luxury {
                    background: rgba(18, 18, 18, 0.85);
                    backdrop-filter: blur(15px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    padding: 50px;
                    width: 100%;
                    max-width: 550px;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.8);
                }

                .brand-accent-line {
                    width: 50px;
                    height: 2px;
                    background: #c5a47e;
                    margin-bottom: 20px;
                }

                .brand-badge-alt {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 5px;
                    font-size: 0.7rem;
                    font-weight: 600;
                    display: block;
                }

                .form-title {
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    font-size: 2.5rem;
                }

                .text-gold { color: #c5a47e; font-style: italic; }

                .luxury-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .input-group-custom {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .input-group-custom label {
                    color: #c5a47e;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                }

                .input-group-custom input {
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 15px;
                    color: #fff;
                    font-family: 'Montserrat', sans-serif;
                    transition: all 0.3s ease;
                }

                .input-group-custom input:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.07);
                    border-color: #c5a47e;
                    box-shadow: 0 0 15px rgba(197, 164, 126, 0.1);
                }

                .btn-luxury-submit {
                    background: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 18px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .btn-luxury-submit:hover {
                    background: #fff;
                    transform: translateY(-2px);
                }

                .btn-back-minimal {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: color 0.3s;
                }

                .btn-back-minimal:hover { color: #fff; }

                @media (max-width: 600px) {
                    .form-container-luxury { padding: 30px; }
                }
            `}</style>
        </div>
    );
}

export default UpdateClient;