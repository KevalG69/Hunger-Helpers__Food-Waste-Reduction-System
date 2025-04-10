import { useState ,useContext} from 'react';
import { useNavigate } from 'react-router-dom';

//css
import '../../css/Pages/CodeVerification.css';

//service 
import { contextAPI } from '../../services/RegistrationContext';

//svg
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { handleError, handleSuccess } from '../../utils/Toast';


const CodeVerification = () => {

    const navigate = useNavigate();

    const {registrationData} = useContext(contextAPI);
    const {registerWith,identifier} = registrationData;
    const [otp, setOtp] = useState({
        Otp:''
    });


    //Close Button 
    const handleCloseBtn = () => {
        navigate(-1);
    }
    



    const handleChange = (e) => {
        
        const { name, value } = e.target;
        
        console.log(name,value)
        
        const copyOtp = {...otp};
        
        copyOtp[name] = value; // only take 1 digit
        
        setOtp(copyOtp);
                
        
      
        if(/^\d{6}$/.test(copyOtp["Otp"])) {
            verifyOtp(copyOtp["Otp"]);
        }

        // console.log(index,otp)
    };


    const verifyOtp = async (EnteredOtp) => {

       

        try {
            const url = "http://localhost:3000/auth/register-verify";
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    identifier,
                    EnteredOtp
                })
            })

            const result = await response.json();

            const { message, success } = result;

            if (success) {
                handleSuccess(message);

                setTimeout(() => {
                    navigate("/RegistrationStep2");
                }, 1000)
            }
            else {
                handleError(message);
            }
        }
        catch (error) {
            console.error(error);
        }
    }


    const handleResend = async () => {
        console.warn("resend");

        try {
            const url = "http://localhost:3000/auth/register-resend-code";
            

            //fetching api
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    registerWith,
                    identifier,
                    CC: 91
                })
            });

            const result = await response.json();

            const { message, success } = result;

            if (success) {
                handleSuccess(message);
            }
            else if (!success) {
                handleError(message);
            }
        }
        catch (error) {
            handleError(error);
        }

    }

    return (
        <div className="verification-wrapper">
            <div className="verification-box">
                <FontAwesomeIcon className="close_btn" size="xl" icon={faXmark} onClick={handleCloseBtn} />
                <h2>Code Verification</h2>
                <p>Check :- {identifier}</p>
                <div className="otp-inputs">
                    <input
                        name="Otp"                       
                        type="text"
                        maxLength="6"
                        onChange={handleChange}
                
                    />
                </div>
                <p className="resend">
                    Does Not received code? <span onClick={handleResend} className="resend-link">Resend</span>
                </p>
            </div>
        </div>
    );
};

export default CodeVerification;
