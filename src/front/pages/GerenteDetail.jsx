import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

function GerenteDetail() {
    const { id } = useParams()
    const [gerente, setGerente] = useState(null)

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id)
            .then(res => res.json())
            .then(data => setGerente(data))
    }, [])

    if (!gerente) return <p>Loading...</p>

    return (
        <div>
            <h2>{gerente.name}</h2>
            <p>{gerente.lastname}</p>
            <p>{gerente.phone}</p>
            <p>{gerente.email}</p>
        </div>
    )
}

export default GerenteDetail