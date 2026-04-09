import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useNavigate } from 'react-router-dom';

const Empleado = () => {
    const [empleados, setEmpleados] = useState([])
    const [selectedEmpleadoId, setSelectedEmpleadoId] = useState(null); 
    const navigate = useNavigate()

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + '/api/empleado')
            .then(response => response.json())
            .then(data => {
                console.log("Datos recibidos:", data);
                setEmpleados(data);
            })
            .catch(error => console.log("Error en fetch:", error));
    }, [])

    const deleteEmpleado = () => {
        if (!selectedEmpleadoId) return;

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/empleado/${selectedEmpleadoId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                const nuevosEmpleados = empleados.filter(empleado => empleado.id !== selectedEmpleadoId);
                setEmpleados(nuevosEmpleados);
            }
        })
        .catch(error => {
            console.error('Error al eliminar el empleado:', error);
        });
    };

    return (
        <div className='container mt-5'>
            <div className="d-flex justify-content-end mb-4">
                <button className="btn btn-success shadow-sm" onClick={() => navigate("/crear-empleado")}>
                    <i className="bi bi-person-plus-fill"></i> Add Employee
                </button>
            </div>
            
            <h1 className="text-center display-2 mb-5">Employees</h1>
            
            <div className="table-responsive shadow-sm rounded">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th scope="col" className="ps-4">Name</th>
                            <th scope="col" className="text-center">Email</th> {/* Centrado */}
                            <th scope="col">Phone</th>
                            <th scope="col">Role</th>
                            <th scope="col">State</th>
                            <th scope="col" className="text-center pe-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {empleados.map((item, index) => (
                            <tr key={index}>
                                <td className="ps-4 fw-bold">{item.full_name}</td>
                                
                                {/* EMAIL */}
                                <td className="text-center px-3 text-secondary">
                                    {item.email}
                                </td>

                                <td>{item.phone}</td>
                                <td>
                                    <span className="text-capitalize">{item.rol}</span>
                                </td>
                                <td>
                                    <span className={`badge rounded-pill ${item.state === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                        {item.state || "Inactive"}
                                    </span>
                                </td>
                                <td className="text-center pe-4">
                                    <div className="btn-group" role="group">
                                        <button className="btn btn-outline-primary btn-sm" title="View Details" onClick={() => navigate(`/empleado-detail/${item.id}`)}>
                                            <i className="bi bi-eye"></i>
                                        </button>
                                        <button className="btn btn-outline-success btn-sm mx-1" title="Edit" onClick={() => navigate(`/edit-empleado/${item.id}`)}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button 
                                            className="btn btn-outline-danger btn-sm" 
                                            title="Delete"
                                            data-bs-toggle="modal" 
                                            data-bs-target="#deleteModal"
                                            onClick={() => setSelectedEmpleadoId(item.id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-danger text-white">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4 text-center">
                            <i className="bi bi-exclamation-triangle text-danger display-4 mb-3"></i>
                            <p className="mb-0">Are you sure you want to delete this employee? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer border-0 justify-content-center">
                            <button type="button" className="btn btn-light px-4" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger px-4" data-bs-dismiss="modal" onClick={deleteEmpleado}>Delete Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Empleado;