import { Link ,NavLink, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell,faCircleUser } from '@fortawesome/free-solid-svg-icons'


//css
import '../../css/Component/Navbar.css';

//svgs
import HungerHelpersLogo from '../../assets/image/HungerHelpersLogo.png'


function Navbar()
{
    //handle onClick    
    const handleClick = ()=>{
         
    }

    return(
        <nav className='Navbar'>
            <img className='logo' src={HungerHelpersLogo}/>

            <ul className='options'>
                <li><NavLink to="Home">Home</NavLink></li>
                <li><NavLink to="Donations">Donations</NavLink></li>
                <li><NavLink to="Help-Me">Help Me</NavLink></li>
                <li><NavLink to="Donation-point">Donation Point</NavLink></li>
                <li><NavLink to="Aboutus">About Us</NavLink></li>
            </ul>

            <ul className='user-options'>
                {/* <li><NavLink to="Notifications" className="link"><FontAwesomeIcon icon={faBell} size="2xl" style={{color:"white"}} /></NavLink></li> */}
                {/* <li><NavLink to="Profile" className="linke"><FontAwesomeIcon icon={faCircleUser} size="2xl" style={{color:"white"}} /></NavLink></li> */}

                <li><Link to="Login"><button id="joinUs_btn" onClick={handleClick()}>Join Us</button></Link></li>
            </ul>
        </nav>
    
    )
}
{/* <FontAwesomeIcon icon={faCircleUser} size="2xl" style={{color:"white"}} /> */}

export default Navbar;