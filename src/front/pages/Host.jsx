import React, { useEffect, useState } from 'react'
import { FaRegEye, FaPencilAlt, FaTrash } from "react-icons/fa"
import { Link, Navigate } from 'react-router-dom'

const Host = () => {
  const [hosts, setHosts] = useState([])

  function deleteHost(id) {
    const requestOptions = {
      method: 'DELETE',
      redirect: 'follow'
    };
    fetch(`https://musical-space-rotary-phone-97g4v5q4wvrxh9pwr-3001.app.github.dev/api/host/${id}`, requestOptions)
      .then(response => response.text())
      .then(result => {
        console.log(result)
        setHosts(hosts.filter((host) => host.id !== id))
      })
      .catch(error => console.log('error', error));
  }
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host")
        const data = await response.json()
        console.log(data)
        setHosts(data)
      } catch (error) {
        console.error("Error fetching hosts:", error);
      }
    }
    fetchHosts()
  }, [])
  return (
    <div className='container'>
      <div className="d-flex justify-content-end">
        <Link to="/create-host">
          <button className="btn btn-primary my-3">Add Host</button>
        </Link>
      </div>
      <h1 className="text-center">Hosts</h1>
      <div className="d-flex justify-content-center">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">first name</th>
              <th scope="col">last name</th>
              <th scope="col">email</th>
              <th scope="col">phone number</th>
              <th scope="col">special notes</th>
              <th scope="col">total visits</th>
              <th scope="col">last visits</th>
              <th scope="col">actions</th>
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
                    <Link to={`/view-host/${host.id}`}>
                    <button className="btn btn-primary" ><FaRegEye /></button>
                    </Link>
                    <Link to={`/edit-host/${host.id}`} className="btn btn-secondary mx-2"><FaPencilAlt /></Link>
                    {/* <button className="btn btn-danger" onClick={() => deleteHost(host.id)}><FaTrash /></button> */}
                    <button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      <FaTrash />
                    </button>

                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                      <div class="modal-dialog">
                        <div class="modal-content">
                          <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">Delete host</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body">
                            Are you sure you want to delete this host?
                          </div>
                          <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onClick={() => deleteHost(host.id)}>Delete host</button>
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
        {/* <!-- Button trigger modal --> */}

        {/* <!-- Modal --> */}

      </div>
    </div>
  )
}

export default Host
