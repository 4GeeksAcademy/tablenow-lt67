import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const EditEmpleado = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [Name, setName] = useState("")
    const [Phone, setPhone] = useState("")
    const [Rol, setRol] = useState("")
    const [State, setState] = useState("")

    useEffect(() => {
        // fetch(`https://symmetrical-potato-7vj4q5r4wg652r9rj-3001.app.github.dev/api/empleado${id}`)
        //  .then(response => response.json())
        // .then(data => setEmpleados(data))
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/empleado/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await response.json();
                console.log("Fetched empleado data:", data);
                setName(data.name);
                setPhone(data.phone);
                setRol(data.rol);
                setState(data.state);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const empleado = { name: Name, phone: Phone, rol: Rol, state: State };
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
                console.error(error);
            }
        } catch (error) {
            console.error("Error updating empleado:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="text-center display-3">Edit Employee</h1>
            <div className="d-flex justify-content-center">
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text" value={Name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div> 

                    <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input type="text" value={Phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Rol</label>
                        <input type="text" value={Rol} onChange={(e) => setRol(e.target.value)} className="form-control" id="rol" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input type="text" value={State} onChange={(e) => setState(e.target.value)} className="form-control" id="state" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Update Employee</button>
                        <Link to="/empleado">
                            <button className="btn btn-secondary mx-2">Back to Employees</button>
                        </Link>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default EditEmpleado