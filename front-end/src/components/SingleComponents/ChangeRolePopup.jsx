import React, { useContext, useState } from 'react';
import '../../css/Component/ChangeRolePopup.css'
import { useNavigate } from 'react-router-dom';
import { contextAPI } from '../../services/RegistrationContext';
import { handleError,handleSuccess } from '../../utils/Toast';


const ChangeRoleModal = () => {

  const navigate = useNavigate();
  const { userData, updateUserData } = useContext(contextAPI);
  console.log(userData)
  const [selectedRole, setSelectedRole] = useState('');

  const handleSubmit = () => {
    if (selectedRole) {
      onChangeRole(selectedRole);

    }
  };

  const onClose = () => {
    navigate(-1)
  }


  const onChangeRole = async (Role) => {

    try {
      const userId = userData._id
      const token = localStorage.getItem("Token");
      console.log(userData)
      if(!userId||!token)
      {
        handleError("User ID Error")
      }
      
      console.log(userId)
      const url = `http://localhost:3000/users/profile?id=${userId}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "Authorization":`Bearer ${token}`
        },
        body: JSON.stringify({
          nickName: userData.nickName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role:Role,
          state: userData.state,
          city: userData.city,
          age: userData.age,
          locality: userData.locality
        })
      })

      const result = await response.json();

      const { message, success } = result;

      if (success) {
        handleSuccess(message);
        updateUserData({ role: Role });
        setTimeout(() => {
          navigate("/Profile");
        }, 1000)
      }
      else {
        handleError(message);
      }
    }
    catch (error) {

    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Role</h2>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select a role</option>
          <option value="Volunteer">Volunteer</option>
          <option value="Restaurant-Donor">Restaurant-Donor</option>
          <option value="HouseHold-Donor">HouseHold-Donor</option>
        </select>

        <div className="modal-buttons">
          <button onClick={handleSubmit} className="submit-btn">Change</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
