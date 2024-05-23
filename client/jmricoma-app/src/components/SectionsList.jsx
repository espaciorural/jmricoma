import React, { useEffect, useState } from 'react';
import getSections from '../services/sectionService';

const SectionsList = ({ id_lang }) => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const fetchsections = async () => {
      const sectionsData = await getSections(id_lang);
      setSections(sectionsData);
    };

    fetchSections();
  }, [id_lang]);

  return (
    <div>
      <h1>Secciones</h1>
      <ul>
        {sections.map(section => (
          <li key={section.id}>{section.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default sectionsList;
