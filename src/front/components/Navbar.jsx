import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">TableNow</span>
                </Link>
                <div className="ml-auto d-flex">
                    
                    <Link to="/menus">
                        <button className="btn btn-success me-2">Gestionar Menú</button>
                    </Link>

                    <Link to="/ventas">
                        <button className="btn btn-warning me-2">Ventas</button>
                    </Link>

                    <Link to="/demo">
                        <button className="btn btn-primary">Check the Context</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};