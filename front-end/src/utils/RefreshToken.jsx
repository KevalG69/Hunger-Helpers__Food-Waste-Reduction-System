import { Navigate, useNavigate } from "react-router-dom";
import { handleError } from "./Toast";

export const refreshToken = async () => {

    const navigate = useNavigate();

    const RToken = localStorage.getItem("RToken");

    if (!RToken) {
        return navigate("/Login");
    }
    else {
        try {
            const url = "http://localhost:3000/auth/refresh-token";

            //fetching apis
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ RToken })
            });

            //getting response from api
            const result = await response.json();


            const { message, success } = result;

            if (!success) {
                handleError(message);
                
                setTimeout(()=>{
                    navigate("/Login");
                },1000)
            }
            else if (success) {
                handleSuccess(message);
                localStorage.setItem("Token", result.token);
            }

        }
        catch (error) {
                console.log(error);
                handleError(error);

            }
        }
}