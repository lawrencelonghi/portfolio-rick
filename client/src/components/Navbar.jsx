import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export const Navbar = ({ menuOpen, setMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const [darkLinks, setDarkLinks] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const work = document.querySelector("#work");
      const about = document.querySelector("#about");
      if (!work || !about) return;

      const workRect = work.getBoundingClientRect();
      const aboutRect = about.getBoundingClientRect();

      // Navbar tem ~80px de altura, ajustamos com offset
      const offset = 80;

      // Escurecer apenas se estamos entre Work e About
      const inWorkSection = workRect.top <= offset && aboutRect.top > offset;

      setDarkLinks(inWorkSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // rodar uma vez na carga inicial
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "pt" : "en");
  };

  return (
    <nav className="fixed top-0 left-0 md:top-8 w-full z-40 bg-[rgba(255,255,255,0.66)] backdrop-blur-xs">
      <div className="flex ml-8 mr-8 items-center justify-between max-w-7xl h-16">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a
            href="#work"
            className="pr-2 font-bold text-1xl sm:text-2xl md:text-3xl text-black tracking-widest"
          >
            RICK TADEU
          </a>
          <span className="font-semibold text-sm md:text-2xl text-gray-900 tracking-widest sm:ml-4">
            {t("beautyArtist")}
          </span>
        </div>

        {/* Mobile */}
        {!menuOpen && (
          <div className="flex items-center space-x-4 lg:hidden">
            <button
              onClick={toggleLang}
              className="px-1 py-0.5 border border-gray-400 rounded"
              style={{fontSize: '8px'}}
            >
              {i18n.language === "en" ? "EN" : "PT"}
            </button>
            <div
              className="px-0.5 py-0.5  cursor-pointer text-gray-950 z-40 text-sm mb-1 inline-flex items-center justify-center"
              onClick={() => setMenuOpen(true)}
            >
              &#9776;
            </div>
          </div>
        )}

        {/* Desktop */}
        <div className="hidden lg:flex md:gap-14 items-center">
          <a
            href="#work"
            className={`text-xl transition-colors duration-500 ${darkLinks ? "text-gray-900" : "text-gray-500"} hover:text-gray-950`}
          >
            {t("work")}
          </a>
          <a
            href="#about"
            className={`text-xl transition-colors duration-500 ${darkLinks ? "text-gray-900" : "text-gray-500"} hover:text-gray-950`}
          >
            {t("about")}
          </a>
          <a
            href="#contact"
            className={`text-xl transition-colors duration-500 ${darkLinks ? "text-gray-900" : "text-gray-500"} hover:text-gray-950 `}
          >
            {t("contact")}
          </a>
          <button
            onClick={toggleLang}
            className="ml-6 px-2 py-1 border rounded cursor-pointer text-sm"
          >
            {i18n.language.toUpperCase()}
          </button>
        </div>

      </div>
    </nav>
  );
};
