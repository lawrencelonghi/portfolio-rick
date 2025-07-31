import { useEffect } from "react"


export const Navbar = ({ menuOpen, setMenuOpen }) => {

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  },[menuOpen])
  return (

<nav className="fixed top-0 left-0 md:top-8 w-full z-40 bg-[rgba(255,255,255,0.2)] backdrop-blur-xs">
  <div className="flex ml-8 mr-8 items-center justify-between max-w-7xl  h-16 ">
    <div className=" flex items-center space-x-2">
      <a href="#work" className="pr-2 font-bold text-1xl sm:text-2xl md:text-3xl text-black tracking-widest">RICK TADEU</a>
      <span className=" font-semibold text-sm l md:text-2xl text-gray-900 tracking-widest sm:ml-4 ">BEAUTY ARTIST</span>
    </div>

{!menuOpen && (
  <div
    className="relative cursor-pointer text-gray-950 z-40 lg:hidden text-2xl"
    onClick={() => setMenuOpen(true)}
  >
    &#9776;
  </div>
)}



      <div className="hidden lg:flex md:gap-14">
        <a href="#work" className="text-xl text-gray-500 tracking-widest hover:text-gray-950 transition-colors relative group">Work <span className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-gray-800 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-10"></span></a>

        <a href="#about" className="text-xl text-gray-500 tracking-widest hover:text-gray-950 transition-colors relative group">About <span className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-gray-800 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-10"></span></a>

        <a href="#contact" className="text-xl text-gray-500 tracking-widest hover:text-gray-950 transition-colors relative group">Contact <span className="absolute bottom-[-3px] left-0 w-full h-[2px] bg-gray-800 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out z-10"></span></a>
      </div>

    </div>
  </nav>
  )
}