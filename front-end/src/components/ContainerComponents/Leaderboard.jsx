import React, { useEffect, useState } from 'react';
import '../../css/Component/Leaderboard.css';

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState([]);
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [topManagers, setTopManagers] = useState([]);

  let data;
  useEffect(() => {
    const fetchLeaderboard = async (type, setter) => {
      try {
        const url = `http://localhost:3000/leaderboard/type/?Type=${type}`;
        const res = await fetch(url,{
            method:"GET",
            headers:{
                'Content-type':'application/json'
            }
        });
        
        const result = await res.json();

        const {success,message} = result;
       
        if(success)
        {
            console.log(message);
            if(result.data)
            {
                
                setter(result.data.rankings);
            }
            else
            {
                console.log("No Leaderboard Found");
            }
        }
        else
        {
            console.log(message);
        }
        
      } catch (err) {
        console.log(`Error fetching ${type} leaderboard:`, err);
      }
    };

    fetchLeaderboard('Top-Donors', setTopDonors);
    fetchLeaderboard('Top-Volunteers', setTopVolunteers);
    fetchLeaderboard('Top-Managers', setTopManagers);
  }, []);

  const renderTable = (title, data) => (
    <div  className="leaderboard-section">
      <h2>{title}</h2>
      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Contribution Points</th>
              <th>Donation Count</th>
              <th>Delivery Count</th>
              <th>Badges</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6">No data available</td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.rank}</td>
                  <td>{user.name}</td>
                  <td>{user.contribution_points}</td>
                  <td>{user.donation_count}</td>
                  <td>{user.deliveries_completed}</td>
                  <td>{(user.badges || []).join(" ")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    
    <div>

      {renderTable("Leaderboard - Top Donors", topDonors)}
      {renderTable("Leaderboard - Top Volunteers", topVolunteers)}
      {renderTable("Leaderboard - Top Managers", topManagers)}
    </div>
    
  );
};

export default Leaderboard;
