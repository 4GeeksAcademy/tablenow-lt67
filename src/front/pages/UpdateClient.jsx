import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

function UpdateClient() {
    const {store, dispatch} = useGlobalReducer()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function sendData(e) {
        e.preventDefault()
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
                {
                    "name": name,
                    "email": email,
                    "password": password
                }
            )
        }
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/client/" + store.id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
            })
            .catch((error) => console.error(error));

        
        navigate("/clients")
    }

    return (
        <div>
            <h1 className="">Edit your account</h1>
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
                    <label htmlFor="InputPassword" className="form-label">Password</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Update</button>
            </form>
        </div>
    )
}

export default UpdateClient