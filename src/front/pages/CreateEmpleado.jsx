import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const CreateEmpleado = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [phone, setPhone] = useState("");
    const [rol, setRol] = useState("");
    const [state, setState] = useState("");
    const [password, setPassword] = useState(""); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const empleado = { name, email, phone, rol, state, password };
        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, ""); 

        fetch(baseUrl + '/api/empleado', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(empleado)
        }).then((response) => {
            if (response.ok) {
                navigate("/empleado");
            } else {
                response.json().then(data => alert(data.message || "Error al crear empleado"));
            }
        }).catch(error => {
            alert("Error de conexión con el servidor");
        });
    }

    const handleReset = (e) => {
        e.preventDefault();
        setName(""); setEmail(""); setPhone(""); setRol(""); setState(""); setPassword(""); 
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center display-4 text-secondary">Create New Empleado</h1>
            <p className="text-center text-muted mb-4">Registra un nuevo miembro del staff para TableNow</p>
            
            <div className="d-flex justify-content-center">
                <form 
                    className="row g-3 shadow p-4 rounded bg-white" 
                    style={{ maxWidth: "800px" }}
                    onSubmit={handleSubmit} 
                    autoComplete="off"
                >
                    <input style={{ display: "none" }} type="text" name="fake_user" />
                    <input style={{ display: "none" }} type="password" name="fake_pass" />

                    {/* 1. NAME */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Full Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="form-control" 
                            name="staff_new_name_field"
                            autoComplete="new-password" 
                            required 
                        />
                    </div>

                    {/* 2. EMAIL */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Access Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            className="form-control" 
                            name="staff_new_email_field"
                            autoComplete="new-password" 
                            required 
                        />
                    </div>

                    {/* 3. PASSWORD */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Temporary Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="form-control" 
                            name="staff_new_password_secure"
                            autoComplete="new-password" 
                            required 
                        />
                    </div>

                    {/* 4. PHONE */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Phone Number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" name="staff_phone" required />
                    </div>

                    {/* 5. ROL */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Role / Position</label>
                        <input type="text" value={rol} onChange={(e) => setRol(e.target.value)} className="form-control" placeholder="Ej: Mesero, Cocina..." required />
                    </div>

                    {/* 6. STATE */}
                    <div className="col-md-6">
                        <label className="form-label fw-bold">State</label>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="form-control" placeholder="Ej: Activo" required />
                    </div>
                    
                    <div className="col-12 mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-primary px-4">Add Empleado</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Reset</button> 
                        <button type="button" className="btn btn-link text-decoration-none" onClick={() => navigate("/empleado")}>Cancel</button>                       
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateEmpleado;