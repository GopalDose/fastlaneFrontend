import React from 'react'
import Hero from '../components/Hero/Hero'

const Home = ({setShowLogin, isLoggedIn}) => {
  return (
    <section>
        <Hero setShowLogin={setShowLogin} isLoggedIn={isLoggedIn}/>
    </section>
  )
}

export default Home