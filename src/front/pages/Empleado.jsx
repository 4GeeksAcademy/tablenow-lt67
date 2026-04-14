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
        .catch(error => console.error('Error al eliminar:', error));
    };

    return (
        <div className='min-vh-100 py-5' style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            color: '#fff'
        }}>
            <style>{`
                .gold-text { color: #c5a47e !important; }
                .gold-border { border: 1px solid #c5a47e !important; }
                .btn-gold { 
                    background-color: #c5a47e !important; 
                    color: #000 !important; 
                    font-weight: 600; 
                    border-radius: 50px;
                    transition: all 0.3s ease;
                }
                .btn-gold:hover { transform: translateY(-2px); filter: brightness(1.1); }
                .employee-card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(197, 164, 126, 0.2);
                    border-radius: 15px;
                    transition: all 0.4s ease;
                }
                .employee-card:hover {
                    border-color: #c5a47e;
                    transform: translateY(-5px);
                    background: rgba(255, 255, 255, 0.07);
                }
                .role-badge {
                    font-size: 0.7rem;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    background: rgba(197, 164, 126, 0.15);
                    color: #c5a47e;
                    padding: 4px 12px;
                    border-radius: 50px;
                }
                .font-playfair { font-family: 'Playfair Display', serif; }
            `}</style>

            <div className='container'>
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-end mb-5 border-bottom border-secondary pb-4">
                    <div>
                        <p className="gold-text mb-0 text-uppercase fw-bold" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>Staff Management</p>
                        <h1 className="display-4 font-playfair mb-0">Our Team</h1>
                    </div>
                    <button className="btn btn-gold px-4 shadow-sm" onClick={() => navigate("/crear-empleado")}>
                        <i className="bi bi-person-plus-fill me-2"></i> Add Employee
                    </button>
                </div>
                
                {/* Employees Grid */}
                <div className="row g-4">
                    {empleados.map((item, index) => (
                        <div className="col-md-6 col-lg-4" key={index}>
                            <div className="employee-card p-4 h-100 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="rounded-circle gold-border d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', background: 'rgba(197, 164, 126, 0.1)' }}>
                                            <i className="bi bi-person gold-text fs-3"></i>
                                        </div>
                                        <span className={`badge rounded-pill ${item.state === 'Active' ? 'bg-success' : 'bg-secondary'} opacity-75`}>
                                            {item.state || "Inactive"}
                                        </span>
                                    </div>
                                    
                                    <h4 className="font-playfair mb-1">{item.full_name}</h4>
                                    <div className="role-badge d-inline-block mb-3">{item.rol}</div>
                                    
                                    <div className="text-secondary small mb-2">
                                        <i className="bi bi-envelope me-2"></i>{item.email}
                                    </div>
                                    <div className="text-secondary small">
                                        <i className="bi bi-telephone me-2"></i>{item.phone}
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-top border-secondary d-flex justify-content-end gap-2">
                                    <button className="btn btn-sm btn-outline-light rounded-circle" title="View" onClick={() => navigate(`/empleado-detail/${item.id}`)}>
                                        <i className="bi bi-eye"></i>
                                    </button>
                                    <button className="btn btn-sm btn-outline-light rounded-circle" title="Edit" onClick={() => navigate(`/edit-empleado/${item.id}`)}>
                                        <i className="bi bi-pencil"></i>
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-outline-danger rounded-circle" 
                                        title="Delete"
                                        data-bs-toggle="modal" 
                                        data-bs-target="#deleteModal"
                                        onClick={() => setSelectedEmpleadoId(item.id)}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {empleados.length === 0 && (
                    <div className="text-center py-5">
                        <i className="bi bi-people text-secondary display-1"></i>
                        <p className="mt-3 text-secondary">No employees registered yet.</p>
                    </div>
                )}
            </div>

            {/* MODAL (Estilo Dark) */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content bg-dark border-0 shadow-lg text-white">
                        <div className="modal-body p-5 text-center">
                            <i className="bi bi-exclamation-circle gold-text display-1 mb-4"></i>
                            <h3 className="font-playfair mb-3">Terminate Access?</h3>
                            <p className="text-secondary mb-4">Are you sure you want to remove this team member? This action will revoke all system permissions immediately.</p>
                            <div className="d-flex gap-2 justify-content-center">
                                <button type="button" className="btn btn-outline-light px-4 btn-pill" data-bs-dismiss="modal" style={{ borderRadius: '50px' }}>Cancel</button>
                                <button type="button" className="btn btn-danger px-4" data-bs-dismiss="modal" onClick={deleteEmpleado} style={{ borderRadius: '50px' }}>Remove Permanently</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Empleado;