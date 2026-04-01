import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NewRestaurant() {

    const navigate = useNavigate()

    const [ownerId, setOwnerId] = useState(0)
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [phone, setPhone] = useState('')
    const [totalCapacity, setTotalCapacity] = useState(0)


    function sendData(e) {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "id_owner": ownerId,
                    "name": name,
                    "address": address,
                    "phone": phone,
                    "total_capacity": totalCapacity
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
            })
            .catch((error) => console.error(error));

        console.log("sending data")
        navigate("/restaurants")
    }

    return (
        <div>
            <h1 className="">Create your restaurant</h1>
            <form className="w-50 mx-auto" onSubmit={sendData}>
                <div className="mb-3">
                    <label htmlFor="InputName" className="form-label">Owner ID</label>
                    <input value={ownerId} onChange={(e) => setOwnerId(e.target.value)} type="number" className="form-control" />
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
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
            <button onClick={() => navigate("/restaurants")} className="btn btn-primary">Back to restaurants</button>
        </div>
    )
}

export default NewRestaurant