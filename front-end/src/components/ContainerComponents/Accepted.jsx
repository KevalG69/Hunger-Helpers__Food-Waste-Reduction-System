import React, { useContext, useEffect ,useState} from 'react';


import DonationBoxCard2 from '../SingleComponents/DonationBoxCard2';
import Filters from '../SingleComponents/Filters';

import '../../css/Component/ActiveDonations.css';
import { handleError } from '../../utils/Toast';
import { contextAPI } from '../../services/RegistrationContext';

const Accepted = () => {

  const {userData} = useContext(contextAPI);
  const [donations1,setDonations1] = useState([]);
  

  
  
  const fetchDonationBox1 = async ()=>{

    try
    {
      const token = localStorage.getItem("Token");
      const userId = userData._id;
    
      const url = `http://localhost:3000/users/deliveries/?userId=${userId}`;

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
       
        console.log(result.data)
        setDonations1(result.data);
      }
      else
      {
        console.log(result.message);
      }

    }
    catch(error)
    {
      console.log(error)
    }
  }
 
  
  const fetchDonationBox2 = async (donation)=>{

    try
    {
      const donationBoxId = donation.donation_id;
      const token = localStorage.getItem("Token");
      const userId = userData._id;
    
      const url = `http://localhost:3000/donation-box/id/?donationBoxId=${donationBoxId}&userId=${userId}`;

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
       
        console.log(result.data)
        return result.data;
      }
      else
      {
        console.log(result.message);
      }

    }
    catch(error)
    {
      console.log(error)
    }
  }
 

  
  useEffect(()=>{
    fetchDonationBox1();
   

  },[])
  
  return (
    <div className="donation-layout">
     
      <div className="donation-main">
        {/* <Filters /> */}
        <div className="donation-cards">
          { donations1.length === 0 ? (
          
                <p>No data available</p>
        
            ) :(donations1.map((donation) => (
            <DonationBoxCard2 key={donation._id} delivery={donation} renderFrom={"Accepted"}/>)
          ))}
        </div>
      </div>
    </div>
  );
};

export default Accepted;
