import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

function EditGerente() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        phone: "",
        email: ""
    })

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id)
            .then(res => res.json())
            .then(data => setForm(data))
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form)
        })
        .then(() => navigate("/gerentes"))
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input value={form.lastname} onChange={e => setForm({...form, lastname: e.target.value})} />
            <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <button type="submit">Update</button>
        </form>
    )
}

export default EditGerente