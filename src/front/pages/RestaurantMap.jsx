import React from 'react';
import { MapContainer } from 'react-leaflet/MapContainer';
import { TileLayer } from 'react-leaflet/TileLayer';
import { Marker } from 'react-leaflet/Marker';
import { Popup } from 'react-leaflet/Popup';
import L from 'leaflet';

// --- SOLUCIÓN PARA EL ICONO DEL MARCADOR ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// ------------------------------------------

const RestaurantMap = ({ lat, lng, nombre }) => {
    // 1. Aseguramos que lat y lng sean números
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    // 2. Si no son coordenadas válidas, mostramos un mensaje para no romper la app
    if (isNaN(latNum) || isNaN(lngNum)) {
        return (
            <div className="alert alert-secondary text-center d-flex align-items-center justify-content-center h-100 mb-0">
                <small><i className="fas fa-map-marker-alt me-1"></i> Sin coordenadas</small>
            </div>
        );
    }

    const position = [latNum, lngNum];

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <MapContainer 
                // La KEY es el truco: si cambia la lat o lng, el mapa se RE-RENDERIZA por completo
                key={`${latNum}-${lngNum}`} 
                center={position} 
                zoom={15} 
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <strong>{nombre || "Restaurante"}</strong>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default RestaurantMap;