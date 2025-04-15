//csss 
import { useContext } from 'react';
import '../../css/Component/Contribution.css';
import { contextAPI } from '../../services/RegistrationContext';
import { handleError } from '../../utils/Toast';


const Contribution = () => {

    const {userData,contributionInfo,updateContributionInfo} = useContext(contextAPI);
    
    const fetchContribution = async (e)=>{
        e.preventDefault();
        try {

            const userId = userData._id
            const token = localStorage.getItem("Token");
            console.log(token)
            if (!userId || !token) {
                handleError("User ID Error")
            }

            console.log(userId)
            const url = `http://localhost:3000/users/contribution-info/?userId=${userId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const result = await response.json();

            const { message, success } = result;

            if (success) {
                if(!result.data)
                {
                    return;
                }
                handleSuccess(message);
                const {
                    badges,
                    donation_points,
                    volunteer_points,
                    donation_count,
                    completed_deliveries,
                    last_contribution

                } = result.data;
                console.log("result Data = ", result, result.data)
                updateContributionInfo({
                    badges,
                    donation_points,
                    volunteer_points,
                    donation_count,
                    completed_deliveries,
                    last_contribution
                });
                setTimeout(() => {
                    navigate("/Profile");
                }, 1000)
            }
            else {
                handleError(message);
            }
        }
        catch(error)
        {
            handleError(message);
        }
    }

    return (
        <>
            <main className="content">
                <h2>Contribution</h2>
                {Array.isArray(contributionInfo.badges) && contributionInfo.badges.map((element)=>{
                    return <div key={element} className="badges">{element}</div>
                    
                })

                }
                <div className="stats-grid">
                    <div className="stat-box">
                        <h4>Donation Point</h4>
                        <p>{contributionInfo.donation_points}</p>
                    </div>
                    <div className="stat-box">
                        <h4>Donation Count</h4>
                        <p>{contributionInfo.donation_count}</p>
                    </div>
                    <div className="stat-box">
                        <h4>Volunteer Point</h4>
                        <p>{contributionInfo.volunteer_points}</p>
                    </div>
                    <div className="stat-box">
                        <h4>Completed Deliveries</h4>
                        <p>{contributionInfo.completed_deliveries}</p>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Contribution;