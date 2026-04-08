import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function EditHost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [phone, setPhone] = useState("")
    const [totalVisits, setTotalVisits] = useState(0)
    const [lastVisit, setLastVisit] = useState("")
    const [specialNotes, setSpecialNotes] = useState("")

    useEffect(() => {
        // fetch(`https://musical-space-rotary-phone-97g4v5q4wvrxh9pwr-3001.app.github.dev/api/host/${id}`)
        //     .then(response => response.json())
        //     .then(data => setHostData(data))
        const fetchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host/" + id, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await response.json();
                console.log("Fetched host data:", data);
                setFirstName(data.first_name);
                setLastName(data.last_name);
                setEmail(data.email);
                setPassword(data.password);
                setPhone(data.phone_number);
                setTotalVisits(data.total_visits);
                setLastVisit(data.last_visit);
                setSpecialNotes(data.special_notes);
            } catch (error) {
                console.log("Error fetching host data:", error);
            }
        }
        fetchData()
    }, []);


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
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/host/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(hostData)
            });
            if (response.ok) {
                navigate("/hosts");
            }
        } catch (error) {
            console.error("Error updating host:", error);
        }
    };

    return (
        <div className="container">
            <h1 className="text-center">Edit host</h1>
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
                        <label className="form-label">Phone number</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="phone" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">Total visits</label>
                        <input type="number" value={totalVisits} onChange={(e) => setTotalVisits(e.target.value)} className="form-control" id="totalVisits" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">Last visit</label>
                        <input type="text" value={lastVisit} onChange={(e) => setLastVisit(e.target.value)} className="form-control" id="lastVisit" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-md-7">
                        <label className="form-label">Special notes</label>
                        <input type="text" value={specialNotes} onChange={(e) => setSpecialNotes(e.target.value)} className="form-control" id="specialNotes" required />
                        <div className="valid-feedback">
                            Looks good!
                        </div>
                    </div>

                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">Update host</button>
                        <Link to="/hosts">
                            <button className="btn btn-secondary mx-2">Back to Hosts</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditHost;