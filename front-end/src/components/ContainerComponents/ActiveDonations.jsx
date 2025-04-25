import React, { useContext, useEffect, useState } from 'react';


import '../../css/Component/ActiveDonations.css';

import DonationBoxCard from '../SingleComponents/DonationBoxCard';
import { contextAPI } from '../../services/Context';
import Loading from '../../utils/Loading'


const ActiveDonations = () => {

  const { donationFilter } = useContext(contextAPI);
  const [donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchDonationBox = async () => {

    try {
      const token = localStorage.getItem("Token");
      const status = "Pending"
      
      const url = `http://localhost:3000/donation-box/?status=${status}`;

      setLoading(true)
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();
      setLoading(false)

      if (result.success) {
        console.log(result.message);
        setDonations(result.data);

      }
      else {
        console.log(result.message);
        setError(result.error)
      }

    }
    catch (error) {
      console.log(error);
      setError(error)
    }
  }

  
  useEffect(() => {
    fetchDonationBox();
  }, [])

  if (loading) {
    return (
      <>
        <Loading></Loading>
      </>
    );
  }

  if (error) {
    return (
      <div>
        <h1>
          {error.message}
        </h1>
      </div>
    )
  }
  return (
    <div className="donation-layout">

      <div className="donation-main">
        {/* <Filters /> */}
        <div className="donation-cards">
          {donations.length === 0 ? (

            <p>No data available</p>

          ) : (donations.map((donation) => (
            <DonationBoxCard key={donation._id} data={donation} renderFrom={"ActiveDonations"}  />)
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveDonations;
