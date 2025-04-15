import React, { useContext, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom"

//service
import { contextAPI } from './RegistrationContext';

//utils



const getCurrentUser = ()=>{
  
   const {userData} = useContext(contextAPI);
 
   return userData.role   
}


export const PublicElement = ({children},)=>{

    return <>{children}</>;

}

export const UserElement =({children})=>{
   

    const CURRENT_USER_ROLE = getCurrentUser();
    
    if(!CURRENT_USER_ROLE)
    {
        
        return <Navigate to={"/Login"}/>;
    }
    else
    {
        return <>{children}</>;
    }
}

export const NewUserElement =({children})=>{

    
    const CURRENT_USER_ROLE = getCurrentUser();
    
    if(!CURRENT_USER_ROLE)
    {
        return <>{children}</>;
    
    }
    else
    {
        return <Navigate to={"/Home"}/>;
    }
}

export const DonorElement = ({children},)=>{
    //User Roles
    const USER_ROLES = {
        ADMIN : "Admin",
        MANAGER : "Manager",
        VOLUNTEER : "Volunteer",
        RESTAURANT_DONOR : "Restaurant-Donor",
        HOUSEHOLD_DONOR : "HouseHold-Donor"
    }
    const navigate = useNavigate();

   

    const CURRENT_USER_ROLE = getCurrentUser();
    
    if(!CURRENT_USER_ROLE)
    {
        return <Navigate to={"/Login"}/>;
   
    }
    else if(CURRENT_USER_ROLE == USER_ROLES.RESTAURANT_DONOR || CURRENT_USER_ROLE == USER_ROLES.HOUSEHOLD_DONOR||
        CURRENT_USER_ROLE == USER_ROLES.VOLUNTEER || CURRENT_USER_ROLE == USER_ROLES.MANAGER ||CURRENT_USER_ROLE == USER_ROLES.ADMIN)
    
    {
        return <>{children}</>;
    }
    else
    {
        return <><h1>Your Not a DONOR</h1></>
    }
}

export const VolunteerElement = ({children},)=>{
    //User Roles
    const USER_ROLES = {
        ADMIN : "Admin",
        MANAGER : "Manager",
        VOLUNTEER : "Volunteer",
        RESTAURANT_DONOR : "Restaurant-Donor",
        HOUSEHOLD_DONOR : "HouseHold-Donor"
    }

    const navigate = useNavigate();
   

    const CURRENT_USER_ROLE = getCurrentUser();
    
    if(!CURRENT_USER_ROLE)
    {
        return <Navigate to={"/Login"}/>;
     
    }
    else if(CURRENT_USER_ROLE == USER_ROLES.VOLUNTEER || CURRENT_USER_ROLE == USER_ROLES.MANAGER|| CURRENT_USER_ROLE == USER_ROLES.ADMIN)
    {
        return <>{children}</>;
    }
    else
    {
        return <><h1>Your Not Volunteer</h1></>
    }
}

export const ManagerElement = ({children},)=>{
    //User Roles
    const USER_ROLES = {
        ADMIN : "Admin",
        MANAGER : "Manager",
        VOLUNTEER : "Volunteer",
        RESTAURANT_DONOR : "Restaurant-Donor",
        HOUSEHOLD_DONOR : "HouseHold-Donor"
    }
    const navigate = useNavigate();

   

    const CURRENT_USER_ROLE = getCurrentUser();
    
    if(!CURRENT_USER_ROLE)
    {
        return <Navigate to={"/Login"}/>;
    }
    else if(CURRENT_USER_ROLE == USER_ROLES.MANAGER || CURRENT_USER_ROLE == USER_ROLES.ADMIN)
    {
        return <>{children}</>;
    }
    else
    {
        return <><h1>Access Denied</h1></>
    }
}

export const AdminElement = ({children},)=>{
    //User Roles
    const USER_ROLES = {
        ADMIN : "Admin",
        MANAGER : "Manager",
        VOLUNTEER : "Volunteer",
        RESTAURANT_DONOR : "Restaurant-Donor",
        HOUSEHOLD_DONOR : "HouseHold-Donor"
    }
    const navigate = useNavigate();

    const CURRENT_USER_ROLE = getCurrentUser();
    
    if(!CURRENT_USER_ROLE)
    {
        return <Navigate to={"/Login"}/>;
    }
    else if(CURRENT_USER_ROLE == USER_ROLES.ADMIN)
    {
        return <>{children}</>;
    }
    else
    {
        return <><h1>Access Denied</h1></>
    }
}



