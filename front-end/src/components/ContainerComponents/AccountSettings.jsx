//csss 
import { useContext, useState } from 'react';
import '../../css/Component/AccountSetting.css';
import { contextAPI } from '../../services/Context';
import ChangeRoleModal from '../SingleComponents/ChangeRolePopup';
import GetVerified from "../SingleComponents/getVerified";
import { useNavigate } from 'react-router-dom';
import { handleError ,handleSuccess} from '../../utils/Toast';

const AccountSettings = () => {

    const navigate = useNavigate();
    const { userData } = useContext(contextAPI);

    
    const [data, setData] = useState({
        _id: userData._id,
        verified: userData.verified,
        nickName: userData.nickName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        state: userData.state,
        city: userData.city,
        locality: userData.locality,
        age: userData.age,
        identifier: userData.identifier,
        avaibility_status: userData.avaibility_status
    })

    const [activeItem, setActiveItem] = useState("account");

    const handleClick = (e) => {
        const selected = e.target.id || e.target.innerText.toLowerCase().replace(/\s/g, "");
        console.log("CLick")
        setActiveItem(selected);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        const copyData = { ...data };
        copyData[name] = value;
        setData(copyData);

    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {

            const userId = userData._id
            const token = localStorage.getItem("Token");
            console.log(token)
            if (!userId || !token) {
                handleError("User ID Error")
            }

            console.log(userId)
            const url = `http://localhost:3000/users/profile?userId=${userId}`;
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nickName: data.nickName,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                    state: data.state,
                    city: data.city,
                    age: data.age,
                    locality: data.locality
                })
            })

            const result = await response.json();

            const { message, success } = result;

            if (success) {
                handleSuccess(message);
                const {
                    _id,
                    verified,
                    nickName,
                    firstName,
                    lastName,
                    role,
                    state,
                    city,
                    locality,
                    age,
                    identifier,
                    avaibility_status

                } = result.data;
                console.log("result Data = ", result, result.data)
                updateUserData({
                    _id,
                    verified,
                    nickName,
                    firstName,
                    lastName,
                    role,
                    state,
                    city,
                    locality,
                    age,
                    identifier,
                    avaibility_status
                });
                setTimeout(() => {
                    navigate("/Profile");
                }, 1000)
            }
            else {
                handleError(message);
            }
        }
        catch (error) {
            console.error(error);
            handleError(message);
        }
    }
    const handleCancel = () => {
        setData({ _id: userData._id,
            verified: userData.verified,
            nickName: userData.nickName,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            state: userData.state,
            city: userData.city,
            locality: userData.locality,
            age: userData.age,
            identifier: userData.identifier,
            avaibility_status: userData.avaibility_status})
    }

    return (
        <div>
            {
                (activeItem == "getVerified") &&
                (<GetVerified />)

            }
            {
                (activeItem == "changeRole") &&
                (<ChangeRoleModal />)
            }
            <section className="account-form">
                <h2>Account Settings</h2>
                <form>
                    <div className="form-grid">
                        <div className='row1'>

                            <div className='nick'>
                                <label>Nickname</label>
                                <input type="text" onChange={handleChange} name="nickName" value={data.nickName} />
                            </div>

                            <div>

                                <label>Role</label>
                                <div className="role-section">
                                    <span className="role-badge">{data.role}</span>
                                    <button type="button" id="getVerified" onClick={handleClick} className="btn small green">Get Verified</button>
                                    <div>
                                        <button type="button" id="changeRole" onClick={handleClick} className="btn small red"
                                        >Change Role</button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='row2'>
                            <div>

                                <label>First Name</label>
                                <input type="text" name="firstName" onChange={handleChange} value={data.firstName} />
                            </div>

                            <div>

                                <label>Last Name</label>
                                <input type="text" name="lastName" onChange={handleChange} value={data.lastName} />
                            </div>

                            <div>

                                <label>Age</label>
                                <input type="number" name="age" onChange={handleChange} value={data.age} />
                            </div>
                        </div>
                        <div className='row3'>
                            <div>

                                <label>State</label>
                                <input type="text" name="state" onChange={handleChange} value={data.state} />
                            </div>

                            <div>

                                <label>City</label>
                                <input type="text" name="city" onChange={handleChange} value={data.city} />
                            </div>
                        </div>
                        <div>
                            <label>Locality</label>
                            <input type="text" name="locality" onChange={handleChange} value={data.locality} />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button type="submit" onClick={handleUpdate} className="btn pink">Update</button>
                        <button type="button" onClick={handleCancel} className="btn grey">Cancel</button>
                    </div>
                </form>
            </section>
        </div >
    );
};

export default AccountSettings;