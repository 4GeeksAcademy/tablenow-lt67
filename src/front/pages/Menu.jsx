import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Menu = () => {
    const { store, dispatch } = useGlobalReducer();
    const [editMode, setEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        nombre: "",
        categoria: "",
        precio: "",
        restaurante_id: "",
        foto: ""
    });

    // Functional Logic (Untouched)
    const getRestauranteNombre = (id) => {
        if (!store.restaurants) return "Loading...";
        const resto = store.restaurants.find(r => r.id === parseInt(id));
        return resto ? (resto.nombre || resto.name) : "Unknown";
    };

    const sincronizarRestaurante = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants");
            if (resp.ok) {
                const data = await resp.json();
                dispatch({ type: "set_restaurants", payload: data });
                if (data.length > 0 && !formData.restaurante_id) {
                    setFormData(prev => ({ ...prev, restaurante_id: data[0].id }));
                }
            }
        } catch (error) {
            console.error("Error synchronizing restaurant", error);
        }
    };

    const getMenus = async () => {
        try {
            const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/menus");
            if (!resp.ok) throw new Error("Error fetching menus");
            const data = await resp.json();
            dispatch({ type: "set_menus", payload: data });
        } catch (error) {
            console.error("Error loading menus", error);
        }
    };

    const handleFileUpload = async (e) => {
        const files = e.target.files;
        if (files.length === 0) return;
        setUploading(true);
        const data = new FormData();
        data.append("file", files[0]);
        data.append("upload_preset", "TableNow");

        try {
            const resp = await fetch("https://api.cloudinary.com/v1_1/dfq0tzllo/image/upload", {
                method: "POST",
                body: data
            });
            const file = await resp.json();
            if (file.secure_url) {
                setFormData(prev => ({ ...prev, foto: file.secure_url }));
            }
        } catch (error) {
            alert("Error uploading image to Cloudinary");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.restaurante_id) return alert("Please select a restaurant");
        const url = editMode 
            ? `${import.meta.env.VITE_BACKEND_URL}/api/menus/${currentId}`
            : `${import.meta.env.VITE_BACKEND_URL}/api/menus`;
        try {
            const resp = await fetch(url, {
                method: editMode ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (resp.ok) {
                setFormData({ nombre: "", categoria: "", precio: "", restaurante_id: formData.restaurante_id, foto: "" });
                setEditMode(false);
                setCurrentId(null);
                getMenus();
            }
        } catch (error) {
            console.error("Error processing dish", error);
        }
    };

    const handleEditClick = (item) => {
        setEditMode(true);
        setCurrentId(item.id);
        setFormData({
            nombre: item.nombre,
            categoria: item.categoria,
            precio: item.precio,
            restaurante_id: item.restaurante_id,
            foto: item.foto || ""
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/menus/${id}`, {
                method: "DELETE"
            });
            if (response.ok) getMenus();
        } catch (error) {
            console.error("Error deleting item", error);
        }
    };

    useEffect(() => {
        getMenus();
        sincronizarRestaurante();
    }, []);

    // Constant Styles
    const goldColor = "#c5a47e";
    
    const backgroundWrapper = {
        background: `linear-gradient(rgba(15, 15, 15, 0.92), rgba(15, 15, 15, 0.92)), url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        color: "#e0e0e0",
        fontFamily: "'Playfair Display', serif"
    };

    const glassStyle = {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        border: `1px solid rgba(197, 164, 126, 0.25)`,
        borderRadius: "15px",
        color: goldColor
    };

    const inputStyle = {
        background: "rgba(0, 0, 0, 0.4)",
        border: `1px solid rgba(197, 164, 126, 0.4)`,
        color: "#ffffff",
        borderRadius: "8px"
    };

    return (
        <div style={backgroundWrapper} className="container-fluid py-5">
            <style>
                {`
                    input::placeholder, select::placeholder { color: rgba(255, 255, 255, 0.5) !important; }
                    input:focus, select:focus { background-color: rgba(0,0,0,0.6) !important; color: white !important; border-color: ${goldColor} !important; box-shadow: 0 0 0 0.25rem rgba(197, 164, 126, 0.25) !important; }
                    .form-select option { background: #1a1a1a; color: white; }
                `}
            </style>

            <div className="container">
                <header className="text-center mb-5">
                    <h1 style={{ color: goldColor, fontWeight: "700", letterSpacing: "3px", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}>
                        <i className="fas fa-scroll me-3"></i>MENUS & CARDS
                    </h1>
                    <p style={{ color: "rgba(255, 255, 255, 0.8)", fontStyle: "italic", fontSize: "1.1rem" }}>
                        Design an unforgettable gastronomic experience
                    </p>
                </header>

                <div className="row g-4">
                    {/* Creation/Edition Panel */}
                    <div className="col-lg-4">
                        <div className="card p-4 shadow-lg" style={glassStyle}>
                            <h4 className="mb-4 text-center" style={{ color: goldColor, borderBottom: `1px solid ${goldColor}`, paddingBottom: "10px" }}>
                                {editMode ? 'Refine Dish' : 'New Entry'}
                            </h4>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small text-uppercase fw-bold" style={{ color: "white" }}>Host Restaurant</label>
                                    <select 
                                        className="form-select" 
                                        style={inputStyle}
                                        value={formData.restaurante_id}
                                        onChange={e => setFormData({...formData, restaurante_id: e.target.value})}
                                        required
                                    >
                                        <option value="">Select location...</option>
                                        {store.restaurants?.map(res => (
                                            <option key={res.id} value={res.id}>{res.nombre || res.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small text-uppercase fw-bold" style={{ color: "white" }}>Dish Name</label>
                                    <input 
                                        type="text" className="form-control" style={inputStyle}
                                        placeholder="e.g. Medium-rare Sirloin"
                                        value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} required
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-7 mb-3">
                                        <label className="form-label small text-uppercase fw-bold" style={{ color: "white" }}>Category</label>
                                        <input 
                                            type="text" className="form-control" style={inputStyle}
                                            placeholder="Starters, Steaks..."
                                            value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-md-5 mb-3">
                                        <label className="form-label small text-uppercase fw-bold" style={{ color: "white" }}>Price</label>
                                        <input 
                                            type="number" className="form-control" style={inputStyle}
                                            placeholder="0.00"
                                            value={formData.precio} onChange={e => setFormData({...formData, precio: e.target.value})} required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small text-uppercase fw-bold" style={{ color: "white" }}>Presentation Image</label>
                                    <div className="d-flex flex-column gap-2">
                                        <label className="btn btn-outline-light w-100" style={{ borderColor: goldColor, color: goldColor }}>
                                            {uploading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-upload me-2"></i>Upload Photo</>}
                                            <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                        </label>
                                        <input 
                                            type="text" className="form-control form-control-sm text-center" style={{...inputStyle, fontSize: "0.8rem"}}
                                            placeholder="Or paste direct link here"
                                            value={formData.foto} 
                                            onChange={(e) => setFormData({...formData, foto: e.target.value})} 
                                        />
                                    </div>

                                    {formData.foto && (
                                        <div className="mt-3 position-relative rounded overflow-hidden" style={{ border: `1px solid ${goldColor}`, height: "150px" }}>
                                            <img src={formData.foto} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                                 onError={(e) => e.target.src = "https://images.unsplash.com/photo-1495195129352-aec329a7ed7a?q=80&w=400&auto=format&fit=crop"} />
                                            <button type="button" className="btn btn-sm btn-dark position-absolute top-0 end-0 m-2" style={{ color: goldColor }} onClick={() => setFormData({...formData, foto: ""})}>
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn w-100 py-2 fw-bold text-uppercase" style={{ background: goldColor, color: "#000", border: "none" }} disabled={uploading}>
                                    {editMode ? 'Confirm Changes' : 'Add to Menu'}
                                </button>
                                {editMode && (
                                    <button onClick={() => { setEditMode(false); setFormData({nombre:"", categoria:"", precio:"", restaurante_id:"", foto:""}) }} className="btn btn-link w-100 mt-2 text-decoration-none" style={{ color: "#fff", opacity: "0.8" }}>
                                        Cancel Edition
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Stylized Menu List */}
                    <div className="col-lg-8">
                        <div className="row row-cols-1 row-cols-md-2 g-4">
                            {store.menus?.map((item) => (
                                <div key={item.id} className="col">
                                    <div className="card h-100 shadow-sm border-0" style={glassStyle}>
                                        <div className="position-relative">
                                            <img 
                                                src={item.foto || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=400&auto=format&fit=crop"} 
                                                className="card-img-top" 
                                                alt={item.nombre}
                                                style={{ height: "180px", objectFit: "cover", opacity: "0.9" }}
                                            />
                                            <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                                                <button className="btn btn-dark btn-sm shadow" style={{ color: goldColor, background: "rgba(0,0,0,0.8)" }} onClick={() => handleEditClick(item)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="btn btn-dark btn-sm shadow" style={{ color: goldColor, background: "rgba(0,0,0,0.8)" }} onClick={() => handleDelete(item.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                            <div className="position-absolute bottom-0 start-0 m-3">
                                                <span className="badge px-3 py-2" style={{ background: goldColor, color: "#000", fontSize: "1rem" }}>${item.precio}</span>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <h5 className="card-title mb-0" style={{ color: goldColor, fontWeight: "600" }}>{item.nombre}</h5>
                                                <small className="text-uppercase" style={{ fontSize: "0.75rem", color: "#fff", opacity: "0.7", letterSpacing: "1px" }}>{item.categoria}</small>
                                            </div>
                                            <div className="d-flex align-items-center mt-3 pt-3" style={{ borderTop: "1px solid rgba(197, 164, 126, 0.15)" }}>
                                                <i className="fas fa-map-marker-alt me-2" style={{ color: goldColor, fontSize: "0.8rem" }}></i>
                                                <span className="small" style={{ color: "rgba(255, 255, 255, 0.7)" }}>{getRestauranteNombre(item.restaurante_id)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {store.menus?.length === 0 && (
                            <div className="text-center py-5" style={glassStyle}>
                                <i className="fas fa-utensils mb-3 fa-3x" style={{ color: goldColor, opacity: "0.3" }}></i>
                                <p style={{ color: "white" }}>The menu is empty. Start creating exclusive dishes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};