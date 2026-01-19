import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useStaffStore } from '@/store/staffStore';
import { Bin } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet Icons
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const truckIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2554/2554936.png', // Truck emoji/icon
  iconSize: [40, 40],
});

const binIcon = new Icon({
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const LiveMap = () => {
  const { vehicleLoc, bins } = useStaffStore();

  // 🛡️ Safe check for vehicle location
  const centerPos: [number, number] = vehicleLoc ? [vehicleLoc[0], vehicleLoc[1]] : [23.2599, 77.4126];

  return (
    <div className="h-[400px] rounded-3xl overflow-hidden border-4 border-black dark:border-gray-700 shadow-neo z-0 relative">
      <MapContainer center={centerPos} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* 🚛 Staff Truck */}
        {vehicleLoc && (
          <Marker position={[vehicleLoc[0], vehicleLoc[1]]} icon={truckIcon}>
             <Popup>You are here</Popup>
          </Marker>
        )}

        {/* 🗑️ Bins */}
        {bins.map((bin: Bin) => (
          <Marker key={bin.id} position={[bin.lat, bin.lng]} icon={binIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{bin.address}</h3>
                {/* 👇 Fixed: changed .level to .fillLevel */}
                <p>Fill: {bin.fillLevel}%</p> 
                <p className="capitalize">Status: {bin.status}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};