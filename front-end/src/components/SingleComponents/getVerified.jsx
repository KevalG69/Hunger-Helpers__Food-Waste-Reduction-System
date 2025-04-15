import React, { useContext } from 'react';
import '../../css/Component/getVerified.css';
import { useNavigate } from 'react-router-dom';



const GetVerified = () => {

    const navigate = useNavigate();
    

    const onConfirm = ()=>{

        navigate(-1)
    }

   
  return (
    <div className="logout-popup-overlay">
      <div className="logout-popup">
        <h3>Contact NGO's Manager to get Verified</h3>
        <div className="logout-buttons">
          <button onClick={onConfirm} className="confirm-btn">OK</button>
        </div>
      </div>
    </div>
  );
};

export default GetVerified;
