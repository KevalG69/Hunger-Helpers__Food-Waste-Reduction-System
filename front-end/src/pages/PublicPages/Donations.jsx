import React, { useContext, useEffect, useState } from 'react';
import '../../css/Pages/Donations.css';
import { contextAPI } from '../../services/RegistrationContext';
import ActiveDonations from '../../components/ContainerComponents/ActiveDonations';
import DonationFormModal from '../../components/ContainerComponents/DonationFormModel';
import { useNavigate } from 'react-router-dom';

import Accepted from '../../components/ContainerComponents/Accepted';
import MyDonations from '../../components/ContainerComponents/MyDonations';
import History from '../../components/ContainerComponents/History';
import ReportFormModal from '../../components/ContainerComponents/ReportFormModel';





function DonationPage() {
  const { userData, report } = useContext(contextAPI);

  //User Roles
  const USER_ROLES = {
    ADMIN: "Admin",
    MANAGER: "Manager",
    VOLUNTEER: "Volunteer",
    RESTAURANT_DONOR: "Restaurant-Donor",
    HOUSEHOLD_DONOR: "HouseHold-Donor"
  }
  const CURRENT_USER_ROLE = !userData ? null : userData.role;

  
  const volunteer = () => {
    if (CURRENT_USER_ROLE == USER_ROLES.VOLUNTEER || CURRENT_USER_ROLE == USER_ROLES.MANAGER || CURRENT_USER_ROLE == USER_ROLES.ADMIN) {
      return true;
    }
    else {
      return false;
    }
  }

 



  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("active-donations");




  const handleClick = (e) => {
    const selected = e.target.id || e.target.innerText.toLowerCase().replace(/\s/g, "");
    setActiveItem(selected);
  };

  const handleClose = () => {
    setActiveItem("active-donations")
  }



  return (
    <div className="donation-page">
      {/* Sidebar */}
      <aside className="sideba">
        <ul className="sideba-menu">

          {
            (volunteer()) &&
            (<li
              className={activeItem === "active-donations" ? "active" : ""}
              id="active-donations"
              onClick={handleClick}
            >
              Active Donations
            </li>)
          }
          {
            (volunteer()) &&
            (
              <li
                className={activeItem === "accepted" ? "active" : ""}
                id="accepted"
                onClick={handleClick}
              >
                Accepted
              </li>)
          }
          <li
            className={activeItem === "my-donations" ? "active" : ""}
            id="my-donations"
            onClick={handleClick}
          >
            My Donations
          </li>
          <li
            className={activeItem === "history" ? "active" : ""}
            id="history"
            onClick={handleClick}
          >
            History
          </li>

          <li
            className={activeItem === "donationFormData" ? "active" : ""}
            id="donationFormData"
            onClick={handleClick}
          >
            +
          </li>

        </ul>
      </aside>

      {/* Donation Cards */}
      {
        (activeItem == "active-donations") &&
        (<ActiveDonations />)
      }
      {
        (activeItem == "accepted") &&
        (<Accepted />)
      }
      {
        (activeItem == "my-donations") &&
        (<MyDonations />)
      }
      {
        (activeItem == "history") &&
        (<History />)
      }

      {
        (activeItem == "donationFormData") &&
        (<DonationFormModal onClose={handleClose} />)
      }

      {
        (activeItem == "reportForm") &&
        (<ReportFormModal onClose={handleClose} reportedUserId={report.reportedUserId} reportedDonationId={report.reportedDonationId} />)
      }


    </div>

  );
}

export default DonationPage;