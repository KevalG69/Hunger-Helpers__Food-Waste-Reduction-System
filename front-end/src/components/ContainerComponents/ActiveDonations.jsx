import React, { useContext, useEffect ,useState} from 'react';


import DonationBoxCard from '../SingleComponents/DonationBoxCard';
import Filters from '../SingleComponents/Filters';

import '../../css/Component/ActiveDonations.css';
import { handleError } from '../../utils/Toast';
import { contextAPI } from '../../services/RegistrationContext';

const ActiveDonations = () => {
 
  const {donationFilter} = useContext(contextAPI);
  const [donations,setDonations] = useState([]);
  const fetchDonationBox = async ()=>{

    try
    {
      const token = localStorage.getItem("Token");
      const status = "Pending"
      const type = donationFilter.type;
      const url = `http://localhost:3000/donation-box/?status=${status}&type=${type}`;

      const res = await fetch(url,{
        method:"GET",
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${token}`
        }
      })

      const result = await res.json();

      if(result.success)
      {
        console.log(result.message);
        console.log(result.data[0]);
        
        setDonations(result.data);
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

  useEffect(()=>{
    fetchDonationBox();
  },[])

  return (
    <div className="donation-layout">
     
      <div className="donation-main">
       {/* <Filters /> */}
        <div className="donation-cards">
          { donations.length === 0 ? (
          
                <p>No data available</p>
        
            ) :(donations.map((donation) => (
            <DonationBoxCard key={donation._id} data={donation} renderFrom={"ActiveDonations"} />)
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveDonations;
