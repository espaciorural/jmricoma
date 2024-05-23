import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getLanguages } from '../services/languageService';
import getSections from '../services/sectionService';
import { getImages } from '../services/imageService';
import { Slide } from 'react-awesome-reveal';

const Header = ({ onLanguageChange, idSection }) => {
  const [languages, setLanguages] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0); // Track current section index
  const defaultLanguage = 'CA';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await getLanguages();
        setLanguages(langs);
        if (langs.length > 0) {
          const defaultLang = langs[0].id;
          setSelectedLanguage(defaultLang);
          await fetchSections(defaultLang);
          onLanguageChange(defaultLang);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, [onLanguageChange]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getImages(1, 'header');
        if (images.length > 0) {
          setBackgroundImage(images[0].path);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (selectedLanguage) {
      fetchSections(selectedLanguage);
    }
  }, [selectedLanguage]);

  const fetchSections = async (id_lang) => {
    try {
      const sectionsData = await getSections(id_lang);
      setSections(sectionsData);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleLanguageChange = async (id_lang, languageCode, sectionName, index) => {
    setSelectedLanguage(id_lang);
    onLanguageChange(id_lang);
    await fetchSections(id_lang);
    const url = generateLanguageLink(languageCode, sectionName, index);
    navigate(url);
    setCurrentSectionIndex(index); // Update current section index
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const generateLink = (sectionName, index) => {
    const language = languages.find(lang => lang.id === selectedLanguage);
    const langCode = language && language.code !== defaultLanguage ? `${language.code}` : '';
    const sectionPath = index === 0 ? '' : `/${sectionName.toLowerCase()}`;
    return `${langCode.toLowerCase()}${sectionPath}`;
  };

  const isSelectedSection = (sectionName, index) => {
    const sectionUrl = generateLink(sectionName, index);
    if (index === 0) {
      // Caso especial para la sección "Home"
      const langCode = languages.find(lang => lang.id === selectedLanguage)?.code.toLowerCase();
      if (langCode && langCode !== defaultLanguage.toLowerCase()) {
        return location.pathname === `/${langCode}`;
      } else {
        return location.pathname === '/';
      }
    }
    return location.pathname.endsWith(sectionUrl);
  };

  const generateLanguageLink = (languageCode, sectionName, index) => {
    const langCode = languageCode !== defaultLanguage ? `${languageCode}` : '';
    const sectionPath = index === 0 ? '' : `/${sectionName.toLowerCase()}`;
    return `/${langCode.toLowerCase()}${sectionPath}`;
  };

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="header">
      {currentSectionIndex === 0 && (
        <Slide direction="down" duration={1000} triggerOnce>
          <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}></div>
        </Slide>
      )}
      <nav className={`${scrolled ? 'nav-scrolled' : ''}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {sections.map((section, index) => (
            <li key={section.id}>
              <Link
                to={generateLink(section.name, index)}
                className={isSelectedSection(section.name, index) ? 'selected' : ''}
                onClick={() => setCurrentSectionIndex(index)} // Update current section index on click
              >
                {section.name.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
        <ul className="language-switcher" style={{ marginLeft: 'auto' }}>
          {languages.map(language => (
            <li key={language.id}>
              <Link
                to={language.code.toLowerCase()}
                className={selectedLanguage === language.id ? 'selected' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleLanguageChange(language.id, language.code, sections[0]?.name || '', 0);
                }}
              >
                {language.code}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Header;
