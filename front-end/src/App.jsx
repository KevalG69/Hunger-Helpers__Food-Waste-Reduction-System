//Modules
import { useState } from 'react'
import { Route, BrowserRouter as Router, Routes ,Navigate} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//css 
import './css/App.css'

//Components
import Navbar from './components/ContainerComponents/Navbar'

//service
import { ContextProvider } from './services/RegistrationContext';

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



function App() {

  return (
    <ContextProvider>

      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Navigate to="/Home"/>} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Donations" element={<Donations />} />
          <Route path="/Donation-point" element={<DonationPoint/>} />
          <Route path="/Aboutus" element={<AboutUs />} />

          <Route path="/Notifications" element={<Notifications />} />
          <Route path="/Profile" element={<Profile />} />
          
          <Route path="/Login" element={<Login/>} />
          <Route path='/RegistrationStep1' element={<RegistrationStep1/>}/>
          <Route path='/CodeVerification' element={<CodeVerification/>}/>
          <Route path='/RegistrationStep2' element={<RegistrationStep2/>}/>
          <Route path='/ForgotPassword' element={<ForgotPassword/>}/>
          <Route path='/CreateNewPassword' element={<CreateNewPassword/>}/>
                   
        </Routes>
      </Router>
      <ToastContainer/>
    </ContextProvider>    

  )
}

export default App;
