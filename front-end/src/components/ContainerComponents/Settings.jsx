import React, { useState, useEffect } from 'react';
import '../../css/Component/Settings.css';


const Settings = () => {
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    if (darkTheme) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkTheme]);

  return (
    <div className="settings-container">
      <h2>Settings</h2>
      <div className="setting-option">
        <span>Dark Theme</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkTheme}
            onChange={() => setDarkTheme(!darkTheme)}
          />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default Settings;
