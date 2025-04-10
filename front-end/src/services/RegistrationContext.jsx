import { createContext ,useState} from "react";



export const contextAPI = createContext();

export const ContextProvider = ({children}) =>{
    
    const [registrationData,setRegistrationData] = useState({
        registerWith:'',
        identifier:'',
        password:''
    });

    const [userData,setUserData] = useState({
        nickName:"",
        firstName:"",
        lastName:"",
        role:"",
        state:"",
        city:"",
        locality:"",
        identifier:"",
        avaibility_status:false
    })

    const [forgotIdentifier,setForgotIdentifier] = useState({
        identifier:""
    });
    
    const updateRegistrationData = (newData)=>{
        setRegistrationData((prev)=> ({...prev,...newData}));
    };

    const updateUserData = (newData)=>{
        setUserData((prev)=> ({...prev,...newData}));
    };

    const updateForgotIdentifier = (newData)=>{
        setForgotIdentifier((prev)=> ({...prev,...newData}));
    };



    return (
        <contextAPI.Provider value = {{registrationData,updateRegistrationData,userData,updateUserData,forgotIdentifier,
            updateForgotIdentifier
        }}>
            {children}
        </contextAPI.Provider>
    );
};
