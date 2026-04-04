import React, { useState } from "react"
import { Link } from "react-router-dom"

const NewHost = () => {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [totalVisits, setTotalVisits] = useState(0)
    const [lastVisit, setLastVisit] = useState("")
    const [specialNotes, setSpecialNotes] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const hostData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone_number: phone,
            total_visits: totalVisits,
            last_visit: lastVisit,
            special_notes: specialNotes
        };

        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(hostData)
            });

            if (response.ok)
                alert("Host saved successfully");
            handleReset(e);
        } catch (error) {
            console.error("Error creating host:", error);
        }
    }

    const handleReset = (e) => {
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setTotalVisits(0);
        setLastVisit("");
        setSpecialNotes("");
    }

    return (

        <div className="container">
            <h1 className="text-center">Create new host</h1>
            <div className="d-flex justify-content-center">
                <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="form-control" id="firstName" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="form-control" id="lastName" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Email</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label">Phone number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Total visits</label>
                        <input type="number" value={totalVisits} onChange={(e) => setTotalVisits(e.target.value)} className="form-control" id="totalVisits" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Last visit</label>
                        <input type="date" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} className="form-control" id="lastVisit" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Special notes</label>
                        <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="form-control" id="specialNotes" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Add host</button>
                        <button type="button" className="btn btn-secondary mx-2" onClick={(e) => handleReset(e)}>Reset</button>
                        <Link to="/hosts">
                            <button className="btn btn-secondary">Back to Hosts</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewHost
