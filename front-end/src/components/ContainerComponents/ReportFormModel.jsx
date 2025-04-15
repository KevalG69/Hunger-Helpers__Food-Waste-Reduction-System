import React, { useRef, useState } from "react";
import '../../css/Component/ReportFromModel.css'; // Make sure to style this
import { handleError, handleSuccess } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

const ReportFormModal = ({  reportedUserId, reportedDonationId }) => {
  const navigate= useNavigate();
  const fileInputRef = useRef();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [formData, setFormData] = useState({
    reportType: "",
    desription: "",
  });

  const onClose = ()=>{
    navigate("/Donations")
  }
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const uploadToCloudinary = async (files) => {
    const uploadedUrls = [];
    for (let file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("cloud_name", "dwcjife8s"); // 🔁 CHANGE

      const res = await fetch("https://api.cloudinary.com/v1_1/dwcjife8s/image/upload", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.secure_url) uploadedUrls.push(result.secure_url);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const evidenceUrls = await uploadToCloudinary(imageFiles);
      const token = localStorage.getItem("Token");
      const reportType = formData.reportType;
      const description = formData.description;

      const response = await fetch(`http://localhost:3000/report`, {
        method: "POST",
        headers: {
          
          Authorization: `Bearer ${token}`,
        },
        body:  {
          reportType,
          description,
          reportedUserId,
          reportedDonationId,
          evidence: evidenceUrls}
      });

      const result = await response.json();

      if (result.success) {
        handleSuccess("Report submitted!");
        onClose();
      } else {
        handleError(result.message);
      }

    } catch (err) {
      console.error(err);
      handleError("Failed to submit report");
    }
  };

  return (
    <div className="report-modal-overlay">
      <div className="report-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Report Form</h2>
        <form onSubmit={handleSubmit}>

          <label>Type of Report</label>
          <select name="reportType" onChange={handleChange} required>
            <option value="">Select type</option>
            <option value="Fake Donation">Fake Donation</option>
            <option value="Abuse">Abuse</option>
            <option value="Inappropriate Content">Inappropriate Content</option>
            <option value="Other">Other</option>
          </select>

          <label>Description</label>
          <textarea
            name="desription"
            rows="4"
            placeholder="Describe the issue"
            onChange={handleChange}
            required
          />

          <label>Upload Evidence (optional)</label>
          <div className="image-preview-area" onClick={handleImageClick}>
            {previewUrls.length === 0 ? (
              <span>Click to upload</span>
            ) : (
              previewUrls.map((url, i) => (
                <img src={url} alt={`Preview ${i}`} key={i} className="preview-img" />
              ))
            )}
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <div className="form-actions">
            <button type="submit" className="btn-submit">Submit Report</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportFormModal;
