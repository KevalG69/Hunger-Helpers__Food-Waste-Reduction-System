//Modules

import { Route, BrowserRouter as Router, Routes, Navigate, useNavigate} from 'react-router-dom'
import { useEffect, useContext, useState } from 'react';

import { contextAPI } from "./services/RegistrationContext";


import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

//css 
import './css/App.css'

//Components
import Navbar from './components/ContainerComponents/Navbar'

//utils
import { DonorElement, NewUserElement, PublicElement, UserElement, VolunteerElement } from './services/AccessController';
import { useFetchUser } from './utils/FetchUser';


//pages 
import Home from './pages/PublicPages/Home'
import Donations from './pages/PublicPages/Donations'
import DonationPoint from './pages/PublicPages/DonationPoint'
import AboutUs from './pages/PublicPages/AboutUs'

import Notifications from './pages/UserPages/Notifications'
import Profile from './pages/UserPages/Profile'

import Login from './pages/AuthPages/Login'
import RegistrationStep1 from './pages/AuthPages/RegistrationStep1';
import RegistrationStep2 from './pages/AuthPages/RegistrationStep2';
import CodeVerification from './pages/AuthPages/CodeVerification';
import ForgotPassword from './pages/AuthPages/ForgotPassword';
import CreateNewPassword from './pages/AuthPages/CreateNewPassword';
import ReportFormModal from './components/ContainerComponents/ReportFormModel';
import DonationEdit from './components/ContainerComponents/DonationEdit';




function App() {

 
 const {userData,report,editDonationData} = useContext(contextAPI);

    const fetchUser = useFetchUser();

    useEffect(() => {
      console.log("---------------------------------------------------------------")
      const token = localStorage.getItem("Token");
      if (token) {
      
        fetchUser(token);
      }
    }, []);
  


  return (

    <>
   
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/Home" />} />

          <Route path="/Home" element={<PublicElement><Home /></PublicElement>} />
          <Route path="/Donations" element={<DonorElement><Donations /></DonorElement>} />
          <Route path="/Donation-point" element={<UserElement><DonationPoint /></UserElement>} />
          <Route path="/Aboutus" element={<PublicElement><AboutUs /></PublicElement>} />

          <Route path="/Notifications" element={<UserElement><Notifications /></UserElement>} />
          <Route path="/Profile" element={<UserElement><Profile /></UserElement>} />

          <Route path="/Login" element={<NewUserElement><Login /></NewUserElement>} />
          <Route path='/RegistrationStep1' element={<NewUserElement><RegistrationStep1 /></NewUserElement>} />
          <Route path='/CodeVerification' element={<NewUserElement><CodeVerification /></NewUserElement>} />
          <Route path='/RegistrationStep2' element={<NewUserElement><RegistrationStep2 /></NewUserElement>} />
          <Route path='/ForgotPassword' element={<PublicElement><ForgotPassword /></PublicElement>} />
          <Route path='/CreateNewPassword' element={<PublicElement><CreateNewPassword /></PublicElement>} />

          <Route path='/Report' element={<UserElement><ReportFormModal reportedUserId={report.reportedUserId} 
          reportedDonationId={report.reportedDonationId} /></UserElement>} />
          <Route path="/DonationEdit" element={<UserElement><DonationEdit data={editDonationData}/></UserElement>} />

        </Routes>
    
      <ToastContainer />
    </>


  )
}

export default App;
