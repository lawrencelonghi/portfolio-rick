import { useTranslation } from "react-i18next";
import { useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";

export const About = () => {
  console.log("About component rendered")
  const { t } = useTranslation();

    // useEffect(() => {
    //   AOS.init({
    //     duration: 1300,
    //     offset: 1100, 
    //     once: true,
    //   });
    // }, [])

  return (
    <section id="about" className="ml-8 mr-8 pt-20 md:pt-28 flex gap-30 relative">
      <div data-aos="fade-right" className="hidden z-10 space-y-18 md:flex flex-col items-center">
        <img src="/static/about-img.png" alt="Ricardo Tadeu" />
      </div>
      <div data-aos="fade-left" className="max-w-prose mx-auto tracking-wider text-sm space-y-6">
        <p>{t("aboutParagraph1")}</p>
        <p>{t("aboutParagraph2")}</p>
        <p>{t("aboutParagraph3")}</p>
        <p>{t("aboutParagraph4")}</p>
        <p>{t("aboutParagraph5")}</p>
        <p>{t("aboutParagraph6")}</p>
      </div>
    </section>
  );
};
