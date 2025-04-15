import React, { useState } from 'react';
import '../../css/Component/Language.css';


const languages = [
  'English',
  'Hindi',
  'Gujarati',
  'Marathi',
  'Tamil',
  'Telugu',
  'Bengali',
  'Kannada',
  'Malayalam',
];

const LanguageSelector = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    // Optional: Save selection to backend/localStorage
  };

  return (
    <div className="lang-container">
      <h2>Select Language</h2>
      <select value={selectedLanguage} onChange={handleLanguageChange} className="lang-select">
        {languages.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
      <p className="lang-note">Current Language: <strong>{selectedLanguage}</strong></p>
    </div>
  );
};

export default LanguageSelector;
