import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ machines }) => {
  return (
    <MapContainer
      center={[28.6139, 77.209]}
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {machines.slice(0, 50).map((machine) => (
        <CircleMarker
          key={machine.id}
          center={[machine.location.lat, machine.location.lng]}
          radius={5}
          fillColor="#1976d2"
          color="#fff"
          weight={1}
          opacity={1}
          fillOpacity={0.6}
        >
          <Popup>
            <div>
              <strong>{machine.type}</strong>
              <br />
              Status: {machine.status}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
