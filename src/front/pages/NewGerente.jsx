import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewGerente() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [lastname, setlastname] = useState('');
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
                "lastname": lastname,
                "email": email,
                "phone": phone,
                "password": password
            })
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                navigate("/gerentes");
            })
            .catch((error) => console.error(error));
    }

    return (
        <div className="new-gerente-wrapper">
            {/* Fondo con overlay oscuro */}
            <div className="background-overlay"></div>

            <div className="form-container-luxury content-relative">
                <div className="form-header">
                    <div className="brand-accent-line mx-auto"></div>
                    <span className="brand-badge-alt">Internal Administration</span>
                    <h1 className="form-title">Register New <span className="text-gold">Manager</span></h1>
                </div>

                <form className="luxury-form" onSubmit={sendData}>
                    <div className="form-row-dual">
                        <div className="input-group-custom">
                            <label>First Name</label>
                            <input 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                type="text" 
                                placeholder="Name"
                                required 
                            />
                        </div>
                        <div className="input-group-custom">
                            <label>Last Name</label>
                            <input 
                                value={lastname} 
                                onChange={(e) => setlastname(e.target.value)} 
                                type="text" 
                                placeholder="Lastname"
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group-custom">
                        <label>Corporate Email</label>
                        <input 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            type="email" 
                            placeholder="manager@system.com"
                            required 
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Contact Phone</label>
                        <input 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            type="tel" 
                            placeholder="+00 000 000 000"
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Access Password</label>
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
                            Confirm Registration
                        </button>
                        <button type="button" onClick={() => navigate("/gerentes")} className="btn-back-minimal">
                            ← Return to Management
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .new-gerente-wrapper {
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
                    background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.96) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .form-container-luxury {
                    background: rgba(15, 15, 15, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    padding: 45px;
                    width: 100%;
                    max-width: 600px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.9);
                }

                .form-header { text-align: center; margin-bottom: 35px; }
                .brand-accent-line { width: 40px; height: 2px; background: #c5a47e; margin-bottom: 20px; }
                .brand-badge-alt { color: #c5a47e; text-transform: uppercase; letter-spacing: 4px; font-size: 0.65rem; font-weight: 600; display: block; margin-bottom: 8px; }
                .form-title { font-family: 'Playfair Display', serif; color: #fff; font-size: 2.2rem; }
                .text-gold { color: #c5a47e; font-style: italic; }

                .luxury-form { display: flex; flex-direction: column; gap: 20px; }
                
                .form-row-dual {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }

                .input-group-custom { display: flex; flex-direction: column; gap: 8px; }
                .input-group-custom label { color: #c5a47e; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
                
                .input-group-custom input {
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    padding: 14px;
                    color: #fff;
                    font-family: 'Montserrat', sans-serif;
                    transition: all 0.3s ease;
                }

                .input-group-custom input:focus {
                    outline: none;
                    border-color: #c5a47e;
                    background: rgba(255, 255, 255, 0.05);
                }

                .form-actions-vertical { margin-top: 25px; display: flex; flex-direction: column; gap: 15px; }

                .btn-luxury-submit {
                    background: #c5a47e; color: #000; border: none; padding: 16px;
                    font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
                    font-size: 0.8rem; cursor: pointer; transition: all 0.3s ease;
                }

                .btn-luxury-submit:hover { background: #fff; transform: translateY(-2px); }

                .btn-back-minimal {
                    background: transparent; border: none; color: #555;
                    font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px;
                    cursor: pointer; transition: color 0.3s ease;
                }

                .btn-back-minimal:hover { color: #fff; }

                @media (max-width: 600px) {
                    .form-row-dual { grid-template-columns: 1fr; }
                    .form-container-luxury { padding: 25px; }
                }
            `}</style>
        </div>
    );
}

export default NewGerente;