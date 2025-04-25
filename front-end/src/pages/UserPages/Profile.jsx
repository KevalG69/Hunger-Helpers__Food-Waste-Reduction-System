import { useContext, useState, useRef } from "react";

import defaultAvatar from '../../assets/image/defaultAvatar.jpg'

//css
import AccountSettings from '../../components/ContainerComponents/AccountSettings';
import Contribution from '../../components/ContainerComponents/Contribution';


import '../../css/Pages/Profile.css'
import MyHistory from "../../components/ContainerComponents/MyHistory";
import PrivacySecurity from "../../components/ContainerComponents/PrivacySecurity";
import Notification from "../../components/ContainerComponents/Notification";
import Language from "../../components/ContainerComponents/Language";
import Settings from "../../components/ContainerComponents/Settings";
import Logout from "../../components/ContainerComponents/Logout";


import { contextAPI } from "../../services/Context";




//funcitons
function Profile() {

    const [activeItem, setActiveItem] = useState("account");
    const { userData } = useContext(contextAPI)
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const handleClick = (e) => {
        const selected = e.target.id || e.target.innerText.toLowerCase().replace(/\s/g, "");
        setActiveItem(selected);
    };
    let verified = "Not Verified"
    if (userData.verified == true) {
        verified = "Verified";
    }

    // Inside your component
    const fileInputRef = useRef(null);

    // Add this to state
    const [profileImage, setProfileImage] = useState(userData.profileImage || "");

    // Handle click on image
    const handleImageClick = () => {
        fileInputRef.current.click();
    };


    const handleUpload = async (file) => {
        try {
            const formData = new FormData();
            console.log("formdata")
            formData.append("profilePhoto", file); // 👈 this matches req.file
            const userId = userData._id
            const token = localStorage.getItem("Token");
            console.log("fetchStart")
            const url = `http://localhost:3000/users/upload-profile-photo/?userId=${userId}`

            const response = await fetch(url, {
                method: "POST",
                headers: {

                    Authorization: `Bearer ${token}`  // if you're using JWT
                },
                body: formData
            });

            console.log("result")
            const result = await response.json();

            if (result.success) {
                console.log("Upload success:", result.message);
                setProfileImage(result.imageUrl);
            }
            else {
                console.log(result.message);
            }
        } catch (error) {
            console.log("Upload failed:", error);
        }
    };

    return (
        <>

            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
            </button>

            {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

            <div className={`settings-container ${sidebarOpen ? 'sidebar-open' : ''}`}>

                <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                    <div className="profile">

                        <div className="profile-image-section">
                            <img
                                src={userData.profilePhoto || defaultAvatar} // fallback image
                                alt="Profile"
                                className="profile-image"
                                onClick={handleImageClick}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                accept="image/*"
                                // onChange={handleFileChange}
                                onChange={(e) => handleUpload(e.target.files[0])}
                            />
                            <p className="upload-hint">Click image to change</p>
                        </div>


                        <h3>{userData.nickName}</h3>
                        <p>{userData.firstName} {userData.lastName}</p>
                        <p className="not-verified">{verified} </p>
                    </div>
                    <ul className="sidebar-menu">
                        <li
                            className={activeItem === "account" ? "active" : ""}
                            id="account"
                            onClick={handleClick}
                        >
                            Account
                        </li>
                        <li
                            className={activeItem === "contribution" ? "active" : ""}
                            id="contribution"
                            onClick={handleClick}
                        >
                            Contribution
                        </li>
                        <li
                            className={activeItem === "myhistory" ? "active" : ""}
                            id="myhistory"
                            onClick={handleClick}
                        >
                            My History
                        </li>
                        <li
                            className={activeItem === "privacy" ? "active" : ""}
                            id="privacy"
                            onClick={handleClick}
                        >
                            Privacy & Security
                        </li>
                        <li
                            className={activeItem === "notification" ? "active" : ""}
                            id="notification"
                            onClick={handleClick}
                        >
                            Notification
                        </li>
                        <li
                            className={activeItem === "language" ? "active" : ""}
                            id="language"
                            onClick={handleClick}
                        >
                            Language
                        </li>
                        <li
                            className={activeItem === "settings" ? "active" : ""}
                            id="settings"
                            onClick={handleClick}
                        >
                            Settings
                        </li>
                        <li className={activeItem === "logout" ? "active" : ""}
                            id="logout"
                            onClick={handleClick}>Logout</li>
                    </ul>
                </aside>
                {
                    (activeItem == "account") &&
                    (<AccountSettings />)
                }
                {
                    (activeItem == "contribution") &&
                    (<Contribution />)
                }
                {
                    (activeItem == "myhistory") &&
                    (<MyHistory />)
                }
                {
                    (activeItem == "privacy") &&
                    (<PrivacySecurity />)
                }
                {
                    (activeItem == "notification") &&
                    (<Notification />)
                }
                {
                    (activeItem == "language") &&
                    (<Language />)
                }
                {
                    (activeItem == "settings") &&
                    (<Settings />)
                }
                {
                    (activeItem == "logout") &&
                    (<Logout />)
                }

            </div>


        </>
    )
}
export default Profile;