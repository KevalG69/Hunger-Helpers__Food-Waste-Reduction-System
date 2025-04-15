import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom"

//svgs 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

//service
import { contextAPI } from '../../services/RegistrationContext';

//css
import '../../css/Pages/RegistrationStep2.css';
import { handleError, handleSuccess } from '../../utils/Toast';


const RegistrationStep2 = () => {

  const { registrationData,updateUserData } = useContext(contextAPI);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nickName: "",
    role: "",
    firstName: "",
    lastName: "",
    state: "",
    city: "",
  });

  //Close Button 
  const handleCloseBtn = () => {
    navigate(-1);
  }
  const onBack = () => {
    navigate(-1);
  }

  const handleChange = (e) => {
    //extracting data
    const { name, value } = e.target;
    console.log(name, value);

    //copying data
    const copyFormData = { ...formData };

    //making chang in copy data
    copyFormData[name] = value;

    //changing original data
    setFormData(copyFormData);


    console.log(formData.nickName);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn("Submited")

    //extracting info
    const { nickName, firstName, lastName, state, city, role } = formData;


    //checking data
    if (!lastName || !firstName || !state || !city) {
      handleError('All Field Required');
    }
    else if (!role) {
      handleError("Please Select Role");
    }
    else {
      fetchStep2API();
    }
  };

  const fetchStep2API = async () => {

    try {
      const url = "http://localhost:3000/auth/register-step2";
      const { nickName, firstName, lastName, state, city } = formData;
      let nickname = nickName == "" ? null : nickName;
      let firtname = firstName;
      console.log(formData);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          nickName: nickname,
          firstName: firtname,
          lastName,
          state,
          city
        })
      })

      const result = await response.json();

      const { message, success } = result;

      if (success) {
        handleSuccess(message);
        fetchRegisterAPI();
      }
      else {
        console.log(result.error.details[0].message)

        handleError(`${result.error.details[0].message}`);

      }
    }
    catch (error) {
      console.log(error);
      handleError("UnExpected Error")
    }
  }

  const fetchRegisterAPI = async () => {

    try {
      const url = "http://localhost:3000/auth/register";
      const { identifier, password } = registrationData;
      const { nickName, firstName, lastName, state, city, role } = formData;
      console.log(formData);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({
          nickName,
          firstName,
          lastName,
          role,
          state,
          city,
          identifier,
          password,
        })
      })

      const result = await response.json();

      const { message, success } = result;

      if (success) {
        handleSuccess(message);
        const data = result.data;
        updateUserData({data});
        setTimeout(() => {
          navigate("/Home");
        }, 1000)
      }
      else {
        handleError(message);
      }
    }
    catch (error) {
      console.log(error);
      handleError("UnExpected Error")
    }
  }


  return (
    <div className="details-modal">
      <div className="details-box">
        <FontAwesomeIcon className="close_btn" size="xl" icon={faXmark} onClick={handleCloseBtn} />

        <h2>Finally! Your Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <input
              type="text"
              placeholder="nick name (Optional)"
              name="nickName"
              value={formData.nickName}
              onChange={handleChange}
            />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Role</option>
              <option value="HouseHold-Donor">Household (Donor)</option>
              <option value="Restaurant-Donor">Restaurant (Donor)</option>
              <option value="Volunteer">Volunteer</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <div className="row">
            <input
              type="text"
              placeholder="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="buttons">
            <button type="button" className="back" onClick={onBack}>Back</button>
            <button type="submit" className="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationStep2;
