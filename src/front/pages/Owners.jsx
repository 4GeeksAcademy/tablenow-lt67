import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"



function Owners() {
    const navigate = useNavigate()
    const [owners, setOwners] = useState([])

    async function getOwners() {
        try{
            const response = await
            fetch(import.meta.env.VITE_BACKEND_URL + "/api/owners")
            const data = await response.json()
            setOwners(data)
            
        } catch(error){
            console.log(error)
        }
        
    }

    useEffect(() => {
        getOwners()
        console.log("la pagina cargo")
    }, [])

    function deleteOwner(id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/owner/" + id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                getOwners()
            })
            .catch((error) => console.error(error));
    }

    return (
        <>
            <ul>
                {owners.map((owner) => {
                    return (<li key={owner.id}>
                        name: {owner.name} <br />
                        email: {owner.email} <br />
                        phone: {owner.phone} <br />
                        <button className="btn btn-primary" onClick={()=>{
                            navigate('/edit_owner/'+owner.id)
                            }}>Edit</button>
                        <Link to={"/owner/"+owner.id} className="btn btn-primary">See details</Link>
                        <button className="btn btn-danger" onClick={()=>deleteOwner(owner.id)}>Delete</button>
                    </li>)
                })}
            </ul>
            <button className="btn btn-primary" onClick={()=>navigate('/new_owner')}>Create a new owner</button>
        </>
    )
}

export default Owners