import React, { useEffect, useState } from 'react'
import { FaRegEye, FaPencilAlt, FaTrash, FaHome } from "react-icons/fa" // Añadimos FaHome
import { Link } from 'react-router-dom'

const Host = () => {
  const [hosts, setHosts] = useState([])

  function deleteHost(id) {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/host/${id}`, requestOptions)
      .then(response => {
        if (response.ok) {
          setHosts(hosts.filter((host) => host.id !== id))
        }
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host")
        const data = await response.json()
        console.log("Datos recibidos del backend:", data[0]); // <--- MIRA ESTO EN LA CONSOLA
        setHosts(data)
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    }
    fetchHosts()
  }, [])

  return (
    <div className='container'>
      {/* SECCIÓN DE BOTONES SUPERIORES */}
      <div className="d-flex justify-content-between align-items-center my-3">
        <Link to="/owner-dashboard">
          <button className="btn btn-outline-secondary">
            <FaHome className="me-2" /> Back
          </button>
        </Link>
        
        <Link to="/create-host">
          <button className="btn btn-primary">Add Host</button>
        </Link>
      </div>

      <h1 className="text-center mb-4">Hosts Management</h1>

      <div className="d-flex justify-content-center">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th scope="col">Notes</th>
              <th scope="col">Visits</th>
              <th scope="col">Last Visit</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hosts.map((host) => {
              return (
                <tr key={host.id}>
                  <td>{host.first_name}</td>
                  <td>{host.last_name}</td>
                  <td>{host.email}</td>
                  <td>{host.phone_number}</td>
                  <td>{host.special_notes}</td>
                  <td>{host.total_visits}</td>
                  <td>{host.last_visit}</td>
                  <td>
                    <div className="d-flex">
                        <Link to={`/view-host/${host.id}`}>
                        <button className="btn btn-sm btn-primary me-1"><FaRegEye /></button>
                        </Link>
                        <Link to={`/edit-host/${host.id}`} className="btn btn-sm btn-secondary me-1"><FaPencilAlt /></Link>

                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger" 
                            data-bs-toggle="modal" 
                            data-bs-target={`#modal${host.id}`}
                        >
                        <FaTrash />
                        </button>
                    </div>

                    {/* Modal*/}
                    <div className="modal fade" id={`modal${host.id}`} tabIndex="-1" aria-hidden="true">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h1 className="modal-title fs-5">Delete host</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div className="modal-body text-start">
                            Are you sure you want to delete <strong>{host.first_name} {host.last_name}</strong>?
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                data-bs-dismiss="modal" 
                                onClick={() => deleteHost(host.id)}
                            >
                                Delete host
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Host