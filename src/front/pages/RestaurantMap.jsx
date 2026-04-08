import React, { useMemo, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SearchField = ({ onLocationChange }) => {
    const map = useMap();

    useEffect(() => {
        const provider = new OpenStreetMapProvider();

        const searchControl = new GeoSearchControl({
            provider: provider,
            style: 'button', 
            position: 'topright',
            showMarker: false,
            showPopup: false,
            autoClose: true, 
            retainZoomLevel: false,
            animateZoom: true,
            keepResult: false, 
            searchLabel: 'Busca una dirección...',
            updateMap: true
        });

        map.addControl(searchControl);
        map.on('geosearch/showlocation', (result) => {
            if (onLocationChange) {
                onLocationChange(result.location.y, result.location.x);
            }
            setTimeout(() => {
                const closeButton = document.querySelector('.leaflet-control-geosearch .reset');
                if (closeButton) closeButton.click();
                
                const searchForm = document.querySelector('.leaflet-control-geosearch form');
                if (searchForm) searchForm.classList.remove('active');
            }, 100); 
        });

        return () => map.removeControl(searchControl);
    }, [map, onLocationChange]);

    return null;
};

const RestaurantMap = ({ lat, lng, nombre, onLocationChange }) => {
    const markerRef = useRef(null);

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    const position = useMemo(() => [latNum, lngNum], [latNum, lngNum]);

    if (isNaN(latNum) || isNaN(lngNum)) {
        return (
            <div className="alert alert-secondary text-center d-flex align-items-center justify-content-center h-100 mb-0">
                <small><i className="fas fa-map-marker-alt me-1"></i> Sin coordenadas</small>
            </div>
        );
    }

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current;
                if (marker != null) {
                    const newPos = marker.getLatLng();
                    if (onLocationChange) {
                        onLocationChange(newPos.lat, newPos.lng);
                    }
                }
            },
        }),
        [onLocationChange],
    );

    return (
        <div style={{ height: "100%", width: "100%", position: "relative" }}>
            <style>
                {`
                    .leaflet-control-geosearch { 
                        z-index: 9999 !important; 
                        margin-top: 5px !important;
                        margin-right: 5px !important;
                    }

                    /* El formulario solo se despliega cuando tiene la clase .active */
                    .leaflet-control-geosearch form.active {
                        display: flex !important;
                        background: white !important;
                        border: 2px solid rgba(0,0,0,0.2) !important;
                        border-radius: 4px !important;
                    }

                    /* Por defecto el formulario está oculto */
                    .leaflet-control-geosearch form {
                        display: none;
                    }

                    .leaflet-control-geosearch .results.active {
                        z-index: 10000 !important;
                        background: white !important;
                        color: black !important;
                        max-height: 120px !important;
                        overflow-y: auto !important;
                        width: 100% !important;
                        font-size: 13px;
                    }
                `}
            </style>

            <MapContainer 
                key={`${latNum}-${lngNum}`} 
                center={position} 
                zoom={15} 
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {onLocationChange && <SearchField onLocationChange={onLocationChange} />}

                <Marker 
                    position={position}
                    draggable={true}
                    eventHandlers={eventHandlers}
                    ref={markerRef}
                >
                    <Popup>
                        <strong>{nombre || "Restaurante"}</strong>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default RestaurantMap;