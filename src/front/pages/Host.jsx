import React, { useEffect, useState } from 'react'
import { FaRegEye, FaPencilAlt, FaTrash, FaHome, FaPlus, FaUserTie } from "react-icons/fa"
import { Link } from 'react-router-dom'

const Host = () => {
  const [hosts, setHosts] = useState([])
  const [selectedHost, setSelectedHost] = useState(null)

  // -- LÓGICA DE ELIMINACIÓN --
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

  // -- LÓGICA DE CARGA --
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host")
        const data = await response.json()
        setHosts(data)
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    }
    fetchHosts()
  }, [])

  return (
    <div className="min-vh-100 py-5 main-container">
      <div className="container">
        {/* CABECERA */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <Link to="/owner-dashboard" className="text-decoration-none">
            <button className="btn btn-dashboard shadow-none">
              <FaHome className="me-2" /> Dashboard
            </button>
          </Link>
          
          <div className="text-center d-none d-md-block">
            <h1 className="font-playfair display-5 mb-0">Hosts Registry</h1>
            <p className="gold-text small text-uppercase mb-0" style={{ letterSpacing: '4px' }}>TableNow Concierge</p>
          </div>

          <Link to="/create-host" className="text-decoration-none">
            <button className="btn btn-gold shadow">
              <FaPlus className="me-2" /> Add Host
            </button>
          </Link>
        </div>

        {/* TABLA DE HOSTS */}
        <div className="glass-panel shadow-lg">
          <div className="table-responsive">
            <table className="table custom-table mb-0">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Contact</th>
                  <th scope="col" className="d-none d-lg-table-cell">Notes</th>
                  <th scope="col" className="text-center">Visits</th>
                  <th scope="col">Last Visit</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hosts.map((host) => (
                  <tr key={host.id}>
                    <td>
                      <div className="fw-bold">{host.first_name} {host.last_name}</div>
                      <small className="gold-text opacity-75">ID: #{host.id}</small>
                    </td>
                    <td className="contact-info">
                      <div className="small text-white-50"><i className="bi bi-envelope gold-text"></i>{host.email}</div>
                      <div className="small text-white-50"><i className="bi bi-telephone gold-text"></i>{host.phone_number}</div>
                    </td>
                    <td className="d-none d-lg-table-cell italic small text-secondary">
                      {host.special_notes ? `"${host.special_notes}"` : <span className="opacity-25">---</span>}
                    </td>
                    <td className="text-center">
                      <span className="badge rounded-pill bg-black border border-secondary px-3 py-2">
                        {host.total_visits}
                      </span>
                    </td>
                    <td className="small text-white-50">
                      {host.last_visit || "No visits yet"}
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <Link to={`/view-host/${host.id}`} className="btn-action shadow-sm" title="View">
                          <FaRegEye />
                        </Link>
                        <Link to={`/edit-host/${host.id}`} className="btn-action shadow-sm" title="Edit">
                          <FaPencilAlt />
                        </Link>
                        <button 
                          type="button" 
                          className="btn-action shadow-sm" 
                          data-bs-toggle="modal" 
                          data-bs-target="#deleteModal"
                          onClick={() => setSelectedHost(host)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {hosts.length === 0 && (
            <div className="text-center py-5">
              <FaUserTie className="display-1 text-secondary opacity-25 mb-3" />
              <p className="text-secondary">No hosts found in the database.</p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-secondary">
              <h5 className="modal-title font-playfair gold-text">Confirm Removal</h5>
              <button type="button" className="btn-close btn-close-white shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center py-4">
              {selectedHost && (
                <>
                  <p className="fs-5">Delete <strong>{selectedHost.first_name} {selectedHost.last_name}</strong>?</p>
                  <p className="text-secondary small">This data will be permanently removed from the concierge database.</p>
                </>
              )}
            </div>
            <div className="modal-footer border-0 justify-content-center pb-4">
              <button type="button" className="btn btn-outline-light rounded-pill px-4 shadow-none" data-bs-dismiss="modal">Cancel</button>
              <button 
                  type="button" 
                  className="btn btn-danger rounded-pill px-4 shadow-none" 
                  data-bs-dismiss="modal" 
                  onClick={() => selectedHost && deleteHost(selectedHost.id)}
              >
                  Confirm Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .main-container {
          background: linear-gradient(rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.95)), url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          color: #fff;
        }

        .gold-text { color: #c5a47e !important; }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(197, 164, 126, 0.2);
          border-radius: 20px;
          padding: 30px;
        }

        .custom-table {
          --bs-table-bg: transparent !important;
          --bs-table-color: #fff !important;
          color: #fff !important;
          border-collapse: separate;
          border-spacing: 0 12px;
        }

        .custom-table thead th {
          background: transparent !important;
          color: #c5a47e !important;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 2px;
          border-bottom: 1px solid rgba(197, 164, 126, 0.3) !important;
          padding-bottom: 15px;
        }

        .custom-table tbody tr {
          background: rgba(255, 255, 255, 0.03) !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          transition: all 0.3s ease;
        }

        .custom-table tbody tr:hover {
          background: rgba(197, 164, 126, 0.1) !important;
          transform: translateY(-2px);
        }

        .custom-table td {
          vertical-align: middle;
          padding: 20px 15px !important;
          border: none !important;
          color: #fff !important;
        }

        /* --- FIX BOTÓN GOLD (SIN AZUL) --- */
        .btn-gold {
          background: #c5a47e !important;
          color: #000 !important;
          font-weight: 700;
          border-radius: 50px;
          border: none !important;
          padding: 10px 25px;
          transition: all 0.3s ease;
        }

        .btn-gold:hover, .btn-gold:focus, .btn-gold:active {
          background: #e2c29d !important;
          color: #000 !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(197, 164, 126, 0.4) !important;
          outline: none !important;
        }

        .btn-dashboard {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 50px;
          border: none;
          padding: 10px 25px;
          transition: 0.3s;
        }
        .btn-dashboard:hover { background: rgba(255,255,255,0.2); color: #fff; }

        .btn-action {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: 0.3s;
          border: 1px solid rgba(197, 164, 126, 0.4);
          background: transparent;
          color: #c5a47e;
        }

        .btn-action:hover {
          background: #c5a47e;
          color: #000;
          transform: scale(1.1);
        }

        .modal-content {
          background: #111;
          border: 1px solid #c5a47e;
          color: #fff;
          border-radius: 15px;
        }

        .font-playfair { font-family: 'Playfair Display', serif; }
        
        .contact-info i {
          font-size: 0.9rem;
          margin-right: 8px;
        }
      `}</style>
    </div>
  )
}

export default Host;