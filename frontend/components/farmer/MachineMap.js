import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 30.7333,
  lng: 76.7794,
};

const MachineMap = ({ machines }) => {
  const [selectedMachine, setSelectedMachine] = useState(null);

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        {machines.map((machine) => (
          <Marker
            key={machine.id}
            position={{ lat: machine.location.lat, lng: machine.location.lng }}
            onClick={() => setSelectedMachine(machine)}
            icon={{
              path: window.google?.maps?.SymbolPath?.CIRCLE,
              scale: 8,
              fillColor: machine.available ? '#10b981' : '#ef4444',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
          />
        ))}

        {selectedMachine && (
          <InfoWindow
            position={{
              lat: selectedMachine.location.lat,
              lng: selectedMachine.location.lng,
            }}
            onCloseClick={() => setSelectedMachine(null)}
          >
            <Box sx={{ p: 1, minWidth: 200 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
                {selectedMachine.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {selectedMachine.type}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                {selectedMachine.available ? (
                  <Chip label="Available" size="small" color="success" />
                ) : (
                  <Chip label="Booked" size="small" />
                )}
                <Chip label={`₹${selectedMachine.price}/hr`} size="small" />
              </Box>
              <Button
                fullWidth
                size="small"
                variant="contained"
                href={`/machine/${selectedMachine.id}`}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  mt: 1,
                }}
              >
                View Details
              </Button>
            </Box>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MachineMap;
