import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useParams, useNavigate } from "react-router-dom";

export const AddItemsToSale = () => {
    const { saleId } = useParams();
    const navigate = useNavigate();
    const { store, actions } = useGlobalReducer();
    const [itemId, setItemId] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        actions.getMenus(); 
        if (saleId) actions.getItemsBySale(saleId);
    }, [saleId]);

    const currentItems = store.item_ventas.filter(i => 
        (i.id_venta == saleId) || (i.venta_id == saleId)
    );
    const totalAcumulado = currentItems.reduce((acc, item) => acc + item.subtotal, 0);

    const handleFinalizar = async () => {
        if (confirm(`Do you want to finalize the bill for a total of $${totalAcumulado.toFixed(2)}?`)) {
            const success = await actions.finalizarVenta(saleId);
            if (success) {
                alert("Sale finalized successfully");
                navigate("/sales"); 
            }
        }
    };

    const handleAdd = async () => {
        if (!itemId) return alert("Please select a dish from the menu");

        const selectedMenu = store.menus.find(m => m.id == parseInt(itemId));
        if (!selectedMenu) return alert("Dish information not found");

        const newItem = {
            id_venta: parseInt(saleId),
            id_menu: selectedMenu.id, 
            cantidad: parseInt(quantity),
            precio_unitario: parseFloat(selectedMenu.precio),
            subtotal: parseInt(quantity) * parseFloat(selectedMenu.precio)
        };

        const success = await actions.createItemVenta(newItem);

        if (success) {
            setItemId("");
            setQuantity(1);
            await actions.getItemsBySale(saleId); 
        } else {
            alert("Error adding to ticket. Please check console.");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to remove this item from the order?")) {
            const success = await actions.deleteItemVenta(id);
            if (success) actions.getItemsBySale(saleId);
        }
    };

    const styles = {
        mainWrapper: {
            backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            color: "#fff",
            fontFamily: "'Inter', sans-serif",
            padding: "40px 0"
        },
        headerTitle: {
            fontFamily: "'Playfair Display', serif",
            color: "#c5a47e",
            letterSpacing: "1px",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
        },
        customCard: {
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(197, 164, 126, 0.3)",
            borderRadius: "15px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.8)"
        },
        inputStyle: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(197, 164, 126, 0.5)",
            color: "#fff",
            borderRadius: "8px"
        },
        goldButton: {
            backgroundColor: "#c5a47e",
            color: "#000",
            border: "none",
            fontWeight: "700",
            borderRadius: "8px",
            transition: "all 0.3s ease",
            textTransform: "uppercase",
            letterSpacing: "1px"
        },
        outlineButton: {
            border: "1px solid #c5a47e",
            color: "#fff",
            borderRadius: "8px",
            backgroundColor: "transparent",
            backdropFilter: "blur(5px)"
        },
        tableHeader: {
            color: "#c5a47e",
            textTransform: "uppercase",
            fontSize: "12px",
            letterSpacing: "2px",
            borderBottom: "1px solid rgba(197, 164, 126, 0.3)",
            backgroundColor: "rgba(0,0,0,0.2)"
        },
        deleteBtn: {
            color: "#c5a47e", // Cambiado de rojo a dorado
            transition: "transform 0.2s ease",
            cursor: "pointer"
        }
    };

    return (
        <div style={styles.mainWrapper}>
            <div className="container">
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h2 style={styles.headerTitle} className="display-6">Order for Sale #{saleId}</h2>
                        <p className="text-white opacity-75 mb-0">Manage items and finalize consumption for the selected table.</p>
                    </div>
                    <button 
                        style={styles.outlineButton} 
                        className="btn btn-sm px-4" 
                        onClick={() => navigate("/sales")}
                    >
                        <i className="fas fa-arrow-left me-2"></i> Back to Sales
                    </button>
                </div>

                {/* Adding Form Section */}
                <div className="card p-4 mb-5" style={styles.customCard}>
                    <div className="row g-3 align-items-end">
                        <div className="col-md-6">
                            <label className="form-label text-white small fw-bold text-uppercase">Select Menu Item</label>
                            <select 
                                className="form-select" 
                                style={styles.inputStyle}
                                value={itemId} 
                                onChange={(e) => setItemId(e.target.value)}
                            >
                                <option value="" className="bg-dark text-white">Choose a dish...</option>
                                {store.menus && store.menus.map((m) => (
                                    <option key={m.id} value={m.id} className="bg-dark text-white">
                                        {m.nombre} — ${parseFloat(m.precio).toFixed(2)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label text-white small fw-bold">Quantity</label>
                            <input 
                                type="number" 
                                className="form-control text-center" 
                                style={styles.inputStyle}
                                min="1" 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)} 
                            />
                        </div>
                        <div className="col-md-4">
                            <button 
                                className="btn w-100 py-2 shadow-sm" 
                                style={styles.goldButton} 
                                onClick={handleAdd}
                            >
                                <i className="fas fa-plus-circle me-2"></i> ADD TO TICKET
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="card overflow-hidden mb-4" style={styles.customCard}>
                    <div className="card-header border-0 bg-transparent py-3">
                        <h5 className="mb-0 fw-bold text-white">Consumption Summary</h5>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle mb-0 bg-transparent">
                            <thead>
                                <tr>
                                    <th style={styles.tableHeader} className="ps-4">Dish Name</th>
                                    <th style={styles.tableHeader} className="text-center">Qty</th>
                                    <th style={styles.tableHeader} className="text-end">Unit Price</th>
                                    <th style={styles.tableHeader} className="text-end">Subtotal</th>
                                    <th style={styles.tableHeader} className="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-transparent">
                                {currentItems.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <i className="fas fa-utensils d-block mb-3 fs-2" style={{color: "#c5a47e"}}></i>
                                            <span style={{color: "#c5a47e", fontWeight: "600", fontSize: "1.1rem"}}>
                                                No items added to this order yet.
                                            </span>
                                        </td>
                                    </tr>
                                ) : (
                                    currentItems.map((item) => {
                                        const precio = parseFloat(item.precio_unitario) || 0;
                                        const cantidad = parseInt(item.cantidad) || 0;
                                        const subtotal = item.subtotal ? parseFloat(item.subtotal) : (precio * cantidad);

                                        return (
                                            <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                                                <td className="ps-4 py-3 fw-bold text-white">{item.plato_nombre || `Dish ID: ${item.id_menu}`}</td>
                                                <td className="text-center">
                                                    <span className="badge rounded-pill" style={{ border: "1px solid #c5a47e", color: "#c5a47e", padding: "8px 12px" }}>
                                                        {cantidad}
                                                    </span>
                                                </td>
                                                <td className="text-end text-white opacity-75">${precio.toFixed(2)}</td>
                                                <td className="text-end fw-bold" style={{ color: "#c5a47e" }}>${subtotal.toFixed(2)}</td>
                                                <td className="text-center">
                                                    <button 
                                                        className="btn btn-link p-0" 
                                                        style={styles.deleteBtn}
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <i className="fas fa-trash-alt"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Finalize Footer */}
                <div className="d-flex justify-content-end align-items-center p-4 rounded" style={styles.customCard}>
                    <div className="me-5 text-end">
                        <span className="text-white opacity-75 d-block small text-uppercase fw-bold">Current Balance</span>
                        <span className="h1 fw-bold" style={{ color: "#c5a47e" }}>${totalAcumulado.toFixed(2)}</span>
                    </div>
                    <button 
                        className="btn btn-lg px-5 py-3 shadow" 
                        style={styles.goldButton}
                        onClick={handleFinalizar}
                        disabled={currentItems.length === 0}
                    >
                        FINALIZE & CHECKOUT
                    </button>
                </div>
            </div>
        </div>
    );
};