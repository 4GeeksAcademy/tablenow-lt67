import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";


function Owner (){

    const navigate = useNavigate()

    const [owner, setOwner] = useState({})

    const { ownerId } = useParams()

     useEffect(() => async () => {
    try {
      const response = await
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/owner/" + ownerId)
      const data = await response.json()
      setOwner(data)

    } catch (error) {
      console.log(error)
    }
  }, [])

    return (
        <>
            <h1>Owner Details</h1>
            <ul>
                <li>Name: {owner.name}</li>
                <li>Email: {owner.email}</li>
                <li>Phone: {owner.phone}</li>
            </ul>
            <button onClick={()=> navigate("/owners")} className="btn btn-primary">Back home</button>
        </>
    )
}


export default Owner