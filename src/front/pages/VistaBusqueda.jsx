import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

// --- CONFIGURACIÓN DE ICONOS ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// --- FUNCIÓN AUXILIAR DE ESTADO DE HORARIO ---
const checkStatus = (open, close) => {
    if (!open || !close) return { label: "Horario no disp.", color: "text-muted", full: "N/A" };
    
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [hOpen, mOpen] = open.split(':').map(Number);
    const [hClose, mClose] = close.split(':').map(Number);

    const openTime = hOpen * 60 + mOpen;
    const closeTime = hClose * 60 + mClose;

    // Manejo de horarios que cierran después de medianoche (ej: 18:00 a 02:00)
    let isOpen = false;
    if (closeTime > openTime) {
        isOpen = currentTime >= openTime && currentTime < closeTime;
    } else {
        isOpen = currentTime >= openTime || currentTime < closeTime;
    }

    // Formatear a 12h (AM/PM)
    const format12h = (timeStr) => {
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h);
        const suffix = hour >= 12 ? 'pm' : 'am';
        const formattedHour = ((hour + 11) % 12 + 1);
        return `${formattedHour}${suffix}`;
    };

    return {
        label: isOpen ? "Abierto" : "Cerrado",
        color: isOpen ? "text-success" : "text-danger",
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
            searchLabel: 'Busca una dirección...',
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
            alert("Tu navegador no soporta geolocalización.");
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
                let msg = "Error al acceder al GPS.";
                if (error.code === 1) msg = "Permiso denegado. Activa la ubicación en tu navegador.";
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
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold mb-0">📍 Explorar Restaurantes</h2>
                <Link to="/client-dashboard" className="btn btn-outline-secondary shadow-sm">
                    <i className="fas fa-arrow-left me-2"></i>Volver
                </Link>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <button
                        className="btn btn-primary w-100 mb-3 shadow-sm py-2 fw-bold"
                        onClick={handleGetLocation}
                        disabled={loading}
                    >
                        <i className="fas fa-location-arrow me-2"></i>
                        {loading ? "Localizando..." : "Usar mi ubicación actual"}
                    </button>

                    <div className="list-group shadow-sm overflow-auto" style={{ maxHeight: "70vh", borderRadius: "10px" }}>
                        {nearbyRestaurants.length > 0 ? (
                            nearbyRestaurants.map((rest) => {
                                // LLAMADA A LA LÓGICA DE TIEMPO
                                const status = checkStatus(rest.opening_time, rest.closing_time);
                                
                                return (
                                    <div 
                                        key={rest.id} 
                                        className={`list-group-item list-group-item-action p-3 ${fixedPopupId === rest.id ? 'bg-light border-primary' : ''}`}
                                        style={{ 
                                            cursor: "pointer", 
                                            borderLeft: fixedPopupId === rest.id ? "4px solid #0d6efd" : "" 
                                        }}
                                        onClick={() => handleRestaurantClick(rest)}
                                        onMouseEnter={() => openRestaurantPopup(rest)}
                                        onMouseLeave={() => closeRestaurantPopup(rest)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <img
                                                src={rest.image_url || "https://via.placeholder.com/60"}
                                                className="rounded shadow-sm me-3"
                                                style={{ width: "65px", height: "65px", objectFit: "cover" }}
                                                alt={rest.nombre}
                                            />
                                            <div className="flex-grow-1">
                                                <h6 className="mb-0 fw-bold">{rest.nombre}</h6>
                                                {/* NUEVA LÍNEA DE HORARIO Y ESTADO */}
                                                <div className="small fw-bold">
                                                    <span className="text-muted">{status.timeRange}</span>
                                                    <span className={`ms-2 ${status.color}`}>• {status.label}</span>
                                                </div>
                                                <small className="text-muted d-block text-truncate" style={{ maxWidth: "160px" }}>
                                                    {rest.direccion}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-5 text-center text-muted bg-light">
                                <i className="fas fa-map-marked-alt fa-3x mb-3 opacity-25"></i>
                                <p className="small fw-bold">Sin resultados cerca</p>
                                <p className="small">Busca otra ciudad o activa tu GPS.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="rounded shadow border overflow-hidden" style={{ height: "75vh", position: "relative" }}>
                        <MapContainer
                            center={[userLocation.lat, userLocation.lng]}
                            zoom={13}
                            style={{ height: "100%", width: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                            <SearchField onLocationChange={handleManualSearch} />

                            <Marker position={[userLocation.lat, userLocation.lng]}>
                                <Popup><b>Tu búsqueda / ubicación</b></Popup>
                            </Marker>

                            {nearbyRestaurants.map(rest => {
                                // LLAMADA A LA LÓGICA DE TIEMPO PARA EL POPUP
                                const status = checkStatus(rest.opening_time, rest.closing_time);

                                return (
                                    <Marker 
                                        key={rest.id} 
                                        position={[parseFloat(rest.latitud), parseFloat(rest.longitud)]}
                                        ref={(el) => (markerRefs.current[rest.id] = el)}
                                    >
                                        <Popup>
                                            <div className="p-2" style={{ minWidth: "160px" }}>
                                                <h6 className="fw-bold mb-1 text-center">{rest.nombre}</h6>
                                                {/* ESTADO EN EL POPUP */}
                                                <div className="text-center mb-2" style={{fontSize: "0.75rem"}}>
                                                    <span className="fw-bold text-muted">{status.timeRange}</span>
                                                    <span className={`ms-1 fw-bold ${status.color}`}>({status.label})</span>
                                                </div>
                                                <p className="small text-muted mb-2 text-center">{rest.direccion}</p>
                                                <span className="badge bg-info text-dark mb-2 d-block mx-auto" style={{width: "fit-content"}}>
                                                    {rest.category || "General"}
                                                </span>
                                                <hr className="my-1"/>
                                                <Link 
                                                    to={`/client-dashboard?reservaRestId=${rest.id}`} 
                                                    className="btn btn-primary btn-sm w-100 rounded-pill fw-bold mt-2 text-white"
                                                >
                                                    <i className="fas fa-calendar-check me-2 text-white"></i>
                                                    Reserva aquí
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

            <style>
                {`
                    .list-group-item-action:hover {
                        background-color: #f8f9fa;
                        border-left: 4px solid #0d6efd;
                        transition: all 0.2s ease;
                    }
                    .leaflet-control-geosearch form { background: white; border-radius: 8px; }
                    .leaflet-control-geosearch button.reset { color: red; }
                    .leaflet-popup-content-wrapper { border-radius: 12px; }
                `}
            </style>
        </div>
    );
};