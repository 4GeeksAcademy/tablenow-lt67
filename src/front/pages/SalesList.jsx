import React, { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate, Link } from "react-router-dom"; 

export const SalesList = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                
                const response = await fetch(backendUrl + "/api/sales", {
                    headers: {
                        "Content-Type": "application/json",
                        "Bypass-Tunnel-Reminder": "true"
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log("Ventas recibidas del server:", data); 
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
        <div className="sales-page-wrapper">
            <div className="background-overlay"></div>

            <div className="container content-relative py-5">
                {/* Header Estilizado */}
                <div className="d-flex justify-content-between align-items-end mb-5">
                    <div>
                        <p className="brand-badge">Financial Records</p>
                        <h1 className="display-4 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Sales <span className="text-gold">History</span>
                        </h1>
                    </div>
                    <button className="btn-luxury-action" onClick={() => navigate("/new-sale")}>
                        + NEW RECEIPT
                    </button>
                </div>

                <div className="row g-4">
                    {store.sales && store.sales.length > 0 ? (
                        store.sales.map((sale) => (
                            <div className="col-12 col-md-6 col-lg-4" key={sale.id}>
                                {/* DISEÑO DE RECIBO PREMIUM */}
                                <div className="receipt-card-luxury">
                                    <div className="receipt-top-edge"></div>
                                    
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between mb-4">
                                            <span className="receipt-id">ID: #{sale.id.toString().padStart(5, '0')}</span>
                                            <span className={`receipt-status-badge ${sale.status === 'paid' ? 'status-paid' : 'status-pending'}`}>
                                                {sale.status.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <h5 className="receipt-title text-center mb-4">
                                            TRANSACTION RECEIPT
                                        </h5>
                                        
                                        <div className="receipt-divider"></div>
                                        
                                        <div className="receipt-info-row">
                                            <span>Date:</span>
                                            <span className="fw-bold">
                                                {new Date(sale.date + "Z").toLocaleDateString("es-VE", {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="receipt-info-row">
                                            <span>Method:</span>
                                            <span className="text-capitalize">{sale.payment_method}</span>
                                        </div>
                                        <div className="receipt-info-row">
                                            <span>Booking:</span> 
                                            <span className="text-capitalize fw-bold">
                                                {sale.customer_name ? sale.customer_name : "Walk-in Customer"}
                                            </span>
                                        </div>

                                        <div className="receipt-divider"></div>

                                        <div className="d-flex justify-content-between align-items-center my-4">
                                            <span className="total-label">TOTAL</span>
                                            <span className="total-amount">
                                                ${sale.total.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="mb-4">
                                            <Link to={`/add-items/${sale.id}`} className="btn-manage-items text-decoration-none d-block text-center">
                                                <i className="fas fa-utensils me-2"></i>MANAGE ITEMS
                                            </Link>
                                        </div>
                                        
                                        <div className="text-center receipt-footer">
                                            <p className="m-0 text-gold fw-bold">
                                                {sale.restaurante_nombre ? sale.restaurante_nombre : "TableNow Central"}
                                            </p>
                                            <p className="m-0 small text-muted">Luxury Hospitality Group</p>
                                        </div>
                                    </div>
                                    <div className="receipt-bottom-edge"></div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center mt-5">
                            <p className="text-muted fs-4" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic" }}>
                                No digital receipts found in the archive...
                            </p>
                        </div>
                    )}
                </div>
                
                <div className="mt-5">
                    <button className="btn-back-minimal" onClick={() => navigate("/")}>
                        ← BACK TO DASHBOARD
                    </button>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Montserrat:wght@200;400;600;700&display=swap');

                .sales-page-wrapper {
                    position: relative;
                    min-height: 100vh;
                    background-color: #050505;
                    background-image: url('https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=2070');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    font-family: 'Montserrat', sans-serif;
                }

                .background-overlay {
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%);
                    z-index: 1;
                }

                .content-relative { position: relative; z-index: 2; }

                .brand-badge {
                    color: #c5a47e;
                    text-transform: uppercase;
                    letter-spacing: 4px;
                    font-size: 0.7rem;
                    font-weight: 700;
                    margin-bottom: 0;
                }

                .text-gold { color: #c5a47e; font-style: italic; }

                /* Botón New Receipt */
                .btn-luxury-action {
                    background-color: #c5a47e;
                    color: #000;
                    border: none;
                    padding: 12px 25px;
                    font-weight: 700;
                    font-size: 0.8rem;
                    letter-spacing: 1px;
                    transition: all 0.3s ease;
                }
                .btn-luxury-action:hover {
                    background-color: #fff;
                    transform: translateY(-2px);
                }

                /* DISEÑO DE RECIBO */
                .receipt-card-luxury {
                    background: #fff;
                    color: #000;
                    position: relative;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    transition: transform 0.3s ease;
                }
                .receipt-card-luxury:hover {
                    transform: scale(1.02) rotate(1deg);
                }

                .receipt-top-edge {
                    height: 8px;
                    background-image: radial-gradient(circle, transparent 70%, #fff 70%);
                    background-size: 16px 16px;
                    background-position: 0 -8px;
                    width: 100%;
                }

                .receipt-bottom-edge {
                    height: 8px;
                    background-image: radial-gradient(circle, transparent 70%, #fff 70%);
                    background-size: 16px 16px;
                    background-position: 0 0;
                    width: 100%;
                }

                .receipt-id { color: #888; font-size: 0.75rem; letter-spacing: 1px; }

                .receipt-status-badge {
                    font-size: 0.65rem;
                    padding: 4px 10px;
                    font-weight: 800;
                    letter-spacing: 1px;
                }
                .status-paid { background: #d4edda; color: #155724; }
                .status-pending { background: #fff3cd; color: #856404; }

                .receipt-title {
                    font-family: 'Playfair Display', serif;
                    letter-spacing: 3px;
                    font-weight: 700;
                    border-bottom: 2px solid #000;
                    display: inline-block;
                    width: 100%;
                }

                .receipt-divider {
                    border-top: 1px dashed #ccc;
                    margin: 15px 0;
                }

                .receipt-info-row {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85rem;
                    margin-bottom: 8px;
                }

                .total-label { font-weight: 800; font-size: 1.2rem; }
                .total-amount { font-weight: 800; font-size: 1.5rem; color: #155724; }

                .btn-manage-items {
                    background: #000;
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 10px;
                    transition: 0.3s;
                }
                .btn-manage-items:hover { background: #c5a47e; color: #000; }

                .receipt-footer {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .btn-back-minimal {
                    background: transparent;
                    border: none;
                    color: #888;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 2px;
                    transition: 0.3s;
                }
                .btn-back-minimal:hover { color: #c5a47e; }
            `}</style>
        </div>
    );
};