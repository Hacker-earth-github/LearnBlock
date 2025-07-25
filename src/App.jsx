import React from 'react'
import Home from "./pages/Home"; 
import Testimonial from './pages/Testomonial';
import HowItWorks from './pages/HowItWork';
import Footer from './pages/Footer';
const App = () => {
  return (
    <div>
       
      <Home />
      <HowItWorks/>
      <Testimonial/>
      {/* <Footer/> */}

    </div>
  )
}

export default App