import React, { useState, useEffect, useContext } from 'react';

//css
import '../../css/Pages/Notifications.css';

//import socket from '../../services/socket';
import { contextAPI } from '../../services/RegistrationContext';

const notifications = [
  {
    id: 1,
    type: 'notification',
    title: 'Donation Update',
    message: 'Volunteer Has Accepted Your Donation Box',
    time: '4:20 PM 12/03/2025'
  },
  {
    id: 2,
    type: 'request',
    title: 'New Donation Request',
    message: 'NGO has requested food donation pickup',
    time: '3:45 PM 12/03/2025'
  }
];
import socket from '../../services/socket'; // Uncomment this

const Notifications = () => {

  // const [notifications, setNotifications] = useState([]);
  const [data, setData] = useState([]);
  const { userData } = useContext(contextAPI);
  const { addNotification } = useContext(contextAPI);

  // Inside your component:
  useEffect(() => {
    // Join user's room when component mounts
    if (userData?._id) {
      socket.emit(`${userData.role}`, userData._id);
    }

    // Listen for notifications
    socket.on("Donation-Update", (data) => {
      console.log("Notification received:", data);
      addNotification({
        id: Date.now(), // Unique ID
        type: 'Donation-Update', // or 'success', 'error', etc.
        title: data.message,
        message: JSON.stringify(data.metadata),
        time: new Date().toLocaleTimeString()
      });
    })
    socket.on("Request-Update", (data) => {
      console.log("Notification received:", data);
      addNotification({
        id: Date.now(), // Unique ID
        type: 'Request-Update', // or 'success', 'error', etc.
        title: data.message,
        message: JSON.stringify(data.metadata),
        time: new Date().toLocaleTimeString()
      });

      setData(prev => [...prev, data]);
    });

    return () => {
      socket.off("Donation-Update");
    };
  }, [userData]);


  const removeNotification = (id) => {
    setData(data.filter(item => item.id !== id));
  };

  const handleRequest = (id, action) => {
    console.log(`Request ${id} ${action}`);
    setData(data.filter(item => item.id !== id));
  };

  const fetchNotifications = async () => {

    try {
      const token = localStorage.getItem("Token");
      const userId = userData._id;

      const url = `http://localhost:3000/notification/?userId=${userId}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          
          Authorization: `Bearer ${token}`
        }
      })

      const result = await res.json();

      if (result.success) {
        console.log(result.message);

        setData(prev => [...prev, data]);
      }
      else {
        console.log(result.message);
      }
    }
    catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetchNotifications();
  }, [addNotification])

  return (
    <div className="notification-page">
      <h2>Notifications</h2>
      <div className="notification-list">
        {data.length === 0 ? (

          <p>No data available</p>

        ) : data.map((item) => (
          item.type != 'Request-Update' ? (
            <div key={item.id} className="notification-card">
              <div className="notification-header">
                <span className="notification-time">{item.createdAt}</span>
                <span className="notification-title">{item.type}</span>

                <button className="close-btn" onClick={() => removeNotification(item.id)}>×</button>
              </div>
              <div className="notification-message">{item.message}</div>
              <div className="notification-message">{item.metadata}</div>
            </div>
          ) : (
            <div key={item.id} className="request-card">
              <div className="notification-header">
                <span className="notification-time">{item.createdAt}</span>
                <span className="notification-title">{item.type}</span>
              </div>
              <div className="notification-message">{item.message}</div>
              <div className="notification-message">{item.metadata}</div>

              <div className="request-buttons">
                <button className="accept-btn" onClick={() => handleRequest(item.id, 'accepted')}>Accept</button>
                <button className="reject-btn" onClick={() => handleRequest(item.id, 'rejected')}>Reject</button>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Notifications;
