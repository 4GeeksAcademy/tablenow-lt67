import React, { useEffect, useState } from 'react'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useNavigate } from 'react-router-dom';


const Empleado = () => {
    const [empleados, setEmpleados] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch('https://symmetrical-potato-7vj4q5r4wg652r9rj-3001.app.github.dev/api/empleado')
            .then(response =>
                response.json())
            .then(data => {
                console.log("Datos recibidos:", data);
                setEmpleados(data);
            })
            .catch(error => console.log("Error en fetch:", error));
    }, [])

    const deleteEmpleado = (id) => {
            fetch(`https://symmetrical-potato-7vj4q5r4wg652r9rj-3001.app.github.dev/api/empleado/${id}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                   const nuevosEmpleados = empleados.filter(empleado => empleado.id !== id);
                   setEmpleados(nuevosEmpleados);
                }
            })
            .catch(error => {
                console.error('Error al eliminar el empleado:', error);
            });
    };
    return (
        <div className='container'>
            <div className="d-flex justify-content-end">
                <button className="btn btn-outline-success mb-2" onClick={() => navigate("/crear-empleado")}>Add Employee</button>
            </div>
            <h1 className="text-center display-1">Employees</h1>
            <div className="d-flex justify-content-center">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Rol</th>
                            <th scope="col">State</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {empleados.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.phone}</td>
                                <td>{item.rol}</td>
                                <td>{item.state}</td>
                                <td>
                                    <button className="btn btn-outline-primary btn-1" onClick={() => navigate(`/empleado-detail/${item.id}`)}>
                                        <i className="bi bi-eye"></i>
                                    </button>
                                    <button className="btn btn-outline-success btn-1 mx-2" onClick={() => navigate(`/edit-empleado/${item.id}`)}>
                                        <i className="bi bi-pencil-square"></i>
                                    </button>
                                    <button className="btn btn-outline-danger btn-1 "data-bs-toggle="modal" data-bs-target="#exampleModal">
                                                        <i className="bi bi-trash"></i>
                                                        </button>
                                    <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Delete employee</h1>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div className="modal-body">
                                                    Are you sure you want to delete this employee?
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => deleteEmpleado(item.id)}>Delete employee</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Empleado