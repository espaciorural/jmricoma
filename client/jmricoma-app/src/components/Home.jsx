import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../Web.css";
import "../Home.css";
import getLiterals from "../services/literalService";
import { getLanguageById } from "../services/languageService";
import { getImages } from "../services/imageService";
import { getItems } from "../services/crudService";
import { Fade } from "react-awesome-reveal";
import { FiArrowRight, FiCode, FiDatabase, FiExternalLink, FiGithub, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";
import {
  SiBootstrap,
  SiCss3,
  SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiJquery,
  SiLaravel,
  SiMysql,
  SiPhp,
  SiReact,
  SiSymfony,
  SiVuedotjs,
} from "react-icons/si";

const CONTACT_ITEMS = [
  { icon: FiMapPin, text: "Valldoreix, Barcelona" },
  { icon: FiMail, text: "hola@jmricoma.com", href: "mailto:hola@jmricoma.com" },
  { icon: FiLinkedin, text: "linkedin.com/in/jmricoma", href: "https://linkedin.com/in/jmricoma" },
  { icon: FiGithub, text: "github.com/jmricoma", href: "https://github.com/jmricoma" },
];

const TECHNOLOGIES = [
  { icon: SiPhp, label: "PHP" },
  { icon: SiSymfony, label: "Symfony" },
  { icon: SiLaravel, label: "Laravel" },
  { icon: SiReact, label: "React" },
  { icon: SiVuedotjs, label: "Vue.js" },
  { icon: SiJavascript, label: "JavaScript" },
  { icon: SiHtml5, label: "HTML" },
  { icon: SiCss3, label: "CSS" },
  { icon: SiJquery, label: "jQuery" },
  { icon: SiMysql, label: "MySQL" },
  { icon: FiCode, label: "REST APIs" },
  { icon: SiBootstrap, label: "Bootstrap" },
  { icon: SiGit, label: "Git" },
  { icon: SiDocker, label: "Docker" },
];

const SERVICE_ICONS = [FiCode, FiExternalLink, FiDatabase, FiArrowRight];

const HOME_LABELS = {
  CA: {
    availability: "Disponible per a nous projectes",
    projectsCta: "Veure projectes",
    servicesCta: "Serveis",
    featuredProjects: "Projectes destacats",
    recentProjects: "Alguns projectes recents",
    allProjects: "Veure tots els projectes",
    projectLink: "Veure projecte",
  },
  ES: {
    availability: "Disponible para nuevos proyectos",
    projectsCta: "Ver proyectos",
    servicesCta: "Servicios",
    featuredProjects: "Proyectos destacados",
    recentProjects: "Algunos proyectos recientes",
    allProjects: "Ver todos los proyectos",
    projectLink: "Ver proyecto",
  },
  EN: {
    availability: "Available for new projects",
    projectsCta: "View projects",
    servicesCta: "Services",
    featuredProjects: "Featured projects",
    recentProjects: "Some recent projects",
    allProjects: "View all projects",
    projectLink: "View project",
  },
  FR: {
    availability: "Disponible pour de nouveaux projets",
    projectsCta: "Voir les projets",
    servicesCta: "Services",
    featuredProjects: "Projets selectionnes",
    recentProjects: "Quelques projets recents",
    allProjects: "Voir tous les projets",
    projectLink: "Voir le projet",
  },
};

const Home = ({ idSection, idLang }) => {
  const [literals, setLiterals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [heroImage, setHeroImage] = useState("");
  const [currentLanguageCode, setCurrentLanguageCode] = useState("CA");
  const currentLanguageId = Number(idLang || 1);

  useEffect(() => {
    const fetchLiterals = async () => {
      try {
        const language = await getLanguageById(currentLanguageId);

        if (!language) {
          return;
        }

        setCurrentLanguageCode(language.code);
        const literalsData = await getLiterals(idSection, language.code);
        setLiterals(literalsData.filter((literal) => literal.lang === language.code));
      } catch (error) {
        console.error("Error fetching home literals:", error);
      }
    };

    fetchLiterals();
  }, [currentLanguageId, idSection]);

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const images = await getImages(idSection, "header");

        if (images.length > 0) {
          setHeroImage(images[0].path);
        }
      } catch (error) {
        console.error("Error fetching home image:", error);
      }
    };

    fetchHeroImage();
  }, [idSection]);

  const fetchHomeContent = useCallback(async () => {
    try {
      const [portfolioData, servicesData] = await Promise.all([
        getItems("portfolio"),
        getItems("services"),
      ]);

      const visibleProjects = portfolioData
        .filter((project) => Number(project.id_lang) === currentLanguageId && Number(project.status) === 1)
        .slice(0, 3);

      const projectsWithGallery = await Promise.all(
        visibleProjects.map(async (project) => {
          const galleryOwnerId = project.main_portfolio_id || project.id;
          const gallery = await getImages(galleryOwnerId, "portfolio_gallery");

          return {
            ...project,
            coverImage: gallery[0]?.path || null,
          };
        })
      );

      setProjects(projectsWithGallery);
      setServices(
        servicesData
          .filter((service) => Number(service.id_lang) === currentLanguageId && Number(service.status) === 1)
          .slice(0, 4)
      );
    } catch (error) {
      console.error("Error fetching home content:", error);
    }
  }, [currentLanguageId]);

  useEffect(() => {
    fetchHomeContent();
  }, [fetchHomeContent]);

  const literalByType = useMemo(() => ({
    title: literals.find((literal) => literal.type === "title")?.text,
    subtitle: literals.find((literal) => literal.type === "subtitle")?.text,
    description: literals.find((literal) => literal.type === "description")?.text,
  }), [literals]);

  const labels = HOME_LABELS[currentLanguageCode] || HOME_LABELS.CA;
  const languagePrefix = currentLanguageCode === "CA" ? "" : `/${currentLanguageCode.toLowerCase()}`;
  const portfolioPath = `${languagePrefix}/portfolio`;
  const servicesPath = `${languagePrefix}/serveis`;

  const formatExternalUrl = (url) => {
    if (!url) {
      return "";
    }

    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  return (
    <main className="home-page">
      <section className="home-hero">
        {heroImage && (
          <div className="home-hero-background" aria-hidden="true">
            <img src={heroImage} alt="" />
          </div>
        )}
        <div
          className="home-shell home-hero-grid"
          style={{ "--home-visual-background": "url('/uploads/background-header.png')" }}
        >
          <Fade direction="up" duration={700} triggerOnce>
            <div className="home-hero-copy">
              <p className="home-kicker">{labels.availability}</p>
              <h1>{literalByType.title || "Josep Maria Ricoma"}</h1>
              <h2>{literalByType.subtitle || "Desenvolupo aplicacions web robustes, escalables i orientades a negoci."}</h2>
              <p className="home-hero-text">
                {literalByType.description || "Mes de 20 anys d'experiencia creant solucions amb PHP, Symfony i tecnologies modernes."}
              </p>
              <div className="home-actions">
                <Link to={portfolioPath} className="home-button home-button-primary">
                  {labels.projectsCta} <FiArrowRight aria-hidden="true" />
                </Link>
                <Link to={servicesPath} className="home-button home-button-secondary">
                  {labels.servicesCta}
                </Link>
              </div>
              <div className="home-tech-list" aria-label="Tecnologies">
                <div className="home-tech-track">
                  {[...TECHNOLOGIES, ...TECHNOLOGIES].map(({ icon: Icon, label }, index) => (
                    <span key={`${label}-${index}`}>
                      <Icon aria-hidden="true" />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Fade>

          <div className="home-hero-visual">
            <div className="home-contact-card">
              {CONTACT_ITEMS.map(({ icon: Icon, text, href }) => {
                const content = (
                  <>
                    <Icon aria-hidden="true" />
                    <span>{text}</span>
                  </>
                );

                return href ? (
                  <a href={href} key={text} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {content}
                  </a>
                ) : (
                  <span key={text}>{content}</span>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="home-section home-projects-section">
        <div className="home-shell">
          <div className="home-section-heading">
            <div>
              <p className="home-section-label">{labels.featuredProjects}</p>
              <h2>{labels.recentProjects}</h2>
            </div>
            <Link to={portfolioPath} className="home-text-link">
              {labels.allProjects} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="home-project-grid">
            {projects.map((project) => (
              <article className="home-project-card" key={project.id}>
                <div className="home-project-media">
                  {project.coverImage ? (
                    <img src={project.coverImage} alt={project.title} />
                  ) : (
                    <div className="home-project-placeholder">{project.title?.charAt(0) || "P"}</div>
                  )}
                </div>
                <div className="home-project-body">
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.project_url && (
                    <a href={formatExternalUrl(project.project_url)} target="_blank" rel="noreferrer" className="home-card-link">
                      {labels.projectLink} <FiArrowRight aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-services-band">
        <div className="home-shell">
          <p className="home-section-label">{labels.servicesCta}</p>
          <div className="home-service-grid">
            {services.map((service, index) => {
              const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];

              return (
                <article className="home-service-item" key={service.id}>
                  <div className="home-service-icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{service.title}</h3>
                  {service.description && <p>{service.description}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
