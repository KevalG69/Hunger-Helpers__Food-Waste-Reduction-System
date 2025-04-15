import React, { useContext, useEffect, useState } from 'react';
import '../../css/Component/DonationBoxCard.css';
import { contextAPI } from '../../services/RegistrationContext';
import { handleError, handleSuccess } from '../../utils/Toast';


import { useNavigate } from 'react-router-dom';
import DonationEdit from '../../components/ContainerComponents/DonationEdit.jsx'

const DonationBoxCard = ({ data, renderFrom }) => {

  const navigate = useNavigate()
  const { userData, report, updateReport,updateEditDonationData } = useContext(contextAPI);
  const [Data,setData] = useState({});




  const converter = (raw) => {

    const rawDate = raw;
    const dateObj = new Date(rawDate);

    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return `${date} ${time}`
  }

  const getUserName = (id) => {

  }

  

  const handleAccept = async (e) => {
    e.preventDefault();
    try {
      const userId = data.user_id;
      const donationBoxId = data._id;
      const token = localStorage.getItem("Token");
      const url = `http://localhost:3000/donation-box/accept/?donationBoxId=${donationBoxId}&userId=${userId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {

          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      if (result.success) {
        console.log(result.message);
        handleSuccess(result.message)
      }
      else {
        console.log(result.message);
        handleError(result.message);

      }

    }
    catch (error) {
      console.log(error)
    }
  }

 

  const handleTrackLocation = async (e) => {
    e.preventDefault();
    DonationTracking(data);
  }

  

  const handleDelete = async (e) => {
    e.preventDefault();
    try
    {   
        const token = localStorage.getItem("Token");
        const userId = userData._id;
        const donationBoxId= data._id;

        const url = `http://localhost:3000/donation-box/id/?donationBoxId=${donationBoxId}&userId=${userId}`

        const res = await fetch(url,{
          method:"DELETE",
          headers:{
            'Content-type':"application/json",
            Authorization:`Bearer ${token}`
          }
        })

        const result = await res.json();

        if(result.success)
        {
          handleSuccess(result.message);
          console.log(result.message)
        }
        else
        {
          console.log(result.message);
        }
    }
    catch(error)
    {
        console.log(error);
    }
  }
  

const  handleCancelDonor = async(e)=>{

    try
    {   
        const token = localStorage.getItem("Token");
        const userId = userData._id;
        const donationBoxId= data._id;

        const url = `http://localhost:3000/donation-box/cancel-donor/?donationBoxId=${donationBoxId}&userId=${userId}`

        const res = await fetch(url,{
          method:"POST",
          headers:{
            'Content-type':"application/json",
            Authorization:`Bearer ${token}`
          }
        })

        const result = await res.json();

        if(result.success)
        {
          handleSuccess(result.message);
          console.log(result.message)
        }
        else
        {
          console.log(result.message);
        }
    }
    catch(error)
    {
        console.log(error);
    }
  }
  const handleReport = async (e) => {
    e.preventDefault();

    // Get the correct user ID whether populated or not
    const userId = data.user_id?._id || data.user_id;

    if (!userId || !data._id) {
      console.error("Missing IDs for report:", { userId, donationId: data._id });
      handleError("Cannot create report - missing information");
      return;
    }

    // Update the report state
    await updateReport({
      reportedUserId: userId,
      reportedDonationId: data._id
    });

    // Navigate after state is updated
    navigate("/Report", {
      state: { // Pass as location state as backup
        reportedUserId: userId,
        reportedDonationId: data._id
      }
    });
  };

const handleEdit = (e)=>{
  e.preventDefault();
  updateEditDonationData(data);
  navigate("/DonationEdit");
}


  return (
    <>
      <div className={`donation-card ${data.status.toLowerCase()}`}>
        <img src={data.food_image} alt={data.food_name} />
        <div className='flex'>
          <div className='flex-inner'>

            <div className="card-content">
              <div className='column1'>


                <p>Name: <span className='value'>{data.food_name}</span></p>
                <p>Type: <span className='value'>{data.food_type}</span></p>
                <p>Quantity: <span className='value'>{data.food_quantity}</span></p>
              </div>
              <div className='column2'>

                <p>Cooked: <span className='value'>{converter(data.food_cookedAt)}</span> </p>
                <p>Expire: <span className='value'>{converter(data.food_expireAt)}</span></p>
              </div>
              <div className='column3'>
                <p>Pickup Time: <span className='value'>{converter(data.pickup_time)}</span></p>

              </div>
              <div className='column5'>

                <p>Status</p>
                <span className={`status ${data.status.toLowerCase()}`}>{data.status}</span>
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

            <p>Donor: {data.user_id}</p>
            <p>Updated At:<span className='updated'>{data.updatedAt}</span></p>
          </div>
        </div>
      </div>
    
   

              </>
  );
};

export default DonationBoxCard;
