import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";


function Client (){

    const navigate = useNavigate()

    const [client, setClient] = useState({})

    const { clientId } = useParams()

     useEffect(() => async () => {
    try {
      const response = await
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + clientId)
      const data = await response.json()
      setClient(data)

    } catch (error) {
      console.log(error)
    }
  }, [])

    return (
        <>
            <h1>Client Details</h1>
            <ul>
                <li>Name: {client.name}</li>
                <li>Email: {client.email}</li>
                <li>Phone: {client.phone}</li>
            </ul>
            <button onClick={()=> navigate("/clients")} className="btn btn-primary">Back home</button>
        </>
    )
}


export default Client