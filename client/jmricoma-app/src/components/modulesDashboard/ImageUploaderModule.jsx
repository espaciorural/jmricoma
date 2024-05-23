import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

function ImageUploaderModule({
  onFileUploaded,
  maxFiles,
  maxSize,
  sectionId,
  type,
}) {
  const [thumbnails, setThumbnails] = useState([]);
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios
      .get(`http://jmricoma/api/get-images?sectionId=${sectionId}&type=${type}`)
      .then((response) => {
        if (response.data && response.data.images) {
          setImages(response.data.images); // Actualiza el estado con las imágenes obtenidas
        }
      })
      .catch((error) => {
        console.error("Error al obtener las imágenes:", error);
      });
  }, [sectionId, type]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop: (acceptedFiles) => {
        const filteredFiles = acceptedFiles.filter(
          (file) => file.type === "image/jpeg" || file.type === "image/png"
        );

        const filesWithPreviews = filteredFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );

        setThumbnails(filesWithPreviews); // Almacena las miniaturas en el estado

        // Sube el primer archivo si `maxFiles` es 1, de lo contrario, ajusta para subir múltiples archivos
        if (maxFiles === 1) {
          const file = acceptedFiles[0]; // Asume que solo subes un archivo
          const formData = new FormData();
          formData.append("file", file); // "file" es la clave esperada por tu API
          formData.append("id_section", sectionId); // Añade section_id al FormData
          formData.append("type", type);

          fetch(`http://jmricoma/api/upload-image`, {
            method: "POST",
            body: formData,
            // Añade cualquier encabezado adicional aquí, si es necesario
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              if (data && data.status === "success") {
                // Considera solicitar nuevamente la lista de imágenes para actualizar el estado
                axios
                  .get(
                    `http://jmricoma/api/get-images?sectionId=${sectionId}&type=${type}`, { withCredentials: true }
                  )
                  .then((response) => {
                    if (response.data && response.data.images) {
                      setImages(response.data.images); // Actualiza con las imágenes recién obtenidas
                    }
                  })
                  .catch((error) => {
                    console.error(
                      "Error al obtener las imágenes después de la carga:",
                      error
                    );
                  });
              }
            })
            .catch((error) => {
              console.error("Error al subir el archivo:", error);
              // Aquí puedes manejar el error, por ejemplo, mostrar un mensaje de error
            });
        }
      },
      maxFiles,
      maxSize,
    });

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

const handleDelete = async (imageId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://jmricoma/api/delete-image/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log('Imagen eliminada:', data);
    setImages(images.filter(image => image.id !== imageId));
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
  }
};

  

  const ImageModal = ({ isOpen, imageSrc, onClose }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={onClose}>
        {/* Envoltorio del modal para manejar el clic fuera y cerrar el modal */}
        <div className="bg-white p-2 rounded-lg relative" onClick={e => e.stopPropagation()}>
          {/* Añadido relative aquí para posicionar correctamente el botón de cerrar respecto a este contenedor */}
          <img src={imageSrc} alt="Ampliada" className="max-w-full max-h-full" />
          <button 
            onClick={onClose} 
            className="absolute top-0 right-0 m-4 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-700 transition-colors duration-150"
            aria-label="Cerrar"
          >
            <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState("");

  const handleImageClick = (src) => {
    setSelectedImageSrc(src);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  

  useEffect(() => {
    // Cuando el componente se desmonta, libera los objetos URL
    return () =>
      thumbnails.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [thumbnails]);

  const showUploadOption = images.length < maxFiles;

  console.log(images)

  return (
    <div className="flex justify-center mt-8">
      {showUploadOption && (
        <div
          {...getRootProps()}
          className={`dropzone w-full max-w-xl px-6 py-16 border-2 border-dashed rounded-md cursor-pointer ${
            isDragActive
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 bg-gray-50 hover:border-gray-500"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 16V4a2 2 0 012-2h12a2 2 0 012 2v12M4 16l7-7 4 4 5-5M4 16v6m0-6h16m-6 6v-6m6 6h-6"></path>
            </svg>
            <p className="mt-1">
              Arrastra y suelta algunas imágenes aquí, o haz clic para
              seleccionar imágenes
            </p>
            {isDragActive ? (
              <p className="mt-2 text-blue-500">
                Suelta para subir las imágenes
              </p>
            ) : (
              <p className="mt-2 text-gray-400">
                Soporta archivos de imagen hasta {maxSize / 1024 / 1024}MB
              </p>
            )}
          </div>
          <aside className="w-full max-w-xl mt-4 flex flex-wrap justify-center gap-2">
            {thumbnails.map((file) => (
              <div key={file.name} className="w-24 h-24">
                <img
                  src={file.preview}
                  className="w-full h-full object-cover rounded-md"
                  alt="preview"
                />
              </div>
            ))}
          </aside>
          {fileRejections.length > 0 && (
            <div className="text-red-500 mt-2">
              <p>Errores de archivo:</p>
              <ul>{fileRejectionItems}</ul>
            </div>
          )}
        </div>
      )}
      <div className="images-container flex flex-wrap justify-center gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group w-24 h-24">
            <img
              src={image.path}
              alt={`Imagen ${index}`}
              className="w-full h-full object-cover rounded-md cursor-pointer"
              onClick={() => handleImageClick(image.path)}
            />

            <button
              onClick={() => handleDelete(image.id)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-700 transition duration-150"
              aria-label="Eliminar imagen"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <ImageModal isOpen={isModalOpen} imageSrc={selectedImageSrc} onClose={handleCloseModal} />
    </div>
  );
}

export default ImageUploaderModule;
