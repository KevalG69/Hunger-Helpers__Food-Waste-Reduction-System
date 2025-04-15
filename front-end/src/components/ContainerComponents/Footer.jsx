import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faSquareInstagram, faFacebook, faXTwitter } from '@fortawesome/free-brands-svg-icons';

import Logo from '../../assets/image/HungerHelpersLogo.png';
import '../../css/Component/Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <img
          src={Logo}
          alt="Hunger Helpers"
          className="footer-logo"
        />
        <h3>Hunger Helpers</h3>
        <p>
          Made with <span className="heart">❤️</span> to reduce food waste and fight hunger.
          <br />
          Join us in making a meaningful impact.
        </p>
        <div className="footer-links">
          <a href="/contact">Contact</a> | <a href="/donate">Donate</a> | <a href="/volunteer">Volunteer</a>
        </div>
        <div className="footer-icons">
        <FontAwesomeIcon icon={faEnvelope} />
        <FontAwesomeIcon icon={faSquareInstagram} />
        <FontAwesomeIcon icon={faFacebook} />
        <FontAwesomeIcon icon={faXTwitter} />
        </div>
      </div>
      <div className="footer-bottom">
        {/* <p>© 2025 Hunger Helpers</p> */}
        <p className="creator">Made By - <span>Keval G. Solanki</span></p>
      </div>
    </footer>
  );
};

export default Footer;
