import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";


function Clients() {
    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()
    const [clients, setClients] = useState([])

    async function getClients() {
        try{
            const response = await
            fetch(import.meta.env.VITE_BACKEND_URL + "/api/clients")
            const data = await response.json()
            setClients(data)
            
        } catch(error){
            console.log(error)
        }
        
    }

    useEffect(() => {
        getClients()
        console.log("la pagina cargo")
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
                        phone: {client.phone} <br />
                        <button className="btn btn-primary" onClick={()=>{
                            navigate('/edit_client/'+client.id)
                            }}>Edit</button>
                        <Link to={"/client/"+client.id} className="btn btn-primary">See details</Link>
                        <button className="btn btn-danger" onClick={()=>deleteClient(client.id)}>Delete</button>
                    </li>)
                })}
            </ul>
            <button className="btn btn-primary" onClick={()=>navigate('/new_client')}>Create a new client</button>
        </>
    )
}

export default Clients