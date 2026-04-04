import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const HostDetail = () => {
    const { id } = useParams();
    const[hostData, setHostData] = useState({});

    useEffect(() => {
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
                setHostData(data);
            } catch (error) {
                console.log("Error fetching host data:", error);
            }
        }
        fetchData()
    }, []);
    return (
        <div className="container">
            <h1 className="text-center">View host</h1>
            <div className="d-flex justify-content-center">
                <div class="card w-50">
                    <div class="card-header text-center">
                        <h3>
                            {hostData.first_name} {hostData.last_name}
                        </h3>
                    </div>
                    <div class="card-body">
                        <p className="text-left">email: <strong>{hostData.email}</strong></p>
                        <p className="text-left">phone number: <strong>{hostData.phone_number}</strong></p>
                        <p className="text-left">total visits: <strong>{hostData.total_visits}</strong></p>
                        <p className="text-left">last visit: <strong>{hostData.last_visit}</strong></p>
                        <p className="text-left">special notes: <strong>{hostData.special_notes}</strong></p>
                    </div>
                    <div className="card-footer text-body-secondary float-end">
                        <Link to="/hosts">
                            <button className="btn btn-secondary float-end">Back to Hosts</button>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default HostDetail