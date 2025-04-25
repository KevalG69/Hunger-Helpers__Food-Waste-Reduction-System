import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCircleUser,faHouse ,
        faBoxOpen,faUserTie,faAddressCard,
        faMapLocationDot,faPeopleCarryBox
} from '@fortawesome/free-solid-svg-icons'


//css
import '../../css/Component/Navbar.css';

//svgs
import HungerHelpersLogo from '../../assets/image/HungerHelpersLogo.png'
import { useContext } from 'react';
import { contextAPI } from '../../services/Context';


function Navbar() {
    const { userData } = useContext(contextAPI);

    //User Roles
    const USER_ROLES = {
        ADMIN: "Admin",
        MANAGER: "Manager",
        VOLUNTEER: "Volunteer",
        RESTAURANT_DONOR: "Restaurant-Donor",
        HOUSEHOLD_DONOR: "HouseHold-Donor"
    }
    const CURRENT_USER_ROLE = !userData ? null : userData.role;

    const navigate = useNavigate();
    //handle onClick    
    const handleClick = () => {
        navigate("/Login")
    }

    const newUser = () => {
        if (!CURRENT_USER_ROLE) {
            return true;
        }
        else {
            return false;
        }
    }

    const User = () => {
        if (CURRENT_USER_ROLE) {
            return true;
        }
        else {
            return false;
        }
    }

    const donor = () => {
        if (CURRENT_USER_ROLE == USER_ROLES.RESTAURANT_DONOR || CURRENT_USER_ROLE == USER_ROLES.HOUSEHOLD_DONOR ||
            CURRENT_USER_ROLE == USER_ROLES.VOLUNTEER ||
            CURRENT_USER_ROLE == USER_ROLES.MANAGER || CURRENT_USER_ROLE == USER_ROLES.ADMIN) {
            return true;
        }
        else {
            return false;
        }
    }

    const volunteer = () => {
        if (CURRENT_USER_ROLE == USER_ROLES.VOLUNTEER || CURRENT_USER_ROLE == USER_ROLES.MANAGER || CURRENT_USER_ROLE == USER_ROLES.ADMIN) {
            return true;
        }
        else {
            return false;
        }
    }

    const manager = () => {
        if (CURRENT_USER_ROLE == USER_ROLES.MANAGER) {
            return true;
        }
        else {
            return false;
        }
    }

    const admin = () => {
        if (CURRENT_USER_ROLE == USER_ROLES.ADMIN) {
            return true;
        }
        else {
            return false;
        }
    }

    return (
        <>
            <nav className='Navbar'>
                <img className='logo' src={HungerHelpersLogo} />

                <ul className='options'>
                    <li><NavLink to="Home">Home</NavLink></li>
                    {
                        (donor()) &&
                        (
                            <li><NavLink to="Donations">Donations</NavLink></li>
                        )
                    }

                    {
                        (volunteer())
                        &&
                        (
                            <li><NavLink to="Help-Me">Help Me</NavLink></li>
                        )
                    }
                    {
                        (User())
                        &&
                        (
                            <li><NavLink to="Donation-point">Donation Point</NavLink></li>
                        )
                    }
                    <li><NavLink to="Aboutus">About Us</NavLink></li>

                    {
                        (manager()) &&
                        (<li><NavLink to="Manager-panel">Manager Panel</NavLink></li>)

                    }

                    {
                        (admin()) &&
                        (<li><NavLink to="Admin-panel">Admin Panel</NavLink></li>)


                    }

                </ul>

                <ul className='user-options'>
                    {
                        (User()) &&
                        (<li><NavLink to="Notifications" className="link"><FontAwesomeIcon icon={faBell} size="2xl" style={{ color: "white" }} /></NavLink></li>)


                    }
                    {
                        (User()) &&
                        (<li><NavLink to="Profile" className="linke"><FontAwesomeIcon icon={faCircleUser} size="2xl" style={{ color: "white" }} /></NavLink></li>)
                    }
                    {
                        (newUser()) &&
                        (<li><button className="joinUs_btn" onClick={handleClick}>Join Us</button></li>)

                    }
                </ul>
            </nav>

            {/* Mobile Bottom Navbar */}
            <div className="mobile-navbar">
               
                {/* <div className="mobile-icons"> */}
                <ul className="options">
                    <li><NavLink to="Home" end><FontAwesomeIcon className='mobile-icons' icon={faHouse} style={{color: "#ffffff",}} /></NavLink></li>
                    {
                        (donor()) &&
                        (
                            <li><NavLink to="Donations" end><FontAwesomeIcon className='mobile-icons' icon={faBoxOpen} style={{color: "#ffffff",}} /></NavLink></li>
                        )
                    }

                    {
                        (volunteer())
                        &&
                        (
                            <li><NavLink to="Help-Me" end><FontAwesomeIcon className='mobile-icons' icon={faPeopleCarryBox} style={{color: "#ffffff",}} /></NavLink></li>
                        )
                    }
                    {
                        (User())
                        &&
                        (
                            <li><NavLink to="Donation-point" end><FontAwesomeIcon className='mobile-icons' icon={faMapLocationDot} style={{color: "#ffffff",}} /></NavLink></li>
                        )
                    }
                    {/* <li><NavLink to="Aboutus"><FontAwesomeIcon className='mobile-icons' icon={faAddressCard} style={{color: "#ffffff",}} /></NavLink></li> */}

                    {
                        (manager()) &&
                        (<li><NavLink to="Manager-panel" end><FontAwesomeIcon className='mobile-icons' icon={faUserTie} style={{color: "#ffffff",}} /></NavLink></li>)

                    }

                    {
                        (admin()) &&
                        (<li><NavLink to="Admin-panel" end><FontAwesomeIcon className='mobile-icons' icon={faUserTie} style={{color: "#ffffff",}} /></NavLink></li>)


                    }

                    {
                        (User()) &&
                        (<li><NavLink to="Notifications" end><FontAwesomeIcon className='mobile-icons' icon={faBell}  style={{ color: "white" }} /></NavLink></li>)


                    }
                    {
                        (User()) &&
                        (<li><NavLink to="Profile" end ><FontAwesomeIcon className='mobile-icons' icon={faCircleUser} style={{ color: "white" }} /></NavLink></li>)
                    }
                    {
                        (newUser()) &&
                        (<li><button className="joinUs_btn" onClick={handleClick}>Join Us</button></li>)

                    }
                </ul>
            </div>

        </>
    )
}
{/* <FontAwesomeIcon icon={faCircleUser} size="2xl" style={{color:"white"}} /> */ }

export default Navbar;