import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const CreateEmpleado = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [rol, setRol] = useState("")
    const [state, setState] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        const empleado = { name, phone, rol, state }
        fetch('https://symmetrical-potato-7vj4q5r4wg652r9rj-3001.app.github.dev/api/empleado', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(empleado)
        }).then(() => {
            navigate("/empleado")
        }).catch(error => console.log(error))
    }

    const handleReset = (e) => {
        e.preventDefault();
        setName("")
        setPhone("")
        setRol("")
        setState("")
    }


    return (
        <div className="container">
            <h1 className="text-center display-3">Create new empleado</h1>
            <div className="d-flex justify-content-center">
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">Name</label>
                        <input type="text"  value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Phone</label>
                        <input type="text"  value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Rol</label>
                        <input type="text"  value={rol} onChange={(e) => setRol(e.target.value)} className="form-control" id="rol" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">State</label>
                        <input type="text"  value={state} onChange={(e) => setState(e.target.value)} className="form-control" id="state" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>                                  
                    
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Add</button>
                        <button type="button" className="btn btn-secondary mx-2" onClick={(e) => handleReset(e)}>Reset</button>                      
                        <button className="btn btn-secondary" onClick={() => navigate("/empleado")}>Go back</button>                       
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateEmpleado