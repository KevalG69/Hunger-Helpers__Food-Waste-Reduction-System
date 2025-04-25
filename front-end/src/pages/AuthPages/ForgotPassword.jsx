import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom"

//css
import '../../css/Pages/ForgotPassword.css';


//svgs 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import AuthButton from '../../components/SingleComponents/AuthButton';
import { handleError,handleSuccess } from '../../utils/Toast';
import { contextAPI } from '../../services/Context';



const ForgotPassword = () => {

    const {updateForgotIdentifier} = useContext(contextAPI);

    const navigate = useNavigate();

    const [Identifier, setIdentifier] = useState({
        identifier: ""
    });


    //Close Button 
    const handleCloseBtn = () => {
        navigate(-1);
    }

    const handleChange = (e) => {

        //extracting data
        const { name, value } = e.target;
        console.log(name, value);

        //copying data
        const copyIdentifier = { ...Identifier };

        //making chang in copy data
        copyIdentifier[name] = value;

        //changing original data
        setIdentifier(copyIdentifier);
        console.log(Identifier.identifier)


    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const {identifier} = Identifier;

        console.log(identifier)
        if (!identifier) {
            handleError("Field Required");
        }
        else {
            fetchForgotPassword();
        }

    };

    const fetchForgotPassword = async () => {

        try {
            const url = "http://localhost:3000/auth/forgot-password";
            const {identifier} = Identifier;
            console.log(identifier)
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

            if (success) {
                handleSuccess(message);
                updateForgotIdentifier({identifier})
                setTimeout(() => {
                    navigate("/CreateNewPassword");
                }, 1000)
            }
            else {
                console.log(result.error)
                handleError(`${result.error}`);
            }
        }
        catch (error) {
            console.log(error);
            handleError("UnExpected Error")
        }
    }

    return (
        <div className="forgot-password-overlay">
            <div className="forgot-password-container">
                <FontAwesomeIcon className="close_btn" size="xl" icon={faXmark} onClick={handleCloseBtn} />
                <h2>Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Email/Mobile"
                        name="identifier"
                        onChange={handleChange}
                        required
                    />
                    <AuthButton name="Reset Password"></AuthButton>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

