import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import socket from '../services/socket';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const MapTracking = ({ donationBoxId, pickupLocation }) => {
  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const [path, setPath] = useState([]);

  useEffect(() => {
    // Join the tracking room
    socket.emit('join-tracking-room', donationBoxId);

    // Listen for location updates
    socket.on('location-update', ({ lat, lng }) => {
      const newLocation = { lat, lng };
      setVolunteerLocation(newLocation);
      setPath(prev => [...prev, newLocation]);
    });

    return () => {
      socket.off('location-update');
    };
  }, [donationBoxId]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAaeFPXUKEzTXjOSqFtwJF3iOTactQWhSw">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={volunteerLocation || pickupLocation}
        zoom={14}
      >
        {pickupLocation && (
          <Marker 
            position={pickupLocation}
            label="P"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            }}
          />
        )}
        
        {volunteerLocation && (
          <Marker 
            position={volunteerLocation}
            label="V"
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        )}
        
        {path.length > 1 && (
          <Polyline
            path={path}
            options={{
              strokeColor: '#FF0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapTracking;