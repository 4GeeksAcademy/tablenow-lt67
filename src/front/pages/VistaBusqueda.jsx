import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corregir iconos de Leaflet (para que se vean los marcadores azules)
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

// Componente para mover el mapa suavemente cuando cambie la ubicación
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) map.setView([lat, lng], 13);
    }, [lat, lng]);
    return null;
};

export const VistaBusqueda = () => {
    const { store, actions } = useGlobalReducer();
    const [userLocation, setUserLocation] = useState({ lat: 10.4806, lng: -66.8983 }); // Por defecto Caracas
    const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Obtener todos los restaurantes al cargar usando TU acción del flux
    useEffect(() => {
        actions.getAllRestaurantsPublic(); 
    }, []);

    // 2. Función para obtener ubicación actual de Diego
    const handleGetLocation = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                filterNearby(latitude, longitude);
                setLoading(false);
            },
            (error) => {
                alert("Error al obtener ubicación. Usando ubicación por defecto.");
                setLoading(false);
            }
        );
    };

    // 3. Lógica de Filtrado (La magia que pidió el profe)
    const filterNearby = (userLat, userLng) => {
        // Usamos store.restaurants que es donde getAllRestaurantsPublic guarda la data
        const listado = store.restaurants || [];
        const filtered = listado.filter(rest => {
            if (!rest.latitud || !rest.longitud) return false;
            
            // Calculamos diferencia simple (aprox 10km a la redonda)
            const diffLat = Math.abs(parseFloat(userLat) - parseFloat(rest.latitud));
            const diffLng = Math.abs(parseFloat(userLng) - parseFloat(rest.longitud));
            
            return diffLat < 0.1 && diffLng < 0.1; 
        });
        setNearbyRestaurants(filtered);
    };

    return (
        <div className="container mt-4">
            <h2 className="fw-bold mb-3">📍 Restaurantes cerca de ti</h2>
            
            <div className="row">
                <div className="col-md-4">
                    <button 
                        className="btn btn-primary w-100 mb-3 shadow-sm"
                        onClick={handleGetLocation}
                        disabled={loading}
                    >
                        <i className="fas fa-location-arrow me-2"></i>
                        {loading ? "Buscando..." : "Buscar cerca de mí"}
                    </button>

                    <div className="list-group shadow-sm overflow-auto" style={{ maxHeight: "70vh" }}>
                        {nearbyRestaurants.length > 0 ? (
                            nearbyRestaurants.map((rest) => (
                                <div key={rest.id} className="list-group-item list-group-item-action p-3">
                                    <div className="d-flex align-items-center">
                                        <img src={rest.image_url || "https://via.placeholder.com/60"} alt={rest.nombre} className="rounded me-3" style={{ width: "60px", height: "60px", objectFit: "cover" }} />
                                        <div>
                                            <h6 className="mb-0 fw-bold">{rest.nombre}</h6>
                                            <small className="text-muted">{rest.direccion}</small>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="p-3 text-center text-muted small">
                                {loading ? "Cargando..." : "Haz clic en el botón para encontrar restaurantes cercanos."}
                            </p>
                        )}
                    </div>
                </div>

                <div className="col-md-8">
                    <div className="rounded shadow-sm border overflow-hidden" style={{ height: "75vh" }}>
                        <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />

                            {/* Marcador del Usuario */}
                            <Marker position={[userLocation.lat, userLocation.lng]}>
                                <Popup><b>Tú estás aquí</b></Popup>
                            </Marker>

                            {/* Marcadores de Restaurantes Cercanos */}
                            {nearbyRestaurants.map(rest => (
                                <Marker key={rest.id} position={[parseFloat(rest.latitud), parseFloat(rest.longitud)]}>
                                    <Popup>
                                        <strong>{rest.nombre}</strong><br/>
                                        {rest.telefono}
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};