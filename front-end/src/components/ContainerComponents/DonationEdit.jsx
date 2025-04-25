import React, { useState, useRef, useContext, useEffect } from "react";


//css
import '../../css/Component/DonationFormModel.css';

import { handleError, handleSuccess } from "../../utils/Toast.jsx";
//service
import getLocationAndSubmit from '../../services/getLocationAndSubmite.jsx'
import { contextAPI } from "../../services/Context.jsx";
import { data, useNavigate } from "react-router-dom";

function DonationFormModal() {

  const navigate = useNavigate();
  const { userData,updateOpenBox } = useContext(contextAPI);

  const [location,setLocation] = useState({
    lat:0,
    lng:0
  })
  const [formData, setFormData] = useState({
    food_name:"",
    food_type: "",
    status:"",
    food_quantity:0,
    food_cookedAt:"",
    food_expireAt: "",
    pickup_time:"",
    pickup_location:"",
    food_image:null,
    lat:0,
    lng:0 

  });

  
  const converter = (raw) => {

    const rawDate = raw;
    const dateObj = new Date(rawDate);

    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    return `${date} ${time}`
  }

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
    const iso = date.toISOString();
    return iso.slice(0, 16); // "YYYY-MM-DDTHH:mm"
  };
  

  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Upload to server or Cloudinary

    setFormData((prev) => ({
      ...prev,
      food_image: fileInputRef.current.files[0],
    }));
    


  };

  const handleLocation = async (e) => {
    e.preventDefault(); // prevent button from submitting form

    try {
      const res = await getLocationAndSubmit();
      const { latitude, longitude } = res;

      setFormData((prev) => ({
        ...prev,
          lat: latitude
      }));
      setFormData((prev) => ({
        ...prev,
          lng: longitude
      }));
      console.log("Location updated:", latitude, longitude);
    } catch (err) {
      alert("Failed to get location: " + err);
      console.error(err);
    }
  };

  const fetchDonationBoxById = async () => {
    try {

      const donationBoxId = localStorage.getItem("dId");
      const userId = localStorage.getItem("uId");

      const token = localStorage.getItem("Token");

      
      const url = `http://localhost:3000/donation-box/my-id/?donationBoxId=${donationBoxId}&userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const result = await res.json();

      

      if (result.success) {
    
       setFormData(result.data)


        const {location} = result.data;
        
        console.log("Form Data",formData)
        let lat = location.lat;
        let lng = location.lng;

        setLocation({lat,lng})
       
        console.log("data seted")
      }
      else {
       console.log(result.error)

      }

    }
    catch (error) {
      console.log(error)
     
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (e.target.class == "locatio") {
      return;
    }
    const token = localStorage.getItem("Token");
    const donationBoxId = localStorage.getItem("dId");
    const formDataToSend = new FormData();
    formDataToSend.append("food_name", formData.food_name);
    formDataToSend.append("food_type", formData.food_type);
    formDataToSend.append("food_quantity", formData.food_quantity);
    formDataToSend.append("food_cookedAt", formData.food_cookedAt);
    formDataToSend.append("food_expireAt", formData.food_expireAt);
    formDataToSend.append("pickup_time", formData.pickup_time);
    formDataToSend.append("pickup_location", formData.pickup_location);
    
    // 👇 Always use .append for lat/lng too
    formDataToSend.append("lat", formData.lat || location.lat);
    formDataToSend.append("lng", formData.lng || location.lng);
    
    // 👇 Use correct file upload
    if (fileInputRef.current?.files[0]) {
      formDataToSend.append("food_image", fileInputRef.current.files[0]);
    } else if (formData.food_image instanceof File) {
      formDataToSend.append("food_image", formData.food_image);
    }
    
    console.log("🚀 Sending FormData:");
  for (let [key, value] of formDataToSend.entries()) {
    console.log(key, value);
  }
    try {
      const userId = userData._id;
      const res = await fetch(`http://localhost:3000/donation-box/update/?donationBoxId=${donationBoxId}&userId=${userId}`, {
        method: "PUT",
        headers: {
          
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      const result = await res.json();

      if (result.success) {
        console.log(result.message);
        handleSuccess(result.message);
        updateOpenBox("my-donations")
      } else {

        console.log(result.error.details[0].message);
        handleError(result.error.details[0].message);

      }
    } catch (err) {
      console.log("Upload failed", err);
    }

    
  };

  
  const handleClose = async(e) =>{
    updateOpenBox("my-donations")
  }
  useEffect(()=>{
    fetchDonationBoxById()
  },[])


  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={handleClose}>×</button>

        <form onSubmit={handleSubmit} className="donation-form">

          <div className="image-section" onClick={handleImageClick}>
            <img
              src={formData.food_image || "/upload-placeholder.png"}
              alt="Upload"
              className="image-preview"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <button type="button" className="upload-btn" onClick={handleImageClick}>Upload</button>
          </div>
          <div>

            <div className="form-grid">
              <div className="row">
                <input type="text" name="food_name" value={formData.food_name} placeholder="Food Name" onChange={handleChange} required />
                <select name="food_type" className="type" value={formData.food_type} onChange={handleChange}>
                  <option value="">Type</option>
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>

              </div>
              <input type="text" name="food_quantity" value={formData.food_quantity} placeholder="Food Quantity" onChange={handleChange} required />
              <label className="l">Coocked time</label>
              <input type="datetime-local" name="food_cookedAt" value={formatDateForInput(formData.food_cookedAt)} placeholder="cooked time" onChange={handleChange} required />
              <label className="l">Expire Time</label>
              <input type="datetime-local" name="food_expireAt" value={formatDateForInput(formData.food_expireAt)} placeholder="expire time" onChange={handleChange} required />
              <label className="l">Pickup Time</label>
              <input type="datetime-local" name="pickup_time" value={formatDateForInput(formData.pickup_time)} placeholder="pickup time" onChange={handleChange} required />
              <button className="locatio" onClick={handleLocation}>Live Location</button>
              <input type="text" name="pickup_location" value={formData.pickup_location} placeholder="Pickup Location" onChange={handleChange} required />
            </div>

            <div className="action-buttons">
              <button type="submit" className="create-btn">Update</button>
              <button type="button" onClick={handleClose} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DonationFormModal;
