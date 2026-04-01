import React from "react"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"


function Restaurants() {

    const navigate = useNavigate()
    const [restaurants, setRestaurants] = useState([])

    async function getRestaurants() {
        try{
            const response = await
            fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants")
            const data = await response.json()
            setRestaurants(data)
            
        } catch(error){
            console.log(error)
        }
        
    }

    useEffect(() => {
        getRestaurants()
        console.log("la pagina cargo")
    }, [])

    function deleteRestaurant(id) {
        const requestOptions = {
            method: "DELETE",
            redirect: "follow"
        };
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurant/" + id, requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result)
                getRestaurants()
            })
            .catch((error) => console.error(error));
    }

    return (
        <>
            <ol>
                {restaurants.map((restaurant) => {
                    return (<li key={restaurant.id}>
                        Id: {restaurant.id} <br />
                        Owner ID: {restaurant.id_owner} <br />
                        name: {restaurant.name} <br />
                        address: {restaurant.address} <br />
                        phone: {restaurant.phone} <br />
                        total capacity: {restaurant.total_capacity} <br />
                        <button className="btn btn-primary" onClick={()=>{
                            navigate('/edit_restaurant/'+restaurant.id)
                            }}>Edit</button>
                        <Link to={"/restaurant/"+restaurant.id} className="btn btn-primary">See details</Link>
                        <button className="btn btn-danger" onClick={()=>deleteRestaurant(restaurant.id)}>Delete</button>
                    </li>)
                })}
            </ol>
            <button className="btn btn-primary" onClick={()=>navigate('/new_restaurant')}>Create a new restaurant</button>
        </>
    )
}

export default Restaurants