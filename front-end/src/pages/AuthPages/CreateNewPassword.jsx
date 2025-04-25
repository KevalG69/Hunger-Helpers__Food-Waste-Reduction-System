import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from "react-router-dom"
//css
import '../../css/Pages/CreateNewPassword.css';
import { handleError, handleSuccess} from '../../utils/Toast';
import AuthButton from '../../components/SingleComponents/AuthButton';
import { contextAPI } from '../../services/Context';


const CreateNewPassword = () => {

    const { forgotIdentifier } = useContext(contextAPI);
    const { identifier } = forgotIdentifier;

    const navigate = useNavigate();
    //Close Button 
    const handleCloseBtn = () => {
        navigate(-1);
    }



    const [otp, setOtp] = useState(Array(6).fill(''));
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    const handleResend = async () => {

        try {
            const url = "http://localhost:3000/auth/forgot-password";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    identifier,
                    CC: ""
                })
            });

            const result = await response.json();

            const { message, success } = result;
            console.log(result)
            if (success) {
                handleSuccess(message);
            }
            else {
                console.log(message)
                handleError(message);
            }
        }
        catch (error) {
            console.log(error);
            handleError("UnExpected Error")
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            handleError("Passwords do not match!");
            return;
        }
        const enteredOtp = otp.join('');
        // TODO: Call backend API with enteredOtp, newPassword
        console.log("OTP:", enteredOtp, "Password:", newPassword);
        fetchResetAPI(enteredOtp, newPassword);
    };


    const fetchResetAPI = async (EnteredOtp, newPassword) => {

        try {
            const url = "http://localhost:3000/auth/reset-password";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    identifier,
                    EnteredOtp,
                    newPassword
                })
            });

            const result = await response.json();

            const { message, success } = result;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/Login");
                }, 1000)
            }
            else {
                console.log(result.error)
                handleError(`${result.error}`);
            }
        }
        catch (error) {
            console.log(error);
            handleError(error);
        }
    }

    return (
        <div className="reset-overlay">
            <div className="reset-container">
                <button className="close-btn" onClick={handleCloseBtn}>×</button>
                <h2>Create New Password</h2>
                <p className="email-label">Check Email :-</p>

                <div className="otp-boxes">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => inputsRef.current[index] = el}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            className="otp-input"
                        />
                    ))}
                </div>

                <p className="resend-text">
                    Does Not received code? <span onClick={handleResend} className="resend-link">Resend</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <AuthButton name="Reset Password"></AuthButton>
                </form>
            </div>
        </div>
    );
};

export default CreateNewPassword;
