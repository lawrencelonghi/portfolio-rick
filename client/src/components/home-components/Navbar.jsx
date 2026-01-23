import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const [darkLinks, setDarkLinks] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const work = document.querySelector("#work");
      const about = document.querySelector("#about");

      setIsScrolled(scrollPosition > 50);

      // Esconder/mostrar navbar baseado na direção do scroll
      if (scrollPosition > lastScrollY.current && scrollPosition > 100) {
        // Scrollando para baixo
        setIsVisible(false);
      } else if (scrollPosition < lastScrollY.current) {
        // Scrollando para cima
        setIsVisible(true);
      }
      
      lastScrollY.current = scrollPosition;

      if (!work || !about) return;

      const workRect = work.getBoundingClientRect();
      const aboutRect = about.getBoundingClientRect();
      const offset = 80;
      const inWorkSection = workRect.top <= offset && aboutRect.top > offset;

      setDarkLinks(inWorkSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "pt" : "en");
  };

  return (
    <nav className={`fixed left-0 w-full z-40 bg-[rgba(255,255,255,0.66)] backdrop-blur-xs transition-all duration-300 ${isScrolled ? "top-0" : "top-0 md:top-8"} ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="flex ml-8 mr-8 items-center justify-between max-w-7xl h-16">
        <div className="flex items-center space-x-2">
          <a href="#work" className="pr-2 font-bold text-1xl sm:text-2xl md:text-3xl text-black tracking-widest">
            RICK TADEU
          </a>
          <span className="font-semibold text-sm md:text-2xl text-gray-900 tracking-widest sm:ml-4">
            {t("beautyArtist")}
          </span>
        </div>

        {!menuOpen && (
          <div className="flex items-center space-x-4 lg:hidden">
            <button onClick={toggleLang} className="px-1 py-0.5 border border-gray-400 rounded" style={{fontSize: '8px'}}>
              {i18n.language === "en" ? "EN" : "PT"}
            </button>
            <div className="px-0.5 py-0.5 cursor-pointer text-gray-950 z-40 text-sm mb-1 inline-flex items-center justify-center" onClick={() => setMenuOpen(true)}>
              &#9776;
            </div>
          </div>
        )}

        <div className="hidden lg:flex md:gap-14 items-center">
          <a href="#work" className={`text-xl transition-colors duration-500 ${darkLinks ? "text-gray-900" : "text-gray-500"} hover:text-gray-950`}>
            {t("work")}
          </a>
          <a href="#about" className={`text-xl transition-colors duration-500 ${darkLinks ? "text-gray-900" : "text-gray-500"} hover:text-gray-950`}>
            {t("about")}
          </a>
          <a href="#contact" className={`text-xl transition-colors duration-500 ${darkLinks ? "text-gray-900" : "text-gray-500"} hover:text-gray-950`}>
            {t("contact")}
          </a>

          <div className="flex gap-6">
            <div className=" max-w-xs w-full">
              <a href="https://www.instagram.com/rick_makeup/" className="cursor-pointer " target="_blank" rel="noopener noreferrer">
                <img src="/instagram-logo-thin-svgrepo-com.svg" className="w-6" />
              </a>
            </div> 

            <div className=" max-w-xs w-full">
              
              <a href="mailto:makeup.rick@gmail.com" className="cursor-pointer" target="_blank" rel="noopener noreferrer">
               <img src="/email-logo.png" className="w-6" />
              </a>
            </div> 
          </div>

          <button onClick={toggleLang} className=" px-1 py-0.5 border rounded cursor-pointer text-xs">
            {i18n.language.toUpperCase()}
          </button>
        </div>
      </div>
    </nav>
  );
};