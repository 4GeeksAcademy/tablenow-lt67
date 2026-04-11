import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function EditGerente() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        phone: "",
        email: ""
    })

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id)
            .then(res => res.json())
            .then(data => setForm(data))
    }, [id])

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
        .then(() => navigate("/gerentes"))
    }

    return (
        <div className="edit-gerente-wrapper">
            {/* Fondo con overlay oscuro coherente */}
            <div className="background-overlay"></div>

            <div className="form-container-luxury content-relative">
                <div className="form-header">
                    <div className="brand-accent-line mx-auto"></div>
                    <span className="brand-badge-alt">System Update</span>
                    <h1 className="form-title">Edit <span className="text-gold">Manager</span></h1>
                </div>

                <form className="luxury-form" onSubmit={handleSubmit}>
                    <div className="input-group-custom">
                        <label>First Name</label>
                        <input 
                            value={form.name} 
                            onChange={e => setForm({...form, name: e.target.value})} 
                            placeholder="Manager Name"
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Last Name</label>
                        <input 
                            value={form.lastname} 
                            onChange={e => setForm({...form, lastname: e.target.value})} 
                            placeholder="Manager Lastname"
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Phone Contact</label>
                        <input 
                            value={form.phone} 
                            onChange={e => setForm({...form, phone: e.target.value})} 
                            placeholder="Contact Number"
                        />
                    </div>

                    <div className="input-group-custom">
                        <label>Email Address</label>
                        <input 
                            value={form.email} 
                            onChange={e => setForm({...form, email: e.target.value})} 
                            placeholder="Manager Email"
                        />
                    </div>

                    <div className="form-actions-vertical">
                        <button type="submit" className="btn-luxury-submit">
                            Save Changes
                        </button>
                        <button type="button" onClick={() => navigate("/gerentes")} className="btn-back-minimal">
                            ← Cancel and return
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600&display=swap');

                .edit-gerente-wrapper {
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

                .content-relative { position: relative; z-index: 2; }

                .form-container-luxury {
                    background: rgba(18, 18, 18, 0.8);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    padding: 50px;
                    width: 100%;
                    max-width: 500px;
                    box-shadow: 0 50px 100px rgba(0,0,0,0.8);
                }

                .form-header { text-align: center; margin-bottom: 40px; }
                .brand-accent-line { width: 50px; height: 2px; background: #c5a47e; margin-bottom: 20px; }
                .brand-badge-alt { color: #c5a47e; text-transform: uppercase; letter-spacing: 5px; font-size: 0.7rem; font-weight: 600; display: block; margin-bottom: 10px; }
                .form-title { font-family: 'Playfair Display', serif; color: #fff; font-size: 2.5rem; }
                .text-gold { color: #c5a47e; font-style: italic; }

                .luxury-form { display: flex; flex-direction: column; gap: 20px; }

                .input-group-custom { display: flex; flex-direction: column; gap: 8px; }
                .input-group-custom label { color: #c5a47e; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
                
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
                }

                .form-actions-vertical { margin-top: 20px; display: flex; flex-direction: column; gap: 15px; }

                .btn-luxury-submit {
                    background: #c5a47e; color: #000; border: none; padding: 18px;
                    font-weight: 700; text-transform: uppercase; letter-spacing: 2px;
                    font-size: 0.85rem; cursor: pointer; transition: all 0.3s ease;
                }

                .btn-luxury-submit:hover { background: #fff; transform: translateY(-2px); }

                .btn-back-minimal {
                    background: transparent; border: none; color: #555;
                    font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;
                    cursor: pointer; transition: color 0.3s ease;
                }

                .btn-back-minimal:hover { color: #fff; }

                @media (max-width: 600px) {
                    .form-container-luxury { padding: 30px; }
                    .form-title { font-size: 1.8rem; }
                }
            `}</style>
        </div>
    )
}

export default EditGerente;