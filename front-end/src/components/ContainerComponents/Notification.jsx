import React, { useState } from 'react';
import '../../css/Component/Notification.css';


const NotificationSettings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appNotifications, setAppNotifications] = useState(true);

  return (
    <div className="notif-container">
      <h2>Notification Settings</h2>

      <div className="notif-setting">
        <label>Email Notifications</label>
        <input
          type="checkbox"
          checked={emailNotifications}
          onChange={() => setEmailNotifications(!emailNotifications)}
        />
      </div>

      <div className="notif-setting">
        <label>SMS Notifications</label>
        <input
          type="checkbox"
          checked={smsNotifications}
          onChange={() => setSmsNotifications(!smsNotifications)}
        />
      </div>

      <div className="notif-setting">
        <label>App Push Notifications</label>
        <input
          type="checkbox"
          checked={appNotifications}
          onChange={() => setAppNotifications(!appNotifications)}
        />
      </div>
    </div>
  );
};

export default NotificationSettings;
