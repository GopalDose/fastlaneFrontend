import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Home from './pages/Home'
import LoginPopup from './components/LoginPopup/LoginPopup'
import ShippingCost from './pages/ShippingCost'
import AllDisplay from './pages/AllDisplay'
import Contact from './pages/Contact'

const App = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <div className="container">
        {showLogin && <LoginPopup setShowLogin={setShowLogin} setIsLoggedIn={setIsLoggedIn} />}
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home setShowLogin={setShowLogin} isLoggedIn={isLoggedIn}/>} />
          <Route path="/shipping" element={<ShippingCost />} />
          <Route path="/display" element={<AllDisplay />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
