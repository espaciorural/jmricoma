import React, { useState, useEffect } from 'react';
import '../Web.css';
import '../Home.css';
import getLiterals from '../services/literalService';
import { getLanguageById } from '../services/languageService';
import { getImages } from '../services/imageService';
import { Slide, Fade } from 'react-awesome-reveal';
import { motion, AnimatePresence } from 'framer-motion';

const Home = ({ idSection, idLang }) => {
  const [literals, setLiterals] = useState([]);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const language = await getLanguageById(idLang);
        if (language) {
          const codeLang = language.code;
          const literalsData = await getLiterals(idSection, codeLang);
          const filteredLiterals = literalsData.filter(literal => literal.lang === codeLang);
          setLiterals(filteredLiterals);
        }

        const images = await getImages(idSection, 'header');
        if (images.length > 0) {
          setBackgroundImage(images[0].path); // Assuming you only need one image for the background
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [idSection, idLang]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex((prevIndex) => (prevIndex + 1) % skills.length);
    }, 3000); // Change skill every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const formatText = (text) => {
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const skills = [
    'PHP', 'MySQL', 'React', 'CodeIgniter', 'Wordpress', 'Laravel', 'CSS3', 'JavaScript', 'JQuery', 'HTML5', 'Node.js', 'Ajax', 'JSON', 'XML', 'Bootstrap', 'SASS', 'Git', 'GitHub', 'Docker', 'REST', 'API', 'Symfony', 'Composer'
  ];

  const bounceTransition = {
    duration: 10,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut"
  };

  return (
    <div className="content">
      <div className="content-wrapper">
        <Slide direction="down" duration={1000} triggerOnce>
          <h1>Josep M. Ricomà</h1>
        </Slide>
        {literals.map(literal => (
          <Fade key={`title-${literal.id}`} direction="up" duration={1000} triggerOnce>
            {literal.type === 'title' ? <h2>{literal.text}</h2> : 
             literal.type === 'subtitle' ? <h3>{literal.text}</h3> : 
             null}
          </Fade>
        ))}
        <div className="skills">
          <AnimatePresence>
            <motion.div
              key={currentSkillIndex}
              initial={{ opacity: 0, x: 200 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -200 }}
              transition={{ duration: 3 }}
              className="skill"
            >
              <p>{skills[currentSkillIndex]}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="descriptions-container">
        {literals.map(literal => 
          literal.type === 'description' && (
            <div className="description-block" key={`description-${literal.id}`}>
              <motion.div
                initial={{ y: 30 }}
                animate={{ y: [30, -10, 30] }}
                transition={bounceTransition}
                className="chart-container"
              >
                <div className="donut"></div>
              </motion.div>
              <Fade key={`text-${literal.id}`} direction="right" duration={1000} triggerOnce>
                <p className='description'>{formatText(literal.text)}</p>
              </Fade>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
