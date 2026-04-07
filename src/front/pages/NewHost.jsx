import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

const NewHost = () => {
    const { store, actions } = useGlobalReducer();
    
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [totalVisits, setTotalVisits] = useState(0);
    const [lastVisit, setLastVisit] = useState("");
    const [specialNotes, setSpecialNotes] = useState("");

    
    useEffect(() => {
        actions.getAllRestaurantsPublic();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        const restaurantId = store.restaurants && store.restaurants.length > 0 
            ? store.restaurants[0].id 
            : null;

        if (!restaurantId) {
            alert("Error: No se encontró un restaurante asociado. Por favor, espera a que carguen los datos.");
            return;
        }

        const hostData = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
            phone_number: phone,
            total_visits: parseInt(totalVisits),
            last_visit: lastVisit || null,
            special_notes: specialNotes,
            restaurante_id: restaurantId 
        };

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify(hostData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Host saved successfully");
                handleReset();
            } else {
                alert("Error: " + (data.message || "Internal Server Error"));
            }
        } catch (error) {
            console.error("Error creating host:", error);
        }
    };

    const handleReset = () => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setTotalVisits(0);
        setLastVisit("");
        setSpecialNotes("");
    };

    return (
        <div className="container">
            <h1 className="text-center">Create new host</h1>
            <div className="d-flex justify-content-center">
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" id="firstName" required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" id="lastName" required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Phone number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Total visits</label>
                        <input type="number" value={totalVisits} onChange={(e) => setTotalVisits(e.target.value)} className="form-control" id="totalVisits" required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Last visit</label>
                        <input type="date" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} className="form-control" id="lastVisit" required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Special notes</label>
                        <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="form-control" id="specialNotes" required />
                    </div>
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Add host</button>
                        <button type="button" className="btn btn-secondary mx-2" onClick={handleReset}>Reset</button>
                        <Link to="/hosts">
                            <button type="button" className="btn btn-secondary">Back to Hosts</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewHost;