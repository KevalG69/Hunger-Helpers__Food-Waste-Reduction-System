import React, { useContext } from 'react';
import '../../css/Component/Logout.css';
import { useNavigate } from 'react-router-dom';
import { contextAPI } from '../../services/Context';


const LogoutPopup = () => {

    const navigate = useNavigate();
    const {userData,updateUserData} = useContext(contextAPI);

    const onConfirm = ()=>{
        const token = localStorage.getItem("Token");
        const RToken = localStorage.getItem("RToken");

        if(token)
        {
            localStorage.removeItem("Token");
        }
        if(RToken)
        {
            localStorage.removeItem("RToken");
            navigate("/Home")
        }

        if(userData)
        {
            updateUserData(null)
            window.location.reload();
        }



    }

    const onCancel = ()=>{
        navigate(-1)
    }
  return (
    <div className="logout-popup-overlay">
      <div className="logout-popup">
        <h3>Are you sure you want to logout?</h3>
        <div className="logout-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes</button>
          <button onClick={onCancel} className="cancel-btn">No</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
