import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Gerentes = () => {
    const [gerentes, setGerentes] = useState([]);
    const navigate = useNavigate()

    // GET
    const getGerentes = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes")
            .then(res => res.json())
            .then(data => setGerentes(data));
    };

    useEffect(() => {
        getGerentes();
    }, []);
    console.log(gerentes)

    // DELETE
    const deleteGerente = (id) => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/gerentes/" + id, {
            method: "DELETE"
        })
            .then(() => getGerentes());
    };


    return (
        <>
            <h1>Lista de gerentes</h1>
            <ul>
                {gerentes.map(gerente => (

                    <li key={gerente.id}>
                        {gerente.name} <br />
                        {gerente.lastname} <br />
                        {gerente.phone} <br />
                        {gerente.email} <br />
                        {gerente.date} <br />
                        {gerente.password} <br />
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/edit_gerente/${gerente.id}`)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/gerente/${gerente.id}`)}
                        >
                            See Details
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={() => deleteGerente(gerente.id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}

            </ul>

            <button className="btn btn-primary" onClick={() => navigate("/new_gerente")}>Crear gerente</button>
        </>
    )
};