//Modules
import { useState } from 'react';
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

//css
import '../../css/Pages/Login.css'

//svgs 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import AuthButton from '../../components/SingleComponents/AuthButton';
import { Link } from 'react-router-dom';

//utils
import { handleError,handleSuccess } from '../../utils/Toast';

//funcitons
function Login() {

    const navigate = useNavigate();

    //State
    const [loginInfo, setLoginInfo] = useState({
        identifier: '',
        password: ''
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
    const handleCloseBtn = () => {
        navigate(-1);
    }

    //Inpute Text
    const handleOnChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        const copyLoginInfo = { ...loginInfo };
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo);
    }


    //Submited
    const handleSubmit = (event) => {
        //preventing refresh page
        event.preventDefault();
        console.warn("Submited")

        //extracting info
        const { identifier, password } = loginInfo;

        //checking data
        if (!identifier || !password) {
            toast.error('Both Field Required');
        }
        else if (password.length < 8) {
            toast.error("Password length should at least 8");
        }
        else if (isValidEmail(identifier)) {
            fetchLoginAPI('Email');
        }
        else if (isValidMobile(identifier)) {
            fetchLoginAPI('Mobile');

        }
        else {
            toast.error("INVALID Email/Mobile Or Passoword");
            console.error("INVALID Email/Mobile Or Passoword");
        }

    }

    

    const fetchLoginAPI = async (loginWith) => {

        //try and catch block

        try {
            const url = "http://localhost:3000/auth/login";
            const {identifier,password} = loginInfo
            //fetching apis
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ loginWith, identifier, password })
            });

            //getting response from api
            const result = await response.json();
            console.log(result);

            const { message, success } = result;

            if (!success) {
                handleError(`${result.error}`);
            }
            else if (success) {
                handleSuccess(message);
                localStorage.setItem("Token",result.token);
                localStorage.setItem("RToken",result.refreshToken);
                localStorage.setItem("identifier",result.email);
                localStorage.setItem("firstName",result.firstName);
                localStorage.setItem("lastName",result.lastName);

                setTimeout(() => {
                    navigate("/Home");
                }, 1000)

            }

        }
        catch (error) {
            handleError(error);
        }

    }

    return (
        <div className="login-frame">

            <div className="login-container">
                <FontAwesomeIcon className="close_btn" size="xl" icon={faXmark} onClick={handleCloseBtn} />
                <div id="form-container">

                    <header>Login</header>

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
                                placeholder='password' />

                        </div>

                        <AuthButton name={"Login"}></AuthButton>


                        <div id="links">
                            <span>
                                <Link to="/ForgotPassword" id="forgot-text">
                                    Forgot Password
                                </Link>
                            </span>
                            <span id="register-text">
                                Don't Have Account ?
                                <Link to="/RegistrationStep1" style={{ color: "var(--error)" }}>
                                    Register here
                                </Link>
                            </span>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    )

}

export default Login;