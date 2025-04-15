import { Link } from "react-router-dom";

import { handleError,handleSuccess } from "../../utils/Toast";

import '../../css/Component/OurMission.css'


//css

import { useEffect, useState } from "react";


const OurMission = () => {

    const [donationData,setDonationData] = useState({});
    const fetchDonationData = async () => {
        try {
            
            const url = "http://localhost:3000/analytics/donation-data";
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                }
            })
            
            const result = await response.json();
            
            const { message, success } = result;

            if (success) {
                console.log(message);
                
                const {
                    total_meals_served,
                  total_donors,
                  total_volunteers,
                  total_food_wasted
                } = result.data[0];

                setDonationData({
                    total_meals_served,
                    total_donors,
                    total_volunteers,
                    total_food_wasted
                })
            }
            else {
                console.log(message);
            }
        }
        catch (error) {
            console.error(error);
        
        }
    }
    useEffect(() => {
        fetchDonationData();
    }, [])
    return (
        <>
            <section className="mission-section">
                <h2>Our Mission</h2>
                <div className="mission-cards">
                    <div className="card">1. Minimize Food Waste</div>
                    <div className="card">2. Feed Those in Need</div>
                    <div className="card">3. Empower Volunteers & Donors</div>
                    <div className="card">4. Smart AI-Powered Solutions</div>
                    <div className="card">5. Expand Our Reach</div>
                </div>

                <div className="stats-box">
                    <div className="stat">
                        <i className="fas fa-utensils"></i>
                        <p><strong>{donationData.total_meals_served}</strong><br />Total Meals Served</p>
                    </div>
                    <div className="stat">
                        <i className="fas fa-user"></i>
                        <p><strong>{donationData.total_donors}</strong><br />Total Donors</p>
                    </div>
                    <div className="stat">
                        <i className="fas fa-hands-helping"></i>
                        <p><strong>{donationData.total_volunteers}</strong><br />Total Volunteers</p>
                    </div>
                    <div className="stat">
                        <i className="fas fa-trash-alt"></i>
                        <p><strong>{donationData.total_food_wasted}</strong><br />Total Food Wasted</p>
                    </div>
                </div>

                <div className="join-section">
                    <p>Join us today in making a difference! Be a part of the movement.</p>
                    <button><Link to="/Login" >Join Us</Link></button>
                </div>
            </section>

        </>
    )
}

export default OurMission;