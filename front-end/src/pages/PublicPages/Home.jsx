import React, { useState } from 'react';

//css
import '../../css/Pages/Home.css';

//components
import HeroCarousel from '../../components/ContainerComponents/HeroCarousel';
import ProblemSection from '../../components/ContainerComponents/ProblemSection';
import OurMission from '../../components/ContainerComponents/OurMission';
import AnalyticsSlider from '../../components/ContainerComponents/AnalyticSlider';
import Leaderboard from '../../components/ContainerComponents/Leaderboard';
import Footer from '../../components/ContainerComponents/Footer';
import { Link } from 'react-router-dom';


const Home = () => {
    const handleClick = () => {
        const section = document.getElementById("leaderboard");
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      };
      
    return (
        <>
            <Link to="#leaderboard" onClick={handleClick} className="floating-leaderboard-btn">
                Leaderboard ⬇️
            </Link>

            <HeroCarousel />
            <hr className="custom-line" />
            <ProblemSection />
            <hr className="custom-line" />
            <OurMission />
            <hr className="custom-line" />
            <AnalyticsSlider />
            <hr className="custom-line" />
            <section id="leaderboard">
                <Leaderboard />
            </section>

            <Footer />
        </>
    )
};

export default Home;
