import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TitleSubtitleModule from '../modulesDashboard/TitleSubtitleModule';
import ImageUploaderModule from '../modulesDashboard/ImageUploaderModule';

function Home() {
  const sectionId = "1";
  const [idiomas, setIdiomas] = useState(null); // Inicializa como null para verificar fácilmente si está cargado

  useEffect(() => {
    axios.get(`http://jmricoma/api/languages`, { withCredentials: true })
      .then(response => {
        // Asegúrate de que la ruta de acceso a 'languages' sea correcta según tu estructura de respuesta
        const codigos = response.data.languages.map(lang => lang.code);
        setIdiomas(codigos);
      })
      .catch(error => {
        console.error('Error al cargar los idiomas:', error);
      });
  }, []);

  return (
    <div className="bg-gray-100 flex flex-col items-center">
      <div className="my-8 w-full max-w-2xl px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Home Page</h2>
        {idiomas ? (
          <TitleSubtitleModule sectionId={sectionId} idiomas={idiomas} />
        ) : (
          <p>Cargando idiomas...</p> 
        )}
        <ImageUploaderModule
          onFileUploaded={(files) => { console.log(files); }}
          maxFiles={1} 
          maxSize={1024 * 1024 * 2} // 2MB máximo por archivo
          sectionId={1}
          type={"header"}
        />
      </div>
    </div>
  );
}

export default Home;
