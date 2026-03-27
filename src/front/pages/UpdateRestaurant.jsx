import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate,  useParams } from "react-router-dom";


function UpdateRestaurant() {
    const { restaurantId } = useParams()
    const navigate = useNavigate()

    const [idOwner, setIdOwner] = useState(0)
        const [name, setName] = useState('')
        const [address, setAddress] = useState('')
        const [phone, setPhone] = useState('')
        const [totalCapacity, setTotalCapacity] = useState(0)


    useEffect(()=>{
            fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurant/"+restaurantId)
            .then(response=> response.json())
            .then(data=> {
                setIdOwner(data.id_owner)
                setName(data.name)
                setAddress(data.address)
                setPhone(data.phone)
                setTotalCapacity(data.totalCapacity)
            })
            .catch((error) => console.log(error))
    },[])

    function sendData(e) {
        e.preventDefault()
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "id_owner": idOwner,
                    "name": name,
                    "address": address,
                    "phone": phone,
                    "totalCapacity": totalCapacity
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurant/" + restaurantId, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
            })
            .catch((error) => console.error(error));

        
        navigate("/owners")
    }

    return (
        <div>
            <h1 className="">Edit your account</h1>
            <form className="w-50 mx-auto" onSubmit={sendData}>
                <div className="mb-3">
                    <label htmlFor="InputIdOwner" className="form-label">Your ID Owner</label>
                    <input value={idOwner} onChange={(e) => setIdOwner(e.target.value)} type="number" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputName" className="form-label">Your name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputAddress" className="form-label">Restaurant address</label>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPhone" className="form-label">Phone number</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="phone" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputCapacity" className="form-label">Total capacity</label>
                    <input value={totalCapacity} onChange={(e) => setTotalCapacity(e.target.value)} type="number" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
            <button onClick={()=> navigate("/owners")} className="btn btn-primary">Back home</button>
        </div>
    )
}

export default UpdateRestaurant