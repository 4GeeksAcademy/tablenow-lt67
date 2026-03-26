import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function NewOwner() {

    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    function sendData(e) {
        e.preventDefault()
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "name": name,
                    "email": email,
                    "phone": phone,
                    "password": password
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/owners", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
            })
            .catch((error) => console.error(error));

        console.log("sending data")
        navigate("/owners")
    }

    return (
        <div>
            <h1 className="">Create your owner account</h1>
            <form className="w-50 mx-auto" onSubmit={sendData}>
                <div className="mb-3">
                    <label htmlFor="InputName" className="form-label">Your name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputEmail" className="form-label">Email address</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPhone" className="form-label">Phone number</label>
                    <input value={phone} onChange={(e) => setPhone(e.target.value)} type="phone" className="form-control" />
                </div>
                <div className="mb-3">
                    <label htmlFor="InputPassword" className="form-label">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
            <button onClick={()=> navigate("/owners")} className="btn btn-primary">Back home</button>
        </div>
    )
}

export default NewOwner