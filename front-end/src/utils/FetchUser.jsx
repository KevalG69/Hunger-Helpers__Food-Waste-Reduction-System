// useFetchUser.js (or FetchUser.jsx)
import { useContext } from "react";
import { contextAPI } from "../services/RegistrationContext";
import { handleError } from "./Toast";

export const useFetchUser = () => {
  const { updateUserData } = useContext(contextAPI);

  const fetchUser = async (token) => {
    try {
     
      const response = await fetch("http://localhost:3000/auth/fetch-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
    
      if (result.success) {
        const {
          _id,
          profilePhoto,
          verified,
          nickName,
          firstName,
          lastName,
          role,
          state,
          age,
          city,
          locality,
          identifier,
          avaibility_status,
        } = result.data;

        updateUserData({
          _id,
          profilePhoto,
          age,
          verified,
          nickName,
          firstName,
          lastName,
          role,
          state,
          city,
          locality,
          identifier,
          avaibility_status,
        });
       
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    }
  };

  return fetchUser;
};
