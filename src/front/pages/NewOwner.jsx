import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewOwner() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    function sendData(e) {
        e.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "name": name,
                "email": email,
                "phone": phone,
                "password": password
            })
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/owners", requestOptions)
            .then((response) => {
                if (response.ok) {
                    alert("Account created successfully! Please log in.");
                    navigate("/login-owner");
                } else {
                    alert("Error creating account");
                }
            })
            .catch((error) => console.error(error));
    }

    return (
        <div className="new-owner-wrapper">
            
            <div className="background-overlay"></div>

            <div className="form-container-luxury content-relative">
                <div className="form-header">
                    <div className="brand-accent-line mx-auto"></div>
                    <span className="brand-badge-alt">Join the Network</span>
                    <h1 className="form-title">Create <span className="text-gold">Owner</span> Account</h1>
                </div>

                <form className="luxury-form" onSubmit={sendData}>
                    <div className="input-group-custom">
                        <label>Full Name</label>
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            type="text" 
                            placeholder="e.g. Alexander Pierce"
                            required 
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Email Address</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            placeholder="name@luxury-estate.com"
                            required 
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Phone Number</label>
                        <input 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            type="tel" 
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Security Password</label>
                        <input 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            type="password" 
                            placeholder="••••••••"
                            required 
                        />
                    </div>

                    <div className="form-actions-vertical">
                        <button type="submit" className="btn-luxury-submit">
                            Register Account
                        </button>
                        <button type="button" onClick={() => navigate("/owners")} className="btn-back-minimal">
                            ← Cancel and return
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .new-owner-wrapper {
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
                    background: radial-gradient(circle at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 1;
                }

                .content-relative {
                    position: relative;
                    z-index: 2;
                }

                .form-container-luxury {
                    background: rgba(17, 17, 17, 0.8);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    padding: 50px;
                    width: 100%;
                    max-width: 550px;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.8);
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 40px;
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
                    margin-bottom: 10px;
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
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .input-group-custom input:focus {
                    outline: none;
                    background: rgba(255, 255, 255, 0.07);
                    border-color: #c5a47e;
                    box-shadow: 0 0 15px rgba(197, 164, 126, 0.1);
                }

                .form-actions-vertical {
                    margin-top: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .btn-luxury-submit {
                    background: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 18px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-luxury-submit:hover {
                    background: #fff;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.4);
                }

                .btn-back-minimal {
                    background: transparent;
                    border: none;
                    color: #666;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    cursor: pointer;
                    transition: color 0.3s ease;
                }

                .btn-back-minimal:hover {
                    color: #fff;
                }

                @media (max-width: 600px) {
                    .form-container-luxury { padding: 30px; }
                    .form-title { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    );
}

export default NewOwner;