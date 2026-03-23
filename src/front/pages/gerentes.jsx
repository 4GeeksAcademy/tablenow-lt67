import React, { useEffect, useState } from "react";

export const Gerentes = () => {
    const [gerentes, setGerentes] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        clave: ""
    });

    const API = "http://127.0.0.1:5000/api/gerentes";

    // GET
    const getGerentes = () => {
        fetch(API)
            .then(res => res.json())
            .then(data => setGerentes(data));
    };

    useEffect(() => {
        getGerentes();
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // POST (CREAR)
    const createGerente = () => {
        fetch(API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(() => {
            getGerentes();
            setForm({ nombre:"", apellido:"", email:"", telefono:"", clave:"" });
        });
    };

    // DELETE
    const deleteGerente = (id) => {
        fetch(`${API}/${id}`, {
            method: "DELETE"
        })
        .then(() => getGerentes());
    };

    // PUT (EDITAR)
    const updateGerente = (id) => {
        fetch(`${API}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        })
        .then(() => getGerentes());
    };

    return (
        <div className="container">
            <h1>CRUD Gerentes</h1>

            {/* FORM */}
            <input name="nombre" placeholder="Nombre" onChange={handleChange} value={form.nombre} />
            <input name="apellido" placeholder="Apellido" onChange={handleChange} value={form.apellido} />
            <input name="email" placeholder="Email" onChange={handleChange} value={form.email} />
            <input name="telefono" placeholder="Teléfono" onChange={handleChange} value={form.telefono} />
            <input name="clave" placeholder="Clave" onChange={handleChange} value={form.clave} />

            <button onClick={createGerente}>Crear</button>

            <hr />

            {/* LISTA */}
            <ul>
                {gerentes.map(g => (
                    <li key={g.id}>
                        {g.nombre} {g.apellido}

                        <button onClick={() => deleteGerente(g.id)}>
                            ❌
                        </button>

                        <button onClick={() => updateGerente(g.id)}>
                            ✏️
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};