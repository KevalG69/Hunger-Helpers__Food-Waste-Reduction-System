import React, { useState, useRef, useContext } from "react";


//css
import '../../css/Component/DonationFormModel.css';

import { handleError, handleSuccess} from "../../utils/Toast.jsx";
//service
import getLocationAndSubmit from '../../services/getLocationAndSubmite.jsx'
import { contextAPI } from "../../services/RegistrationContext.jsx";
import { useNavigate } from "react-router-dom";

function DonationFormModal({data}) {

    const navigate = useNavigate();
    const {userData,updateEditDonationData} = useContext(contextAPI);
    const [formData, setFormData] = useState({
        food_name: data.food_name,
        food_type: data.food_type,
        status:data.food_status,
        food_quantity: data.food_quantity,
        food_cookedAt: data.food_cookedAt,
        food_expireAt: data.food_expireAt,
        pickup_time: data.pickup_time,
        pickup_location:data.pickup_location,
        food_image: data.food_image,
        location:{
            lat:data.lat,
            lng:data.lng
        }
    });

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

    const uploadForm = new FormData();
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Upload to server or Cloudinary
        
        uploadForm.append("food_image", file);


    };

    const handleLocation = async (e) => {
        e.preventDefault(); // prevent button from submitting form
      
        try {
          const res = await getLocationAndSubmit();
          const { latitude, longitude } = res;
      
          setFormData((prev) => ({
            ...prev,
            location: {
              lat: latitude,
              lng: longitude
            }
          }));
      
          console.log("Location updated:", latitude, longitude);
        } catch (err) {
          alert("Failed to get location: " + err);
          console.error(err);
        }
      };
      
      const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(e.target.id=="locatio")
        {
            return;
        }
        const token = localStorage.getItem("Token");
      
        const formDataToSend = new FormData();
        formDataToSend.append("food_name", formData.food_name);
        formDataToSend.append("food_type", formData.food_type);
        formDataToSend.append("food_quantity", formData.food_quantity);
        formDataToSend.append("food_cookedAt", formData.food_cookedAt);
        formDataToSend.append("food_expireAt", formData.food_expireAt);
        formDataToSend.append("pickup_time", formData.pickup_time);
        formDataToSend.append("pickup_location", formData.pickup_location);
        formDataToSend.append("lat", formData.location.lat);
        formDataToSend.append("lng", formData.location.lng);
        
        if (fileInputRef.current?.files[0]) {
          formDataToSend.append("food_image", fileInputRef.current.files[0]);
        }
        else
        {
          formDataToSend.append("food_image",null);
        }
      
        try {
            const userId=userData._id;
          const res = await fetch(`http://localhost:3000/donation-box/update/?donationBoxId=${data._id}&userId=${userId}`, {
            method: "PUT",
            headers: {
                "Content-type":"application/json",
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,
          });
      
          const result = await res.json();
      
          if (result.success) {
            console.log(result.message);
            handleSuccess(result.message);

            navigate("/Donations");
          } else {
         
            console.log(result.error.details);
          }
        } catch (err) {
          console.log("Upload failed", err);
        }
      
        console.log("Form data submitted:", formData);
      };
      
const onClose= ()=>{
    navigate(-1);
}
    

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="close-btn" onClick={onClose}>×</button>

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
                            <input type="datetime-local" name="food_cookedAt" value={formData.food_cookedAt} placeholder="cooked time"onChange={handleChange} required />
                            <label className="l">Expire Time</label> 
                            <input type="datetime-local" name="food_expireAt" value={formData.food_expireAt} placeholder="expire time" onChange={handleChange} required />
                            <label className="l">Pickup Time</label> 
                            <input type="datetime-local" name="pickup_time" value={formData.pickup_time} placeholder="pickup time" onChange={handleChange} required />
                            <button className="locatio" onClick={handleLocation}>Live Location</button>
                            <input type="text" name="pickup_location" value={formData.pickup_location} placeholder="Pickup Location" onChange={handleChange} required />
                        </div>

                        <div className="action-buttons">
                            <button type="submit" className="create-btn">Update</button>
                            <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DonationFormModal;
