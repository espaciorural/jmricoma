import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getLanguages } from '../services/languageService';
import getSections from '../services/sectionService';
import { FiSend } from 'react-icons/fi';

const SECTION_SLUGS = ['', 'serveis', 'portfolio', 'contact'];

const Header = ({ onLanguageChange }) => {
  const [languages, setLanguages] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const defaultLanguage = 'CA';
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const langs = await getLanguages();
        setLanguages(langs);
        if (langs.length > 0) {
          const pathLanguageCode = location.pathname.split('/').filter(Boolean)[0]?.toUpperCase();
          const currentLanguage = langs.find(lang => lang.code.toUpperCase() === pathLanguageCode);
          const defaultLang = langs.find(lang => lang.code.toUpperCase() === defaultLanguage) || langs[0];
          const initialLanguage = currentLanguage || defaultLang;

          setSelectedLanguage(initialLanguage.id);
          await fetchSections(initialLanguage.id);
          onLanguageChange(initialLanguage.id);
        }
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, [location.pathname, onLanguageChange]);

  useEffect(() => {
    if (selectedLanguage) {
      fetchSections(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    if (sections.length > 0) {
      const updateCurrentSectionIndex = (path) => {
        const pathParts = path.split('/').filter(Boolean);
        const languageCodes = languages.map(lang => lang.code.toLowerCase());
        const hasLanguagePrefix = languageCodes.includes(pathParts[0]?.toLowerCase());
        const sectionSlug = hasLanguagePrefix ? pathParts[1] : pathParts[0];
        const sectionIndex = sectionSlug
          ? SECTION_SLUGS.findIndex(slug => slug === sectionSlug.toLowerCase())
          : 0;

        setCurrentSectionIndex(sectionIndex === -1 ? 0 : sectionIndex);
      };

      updateCurrentSectionIndex(location.pathname);
    }
  }, [location.pathname, sections, languages, selectedLanguage]);

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
    setCurrentSectionIndex(index);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const normalizePath = (path) => {
    const cleanPath = `/${String(path || '').replace(/^\/+|\/+$/g, '')}`;
    return cleanPath === '/' ? '/' : cleanPath;
  };

  const buildPublicPath = (languageCode, index) => {
    const langPrefix = languageCode.toUpperCase() === defaultLanguage ? '' : `/${languageCode.toLowerCase()}`;
    const sectionSlug = SECTION_SLUGS[index] || '';
    const sectionPath = sectionSlug ? `/${sectionSlug}` : '';

    return `${langPrefix}${sectionPath}` || '/';
  };

  const generateLink = (sectionName, index) => {
    const language = languages.find(lang => Number(lang.id) === Number(selectedLanguage));
    const langCode = language?.code || defaultLanguage;

    return buildPublicPath(langCode, index);
  };

  const isSelectedSection = (sectionName, index) => {
    return normalizePath(location.pathname) === normalizePath(generateLink(sectionName, index));
  };

  const generateLanguageLink = (languageCode, sectionName, index) => {
    return buildPublicPath(languageCode, index);
  };

  const contactPath = () => {
    const language = languages.find(lang => Number(lang.id) === Number(selectedLanguage));
    return buildPublicPath(language?.code || defaultLanguage, 3);
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
      <nav className={`${scrolled ? 'nav-scrolled' : ''}`}>
        <Link to={generateLink('', 0)} className="brand-link" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">JR</span>
          <span className="brand-copy">
            <strong>Josep Maria Ricoma</strong>
            <small>Desenvolupador PHP / Symfony</small>
          </span>
        </Link>
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {sections.slice(0, 3).map((section, index) => (
            <li key={section.id}>
              <Link
                to={generateLink(section.name, index)}
                className={isSelectedSection(section.name, index) ? 'selected' : ''}
                onClick={() => {
                  setCurrentSectionIndex(index);
                  setMenuOpen(false);
                }}
              >
                {section.name.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <ul className="language-switcher">
            {languages.map(language => (
              <li key={language.id}>
                <Link
                  to={generateLanguageLink(language.code, sections[currentSectionIndex]?.name || sections[0]?.name || '', currentSectionIndex)}
                  className={Number(selectedLanguage) === Number(language.id) ? 'selected' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLanguageChange(
                      language.id,
                      language.code,
                      sections[currentSectionIndex]?.name || sections[0]?.name || '',
                      currentSectionIndex
                    );
                    setMenuOpen(false);
                  }}
                >
                  {language.code}
                </Link>
              </li>
            ))}
          </ul>
          <Link to={contactPath()} className="contact-button" onClick={() => setMenuOpen(false)}>
            <FiSend aria-hidden="true" />
            Contactar
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
