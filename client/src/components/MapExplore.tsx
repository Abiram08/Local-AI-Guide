import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { landmarks, Landmark, LandmarkCategory, categoryLabels } from '../data/landmarks';
import 'leaflet/dist/leaflet.css';
import './MapExplore.css';

// Fix Leaflet default icon issue with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons by category
const createIcon = (color: string) => new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const categoryIcons: Record<LandmarkCategory, L.DivIcon> = {
    beaches: createIcon('#0ea5e9'),      // Sky blue
    accommodation: createIcon('#8b5cf6'), // Purple
    restaurants: createIcon('#ef4444'),   // Red
    markets: createIcon('#f59e0b'),       // Amber
    transport: createIcon('#10b981'),     // Emerald
    activities: createIcon('#ec4899'),    // Pink
};

// Fly-to component
const FlyToMarker: React.FC<{ position: [number, number] | null }> = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 14, { duration: 1 });
        }
    }, [map, position]);
    return null;
};

export const MapExplore: React.FC = () => {
    // Default to beaches (no "all" option)
    const [selected, setSelected] = useState<Landmark | null>(null);
    const [filter, setFilter] = useState<LandmarkCategory>('beaches');

    const filteredLandmarks = useMemo(() => {
        return landmarks.filter(l => l.category === filter);
    }, [filter]);

    const goaCenter: [number, number] = [15.38, 73.90];

    const categories: LandmarkCategory[] = ['beaches', 'accommodation', 'restaurants', 'markets', 'transport', 'activities'];

    return (
        <div className="map-explore-container">
            <div className="map-wrapper">
                <MapContainer
                    center={goaCenter}
                    zoom={10}
                    scrollWheelZoom={true}
                    dragging={true}
                    touchZoom={true}
                    doubleClickZoom={true}
                    boxZoom={true}
                    keyboard={true}
                    style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />
                    <FlyToMarker position={selected ? [selected.lat, selected.lng] : null} />

                    {filteredLandmarks.map(mark => (
                        <Marker
                            key={mark.id}
                            position={[mark.lat, mark.lng]}
                            icon={categoryIcons[mark.category]}
                            eventHandlers={{ click: () => setSelected(mark) }}
                        >
                            <Popup className="custom-popup">
                                <div className="popup-content">
                                    <span className={`category-tag ${mark.category}`}>{mark.category}</span>
                                    <h4>{mark.name}</h4>
                                    <p>{mark.description}</p>
                                    <div className="popup-footer">
                                        <span>{mark.price}</span>
                                        <span>⭐ {mark.rating}</span>
                                    </div>
                                    {mark.localTip && <div className="popup-tip">💡 {mark.localTip}</div>}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            <div className="map-sidebar">
                {/* Filter Bar - Above the list */}
                <div className="sidebar-filters">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={filter === cat ? 'active' : ''}
                            onClick={() => { setFilter(cat); setSelected(null); }}
                        >
                            {categoryLabels[cat]}
                        </button>
                    ))}
                </div>

                <div className="sidebar-header">
                    <h4>{categoryLabels[filter]}</h4>
                    <span>{filteredLandmarks.length} spots</span>
                </div>
                <div className="sidebar-list">
                    {filteredLandmarks.map(mark => (
                        <div
                            key={mark.id}
                            className={`sidebar-item ${selected?.id === mark.id ? 'active' : ''}`}
                            onClick={() => setSelected(mark)}
                        >
                            <div className="item-info">
                                <strong>{mark.name}</strong>
                                <span>{mark.price}</span>
                            </div>
                            <span className="item-rating">⭐ {mark.rating}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

