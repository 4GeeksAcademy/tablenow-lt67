import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop.jsx";
import { Navbar } from "../components/Navbar.jsx";
import { Footer } from "../components/Footer.jsx"; 
import injectContext from "../store.js"; 

const Layout = () => {
    return (
        <div>
            <ScrollToTop>
                <Navbar />
                
                <Outlet /> 
                
            </ScrollToTop>
        </div>
    );
};

export default injectContext(Layout);