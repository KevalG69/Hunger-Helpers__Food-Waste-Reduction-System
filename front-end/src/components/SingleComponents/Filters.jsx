import React, { useContext } from 'react';
import '../../css/Elements/Filters.css';
import { contextAPI } from '../../services/RegistrationContext';

const Filters = () => {
  const { donationFilter, updateDonationFilter } = useContext(contextAPI);

  const handleChange = (e) => {
    updateDonationFilter(e.target.name, e.target.value);
  };

  return (
    <div className="filters-bar">
      <select name="food_type"  value={donationFilter.food_type} onChange={handleChange}>
        <option value="">Type of Food</option>
        <option selected value="Veg">Veg</option>
        <option value="Non-Veg">Non-Veg</option>
      </select>

      <select name="location" value={donationFilter.location} onChange={handleChange}>
        <option value="">Location</option>
        <option value="My City">My City</option>
        {/* Add more cities as needed */}
      </select>

      <button onClick={() => {
        updateDonationFilter("type", "");
        updateDonationFilter("location", "");
      }}>🔄</button>
    </div>
  );
};

export default Filters;
