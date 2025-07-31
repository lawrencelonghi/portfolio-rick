import { useState, useEffect } from 'react'
import './index.css'
import './App.css'
import { Navbar } from './components/Navbar'
import { MobileMenu } from './components/MobileMenu'
import { Work } from './components/sections/Work'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'

import ImageGallery from "react-image-gallery";
// import stylesheet if you're not already using CSS @import
import "react-image-gallery/styles/css/image-gallery.css";


function App() {

  const [menuOpen, setMenuOpen] = useState(false)
 

  return <>
  <div>

  <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
  <MobileMenu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
  <Work />
  <About />
  <Contact />
  
  </div>
  

  </>
}

export default App
