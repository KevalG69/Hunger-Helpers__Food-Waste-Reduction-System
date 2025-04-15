//csss 
import { useContext, useEffect, useState } from 'react';
import '../../css/Component/MyHistory.css';
import { contextAPI } from '../../services/RegistrationContext';
import DonationCard from '../SingleComponents/DonationCard';
import { handleError, handleSuccess } from '../../utils/Toast';
import { useNavigate } from 'react-router-dom';

const MyHistory = () => {

    const { userData } = useContext(contextAPI);
    const [donations, setDonations] = useState([]);
    const [delivery, setDelivery] = useState([]);

    const navigate = useNavigate();
    let Total = 0;
    const fetchDonation = async () => {

        try {

            const userId = userData._id
            const token = localStorage.getItem("Token");
            console.log(token)
            if (!userId || !token) {
                handleError("User ID Error")
            }

            console.log(userId)
            const url = `http://localhost:3000/users/donations?userId=${userId}`;
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

                if (!result.data) {
                    return;
                }
                console.log(message);
                Total = result.total
                console.log("result Data = ", result.data[0])
                setDonations(result.data);
                console.log("donation", donations, donations[0])


            }
            else {
                console.log(message);
            }
        }
        catch (error) {
            handleError(error);
        }
    }


    const fetchDelivery = async () => {
        try {

            const userId = userData._id
            const token = localStorage.getItem("Token");
            console.log(token)
            if (!userId || !token) {
                handleError("User ID Error")
            }

            console.log(userId)
            const url = `http://localhost:3000/users/deliveries?userId=${userId}`;
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

                if (!result.data) {
                    return;
                }
                console.log(message);
                Total = result.total
                console.log("result Data = ", result.data[0])
                setDelivery(result.data);
                console.log("donation", delivery, delivery[0])


            }
            else {
                console.log(message);
            }
        }
        catch (error) {
            handleError(error);
        }
    }


    useEffect(() => {
        fetchDonation();
        fetchDelivery();
    }, []);
    return (
        <>
            <main className="content">
                <h2>My History</h2>
                <div className="history-box">
                    <h4>Donation History</h4>
                    <div style={{ maxHeight: '10rem', overflowY: 'auto' }}>

                        {donations.length === 0 ? (
                            <p>No donations found.</p>
                        ) : (
                            donations.map((donation) => (
                                <DonationCard key={donation._id} donation={donation} />
                            ))
                        )}
                    </div>
                </div>
                <div className="history-box">
                    <h4>Delivery History</h4>
                    <div style={{ maxHeight: '10rem', overflowY: 'auto' }}>

                        {delivery.length === 0 ? (
                            <p>No delivery found.</p>
                        ) : (
                            delivery.map((delivery1) => (
                                <DeiliveryCard key={delivery1._id} delivery={delivery1} />
                            ))
                        )}
                    </div>
                    <div className="empty-box">Empty</div>
                </div>
            </main>
        </>
    );
};


export default MyHistory;