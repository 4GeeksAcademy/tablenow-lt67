import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";



function Restaurant (){

    const navigate = useNavigate()

    const [restaurant, setRestaurant] = useState({})

    const { restaurantId } = useParams()

     useEffect(() => async () => {
    try {
      const response = await
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurant/" + restaurantId)
      const data = await response.json()
      setRestaurant(data)

    } catch (error) {
      console.log(error)
    }
  }, [])

    return (
        <>
            <h1>Restaurant Details</h1>
            <ul>
                <li>Owner ID: {restaurant.id_owner}</li>
                <li>Name: {restaurant.name}</li>
                <li>Address: {restaurant.address}</li>
                <li>Phone: {restaurant.phone}</li>
            </ul>
            <button onClick={()=> navigate("/restaurants")} className="btn btn-primary">Back to restaurants</button>
        </>
    )
}


export default Restaurant