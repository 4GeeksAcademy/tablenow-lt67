import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom"; // Importación corregida

export const SalesList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                const response = await fetch(backendUrl + "/api/ventas", {
                    headers: {
                        "Content-Type": "application/json",
                        "Bypass-Tunnel-Reminder": "true"
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    dispatch({ type: "set_sales", payload: data });
                } else {
                    console.error("Error en la respuesta del servidor");
                }
            } catch (error) {
                console.error("Error cargando ventas:", error);
            }
        };
        fetchSales();
    }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Sales History</h2>
                <button className="btn btn-primary shadow-sm" onClick={() => navigate("/new-sale")}>
                    + New Receipt
                </button>
            </div>

            <div className="row">
                {store.sales && store.sales.length > 0 ? (
                    store.sales.map((sale) => (
                        <div className="col-md-4 mb-4" key={sale.id}>
                            {/* DISEÑO DE RECIBO */}
                            <div className="card border-0 shadow-sm" style={{ borderLeft: "5px solid #198754" }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted small">#{sale.id.toString().padStart(5, '0')}</span>
                                        <span className={`badge ${sale.status === 'paid' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                            {sale.status.toUpperCase()}
                                        </span>
                                    </div>
                                    
                                    <h5 className="text-center my-3 fw-bold text-uppercase" style={{ letterSpacing: "2px" }}>
                                        Receipt
                                    </h5>
                                    
                                    <hr className="border-secondary border-1 opacity-25" />
                                    
                                    <div className="d-flex justify-content-between my-2">
                                        <span>Date:</span>
                                        <span className="fw-medium">{sale.date}</span>
                                    </div>
                                    <div className="d-flex justify-content-between my-2">
                                        <span>Method:</span>
                                        <span className="text-capitalize">{sale.payment_method}</span>
                                    </div>
                                    <div className="d-flex justify-content-between my-2">
                                <span>Booking:</span> 
                                    <span className="fw-bold text-capitalize">
                                            {sale.customer_name ? sale.customer_name : "Walk-in Customer"}
                                    </span>
                                    </div>
                                    <hr className="border-secondary border-1 opacity-25" />

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <span className="h5 mb-0 fw-bold">TOTAL</span>
                                        <span className="h4 mb-0 fw-bold text-success">
                                            ${sale.total.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <Link to={`/add-items/${sale.id}`} className="btn btn-outline-primary btn-sm w-100 shadow-sm">
                                            <i className="fas fa-utensils me-2"></i>Manage Items
                                        </Link>
                                    </div>
                                    
                                    <div className="text-center mt-4 pt-2 border-top border-dashed">
                                        <p className="small text-muted mb-0">
                                            {sale.restaurante_nombre ? sale.restaurante_nombre : "TableNow Central"}
                                        </p>
                                        <p className="small text-muted">Thank you for your visit!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center mt-5">
                        <p className="text-muted">No receipts found. Try registering a new sale.</p>
                    </div>
                )}
            </div>
            
            <button className="btn btn-outline-secondary mt-3" onClick={() => navigate("/")}>
                Back to Home
            </button>
        </div>
    );
};