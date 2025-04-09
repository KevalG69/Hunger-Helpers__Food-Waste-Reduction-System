//Modules
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

//css
import '../../css/Pages/RegistrationStep1.css'

//utitls
import { handleSuccess,handleError } from '../../utils/Toast';

//svgs 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark} from '@fortawesome/free-solid-svg-icons'

//componets
import AuthButton from '../../components/SingleComponents/AuthButton';



//funcitons
function RegistrationStep1(){

    const navigate = useNavigate();

    //State
    const [registerInfo,setRegisterInfo] = useState({
        identifier:'',
        password:''
    })


    //validator
    const isValidEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      };

    const isValidMobile = (value) => {
        const mobileRegex = /^[6-9]\d{9}$/;
        return mobileRegex.test(value);
    };

    //event handlers

    //Close Button 
    const handleCloseBtn = ()=>{
        navigate(-1);
    }

    //Inpute Text
    const handleOnChange = (event)=>{
        //extracting data
        const {name,value} = event.target;
        console.log(name,value);

        //copying data
        const copyRegisterInfo = {...registerInfo};

        //making chang in copy data
        copyRegisterInfo[name]=value;

        //changing original data
        setRegisterInfo(copyRegisterInfo);
    }


    //Submited
    const handleSubmit = (event)=>{
        //preventing refresh page
        event.preventDefault();
        console.warn("Submited")

        //extracting info
        const {identifier,password} = registerInfo;
        
        //checking data
        if(!identifier || !password)
        {
            toast.error('Both Field Required');
        }
        else if(password.length<8)
        {
            toast.error("Password length should at least 8");
        }
        else if(isValidEmail(identifier))
        {
            fetchregisterAPI('Email');
        }
        else if(isValidMobile(identifier))
        {
            fetchregisterAPI('Mobile');

        }
        else
        {
            toast.error("INVALID Email/Mobile Or Passoword");
            console.error("INVALID Email/Mobile Or Passoword");
        }

    }

    //handling errors
    const frontError = (error)=>{
        console.log(error);
    }

    const fetchregisterAPI = async (registerWith)=>{
        
        //try and catch block
        try
        {   
            const {identifier,password} = registerInfo;
            // On register submit
            localStorage.setItem("registerWith",registerWith)
            localStorage.setItem("registerIdentifier", identifier);
            //API
            const url = "http://localhost:3000/auth/register-step1";

            //fetching apis
            const response = await fetch(url,{
                method: "POST",
                headers :{
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({registerWith,identifier,password})
            });

            //getting response from api
            const result = await response.json();
            console.log(result);

            const {message,success} = result;

            if(!success)
            {
                handleError(message," Please Try Again ");
            }
            else if(success)
            {
                handleSuccess(message);
                setTimeout(()=>{
                    navigate("/CodeVerification");
                },1000)
                
            }



        }   
        catch(error)
        {
            frontError(error);
        }
        
    }

    return (
        <div className="register-frame">

            <div className="register-container">
                <FontAwesomeIcon className="close_btn" size="xl" icon={faXmark} onClick={handleCloseBtn} />
                <div id="form-container">

                    <header>Register</header>

                    <form onSubmit={handleSubmit}>

                        <div>
                        
                            <input type="text" 
                                name="identifier"
                                placeholder='Email/Mobile'
                                onChange={handleOnChange}
                                autoFocus
                                />
                                
                            
                            <input type="password" 
                                onChange={handleOnChange}
                                name="password"
                                placeholder='password'/>

                        </div>
                        
                        <span> <span style={{color:"var(--primary2)"}}>verification code </span>will sent to your Email/Mobile</span>
                        <AuthButton name={"Register"}></AuthButton>
                        

                        <div id="links">
                            <span id="login-text">
                                Already Have Account ?  
                                <Link to="/Login" style={{color:"var(--error)"}}>
                                    Login here
                                </Link>
                            </span>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    ) 
    
}

export default RegistrationStep1;