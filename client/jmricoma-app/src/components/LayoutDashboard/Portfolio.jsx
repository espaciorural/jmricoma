import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleSubtitleModule from "../modulesDashboard/TitleSubtitleModule";
import CrudModule from "../modulesDashboard/CrudModule";

function Portfolio() {
  const sectionId = "3";
  const [idiomas, setIdiomas] = useState(null);
  const RESOURCE = 'portfolio';
  const MAIN_RESOURCE_ID_FIELD = `main_portfolio_id`;

  useEffect(() => {
    axios
      .get(`/api/languages`, { withCredentials: true })
      .then((response) => {
        setIdiomas(response.data.languages);
      })
      .catch((error) => {
        console.error("Error al cargar los idiomas:", error);
      });
  }, []);

  return (
    <div className="bg-gray-100 flex flex-col items-center">
      <div className="my-8 w-full max-w-2xl px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Portfolio</h2>
        {idiomas ? (
          <TitleSubtitleModule sectionId={sectionId} idiomas={idiomas.map(lang => lang.code)} fields={["subtitle","description"]} />
        ) : (
          <p>Cargando idiomas...</p> 
        )}
      </div>
      <div className="my-8 w-full max-w-2xl px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">
        {idiomas ? (
          <CrudModule 
            resource={RESOURCE}
            mainResourceIdField={MAIN_RESOURCE_ID_FIELD}
          />
        ) : (
          <p>Cargando listado...</p>
        )}
      </div>
    </div>
  );
}

export default Portfolio;
