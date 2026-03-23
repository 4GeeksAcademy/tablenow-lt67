import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";


function Clients() {
    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()
    const [clients, setClients] = useState([])

    function getClients() {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/clients")
            .then((response) => response.json())
            .then((data) => setClients(data))
    }

    useEffect(() => {
        getClients()
    }, [])

    function deleteClient(id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                getClients()
            })
            .catch((error) => console.error(error));
    }

    return (
        <>
            <ul>
                {clients.map((client) => {
                    return (<li key={client.id}>
                        name: {client.name} <br />
                        email: {client.email} <br />
                        <button className="btn btn-primary" onClick={()=>{
                            navigate('/edit_client')
                            dispatch({
                                type: 'set_id',
                                payload: client.id
                            })
                            }}>Edit</button>
                        <button className="btn btn-primary">See details</button>
                        <button className="btn btn-primary" onClick={()=>deleteClient(client.id)}>Delete</button>
                    </li>)
                })}
            </ul>
            <button className="btn btn-primary" onClick={()=>navigate('/new_client')}>Create a new client</button>
        </>
    )
}

export default Clients