import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import RestaurantMap from "./RestaurantMap.jsx";

export const CrearRestaurante = () => {
    const { store, actions } = useGlobalReducer();
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [telefono, setTelefono] = useState("");
    const [capacidad, setCapacidad] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    
    const [categories, setCategories] = useState([]);
    const [categoryInput, setCategoryInput] = useState(""); 
    
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState(""); 

    const [openingTime, setOpeningTime] = useState("09:00");
    const [closingTime, setClosingTime] = useState("22:00");

    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const [loadingLocation, setLoadingLocation] = useState(false);

    const [uploading, setUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.tokenOwner) {
            actions.getOwnerRestaurants();
        }
    }, [store.tokenOwner]);

    const handleMapChange = (newLat, newLng) => {
        setLatitud(newLat);
        setLongitud(newLng);
    };

    const getLocation = () => {
        if (!navigator.geolocation) return alert("Your browser does not support geolocation");
        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitud(position.coords.latitude);
                setLongitud(position.coords.longitude);
                setLoadingLocation(false);
                alert("📍 Location captured successfully");
            },
            (error) => {
                setLoadingLocation(false);
                alert("Could not obtain location automatically.");
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
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
            if (file.secure_url) setImageUrl(file.secure_url);
        } catch (error) {
            alert("Error uploading image to Cloudinary");
        } finally {
            setUploading(false);
        }
    };

    const handleAddChip = (e, state, setState, inputState, setInputState) => {
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const val = inputState.trim();
            if (val && !state.some(item => item.toLowerCase() === val.toLowerCase())) {
                setState([...state, val]);
            }
            setInputState("");
        }
    };

    const removeChip = (indexToRemove, state, setState) => {
        setState(state.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!store.tokenOwner) return alert("No active session found.");
        if (!imageUrl) return alert("Please upload an image or paste a URL.");
        if (!latitud || !longitud) return alert("Please capture the GPS location.");

        const finalCategories = [...categories];
        if (categoryInput.trim()) finalCategories.push(categoryInput.trim());
        
        const finalTags = [...tags];
        if (tagInput.trim()) finalTags.push(tagInput.trim());

        setIsSubmitting(true);
        try {
            const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/restaurants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.tokenOwner}`
                },
                body: JSON.stringify({
                    nombre,
                    direccion,
                    telefono,
                    capacidad_total: parseInt(capacidad, 10) || 0,
                    image_url: imageUrl,
                    latitud,
                    longitud,
                    category: finalCategories.length > 0 ? finalCategories.join(", ") : "General",
                    tags: finalTags.length > 0 ? finalTags.join(", ") : "Standard",
                    opening_time: openingTime,
                    closing_time: closingTime
                })
            });

            if (response.ok) {
                setNombre(""); setDireccion(""); setTelefono(""); setCapacidad("");
                setImageUrl(""); setLatitud(null); setLongitud(null);
                setCategories([]); setCategoryInput("");
                setTags([]); setTagInput(""); 
                await actions.getOwnerRestaurants();
                alert("Restaurant added successfully!");
            } else {
                const errorData = await response.json();
                alert("Error: " + (errorData.msg || "Could not create restaurant"));
            }
        } catch (error) {
            alert("Connection error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            const exito = await actions.deleteRestaurant(id);
            if (exito) alert("Restaurant deleted successfully");
        }
    };

    const handleEdit = async (id, nombreActual) => {
        const nuevoNombre = prompt("New name for the restaurant:", nombreActual);
        if (nuevoNombre && nuevoNombre !== nombreActual) {
            await actions.updateRestaurant(id, { nombre: nuevoNombre });
        }
    };

    const styles = {
        mainContainer: {
            backgroundImage: 'url("https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
            paddingTop: '50px',
            paddingBottom: '50px',
            color: '#fff',
            position: 'relative'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%)',
            minHeight: '100vh',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
        },
        content: {
            position: 'relative',
            zIndex: 2
        },
        glassCard: {
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '15px',
            color: '#fff',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8)'
        },
        input: {
            background: 'rgba(255, 255, 255, 0.29)',
            border: '1px solid rgba(197, 164, 126, 0.3)',
            color: '#fff',
            borderRadius: '8px'
        },
        goldButton: {
            backgroundColor: '#c5a47e',
            border: 'none',
            color: '#000',
            fontWeight: 'bold',
            transition: '0.3s'
        },
        goldOutline: {
            border: '1px solid #c5a47e',
            color: '#c5a47e',
            background: 'transparent'
        },
        badgeGold: {
            backgroundColor: '#c5a47e',
            color: '#000'
        },
        tagLight: {
            color: '#c5a47e',
            border: '1px solid rgba(197, 164, 126, 0.5)',
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: '4px'
        }
    };

    return (
        <div style={styles.mainContainer}>
            <div style={styles.overlay}></div>
            <div className="container" style={styles.content}>
                <div className="row">
                    {/* CREATION FORM */}
                    <div className="col-md-4 mb-4">
                        <div className="card p-4 border-0" style={styles.glassCard}>
                            <h4 className="fw-bold mb-1" style={{color: '#c5a47e'}}>
                                <i className="fas fa-plus-circle me-2"></i>New Venue
                            </h4>
                            <p className="text-light opacity-75 small mb-4">Define your style and location.</p>
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Restaurant Name</label>
                                    <input type="text" className="form-control text-white shadow-none" style={styles.input} placeholder="e.g., La Trattoria Premium" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold mb-1">Categories</label>
                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                        {categories.map((cat, index) => (
                                            <span key={index} className="badge d-flex align-items-center" style={styles.badgeGold}>
                                                {cat}
                                                <i className="fas fa-times ms-2" style={{cursor: 'pointer', fontSize: '0.65rem'}} onClick={() => removeChip(index, categories, setCategories)}></i>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm text-white shadow-none" 
                                        style={styles.input}
                                        placeholder="Grill, Sushi..." 
                                        value={categoryInput} 
                                        onChange={(e) => setCategoryInput(e.target.value)}
                                        onKeyDown={(e) => handleAddChip(e, categories, setCategories, categoryInput, setCategoryInput)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold mb-1">Tags / Ambiance</label>
                                    <div className="d-flex flex-wrap gap-1 mb-2">
                                        {tags.map((tag, index) => (
                                            <span key={index} className="badge border text-white d-flex align-items-center" style={{borderColor: '#c5a47e'}}>
                                                {tag}
                                                <i className="fas fa-times ms-2" style={{cursor: 'pointer', fontSize: '0.65rem'}} onClick={() => removeChip(index, tags, setTags)}></i>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        className="form-control form-control-sm text-white shadow-none" 
                                        style={styles.input}
                                        placeholder="Elegant, Family friendly..." 
                                        value={tagInput} 
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={(e) => handleAddChip(e, tags, setTags, tagInput, setTagInput)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Physical Address</label>
                                    <input type="text" className="form-control text-white shadow-none" style={styles.input} placeholder="Main Ave. Suite 5" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
                                </div>

                                <div className="row mb-3">
                                    <div className="col">
                                        <label className="form-label small fw-bold">Phone</label>
                                        <input type="text" className="form-control text-white shadow-none" style={styles.input} value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                                    </div>
                                    <div className="col">
                                        <label className="form-label small fw-bold">Tables</label>
                                        <input type="number" className="form-control text-white shadow-none" style={styles.input} value={capacidad} onChange={(e) => setCapacidad(e.target.value)} required />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col">
                                        <label className="form-label small fw-bold text-center w-100">Opening</label>
                                        <input type="time" className="form-control form-control-sm text-white shadow-none" style={styles.input} value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                                    </div>
                                    <div className="col">
                                        <label className="form-label small fw-bold text-center w-100">Closing</label>
                                        <input type="time" className="form-control form-control-sm text-white shadow-none" style={styles.input} value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Geolocation</label>
                                    <button type="button" className="btn w-100 btn-sm mb-2 shadow-sm" style={latitud ? styles.goldButton : styles.goldOutline} onClick={getLocation} disabled={loadingLocation}>
                                        {loadingLocation ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-map-marker-alt me-2"></i>}
                                        {latitud ? "Location Captured" : "Capture Current GPS"}
                                    </button>
                                    {latitud && longitud && (
                                        <div className="mb-2 rounded border border-secondary shadow-sm" style={{ height: "130px", overflow: "hidden" }}>
                                            <RestaurantMap lat={latitud} lng={longitud} nombre={nombre || "Venue"} onLocationChange={handleMapChange} />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold">Establishment Image</label>
                                    <label className="btn w-100 mb-2 py-2 shadow-sm" style={{ ...styles.goldOutline, borderStyle: 'dashed', cursor: 'pointer' }}>
                                        {uploading ? <span><i className="fas fa-spinner fa-spin me-2"></i>Uploading...</span> : <><i className="fas fa-camera me-2"></i>Select File</>}
                                        <input type="file" hidden onChange={handleFileUpload} accept="image/*" />
                                    </label>

                                    <div className="input-group input-group-sm mb-2">
                                        <span className="input-group-text bg-dark border-secondary text-white"><i className="fas fa-link"></i></span>
                                        <input type="text" className="form-control text-white shadow-none" style={styles.input} placeholder="Or paste image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                                    </div>

                                    {imageUrl && (
                                        <div className="mt-2 text-center position-relative">
                                            <img src={imageUrl} alt="Preview" className="img-thumbnail bg-dark border-secondary" style={{ maxHeight: "100px", width: "100%", objectFit: "cover" }} 
                                                 onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=Invalid+URL"} />
                                            <button type="button" className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle" style={{padding: "0px 6px"}} onClick={() => setImageUrl("")}>×</button>
                                        </div>
                                    )}
                                </div>

                                <button type="submit" className="btn w-100 py-2 mt-2 shadow" style={styles.goldButton} disabled={isSubmitting || uploading}>
                                    {isSubmitting ? "REGISTERING..." : "SAVE RESTAURANT"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RESTAURANTS LIST */}
                    <div className="col-md-8">
                        <div className="card shadow-lg border-0" style={styles.glassCard}>
                            <div className="card-header bg-transparent py-3 border-bottom border-secondary d-flex align-items-center justify-content-between">
                                <h5 className="mb-0 fw-bold"><i className="fas fa-utensils me-2" style={{color: '#c5a47e'}}></i>My Restaurants</h5>
                                <span className="badge" style={styles.badgeGold}>{store.restaurants?.length || 0} Venues</span>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-dark table-hover align-middle mb-0" style={{backgroundColor: 'transparent'}}>
                                    <thead style={{backgroundColor: 'rgba(197, 164, 126, 0.1)'}}>
                                        <tr style={{color: '#c5a47e'}}>
                                            <th className="ps-4 border-0">ESTABLISHMENT AND DETAILS</th>
                                            <th className="text-end pe-4 border-0">MANAGEMENT</th>
                                        </tr>
                                    </thead>
                                    <tbody className="border-0">
                                        {store.restaurants?.map((rest) => (
                                            <tr key={rest.id} className="border-bottom border-secondary">
                                                <td className="ps-4 py-4">
                                                    <div className="d-flex align-items-start mb-3">
                                                        <img src={rest.image_url || "https://via.placeholder.com/60"} className="rounded shadow-sm me-3" style={{ width: "65px", height: "65px", objectFit: "cover", border: '2px solid #c5a47e' }} />
                                                        <div>
                                                            <div className="fw-bold fs-5 mb-1 text-white">{rest.nombre}</div>
                                                            <div className="d-flex flex-wrap gap-1 mb-2">
                                                                {rest.category && rest.category.split(',').map((cat, i) => (
                                                                    <span key={`cat-${i}`} className="badge text-dark" style={{ ...styles.badgeGold, fontSize: '0.65rem' }}>
                                                                        {cat.trim()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="small opacity-75 d-flex flex-wrap gap-2 align-items-center mb-1">
                                                                <span className="me-2"><i className="fas fa-map-marker-alt me-1 text-warning"></i>{rest.direccion}</span>
                                                                <span><i className="fas fa-phone me-1 text-warning"></i>{rest.telefono}</span>
                                                            </div>
                                                            <div className="small d-flex flex-wrap gap-2 mt-2">
                                                                {rest.tags && rest.tags.split(',').map((tag, i) => (
                                                                    <span key={`tag-${i}`} style={styles.tagLight}>
                                                                        <i className="fas fa-tag me-1" style={{fontSize: '0.6rem'}}></i>{tag.trim()}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="badge bg-dark border border-secondary p-2 d-flex align-items-center">
                                                            <i className="far fa-clock me-2" style={{color: '#c5a47e'}}></i>
                                                            {rest.opening_time || "09:00"} - {rest.closing_time || "22:00"}
                                                        </div>
                                                        {rest.latitud && (
                                                            <div className="rounded border border-secondary shadow-sm" style={{ width: "220px", height: "90px", overflow: 'hidden' }}>
                                                                <RestaurantMap lat={rest.latitud} lng={rest.longitud} nombre={rest.nombre} zoom={14} />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="text-end pe-4">
                                                    <div className="btn-group shadow-sm">
                                                        <button className="btn btn-outline-light btn-sm px-3" onClick={() => handleEdit(rest.id, rest.nombre)} title="Edit name">
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button className="btn btn-outline-danger btn-sm px-3" onClick={() => handleDelete(rest.id)} title="Delete">
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};