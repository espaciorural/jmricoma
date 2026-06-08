import React, { useState, useEffect, useCallback } from "react";
import "../Web.css";
import "../Services.css";
import getLiterals from "../services/literalService";
import { getLanguageById } from "../services/languageService";
import { getItems } from "../services/crudService";
import { Fade } from "react-awesome-reveal";
import { motion } from "framer-motion";

const Services = ({ idSection, idLang }) => {
  const [literals, setLiterals] = useState([]);
  const [services, setServices] = useState([]);
  const [flip, setFlip] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const language = await getLanguageById(idLang);
        if (language) {
          const codeLang = language.code;
          const literalsData = await getLiterals(idSection, codeLang);
          const filteredLiterals = literalsData.filter(
            (literal) => literal.lang === codeLang
          );
          setLiterals(filteredLiterals);
        }
      } catch (error) {
        console.error("Error fetching literals:", error);
      }
    };

    fetchData();
  }, [idSection, idLang]);

  const fetchServices = useCallback(async () => {
    try {
      const servicesData = await getItems("services");
      servicesData.forEach(service => console.log(`Service id_lang: ${service.id_lang}`));

      const filteredServices = servicesData.filter(
        (service) => service.id_lang === idLang
      );

      const servicesWithImages = await Promise.all(
        filteredServices.map(async (service) => {
          try {
            const response = await fetch(`http://jmricoma/api/check-image/services/${service.id}`);
            const result = await response.json();
            return {
              ...service,
              image: result.exists ? result.url : null,
            };
          } catch (error) {
            console.error(`Error checking image for service ID ${service.id}:`, error);
            return {
              ...service,
              image: null,
            };
          }
        })
      );

      setServices(servicesWithImages);
      console.log("All services loaded:", servicesWithImages);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  }, [idLang]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleFlip = (id) => {
    setFlip((prevFlip) => ({
      ...prevFlip,
      [id]: !prevFlip[id],
    }));
  };

  const renderServiceBoxes = () => {
    return services.map((service) => (
      <motion.div 
        key={service.id} 
        className="service-box"
        onClick={() => handleFlip(service.id)}
        style={{ perspective: 1000, width: 'calc(33.333% - 16px)', margin: '8px' }}
      >
        <motion.div
          className="service-box-inner"
          style={{ position: 'relative', width: '100%', height: '200px', textAlign: 'center', transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flip[service.id] ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="service-box-front"
            style={{ backgroundImage: `url(${service.image})`, backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div className="service-box-content">
              <h4>{service.title}</h4>
            </div>
          </motion.div>
          <motion.div
            className="service-box-back"
            style={{ backfaceVisibility: 'hidden', position: 'absolute', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9', transform: 'rotateY(180deg)' }}
          >
            <div className="service-box-content">
              <p>{service.description}</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    ));
  };

  return (
    <div className='content-services'>
      <div className="title-container-services">
        {literals.map((literal) => (
          <Fade
            key={`subtitle-${literal.id}`}
            direction="up"
            duration={1000}
            triggerOnce
          >
            {literal.type === "subtitle" ? (
              <h3>{literal.text}</h3>
            ) : null}
          </Fade>
        ))}
      </div>
      <div className="descriptions-container-services">
        <div className="service-list">
          {renderServiceBoxes()}
        </div>
      </div>
    </div>
  );
};

export default Services;
