import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import hero from '../../assets/images/hero.png';

const Hero = ({ setShowLogin, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/shipping'); // Redirect if logged in
    } else {
      setShowLogin(true); // Show login modal if not logged in
    }
  };

  return (
    <div className="hero">
      <h1>FastLane</h1>
      <span>LAST MILE DELIVERY SYSTEM</span>
      <button onClick={handleButtonClick} className="startBtn">
        Get Started
      </button>
    </div>
  );
};

export default Hero;
