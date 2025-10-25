import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different statuses
const getIcon = (status) => {
  const colors = {
    Active: 'green',
    Idle: 'orange',
    Maintenance: 'red',
  };

  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${colors[status]}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [20, 20],
  });
};

const MonitoringMap = ({ machines, chcs }) => {
  const getCHCName = (chcId) => {
    const chc = chcs.find((c) => c.id === chcId);
    return chc ? chc.name : 'Unknown CHC';
  };

  return (
    <MapContainer
      center={[29.5, 76.5]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {machines.map((machine) => (
        <Marker
          key={machine.id}
          position={[machine.location.lat, machine.location.lng]}
          icon={getIcon(machine.status)}
        >
          <Popup>
            <div>
              <strong>Machine ID:</strong> {machine.id}
              <br />
              <strong>Type:</strong> {machine.type}
              <br />
              <strong>Status:</strong> {machine.status}
              <br />
              <strong>Operator:</strong> {machine.operator_name}
              <br />
              <strong>CHC:</strong> {getCHCName(machine.chcId)}
              <br />
              <strong>Utilization:</strong> {(machine.utilization_rate * 100).toFixed(1)}%
              <br />
              <strong>Total Hours:</strong> {machine.total_hours}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MonitoringMap;
