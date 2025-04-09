import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//css
import '../../css/Pages/CodeVerification.css';

//svg
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark} from '@fortawesome/free-solid-svg-icons'
import { handleError, handleSuccess } from '../../utils/Toast';

const CodeVerification = () => {

    const navigate = useNavigate();

    const identifier = localStorage.getItem("registerIdentifier");
    
    const [otp, setOtp] = useState(new Array(6).fill(""));


        //Close Button 
        const handleCloseBtn = ()=>{
            navigate(-1);
        }

    const handleChange = (e, index) => {

        const value = e.target.value;

        if (/^\d*$/.test(value)) {

            let newOtp = [...otp];
            newOtp[index] = value.slice(-1); // only take 1 digit
            setOtp(newOtp);

            // Auto focus to next input
            if (value && index < 5) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
            else
            {
                verifyOtp()
            }
            console.log(index,otp[index],otp)
         
        }
    };

    const verifyOtp = ()=>{
        console.log(otp);
    }
    

    const handleResend = async ()=>{
        console.warn("resend");

        try
        {
            const url = "http://localhost:3000/auth/register-resend-code";
            const registerWith = localStorage.getItem("registerWith");

            //fetching api
            const response = await fetch(url,{
                method:"POST",
                headers:{
                    'Content-type':'application/json'
                },
                body: JSON.stringify({
                    registerWith,
                    identifier,
                    CC:91
                })
            });

            const result = await response.json();

            const {message,success} = result;

            if(success)
            {
                handleSuccess(message);
            }
            else if(!success)
            {
                handleError(message);
            }
        }
        catch(error)
        {
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
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            id={`otp-${index}`}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e, index)}
                        />
                    ))}
                </div>
                <p className="resend">
                    Does Not received code? <span onClick={handleResend} className="resend-link">Resend</span>
                </p>
            </div>
        </div>
    );
};

export default CodeVerification;
