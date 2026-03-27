import { Link } from "react-router-dom";

export const Navbar = () => {

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1">TableNow</span>
                </Link>
                <div className="ml-auto d-flex"> {/* Añadí d-flex para que los botones salgan uno al lado del otro */}
                    
                    {/* BOTÓN PARA TUS MENÚS */}
                    <Link to="/menus">
                        <button className="btn btn-success me-2">Gestionar Menú</button>
                    </Link>

                    <Link to="/demo">
                        <button className="btn btn-primary">Check the Context</button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};