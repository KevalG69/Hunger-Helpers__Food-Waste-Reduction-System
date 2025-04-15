import React, { useContext, useEffect, useState } from 'react';
import '../../css/Component/DonationBoxCard.css';
import { contextAPI } from '../../services/RegistrationContext';
import { handleError, handleSuccess } from '../../utils/Toast';
import DonationTracking from './TrackView';
import ReportFormModal from '../ContainerComponents/ReportFormModel';
import { useNavigate } from 'react-router-dom';


const DonationBoxCard = ({ delivery, renderFrom }) => {

  const navigate = useNavigate()
  const { userData, report, updateReport } = useContext(contextAPI);
  const [Data,setData] = useState();




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
      if(!donationBoxId)
      {
        return;
      }
      const userId = delivery.volunteer_id;
      const token = localStorage.getItem("Token");
      const url = `http://localhost:3000/donation-box/id/?donationBoxId=${donationBoxId}&userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await res.json();

      if (result.success) {
        const {status,food_name} = result.data[0];
        setData(result.data[0])
        console.log("Fetched data",Data)
      }
      else {
    
        handleError(result.message);

      }

    }
    catch (error) {
      console.log(error)
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

  
 

  const handleReport = async (e) => {
    e.preventDefault();

    // Get the correct user ID whether populated or not
    const userId = Data.user_id?._id || Data.user_id;

    if (!userId || !Data._id) {
      console.error("Missing IDs for report:", { userId, donationId: Data._id });
      handleError("Cannot create report - missing information");
      return;
    }

    // Update the report state
    await updateReport({
      reportedUserId: userId,
      reportedDonationId: Data._id
    });

    // Navigate after state is updated
    navigate("/Report", {
      state: { // Pass as location state as backup
        reportedUserId: userId,
        reportedDonationId: Data._id
      }
    });
  };


  useEffect(()=>{
    fetchDonationBoxById();
  },[])
  return (
    <>
      {(Data==null)?(
          <p>No Data Available</p>):
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
              </div>
            </div>
            <div className='column4'>

              {
                  (renderFrom === "ActiveDonations") &&

                (
                    <div className="card-actions">
                    <button onClick={handleAccept} className="accept">Accept</button>
                    <button onClick={handleTrackLocation} className="location">Location</button>
                    <button onClick={handleReport} className="report">Report</button>
                  </div>
                )
              }

              {
                  (renderFrom == "Accepted") &&

                (
                    <div className="card-actions">
                    <button onClick={handleClaim} className="accept">Claim</button>
                    <button onClick={handleDeliver} className="accept">Deliver</button>
                    <button onClick={handleCancelVolunteer} className="report">Cancel</button>
                    <button onClick={handleTrackLocation} className="location">Location</button>
                    <button onClick={handleReport} className="report">Report</button>
                  </div>
                )
              }
              {
                  (renderFrom == "MyDonations") &&

                (
                    <div className="card-actions">
                    <button onClick={handleEdit} className="accept">Edit</button>
                    <button onClick={handleCancelDonor} className="report">Cancel</button>
                    <button onClick={handleDelete} className="report">Delete</button>
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
