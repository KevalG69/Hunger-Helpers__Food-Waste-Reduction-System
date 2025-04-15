import React from 'react';
import MapTracking from '../../services/MapTracking.jsx';
import '../../css/Component/TrackView.css'

const DonationTracking = ({ donationBox }) => {
  return (
    <div className="tracking-container">
      <h2>Track Volunteer</h2>
      <div className="map-container">
        <MapTracking 
          donationBoxId={donationBox._id} 
          pickupLocation={donationBox.location}
        />
      </div>
      <div className="tracking-info">
        <p>Volunteer: {donationBox.volunteer_id}</p>
        <p>Status: {donationBox.status}</p>
      </div>
    </div>
  );
};

export default DonationTracking;