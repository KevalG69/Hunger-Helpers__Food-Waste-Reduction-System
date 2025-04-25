//csss 
import { useContext, useEffect, useState } from 'react';

import '../../css/Component/MyHistory.css';

import { contextAPI } from '../../services/Context';
import DonationCard from '../SingleComponents/DonationCard';
import { handleError, handleSuccess } from '../../utils/Toast';
import Loading from '../../utils/Loading'


const MyHistory = () => {

    //States
    const { userData } = useContext(contextAPI);


    const [donations, setDonations] = useState([]);
    const [delivery, setDelivery] = useState([]);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDonation = async () => {

        try {

            const userId = userData._id
            const token = localStorage.getItem("Token");

            setLoading(true)            
            const url = `http://localhost:3000/users/donations?userId=${userId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const result = await response.json();
            setLoading(false);

    
            if (result.success) {

                if (!result.data) {
                    return;
                }
                console.log(result.message);
                setDonations(result.data);

            }
            else {
                console.log(result.message);
                setError(result.error)
            }
        }
        catch (error) {
            handleError(error);
            setError(error)
        }
    }


    const fetchDelivery = async () => {
        try {

            const userId = userData._id
            const token = localStorage.getItem("Token");
    
            setLoading(true)        ;
            const url = `http://localhost:3000/users/deliveries?userId=${userId}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            })

            const result = await response.json();
            setLoading(false);

            if (result.success) {
                console.log(result.message);
                setDelivery(result.data);

            }
            else {
                console.log(result.error)
            }
        }
        catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchDonation();
        fetchDelivery();
    }, []);


    if(loading)
        {
          return (
            <>
            <Loading></Loading>
            </>
          );
        }

    if(error)
    {
        return (
            <div>
                <h1>
                    {error.message}
                </h1>
            </div>
        )
    }
    return (
        <>
            <main className="content">
                <h2>My History</h2>
                <div className="history-box">
                    <h4>Donation History</h4>
                    <div style={{ maxHeight: '10rem', overflowY: 'auto' }}>

                        {donations.length === 0 ? (
                            <p>Empty</p>
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
                            <p>Empty</p>
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