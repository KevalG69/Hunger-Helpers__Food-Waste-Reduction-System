import React, { useRef ,useState,useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronRight, faCircleChevronLeft } from '@fortawesome/free-solid-svg-icons'

//css
import '../../css/Component/AnalyticSlider.css';

const data = [

    // Add more region data
];

const AnalyticsSlider = () => {
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollRef = useRef(null);

    const scroll = (direction) => {
        const container = scrollRef.current;
        container.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth'
        });
    };
    useEffect(() => {
        const fetchAnalytics = async () => {
          try {
            const url = "http://localhost:3000/analytics"
            const response = await fetch(url,{
                method:"GET",
                headers:{
                    'Content-type':'application/json'
                }
            })

            const result = await response.json();

            if(result.success)
            {
                console.log(result.message)
                setAnalytics(result.data);
                setLoading(false);
            }
            else
            {
                console.log(result.message)
            }
          } catch (error) {
            console.log("Error fetching analytics:", error);
            setLoading(false);
          }
        };
    
        fetchAnalytics();
      }, []);
    
      if (loading) return <p>Loading analytics...</p>;

    return (
        <section className="analytics-section">
            <h2>Analytic data</h2>
            <div className="analytics-container">
             

                <div className="cards-wrapper" ref={scrollRef}>
                    {analytics.map((item, index) => (
                        <div className="card" key={index}>
                            <h3>{item.region}</h3>
                            <ul>
                                <li><strong>Meals Donated:</strong> {item.total_meals_donated}</li>
                                <li><strong>Food Wasted:</strong> {item.total_food_wasted}</li>
                                <li><strong>Donors:</strong> {item.total_donors}</li>
                                <li><strong>Volunteers:</strong> {item.total_volunteers}</li>
                                <li><strong>Active Users:</strong> {item.active_users}</li>
                                <li><strong>Donation Success Rate:</strong> {item.donation_success_rate}</li>
                                <li><strong>Avg Donation Time:</strong> {item.avg_donation_time}</li>
                                <li><strong>Top Donor:</strong> {item.top_donors}</li>
                                <li><strong>Top Volunteer:</strong> {item.top_volunteers}</li>
                                <li><strong>Updated Date:</strong> {item.updatedAt}</li>
                            </ul>
                        </div>
                    ))}
                </div>

                
            </div>
        </section>
    );
};

export default AnalyticsSlider;
