import { createContext ,useState} from "react";



export const contextAPI = createContext();

export const ContextProvider = ({children}) =>{
    
    const [registrationData,setRegistrationData] = useState({
        registerWith:'',
        identifier:'',
        password:''
    });

    const [userData,setUserData] = useState({
        _id:"",
        profilePhoto:"",
        verified:false,
        nickName:"None",
        firstName:"",
        lastName:"",
        role:"",
        state:"",
        city:"",
        locality:"",
        age:"",
        identifier:"",
        avaibility_status:""
    })

    const [contributionInfo,setContributionInfo] = useState({
        badges:{},
        donation_points:0,
        volunteer_points:0,
        donation_count:0,
        completed_deliveries:0,
        last_contribution:""
    });

    const [donationFilter,setDonationFilter] = useState({
        status:"",
        type:"",
        location:"",
    })
    const [donations,setDonations] = useState([]);

    const [forgotIdentifier,setForgotIdentifier] = useState({
        identifier:""
    });

    const [notifications, setNotifications] = useState([]);
    
    const [report,setReport] = useState({
        reportedUserId:null,
        reportedDonationId:null
    })

    const [editDonationData,setEditDonationData]=useState({

    });
    const addNotification = (notification) => {
        setNotifications(prev => [...prev, notification]);
        // Auto-remove after 5 seconds
        setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
      };
      const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      };
        
    const updateRegistrationData = (newData)=>{
        setRegistrationData((prev)=> ({...prev,...newData}));
    };

    const updateUserData = (newData)=>{
        setUserData((prev)=> ({...prev,...newData}));
    };

    const updateForgotIdentifier = (newData)=>{
        setForgotIdentifier((prev)=> ({...prev,...newData}));
    };

    const updateContributionInfo = (newData)=>{
        setContributionInfo((prev)=> ({...prev,...newData}));
    };

    const updateDonations = (newData)=>{
        setDonations((prev)=> ({...prev,...newData}));
    };

    const updateDonationFilter = (newData)=>{
        setDonationFilter((prev)=> ({...prev,...newData}));
    };

    const updateReport = (newData)=>{
        setReport(prev => ({
            ...prev,
            ...newData
          }));
    };
    const updateEditDonationData = (newData)=>{
        setEditDonationData(prev => ({
            ...prev,
            ...newData
          }));
    };
    return (
        <contextAPI.Provider value = {{registrationData,updateRegistrationData,userData,updateUserData,forgotIdentifier,
            updateForgotIdentifier,contributionInfo,updateContributionInfo,donations,updateDonations,
            donationFilter,updateDonationFilter,notifications,addNotification,removeNotification,report,updateReport,
            editDonationData,updateEditDonationData
        }}>
            {children}
        </contextAPI.Provider>
    );
};
