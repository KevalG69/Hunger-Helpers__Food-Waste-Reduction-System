import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronRight,faCircleChevronLeft} from '@fortawesome/free-solid-svg-icons'

//images
import image1 from '../../assets/image/image1.jpg'
import image2 from '../../assets/image/image2.png'

//css
import '../../css/Component/HeroCarousel.css';
import { useNavigate } from 'react-router-dom';

//svgs


const slides = [
  {
    image: `${image1}`,
    heading: 'Donate',
    subheading: 'Your Extra Can Be Someone’s Meal',
    description:
      'Your small act of kindness can create a ripple of change. Donate surplus food and ensure that no meal goes to waste while feeding those in need.',
  },
  {
    image: `${image2}`,
    heading: 'Share Kindness',
    subheading: 'Make a Difference Today',
    description:
      'Be a hero in someone’s story by sharing what you have. Help eliminate hunger, one donation at a time.',
  },
  // Add more slides if needed
];

const HeroCarousel = () => {

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];

  const handleClick = ()=>{
    const token = localStorage.getItem("Token");
    if(!token)
    {
      navigate("/Login");
    }
    else
    {
      navigate("/Donations")
    }
  }

  return (
    <div className="hero-carousel">
      <div
        className="hero-slide"
        style={{ backgroundImage: `url(${currentSlide.image})` }}
      >
        <div className="overlay" />
        <div className="hero-content">
          <h1>{currentSlide.heading}</h1>
          <h3>{currentSlide.subheading}</h3>
          <p>{currentSlide.description}</p>
          <button className="donate-btn" onClick={handleClick}>Donate Now</button>
         
        </div>
        <button className="arrow left" onClick={prevSlide}><FontAwesomeIcon icon={faCircleChevronLeft} style={{color: "#D13479",}} /></button>
        <button className="arrow right" onClick={nextSlide}>
        <FontAwesomeIcon icon={faCircleChevronRight} style={{color: "#D13479",}} /></button>
      </div>
    </div>
  );
};

export default HeroCarousel;
