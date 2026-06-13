import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiMonitor } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { lang } = useParams();
  const languagePrefix = lang ? `/${lang}` : '';

  const links = [
    { label: 'Inici', to: `${languagePrefix || '/'}` },
    { label: 'Serveis', to: `${languagePrefix}/serveis` },
    { label: 'Portfoli', to: `${languagePrefix}/portfolio` },
  ];

  const technologies = [
    'PHP / Symfony',
    'React / Vue.js',
    'MySQL',
    'Docker / Linux',
    'APIs / Integracions',
  ];

  const contactItems = [
    { icon: FiMapPin, text: 'Valldoreix, Barcelona' },
    { icon: FiMonitor, text: 'Remot / Híbrid / Presencial' },
    { icon: FiMail, text: 'hola@jmricoma.com', href: 'mailto:hola@jmricoma.com' },
    { icon: FiLinkedin, text: 'linkedin.com/in/jmricoma', href: 'https://linkedin.com/in/jmricoma' },
    { icon: FiGithub, text: 'github.com/jmricoma', href: 'https://github.com/jmricoma' },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <Link to={languagePrefix || '/'} className="site-footer__brand-link">
            <span className="site-footer__brand-mark">JR</span>
            <span>
              <strong>Josep Maria Ricomà</strong>
              <small>Desenvolupador PHP / Symfony</small>
            </span>
          </Link>
          <p>
            Més de 20 anys creant aplicacions web, APIs i solucions digitals que fan créixer negocis.
          </p>
          <div className="site-footer__social">
            <a href="https://github.com/jmricoma" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="https://linkedin.com/in/jmricoma" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a href="mailto:hola@jmricoma.com" aria-label="Email">
              <FiMail />
            </a>
          </div>
        </div>

        <div className="site-footer__column">
          <h2>Enllaços</h2>
          <ul>
            {links.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__column">
          <h2>Tecnologies</h2>
          <ul>
            {technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        </div>

        <div className="site-footer__column site-footer__contact">
          <h2>Contacte</h2>
          <ul>
            {contactItems.map((item) => {
              const Icon = item.icon;
              const content = (
                <>
                  <Icon aria-hidden="true" />
                  <span>{item.text}</span>
                </>
              );

              return (
                <li key={item.text}>
                  {item.href ? (
                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>
                      {content}
                    </a>
                  ) : (
                    <span>{content}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <p className="site-footer__copyright">
        © {currentYear} Josep Maria Ricomà. Tots els drets reservats.
      </p>
    </footer>
  );
};

export default Footer;
