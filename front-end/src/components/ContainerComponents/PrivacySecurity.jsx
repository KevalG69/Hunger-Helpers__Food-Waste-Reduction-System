import { useContext, useState} from 'react';
import '../../css/Component/PrivacySecurity.css';
import { useNavigate } from 'react-router-dom';

const PrivacySecurity = () => {

 
  const navigate = useNavigate();
  const handleClick = ()=>{
    navigate("/ForgotPassword")
  }

  return (
    <div className="privacy-container">
      <h2>Privacy & Security</h2>

      <div className="privacy-section">
        <h4>Login & Account Security</h4>
        <div className="privacy-card">
          <span><i className="fa fa-lock"></i> Change Password</span>
          <button onClick={handleClick} className="change-btn">Change</button>
        </div>

        <h4>Recent Login</h4>
        
      </div>
    </div>
  );
};

export default PrivacySecurity;
