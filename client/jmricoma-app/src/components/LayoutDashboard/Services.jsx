import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleSubtitleModule from "../modulesDashboard/TitleSubtitleModule";

function Services() {
  const sectionId = "2";
  const [idiomas, setIdiomas] = useState(null);

  useEffect(() => {
    axios
      .get(`http://jmricoma/api/languages`, { withCredentials: true })
      .then((response) => {
        const codigos = response.data.languages.map((lang) => lang.code);
        setIdiomas(codigos);
      })
      .catch((error) => {
        console.error("Error al cargar los idiomas:", error);
      });
  }, []);

  return (
    <div className="bg-gray-100 flex flex-col items-center">
      <div className="my-8 w-full max-w-2xl px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Servicios</h2>
        {idiomas ? (
          <TitleSubtitleModule sectionId={sectionId} idiomas={idiomas} fields={["subtitle"]} />
        ) : (
          <p>Cargando idiomas...</p> 
        )}
      </div>
    </div>
  );
}

export default Services;
