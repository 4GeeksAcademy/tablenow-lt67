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

    // --- LÓGICA DE CÁLCULO Y FINALIZACIÓN ---
    const currentItems = store.item_ventas.filter(i => i.id_venta == saleId);
    const totalAcumulado = currentItems.reduce((acc, item) => acc + item.subtotal, 0);

    const handleFinalizar = async () => {
        if (confirm(`¿Deseas finalizar la cuenta por un total de $${totalAcumulado.toFixed(2)}?`)) {
            const success = await actions.finalizarVenta(saleId);
            if (success) {
                alert("Venta finalizada con éxito");
                navigate("/sales"); 
            }
        }
    };

  const handleAdd = async () => {
        if (!itemId) return alert("Por favor, selecciona un plato");

        const listaPlatos = store.menus || store.menu; 
        const selectedMenu = listaPlatos.find(m => m.id == parseInt(itemId));
        
        if (!selectedMenu) return alert("No se encontró el plato");

        const newItem = {
            id_venta: parseInt(saleId),
            id_menu: parseInt(itemId),
            cantidad: parseInt(quantity),
            precio_unitario: parseFloat(selectedMenu.precio),
            subtotal: parseFloat(selectedMenu.precio) * parseInt(quantity)
        };

        const success = await actions.createItemVenta(newItem);
        if (success) {
            setItemId("");
            setQuantity(1);
            actions.getItemsBySale(saleId);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("¿Estás seguro de quitar este plato del pedido?")) {
            await actions.deleteItemVenta(id);
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>🛒 Pedido para Venta #{saleId}</h3>
                <button className="btn btn-outline-secondary" onClick={() => navigate("/sales")}>
                    Volver a Ventas
                </button>
            </div>

            {/* FORMULARIO DE AGREGAR */}
            <div className="card p-4 shadow-sm mb-4 bg-light">
                <div className="row g-3 align-items-end">
                   <div className="col-md-6">
    <label className="form-label fw-bold">Seleccionar Restaurante</label>
    <select 
        className="form-select" 
        value={itemId} 
        onChange={(e) => setItemId(e.target.value)}
    >
        <option value="">Selecciona un local...</option>
                {store.restaurants && store.restaurants.map((rest) => (
                    <option key={rest.id} value={rest.id}>
                {rest.nombre} 
                    </option>
                    ))}
            </select>
                </div>
                    <div className="col-md-2">
                        <label className="form-label fw-bold">Cant.</label>
                        <input type="number" className="form-control" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-success w-100" onClick={handleAdd}>
                            <i className="fas fa-plus me-2"></i>Añadir al Ticket
                        </button>
                    </div>
                </div>
            </div>

            {/* TABLA DE PRODUCTOS AGREGADOS */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-white">
                    <h5 className="mb-0">Resumen del Consumo</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Plato</th>
                                <th className="text-center">Cant.</th>
                                <th className="text-end">Precio Unit.</th>
                                <th className="text-end">Subtotal</th>
                                <th className="text-center">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.plato_nombre && item.plato_nombre !== "N/A" 
                                            ? item.plato_nombre 
                                            : store.restaurants.find(r => r.id === item.id_menu)?.nombre || `ID: ${item.id_menu}`
                                        }
                                    </td>
                                    <td className="text-center">{item.cantidad}</td>
                                    <td className="text-end">${item.precio_unitario.toFixed(2)}</td>
                                    <td className="text-end fw-bold">${item.subtotal.toFixed(2)}</td>
                                    <td className="text-center">
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item.id)}>
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {currentItems.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4">No hay platos agregados a esta venta todavía.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- PIE DE PÁGINA: TOTAL Y FINALIZAR --- */}
            <div className="d-flex justify-content-end align-items-center mt-3 p-3 bg-white shadow-sm rounded border">
                <div className="me-4 text-end">
                    <span className="text-muted d-block small">Total acumulado:</span>
                    <span className="h3 fw-bold text-success">${totalAcumulado.toFixed(2)}</span>
                </div>
                <button 
                    className="btn btn-primary btn-lg px-4 shadow" 
                    onClick={handleFinalizar}
                    disabled={currentItems.length === 0}
                >
                    <i className="fas fa-check-circle me-2"></i>Finalizar y Cobrar
                </button>
            </div>
        </div>
    );
};