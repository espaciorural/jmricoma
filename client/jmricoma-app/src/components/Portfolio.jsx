import React, { useCallback, useEffect, useState } from "react";
import "../Web.css";
import "../Portfolio.css";
import getLiterals from "../services/literalService";
import { getLanguageById } from "../services/languageService";
import { getItems } from "../services/crudService";
import { getImages } from "../services/imageService";
import { Fade } from "react-awesome-reveal";
import { motion } from "framer-motion";

const Portfolio = ({ idLang }) => {
  const sectionId = 3;
  const [literals, setLiterals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeImages, setActiveImages] = useState({});
  const currentLanguageId = Number(idLang || 1);

  useEffect(() => {
    const fetchLiterals = async () => {
      try {
        const language = await getLanguageById(currentLanguageId);

        if (!language) {
          return;
        }

        const literalsData = await getLiterals(sectionId, language.code);
        setLiterals(literalsData.filter((literal) => literal.lang === language.code));
      } catch (error) {
        console.error("Error fetching portfolio literals:", error);
      }
    };

    fetchLiterals();
  }, [currentLanguageId]);

  const fetchPortfolio = useCallback(async () => {
    try {
      const portfolioData = await getItems("portfolio");
      const filteredProjects = portfolioData
        .filter((project) => Number(project.id_lang) === currentLanguageId && Number(project.status) === 1)
        .sort((a, b) => Number(a.item || 0) - Number(b.item || 0));

      const projectsWithGallery = await Promise.all(
        filteredProjects.map(async (project) => {
          const galleryOwnerId = project.main_portfolio_id || project.id;
          const gallery = await getImages(galleryOwnerId, "portfolio_gallery");

          return {
            ...project,
            gallery,
            coverImage: gallery[0]?.path || null,
          };
        })
      );

      setProjects(projectsWithGallery);
      setActiveImages(
        projectsWithGallery.reduce((activeByProject, project) => ({
          ...activeByProject,
          [project.id]: project.coverImage,
        }), {})
      );
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  }, [currentLanguageId]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const titleLiteral = literals.find((literal) => literal.type === "subtitle");
  const descriptionLiteral = literals.find((literal) => literal.type === "description");
  const formatExternalUrl = (url) => {
    if (!url) {
      return "";
    }

    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  return (
    <main className="portfolio-page" style={{ "--portfolio-hero-image": "url('/uploads/josep.webp')" }}>
      <section className="portfolio-intro">
        <div className="portfolio-intro-inner">
          <Fade direction="up" duration={700} triggerOnce>
            <p className="portfolio-kicker">Portfolio</p>
            <h1>{titleLiteral?.text || "Projectes seleccionats"}</h1>
            {descriptionLiteral?.text && <p className="portfolio-intro-text">{descriptionLiteral.text}</p>}
          </Fade>
        </div>
      </section>

      <section className="portfolio-grid-section">
        <div className="portfolio-grid">
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              className="portfolio-project"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
            >
              <div className="portfolio-media">
                {activeImages[project.id] ? (
                  <img src={activeImages[project.id]} alt={project.title} />
                ) : (
                  <div className="portfolio-media-empty">Sense imatge</div>
                )}
              </div>

              {project.gallery.length > 1 && (
                <div className="portfolio-thumbnails" aria-label={`Galeria de ${project.title}`}>
                  {project.gallery.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => setActiveImages((current) => ({ ...current, [project.id]: image.path }))}
                      className={activeImages[project.id] === image.path ? "is-active" : ""}
                      aria-label={`Veure imatge ${image.id}`}
                    >
                      <img src={image.path} alt="" />
                    </button>
                  ))}
                </div>
              )}

              <div className="portfolio-project-body">
                <h2>{project.title}</h2>
                {project.description && <p>{project.description}</p>}
                {project.skills && (
                  <div className="portfolio-skill-list">
                    {project.skills.split(",").map((skill) => skill.trim()).filter(Boolean).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                )}
                {project.project_url && (
                  <a href={formatExternalUrl(project.project_url)} target="_blank" rel="noreferrer" className="portfolio-link">
                    Veure projecte
                  </a>
                )}
              </div>
            </motion.article>
          ))}

          {projects.length === 0 && (
            <div className="portfolio-empty">
              <h2>Encara no hi ha projectes publicats</h2>
              <p>Quan activis projectes des del panell, apareixeran aquí amb la seva galeria.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Portfolio;
