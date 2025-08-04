import { useState, useEffect } from 'react'
import './index.css'
import './App.css'
import { Navbar } from './components/Navbar'
import { MobileMenu } from './components/MobileMenu'
import { Work } from './components/sections/Work'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'



import AOS from 'aos';
import 'aos/dist/aos.css';



function App() {

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1300,
      once: true,
      offset: 800, 
    });
  }, [])
  

  const [menuOpen, setMenuOpen] = useState(false)
 

  return <>
  <div className={fadeIn ? "fade-in" : ""}>

  <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
  <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
  <Work />
  <About />
  <Contact />
  
  </div>
  

  </>
}

export default App
