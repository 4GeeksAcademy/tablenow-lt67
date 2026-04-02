import React from "react";
import { Outlet } from "react-router-dom"; // Importamos Outlet
import ScrollToTop from "../components/ScrollToTop.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx"; 
import injectContext from "../store.js"; 

const Layout = () => {
    return (
        <div>
            <ScrollToTop>
                <Navbar />
                {/* Outlet es el espacio donde se renderizan las rutas hijas de routes.js */}
                <Outlet /> 
            </ScrollToTop>
        </div>
    );
};

export default injectContext(Layout);