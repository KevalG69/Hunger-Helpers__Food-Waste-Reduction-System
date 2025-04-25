import React, { useContext, useEffect, useState } from 'react';


import DonationBoxCard from '../SingleComponents/DonationBoxCard';
import Filters from '../SingleComponents/Filters';

import '../../css/Component/ActiveDonations.css';
import { handleError } from '../../utils/Toast';
import { contextAPI } from '../../services/Context';
import Loading from '../../utils/Loading';

const MyDonations = () => {

  //States
  const { userData } = useContext(contextAPI);

  const [donations, setDonations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let change = 0;

  //fetch funciton 

  const fetchDonationBox = async () => {

    try {

      const token = localStorage.getItem("Token");
      const userId = userData._id

      const url = `http://localhost:3000/users/donations/?userId=${userId}`;

      setLoading(true);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      setLoading(false);

      if (result.success) {

        console.log(result.message);
        setDonations(result.data);

      }
      else {
        console.log(result.message);
        setError(result.error);
      }

    }
    catch (error) {
      console.log(error)
      setError(error);
    }
  }


 


  useEffect(() => {

    fetchDonationBox();
  }, [])

  useEffect(() => {

    fetchDonationBox();
  }, [change])

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
          {(donations.length === 0) ? (

            <p>No data available</p>

          ) : (donations.map((donation) => (
            <DonationBoxCard key={donation._id} data={donation} renderFrom={"MyDonations"}
              change={change} />)
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyDonations;
