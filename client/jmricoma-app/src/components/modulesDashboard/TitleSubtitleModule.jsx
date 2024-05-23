import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

function LanguageInputs({
  titulo,
  subtitulo,
  descripcion,
  idTitulo,
  idSubtitulo,
  idDescripcion,
  language,
  updateTitulo,
  updateSubtitulo,
  updateDescripcion,
  fields,
}) {
  return (
    <>
      {fields.includes("title") && (
        <div className="mb-4">
          <label
            htmlFor={`titulo-${language}`}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Título ({language}):
          </label>
          <input
            id={`titulo-${language}`}
            type="text"
            value={titulo}
            data-id={idTitulo}
            onChange={(e) => updateTitulo(language, e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}
      {fields.includes("subtitle") && (
        <div className="mb-4">
          <label
            htmlFor={`subtitulo-${language}`}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Subtítulo ({language}):
          </label>
          <input
            id={`subtitulo-${language}`}
            type="text"
            value={subtitulo}
            data-id={idSubtitulo}
            onChange={(e) => updateSubtitulo(language, e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}
      {fields.includes("description") && (
        <div className="mb-4">
          <label
            htmlFor={`descripcion-${language}`}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Descripción ({language}):
          </label>
          <textarea
            id={`descripcion-${language}`}
            value={descripcion}
            data-id={idDescripcion}
            onChange={(e) => updateDescripcion(language, e.target.value)}
            className="h-32 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      )}
    </>
  );
}

function TitleSubtitleModule({ sectionId, idiomas, fields = ["title", "subtitle", "description"] }) {
  const [titulos, setTitulos] = useState([]);
  const [subtitulos, setSubtitulos] = useState([]);
  const [descripciones, setDescripciones] = useState([]);
  const [idTitulos, setIdTitulos] = useState([]);
  const [idSubtitulos, setIdSubtitulos] = useState([]);
  const [idDescripciones, setIdDescripciones] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  const [activeTab, setActiveTab] = useState(idiomas[0]);

  useEffect(() => {
    const initStates = (idiomasList) => {
      const titulosInit = idiomasList.map((lang) => ({ lang, text: "" }));
      const subtitulosInit = idiomasList.map((lang) => ({ lang, text: "" }));
      const descripcionesInit = idiomasList.map((lang) => ({ lang, text: "" }));
      const idTitulosInit = idiomasList.map((lang) => ({ lang, id: "" }));
      const idSubtitulosInit = idiomasList.map((lang) => ({ lang, id: "" }));
      const idDescripcionesInit = idiomasList.map((lang) => ({ lang, id: "" }));

      setTitulos(titulosInit);
      setSubtitulos(subtitulosInit);
      setDescripciones(descripcionesInit);
      setIdTitulos(idTitulosInit);
      setIdSubtitulos(idSubtitulosInit);
      setIdDescripciones(idDescripcionesInit);
    };

    if (idiomas && idiomas.length > 0) {
      initStates(idiomas);
    }

    axios
      .get(`http://jmricoma/api/literal/section/${sectionId}`, {
        withCredentials: true,
      })
      .then((response) => {
        const literales = response.data;
        literales.forEach((literal) => {
          const { id, lang, type, text } = literal;
          if (type === "title") {
            setTitulos((prev) =>
              prev.map((item) =>
                item.lang === lang ? { ...item, text } : item
              )
            );
            setIdTitulos((prev) =>
              prev.map((item) => (item.lang === lang ? { ...item, id } : item))
            );
          } else if (type === "subtitle") {
            setSubtitulos((prev) =>
              prev.map((item) =>
                item.lang === lang ? { ...item, text } : item
              )
            );
            setIdSubtitulos((prev) =>
              prev.map((item) => (item.lang === lang ? { ...item, id } : item))
            );
          } else if (type === "description") {
            setDescripciones((prev) =>
              prev.map((item) =>
                item.lang === lang ? { ...item, text } : item
              )
            );
            setIdDescripciones((prev) =>
              prev.map((item) => (item.lang === lang ? { ...item, id } : item))
            );
          }
        });
      })
      .catch((error) => {
        console.error("Hubo un error al obtener los literales:", error);
      });
  }, [sectionId, idiomas]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const apiUrl = `http://jmricoma/api/literal/update/section/${sectionId}`;
    const dataToSend = [];
  
    idiomas.forEach((lang) => {
      if (fields.includes("title")) {
        const titulo = titulos.find((t) => t.lang === lang);
        const idTitulo = idTitulos.find((t) => t.lang === lang);
        if (titulo && idTitulo) {
          dataToSend.push({
            lang: lang,
            id_section: sectionId,
            type: "title",
            text: titulo.text,
            id: idTitulo.id,
          });
        }
      }
  
      if (fields.includes("subtitle")) {
        const subtitulo = subtitulos.find((s) => s.lang === lang);
        const idSubtitulo = idSubtitulos.find((s) => s.lang === lang);
        if (subtitulo && idSubtitulo) {
          dataToSend.push({
            lang: lang,
            id_section: sectionId,
            type: "subtitle",
            text: subtitulo.text,
            id: idSubtitulo.id,
          });
        }
      }
  
      if (fields.includes("description")) {
        const descripcion = descripciones.find((d) => d.lang === lang);
        const idDescripcion = idDescripciones.find((d) => d.lang === lang);
        if (descripcion && idDescripcion) {
          dataToSend.push({
            lang: lang,
            id_section: sectionId,
            type: "description",
            text: descripcion.text,
            id: idDescripcion.id,
          });
        }
      }
    });
  
    dataToSend.forEach((data, index, array) => {
      axios
        .put(apiUrl, data, { withCredentials: true })
        .then((response) => {
          console.log("Registro guardado con éxito:", response.data);
          const item = response.data.data;
          if (item.action === "created" || item.action === "updated") {
            const updateState = (stateUpdater, item) => {
              stateUpdater((prevState) => {
                const newState = [...prevState];
                const foundIndex = newState.findIndex(
                  (s) => s.lang === item.lang && s.type === item.type
                );
                if (foundIndex !== -1) {
                  newState[foundIndex] = {
                    ...newState[foundIndex],
                    id: item.id,
                    text: item.text,
                  };
                } else {
                  newState.push({
                    lang: item.lang,
                    type: item.type,
                    id: item.id,
                    text: item.text,
                  });
                }
                return newState;
              });
            };
  
            if (item.type === "title") {
              updateState(setTitulos, item);
              updateState(setIdTitulos, item);
            } else if (item.type === "subtitle") {
              updateState(setSubtitulos, item);
              updateState(setIdSubtitulos, item);
            } else if (item.type === "description") {
              updateState(setDescripciones, item);
              updateState(setIdDescripciones, item);
            }
          }
  
          if (index === array.length - 1) {
            setMensajeExito("Todos los cambios han sido guardados exitosamente.");
            setTimeout(() => {
              setMensajeExito("");
            }, 3000);
          }
        })
        .catch((error) => {
          console.error("Error al guardar el registro:", error);
        });
    });
  };
  

  const updateTitulo = useCallback((lang, newText) => {
    setTitulos((prevTitulos) => {
      return prevTitulos.map((titulo) => {
        if (titulo.lang === lang) {
          return { ...titulo, text: newText };
        }
        return titulo;
      });
    });
  }, []);

  const updateSubtitulo = useCallback((lang, newText) => {
    setSubtitulos((prevSubtitulos) => {
      return prevSubtitulos.map((subtitulo) => {
        if (subtitulo.lang === lang) {
          return { ...subtitulo, text: newText };
        }
        return subtitulo;
      });
    });
  }, []);

  const updateDescripcion = useCallback((lang, newText) => {
    setDescripciones((prevDescripciones) => {
      return prevDescripciones.map((descripcion) => {
        if (descripcion.lang === lang) {
          return { ...descripcion, text: newText };
        }
        return descripcion;
      });
    });
  }, []);

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
      >
        <div className="flex justify-center mb-4">
          {idiomas.map((idioma) => (
            <button
              key={idioma}
              type="button"
              onClick={() => setActiveTab(idioma)}
              className={`px-4 py-2 ${
                activeTab === idioma ? "text-blue-500 font-bold" : "text-gray-500"
              }`}
            >
              {idioma}
            </button>
          ))}
        </div>

        {idiomas.includes(activeTab) && (
          <LanguageInputs
            titulo={titulos.find((t) => t.lang === activeTab)?.text || ""}
            subtitulo={subtitulos.find((s) => s.lang === activeTab)?.text || ""}
            descripcion={descripciones.find((d) => d.lang === activeTab)?.text || ""}
            idTitulo={idTitulos.find((t) => t.lang === activeTab)?.id || ""}
            idSubtitulo={idSubtitulos.find((s) => s.lang === activeTab)?.id || ""}
            idDescripcion={idDescripciones.find((d) => d.lang === activeTab)?.id || ""}
            language={activeTab}
            updateTitulo={updateTitulo}
            updateSubtitulo={updateSubtitulo}
            updateDescripcion={updateDescripcion}
            fields={fields}
          />
        )}

        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar Cambios
          </button>
        </div>
        {mensajeExito && (
          <div className="text-green-500 text-center mt-3">{mensajeExito}</div>
        )}
      </form>
    </div>
  );
}

export default TitleSubtitleModule;