import React, { useContext, useEffect, useState } from 'react';
import '../../css/Component/DonationBoxCard.css';
import { contextAPI } from '../../services/Context';
import { handleError, handleSuccess } from '../../utils/Toast';

import { useNavigate } from 'react-router-dom';
import Loading from '../../utils/Loading';

const DonationBoxCard = ({ delivery, renderFrom,fetchDonationBox}) => {

  const navigate = useNavigate()

  const { userData, updateOpenBox } = useContext(contextAPI);
  const [Data, setData] = useState();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const converter = (raw) => {

    const rawDate = raw;
    const dateObj = new Date(rawDate);

    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return `${date} ${time}`
  }


  const fetchDonationBoxById = async () => {
    try {

      const donationBoxId = delivery.donation_id;
      const userId = delivery.volunteer_id;

      const token = localStorage.getItem("Token");

      setLoading(true)
      const url = `http://localhost:3000/donation-box/id/?donationBoxId=${donationBoxId}&userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await res.json();

      setLoading(false)

      if (result.success) {
        setData(result.data)
      }
      else {
        setError(result.error)
      }

    }
    catch (error) {
      console.log(error)
      setError(error)
    }
  }


  const handleClaim = async (e) => {
    e.preventDefault();

    const userId = Data.user_id;
    const donationBoxId = Data._id;
    console.log(Data)
    try {


      const token = localStorage.getItem("Token");
      const url = `http://localhost:3000/donation-box/claim-volunteer?donationBoxId=${donationBoxId}&userId=${userId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-typ": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      if (result.success) {
        console.log(result.message);

      }
      else {
        console.log(result.message);


      }

    }
    catch (error) {
      console.log(error)
    }
  }

  const handleDeliver = async (e) => {

  }

  const handleTrackLocation = async (e) => {
    e.preventDefault();

  }


  //cancel volunteer
  const handleCancelVolunteer = async () => {
    try {
      const token = localStorage.getItem("Token");
      const userId = userData._id;

      const url = `http://localhost:3000/donation-box/cancel-volunteer/?donationBoxId=${Data._id}&userId=${userId}`;

      setLoading(true)
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();
      setLoading(false)

      if (result.success) {
        console.log(result.message);
        handleSuccess(result.message);
        fetchDonationBox();
        
      }
      else {
        console.log(result.message);
        handleError(result.message)
        setError(result.error);
      }

    }
    catch (error) {
      console.log(error)
      setError(error)
    }
  }

  const handleReport = async (e) => {
    localStorage.setItem("dId",Data._id);
    localStorage.setItem("uId",Data.user_id);
    
  await updateOpenBox("report-form")
    
  };


  useEffect(() => {
    fetchDonationBoxById();
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
    <>
      {(Data == null) ? (<></>) :
        (<div className={`donation-card ${Data.status.toLowerCase()}`}>
          <img src={Data.food_image} alt={Data.food_name} />
          <div className='flex'>
            <div className='flex-inner'>

              <div className="card-content">
                <div className='column1'>


                  <p>Name: <span className='value'>{Data.food_name}</span></p>
                  <p>Type: <span className='value'>{Data.food_type}</span></p>
                  <p>Quantity: <span className='value'>{Data.food_quantity}</span></p>
                </div>
                <div className='column2'>

                  <p>Cooked: <span className='value'>{converter(Data.food_cookedAt)}</span> </p>
                  <p>Expire: <span className='value'>{converter(Data.food_expireAt)}</span></p>
                </div>
                <div className='column3'>
                  <p>Pickup Time: <span className='value'>{converter(Data.pickup_time)}</span></p>

                </div>
                <div className='column5'>

                  <p>Status</p>
                  <span className={`status ${Data.status.toLowerCase()}`}>{Data.status}</span>
                  <span className={`status ${delivery.type.toLowerCase()}`}>{delivery.type}</span>

                </div>
              </div>
              <div className='column4'>
                {
                  (renderFrom == "Accepted") &&

                  (
                    <div className="card-actions">
                      <button onClick={handleClaim} className="accept">Claim</button>
                      {
                        (Data.status == "Claimed") &&
                        (<button onClick={handleDeliver} className="accept">Deliver</button>)
                      }
                      <button className="report" onClick={handleCancelVolunteer}>Cancel</button>
                      <button onClick={handleTrackLocation} className="location">Location</button>
                      <button onClick={handleReport} className="report">Report</button>
                    </div>
                  )
                }
                {
                  (renderFrom == "History") &&

                  (
                    <div className="card-actions">

                    </div>
                  )
                }
              </div>
            </div>

            <div className='donor'>

              <p>Donor: {Data.user_id}</p>
              <p>Updated At:<span className='updated'>{Data.updatedAt}</span></p>
            </div>
          </div>
        </div>
        )}


    </>
  );
};

export default DonationBoxCard;
