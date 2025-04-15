import React, { useEffect, useState } from 'react';
import { geolocated } from 'react-geolocated';
import socket from '../services/socket';

const LocationUpdater = ({ donationBoxId, isGeolocationAvailable, isGeolocationEnabled, coords }) => {
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
      // Send updates every 10 seconds
      const id = setInterval(() => {
        socket.emit('volunteer-location-update', {
          donationBoxId,
          lat: coords.latitude,
          lng: coords.longitude
        });
      }, 10000);
      setIntervalId(id);

      return () => clearInterval(id);
    }
  }, [isGeolocationAvailable, isGeolocationEnabled, coords, donationBoxId]);

  return null;
};

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  watchPosition: true,
  userDecisionTimeout: 5000,
})(LocationUpdater);