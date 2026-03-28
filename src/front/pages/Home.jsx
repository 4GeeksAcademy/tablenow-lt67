import React, { useEffect } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();
	const navigate = useNavigate()

  const loadMessage = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

      const response = await fetch(backendUrl + "/api/hello");
      const data = await response.json();

      if (response.ok) dispatch({ type: "set_hello", payload: data.message });

      return data;

    } catch (error) {
      if (error.message) throw new Error(
        `Could not fetch the message from the backend.
        Please check if the backend is running and the backend port is public.`
      );
    }
  };

  const loadSales = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(backendUrl + "/api/sales");
      const data = await response.json();
      if (response.ok) dispatch({ type: "set_sales", payload: data });
    } catch (error) {
      console.error("Error loading sales", error);
    }
  };

  useEffect(() => {
    loadMessage();
    loadSales();
  }, []);
	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>

{/*BOTÓN DE GERENTES*/}
      <div className="my-4">
        <button 
          className="btn btn-success btn-lg shadow" 
          onClick={() => navigate("/gerentes")}
        >
          Acceder a Gestión de Gerentes
        </button>
      </div>

			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>
			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
			<button className="btn btn-primary" onClick={()=>navigate("/clients")}>Clients</button>
			<button className="btn btn-primary" onClick={()=>navigate("/owners")}>Owners</button>
		  <button className="btn btn-success" onClick={() => navigate("/new-sale")}>New Sale</button>
    </div>
	);
};