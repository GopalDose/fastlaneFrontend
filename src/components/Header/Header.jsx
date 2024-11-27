import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Header = ({isLoggedIn, setIsLoggedIn}) => {
  useEffect(() => {
    // Check if access_token exists in localStorage
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token); // Set to true if token exists, otherwise false
  });

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('access_token');
    setIsLoggedIn(false); // Update state
    alert('You have been logged out.');
  };

  return (
    <header className="header">
      <div className="brand">
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
      </div>
      <div className="nav">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="contact">Contact</Link>
          </li>
          {isLoggedIn && ( 
            <>
              <li>
                <Link to="display">Display Data</Link>
              </li>
              <li>
                <button className="logoutbtn" onClick={handleLogout}>
                  Logout
                </button>
              </li>

            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
