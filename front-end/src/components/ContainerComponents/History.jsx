import React, { useContext, useEffect, useState } from 'react';


import DonationBoxCard from '../SingleComponents/DonationBoxCard';


import '../../css/Component/ActiveDonations.css';

import { contextAPI } from '../../services/Context';
import Loading from '../../utils/Loading'

const Accepted = () => {

  const { userData } = useContext(contextAPI);
  const [donations, setDonations] = useState([]);
  const [deliveries, setDeliveries] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDonationBox = async () => {

    try {
      const token = localStorage.getItem("Token");
      const userId = userData._id

      setLoading(true)
      const url = `http://localhost:3000/users/donations/?userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {

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
        setError(result.error)
      }

    }
    catch (error) {
      console.log(error)
      setError(error)
    }
  }
  const fetchDelivery = async () => {

    try {

      const token = localStorage.getItem("Token");
      const userId = userData._id

      const url = `http://localhost:3000/users/deliveries/?userId=${userId}`;

      setLoading(true)
      const res = await fetch(url, {
        method: "GET",
        headers: {

          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      setLoading(false);


      if (result.success) {
        console.log(result.message);
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

  if(loading)
        {
          return (
            <>
            <Loading></Loading>
            </>
          );
        }

    if(error)
    {
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

            <p></p>

          ) : (donations.map((donation) => (
            <DonationBoxCard key={donation._id} data={donation} renderFrom={"History"} />)
          ))}
          {deliveries.length === 0 ? (

            <p></p>

          ) : (deliveries.map((delivery) => (
            <DonationBoxCard key={delivery._id} data={delivery} renderFrom={"History"} />)
          ))}

        </div>
      </div>
    </div>
  );
};

export default Accepted;
