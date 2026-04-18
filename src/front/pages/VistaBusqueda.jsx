import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';


import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- SCHEDULE STATUS HELPER ---
const checkStatus = (open, close) => {
    if (!open || !close) return { label: "N/A", color: "text-muted", timeRange: "N/A" };
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [hOpen, mOpen] = open.split(':').map(Number);
    const [hClose, mClose] = close.split(':').map(Number);

    const openTime = hOpen * 60 + mOpen;
    const closeTime = hClose * 60 + mClose;

    let isOpen = false;
    if (closeTime > openTime) {
        isOpen = currentTime >= openTime && currentTime < closeTime;
    } else {
        isOpen = currentTime >= openTime || currentTime < closeTime;
    }

    const format12h = (timeStr) => {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h);
        const suffix = hour >= 12 ? 'pm' : 'am';
        const formattedHour = ((hour + 11) % 12 + 1);
        return `${formattedHour}${suffix}`;
    };

    return {
        label: isOpen ? "Open" : "Closed",
        color: isOpen ? "#28a745" : "#dc3545",
        timeRange: `${format12h(open)} / ${format12h(close)}`
    };
};

const SearchField = ({ onLocationChange }) => {
    const map = useMap();
    useEffect(() => {
        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'button',
            position: 'topright',
            showMarker: false,
            autoClose: true,
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: true,
            searchLabel: 'Search for an address...',
            updateMap: true,
        });

        map.addControl(searchControl);
        map.on('geosearch/showlocation', (result) => {
            if (onLocationChange) onLocationChange(result.location.y, result.location.x);
        });
        return () => map.removeControl(searchControl);
    }, [map, onLocationChange]);
    return null;
};

const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng], 14);
    }, [lat, lng]);
    return null;
};

export const VistaBusqueda = () => {
    const { store, actions } = useGlobalReducer();
    const [userLocation, setUserLocation] = useState({ lat: 10.4806, lng: -66.8983 });
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fixedPopupId, setFixedPopupId] = useState(null);
    
    const markerRefs = useRef({});

    useEffect(() => {
        actions.getAllRestaurantsPublic();
    }, []);

    const filterNearby = (lat, lng) => {
        const listado = store.restaurants || [];
        const filtered = listado.filter(rest => {
            if (!rest.latitud || !rest.longitud) return false;
            const diffLat = Math.abs(parseFloat(lat) - parseFloat(rest.latitud));
            const diffLng = Math.abs(parseFloat(lng) - parseFloat(rest.longitud));
            return diffLat < 0.1 && diffLng < 0.1;
        });
        setNearbyRestaurants(filtered);
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Your browser does not support geolocation.");
            return;
        }

        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                filterNearby(latitude, longitude);
                setLoading(false);
            },
            (error) => {
                setLoading(false);
                let msg = "Error accessing GPS.";
                if (error.code === 1) msg = "Permission denied. Please enable location in your browser.";
                alert(msg);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    };

    const handleManualSearch = (lat, lng) => {
        setUserLocation({ lat, lng });
        filterNearby(lat, lng);
    };

    const handleRestaurantClick = (rest) => {
        if (fixedPopupId === rest.id) {
            setFixedPopupId(null);
        } else {
            setFixedPopupId(rest.id);
            openRestaurantPopup(rest);
        }
    };

    const openRestaurantPopup = (rest) => {
        const marker = markerRefs.current[rest.id];
        if (marker) {
            setUserLocation({ lat: parseFloat(rest.latitud), lng: parseFloat(rest.longitud) });
            marker.openPopup();
        }
    };

    const closeRestaurantPopup = (rest) => {
        if (fixedPopupId !== rest.id) {
            const marker = markerRefs.current[rest.id];
            if (marker) {
                marker.closePopup();
            }
        }
    };

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#000", minHeight: "100vh", color: "#fff" }}>
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0" style={{ color: "#c5a47e" }}>
                        <i className="fas fa-map-marker-alt me-2"></i>Explore Restaurants
                    </h2>
                    <Link to="/client-dashboard" className="btn shadow-sm" style={{ border: "1px solid #c5a47e", color: "#c5a47e" }}>
                        <i className="fas fa-arrow-left me-2"></i>Back
                    </Link>
                </div>

                <div className="row g-4">
                    <div className="col-md-4">
                        <button
                            className="btn w-100 mb-3 py-2 fw-bold transition-all"
                            style={{ backgroundColor: "#c5a47e", color: "#000", border: "none" }}
                            onClick={handleGetLocation}
                            disabled={loading}
                        >
                            <i className="fas fa-location-arrow me-2"></i>
                            {loading ? "Locating..." : "Use Current Location"}
                        </button>

                        <div className="list-group shadow-sm overflow-auto custom-scrollbar" 
                             style={{ maxHeight: "70vh", borderRadius: "10px", backgroundColor: "#111", border: "1px solid #333" }}>
                            {nearbyRestaurants.length > 0 ? (
                                nearbyRestaurants.map((rest) => {
                                    const status = checkStatus(rest.opening_time, rest.closing_time);
                                    const isSelected = fixedPopupId === rest.id;
                                    
                                    return (
                                        <div 
                                            key={rest.id} 
                                            className="list-group-item p-3"
                                            style={{ 
                                                cursor: "pointer", 
                                                backgroundColor: isSelected ? "#1a1a1a" : "transparent",
                                                borderBottom: "1px solid #333",
                                                borderLeft: isSelected ? "4px solid #c5a47e" : "4px solid transparent",
                                                color: "#fff",
                                                transition: "all 0.3s ease"
                                            }}
                                            onClick={() => handleRestaurantClick(rest)}
                                            onMouseEnter={() => openRestaurantPopup(rest)}
                                            onMouseLeave={() => closeRestaurantPopup(rest)}
                                        >
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={rest.image_url || "https://via.placeholder.com/65"}
                                                    className="rounded me-3"
                                                    style={{ width: "65px", height: "65px", objectFit: "cover", border: "1px solid #c5a47e" }}
                                                    alt={rest.nombre}
                                                />
                                                <div className="flex-grow-1">
                                                    <h6 className="mb-1 fw-bold" style={{ color: isSelected ? "#c5a47e" : "#fff" }}>{rest.nombre}</h6>
                                                    <div className="small fw-bold mb-1">
                                                        <span style={{ color: "#aaa" }}>{status.timeRange}</span>
                                                        <span className="ms-2" style={{ color: status.color }}>• {status.label}</span>
                                                    </div>
                                                    <small className="d-block text-truncate" style={{ maxWidth: "180px", color: "#888" }}>
                                                        {rest.direccion}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-5 text-center" style={{ color: "#666" }}>
                                    <i className="fas fa-map-marked-alt fa-3x mb-3 opacity-25" style={{ color: "#c5a47e" }}></i>
                                    <p className="small fw-bold">No results nearby</p>
                                    <p className="small">Search for another city or enable GPS.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="rounded overflow-hidden shadow" style={{ height: "75vh", border: "1px solid #c5a47e" }}>
                            <MapContainer
                                center={[userLocation.lat, userLocation.lng]}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                            >
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                                <SearchField onLocationChange={handleManualSearch} />

                                <Marker position={[userLocation.lat, userLocation.lng]}>
                                    <Popup><b>Your search / location</b></Popup>
                                </Marker>

                                {nearbyRestaurants.map(rest => {
                                    const status = checkStatus(rest.opening_time, rest.closing_time);
                                    return (
                                        <Marker 
                                            key={rest.id} 
                                            position={[parseFloat(rest.latitud), parseFloat(rest.longitud)]}
                                            ref={(el) => (markerRefs.current[rest.id] = el)}
                                        >
                                            <Popup>
                                                <div className="text-center" style={{ minWidth: "160px", fontFamily: "inherit" }}>
                                                    <h6 className="fw-bold mb-1" style={{ color: "#000" }}>{rest.nombre}</h6>
                                                    <div className="mb-2" style={{fontSize: "0.75rem"}}>
                                                        <span className="fw-bold text-muted">{status.timeRange}</span>
                                                        <span className="ms-1 fw-bold" style={{ color: status.color }}>({status.label})</span>
                                                    </div>
                                                    <p className="small text-muted mb-2">{rest.direccion}</p>
                                                    <span className="badge mb-2 d-inline-block" style={{ backgroundColor: "#c5a47e", color: "#000" }}>
                                                        {rest.category || "General"}
                                                    </span>
                                                    <hr className="my-1"/>
                                                    <Link 
                                                        to={`/client-dashboard?reservaRestId=${rest.id}`} 
                                                        className="btn btn-sm w-100 rounded-pill fw-bold mt-2"
                                                        style={{ backgroundColor: "#000", color: "#c5a47e" }}
                                                    >
                                                        <i className="fas fa-calendar-check me-2"></i>Book Here
                                                    </Link>
                                                </div>
                                            </Popup>
                                        </Marker>
                                    );
                                })}
                            </MapContainer>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                    .custom-scrollbar::-webkit-scrollbar-track { background: #111; }
                    .custom-scrollbar::-webkit-scrollbar-thumb { background: #c5a47e; border-radius: 10px; }
                    
                    .list-group-item:hover {
                        background-color: #222 !important;
                        transition: 0.3s;
                    }

                    .leaflet-popup-content-wrapper { 
                        border-radius: 8px; 
                        border: 2px solid #c5a47e;
                    }
                    
                    .leaflet-control-geosearch form { 
                        background: #111; 
                        border: 1px solid #c5a47e;
                        color: #fff;
                    }
                    .leaflet-control-geosearch form input { color: #fff; background: transparent; }
                `}
            </style>
        </div>
    );
};