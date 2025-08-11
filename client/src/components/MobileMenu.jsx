import { useTranslation } from "react-i18next";

export const MobileMenu = ({ menuOpen, setMenuOpen }) => {
  const { t } = useTranslation();

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full bg-[rgba(255,255,255,0.6)] z-40 flex flex-col 
          items-center justify-center transition-all duration-300 ease-in-out
          ${menuOpen ? "h-screen opacity-100 pointer-events-auto" : "h-0 opacity-0 pointer-events-none"}`}
      >
        
        <button onClick={() => setMenuOpen(false)} 
      className="absolute top-3 right-8 text-gray-900 text-3xl focus:outline-none cursor-pointer"
      aria-label="fechar menu close menu">
        &times;
      </button>

        <a
          href="#work"
          onClick={() => setMenuOpen(false)}
          className="text-2xl text-gray-950 font-semibold transition-colors tracking-widest p-6"
        >
          {t("work")}
        </a>
        <a
          href="#about"
          onClick={() => setMenuOpen(false)}
          className="text-2xl text-gray-950 font-semibold transition-colors tracking-widest p-6"
        >
          {t("about")}
        </a>
        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="text-2xl text-gray-950 font-semibold transition-colors tracking-widest p-6"
        >
          {t("contact")}
        </a>
      </div>
    </>
  );
};
