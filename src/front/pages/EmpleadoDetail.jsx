import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const EmpleadoDetail = () => {
    const { id } = useParams(); 
    const [empleado, setEmpleado] = useState(null);

    useEffect(() => {
        const getEmpleadoInfo = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/empleado/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setEmpleado(data);
                } else {
                    console.error("No se pudo obtener la información del empleado");
                }
            } catch (error) {
                console.error("Error en el fetch:", error);
            }
        };

        getEmpleadoInfo();
    }, [id]);

    
    if (!empleado) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center display-3 mb-4">Employee Details</h1>
            <div className="d-flex justify-content-center">
                <div className="card shadow-lg" style={{ width: "100%", maxWidth: "600px" }}>
                    <div className="card-body p-5">
                        {/* FULL NAME */}
                        <div className="row mb-3">
                            <div className="col-sm-4 font-weight-bold text-secondary">Full Name:</div>
                            <div className="col-sm-8"><h4>{empleado.full_name}</h4></div>
                        </div>
                        <hr />

                        {/* EMAIL - Ahora con color de texto normal (negro) */}
                        <div className="row mb-3">
                            <div className="col-sm-4 font-weight-bold text-secondary">Email Address:</div>
                            <div className="col-sm-8 text-dark">{empleado.email}</div>
                        </div>
                        <hr />

                        {/* PHONE NUMBER */}
                        <div className="row mb-3">
                            <div className="col-sm-4 font-weight-bold text-secondary">Phone Number:</div>
                            <div className="col-sm-8">{empleado.phone}</div>
                        </div>
                        <hr />

                        {/* ROLE */}
                        <div className="row mb-3">
                            <div className="col-sm-4 font-weight-bold text-secondary">Role:</div>
                            <div className="col-sm-8">
                                <span className="badge bg-info text-dark">{empleado.rol}</span>
                            </div>
                        </div>
                        <hr />

                        {/* STATUS */}
                        <div className="row mb-4">
                            <div className="col-sm-4 font-weight-bold text-secondary">Status:</div>
                            <div className="col-sm-8">
                                <span className={`badge ${empleado.state === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                    {empleado.state || "No State"}
                                </span>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                            <Link to="/empleado" className="btn btn-secondary">
                                <i className="bi bi-arrow-left"></i> Go Back
                            </Link>
                            <Link to={`/edit-empleado/${id}`} className="btn btn-primary">
                                <i className="bi bi-pencil"></i> Edit Info
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmpleadoDetail;