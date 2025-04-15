import React, { useContext, useEffect, useState } from 'react';


import DonationBoxCard from '../SingleComponents/DonationBoxCard';
import Filters from '../SingleComponents/Filters';

import '../../css/Component/ActiveDonations.css';
import { handleError } from '../../utils/Toast';
import { contextAPI } from '../../services/RegistrationContext';

const Accepted = () => {

  const { userData } = useContext(contextAPI);
  const [donations, setDonations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);


  const fetchDonationBox = async () => {

    try {
      const token = localStorage.getItem("Token");
      const userId = userData._id
      const url = `http://localhost:3000/users/donations/?userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {

          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      if (result.success) {
        console.log(result.message);
        console.log(result.data[0]);

        setDonations(result.data);
      }
      else {
        console.log(result.message);
      }

    }
    catch (error) {
      console.log(error)
    }
  }
  const fetchDelivery = async () => {

    try {

      const token = localStorage.getItem("Token");
      const userId = userData._id
      const url = `http://localhost:3000/users/deliveries/?userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {

          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      if (result.success) {
        console.log(result.message);
        console.log(result.data[0]);

        const data = result.data;
        setDeliveries(result.data);
      }
      else {
        console.log(result.message);
      }

    }
    catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchDonationBox();
    fetchDelivery();
  }, [])

  return (
    <div className="donation-layout">

      <div className="donation-main">
        {/* <Filters /> */}
        <div className="donation-cards">
          {donations.length === 0 ? (

            <p>No data available</p>

          ) : (donations.map((donation) => (
            <DonationBoxCard key={donation._id} data={donation} renderFrom={"History"} />)
          ))}
          {deliveries.length === 0 ? (

            <p>No data available</p>

          ) : (deliveries.map((delivery) => (
            <DonationBoxCard key={delivery._id} data={delivery} renderFrom={"History"} />)
          ))}

        </div>
      </div>
    </div>
  );
};

export default Accepted;
