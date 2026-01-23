import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export const About = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const { t, i18n } = useTranslation();
  const [profileImage, setProfileImage] = useState(null);
  const [profileText, setProfileText] = useState({ textPt: '', textEn: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      offset: 400, 
      once: true,
    });
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/profile-image`);
        const data = await response.json();
        setProfileImage(data);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileImage();
  }, [BACKEND_URL]);

  useEffect(() => {
    const fetchProfileText = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/profile-texts`);
        const data = await response.json();
        setProfileText(data);
      } catch (error) {
        console.error('Error fetching profile text:', error);
      }
    };

    fetchProfileText();
  }, [BACKEND_URL]);

  // Determina qual texto mostrar baseado no idioma atual
  const currentText = i18n.language === 'pt' ? profileText.textPt : profileText.textEn;

  // Divide o texto em parágrafos (separados por quebras de linha)
  const paragraphs = currentText
    ? currentText.split('\n').filter(p => p.trim() !== '')
    : [];

  return (
    <section id="about" className="ml-8 mr-8 pt-20 md:pt-28 flex gap-30 relative">
      <div data-aos="fade-right" className="hidden z-10 space-y-18 md:flex flex-col items-center">
        {loading ? (
          <div className="w-64 h-64 bg-gray-200 animate-pulse rounded" />
        ) : profileImage?.path ? (
          <img 
            src={`${BACKEND_URL}${profileImage.path}`} 
            alt="Ricardo Tadeu"
            className="max-w-full h-auto"
          />
        ) : (
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded">
            <span className="text-gray-500">Sem imagem</span>
          </div>
        )}
      </div>
      <div data-aos="fade-left" className="max-w-prose mx-auto tracking-wider text-sm">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-6">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-gray-500">{t('about.defaultText')}</p>
        )}
      </div>
    </section>
  );
};