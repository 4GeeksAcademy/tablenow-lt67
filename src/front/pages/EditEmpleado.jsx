import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditEmpleado = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [Name, setName] = useState("");
    const [Email, setEmail] = useState(""); 
    const [Phone, setPhone] = useState("");
    const [Rol, setRol] = useState("");
    const [State, setState] = useState("");
    const [Password, setPassword] = useState(""); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/empleado/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                
                setName(data.full_name || ""); 
                setEmail(data.email || "");    
                setPhone(data.phone || "");
                setRol(data.rol || "");
                setState(data.state || "");
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const empleado = { 
            name: Name, 
            email: Email, 
            phone: Phone, 
            rol: Rol, 
            state: State, 
            password: Password 
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/empleado/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(empleado)
            });

            if (response.ok) {
                navigate("/empleado");
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Error al actualizar");
            }
        } catch (error) {
            console.error("Error updating empleado:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center display-3">Edit Employee</h1>
            <div className="d-flex justify-content-center">
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit} autoComplete="off">
                    
                    {/* NAME */}
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" value={Name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" required />
                    </div> 

                    {/* EMAIL */}
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" value={Email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" required />
                    </div>

                    {/* PASSWORD */}
                    <div className="col-md-6">
                        <label className="form-label">New Password (leave blank to keep current)</label>
                        <input 
                            type="password" 
                            value={Password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            className="form-control" 
                            id="password" 
                            placeholder="********"
                        />
                    </div>

                    {/* PHONE */}
                    <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input type="text" value={Phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" required />
                    </div>

                    {/* ROLE */}
                    <div className="col-md-6">
                        <label className="form-label">Role</label>
                        <input type="text" value={Rol} onChange={(e) => setRol(e.target.value)} className="form-control" id="rol" required />
                    </div>

                    {/* STATE */}
                    <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input type="text" value={State} onChange={(e) => setState(e.target.value)} className="form-control" id="state" required />
                    </div>

                    <div className="col-12 mt-4 text-center">
                        <button type="submit" className="btn btn-primary px-4">Update Employee</button>
                        <Link to="/empleado">
                            <button type="button" className="btn btn-secondary mx-2 px-4">Back to Employees</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEmpleado;