import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useStaffStore } from '@/store/staffStore';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Fix Leaflet Default Icon
const createIcon = (color: string) => new L.DivIcon({
  className: 'bg-transparent',
  html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
});

const VehicleMarker = () => {
  const { vehicleLoc } = useStaffStore();
  const map = useMap();
  
  useEffect(() => {
    map.flyTo([vehicleLoc.lat, vehicleLoc.lng], map.getZoom());
  }, [vehicleLoc]);

  return (
    <Marker 
      position={[vehicleLoc.lat, vehicleLoc.lng]} 
      icon={new L.DivIcon({ html: '🚛', className: 'text-2xl' })}
    >
       <Popup>You are here</Popup>
    </Marker>
  );
};

export const LiveMap = () => {
  const { bins } = useStaffStore();

  const getBinColor = (level: number) => {
    if (level > 80) return '#ef4444'; // Red
    if (level > 50) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 z-0">
      <MapContainer center={[23.2599, 77.4126]} zoom={14} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        <VehicleMarker />
        
        {bins.map(bin => (
          <Marker 
            key={bin.id} 
            position={[bin.lat, bin.lng]}
            icon={createIcon(getBinColor(bin.level))}
          >
            <Popup>
              <div className="text-center">
                <strong className="block text-lg">Bin {bin.id}</strong>
                <div className={`text-xs font-bold px-2 py-1 rounded text-white mt-1 ${getBinColor(bin.level) === '#ef4444' ? 'bg-red-500' : 'bg-green-500'}`}>
                  {bin.level}% Full
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};