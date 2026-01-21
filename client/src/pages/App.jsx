import { useState, useEffect } from 'react'
import '../../src/index.css'
import '../../src/App.css'
import { Navbar } from '../components/home-components/Navbar'
import { MobileMenu } from '../components/home-components/MobileMenu'
import { Work } from '../components/home-components/Work'
import { About } from '../components/home-components/About'
import { Contact } from '../components/home-components/Contact'
import smoothscroll from 'smoothscroll-polyfill';


// Ativa o polyfill ANTES de tudo
smoothscroll.polyfill();

import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from '../components/home-components/Footer'

function App() {
  const [fadeIn, setFadeIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  return (
    <div className={fadeIn ? "fade-in" : ""}>
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Work />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;