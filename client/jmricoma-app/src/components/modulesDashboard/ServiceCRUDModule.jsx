import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../../services/serviceService";
import { getLanguages } from "../../services/languageService";
import { PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

Modal.setAppElement("#root");

const Tabs = ({ languages, currentTab, setCurrentTab }) => (
  <div className="flex mb-4">
    {languages.map(lang => (
      <button
        key={lang.id}
        onClick={() => setCurrentTab(lang.id)}
        className={`py-2 px-4 rounded-t-lg ${currentTab === lang.id ? 'bg-gray-300' : 'bg-gray-100'}`}
      >
        {lang.name}
      </button>
    ))}
  </div>
);

function ServiceCRUDModule() {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    id_lang: 1,
    status: 1,
  });
  const [editingServices, setEditingServices] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [serviceToManageImage, setServiceToManageImage] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadServices();
    loadLanguages();
  }, []);

  const loadServices = async () => {
    const data = await getServices();
    
    const servicesWithImage = await Promise.all(data.map(async (service) => {
      try {
        const response = await fetch(`http://jmricoma/api/check-image/${service.id}`);
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
    }));

    setServices(servicesWithImage);
    console.log("All services loaded:", servicesWithImage);
  };

  const loadLanguages = async () => {
    const langs = await getLanguages();
    const defaultLang = langs.find(lang => Number(lang.id) === 1);
    const filteredLangs = langs.filter(lang => Number(lang.id) !== 1);
    setLanguages(filteredLangs);
    setDefaultLanguage(defaultLang);
    setCurrentTab(defaultLang ? defaultLang.id : 1);
    console.log("Languages loaded (excluding default):", filteredLangs);
  };

  const handleCreateService = async () => {
    try {
      const createdService = await createService(newService);
      if (createdService) {
        const newServices = [...services, createdService];
        const serviceCreationPromises = languages.map(lang => {
          const serviceInOtherLang = {
            ...newService,
            id_lang: lang.id,
            main_service_id: createdService.id,
          };
          return createService(serviceInOtherLang);
        });

        const createdServicesInLang = await Promise.all(serviceCreationPromises);
        createdServicesInLang.forEach(service => {
          if (service) {
            newServices.push(service);
          }
        });

        setServices(newServices);
        setNewService({ title: "", description: "", id_lang: 1, status: 1 });
        setIsCreateModalOpen(false);
        console.log("Service created:", createdService);
        await loadServices();
      }
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  const handleUpdateService = async () => {
    try {
      const updatedServices = services.map(service =>
        editingServices.find(edited => edited.id === service.id) || service
      );
      setServices(updatedServices);

      await Promise.all(
        editingServices.map(async (service) => {
          await updateService(service.id, service);
        })
      );

      console.log("Services updated:", editingServices);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating services:", error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const success = await deleteService(id);
      if (success) {
        const relatedServices = services.filter(service => service.main_service_id === id);

        await Promise.all(relatedServices.map(async (service) => {
          await deleteService(service.id);
        }));

        setServices(services.filter(service => service.id !== id && service.main_service_id !== id));
        console.log("Service and related services deleted:", id, relatedServices.map(s => s.id));
        await loadServices();
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleToggleStatus = async (service) => {
    try {
      console.log("Toggling status for:", service);
      const newStatus = parseInt(service.status) === 1 ? 0 : 1;

      const updatedServices = services.map((s) =>
        s.id === service.id || s.main_service_id === service.id
          ? { ...s, status: newStatus }
          : s
      );
      setServices(updatedServices);

      const updatedService = await updateService(service.id, {
        ...service,
        status: newStatus,
      });

      if (updatedService) {
        const relatedServices = services.filter(s => s.main_service_id === service.id);
        await Promise.all(
          relatedServices.map(async (s) => {
            await updateService(s.id, {
              ...s,
              status: newStatus,
            });
          })
        );

        console.log("Status toggled:", updatedService);
      } else {
        const revertedServices = services.map((s) =>
          s.id === service.id || s.main_service_id === service.id
            ? { ...s, status: parseInt(service.status) === 1 ? 0 : 1 }
            : s
        );
        setServices(revertedServices);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      const revertedServices = services.map((s) =>
        s.id === service.id || s.main_service_id === service.id
          ? { ...s, status: parseInt(service.status) === 1 ? 0 : 1 }
          : s
      );
      setServices(revertedServices);
    }
  };

  const openEditModal = async (service) => {
    const relatedServices = services.filter(s => 
      s.id === service.id || 
      s.main_service_id === service.id || 
      s.id === service.main_service_id
    );

    if (service.main_service_id) {
      const mainService = services.find(s => s.id === service.main_service_id);
      if (mainService && !relatedServices.includes(mainService)) {
        relatedServices.push(mainService);
      }
    }

    console.log('Related services:', relatedServices);
    setEditingServices(relatedServices);
    setCurrentTab(service.id_lang);
    setIsEditModalOpen(true);
  };

  const openConfirmModal = (service) => {
    setServiceToDelete(service);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteService = async () => {
    if (serviceToDelete) {
      await handleDeleteService(serviceToDelete.id);
      setIsConfirmModalOpen(false);
      setServiceToDelete(null);
    }
  };

  const openImageModal = (service) => {
    setServiceToManageImage(service);
    setImage(null);  // Reset image state when opening the modal
    setIsImageModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageSave = async () => {
    if (image && serviceToManageImage) {
      try {
        const formData = new FormData();
        const newFilename = `service_${serviceToManageImage.id}.${image.name.split('.').pop()}`;
        formData.append("file", image);
        formData.append("newFilename", newFilename);

        const response = await fetch('http://jmricoma/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error uploading image');
        }

        // After successful upload, simulate image path assignment
        const uploadedImageURL = URL.createObjectURL(image);
        serviceToManageImage.image = uploadedImageURL;  // This should be the URL returned by your backend after upload
        await loadServices();
        setIsImageModalOpen(false);
        setImage(null);
        setServiceToManageImage(null);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleImageDelete = async () => {
    if (serviceToManageImage) {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`http://jmricoma/api/delete-image/service_${serviceToManageImage.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

        if (!response.ok) {
          throw new Error('Error deleting image');
        }

        serviceToManageImage.image = null;
        await loadServices();
        setIsImageModalOpen(false);
        setServiceToManageImage(null);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Listado</h2>
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4 flex items-center"
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Crear Nuevo Servicio
      </button>
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Lista de Servicios</h4>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="flex w-full">
              <th className="flex-1 py-2 px-4 border-b-2 border-gray-300 text-left leading-4 text-gray-700 tracking-wider">Título</th>
              <th className="w-1/5 py-2 px-4 border-b-2 border-gray-300 text-left leading-4 text-gray-700 tracking-wider">Imagen</th>
              <th className="w-1/5 py-2 px-4 border-b-2 border-gray-300 text-right leading-4 text-gray-700 tracking-wider">Estado</th>
              <th className="w-1/4 py-2 px-4 border-b-2 border-gray-300 text-right leading-4 text-gray-700 tracking-wider">Opciones</th>
            </tr>
          </thead>
          <tbody className="flex flex-col w-full">
            {services.filter(service => service.main_service_id === null).map((service) => (
              <tr key={service.id} className="flex w-full">
                <td className="flex-1 py-2 px-4 border-b border-gray-200">
                  <div>
                    <strong className="block text-left">{service.title}</strong>
                  </div>
                </td>
                <td className="w-1/5 py-2 px-4 border-b border-gray-200 text-left">
                  {service.image ? (
                    <button onClick={() => openImageModal(service)} className="bg-gray-200 py-2 px-4 rounded-md flex items-center">
                      <PhotoIcon className="h-5 w-5 mr-2 text-green-500" />
                    </button>
                  ) : (
                    <button onClick={() => openImageModal(service)} className="bg-gray-200 py-2 px-4 rounded-md flex items-right">
                      <PhotoIcon className="h-5 w-5 mr-2" />
                    </button>
                  )}
                </td>
                <td className="w-1/5 py-2 px-4 border-b border-gray-200 text-right">
                  <button
                    onClick={() => handleToggleStatus(service)}
                    className={`py-1 px-2 rounded-md ${parseInt(service.status) === 1 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {parseInt(service.status) === 1 ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="w-1/4 py-2 px-4 border-b border-gray-200 text-right">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(service)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openConfirmModal(service)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        className="bg-white p-6 rounded-md shadow-lg w-2/4 mx-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      >
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Crear Servicio</h4>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Título"
            value={newService.title}
            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Descripción"
            value={newService.description}
            onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          ></textarea>
          <div className="flex space-x-2">
            <button onClick={handleCreateService} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Crear</button>
            <button onClick={() => setIsCreateModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">Cancelar</button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        className="bg-white p-6 rounded-md shadow-lg w-2/4 mx-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      >
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Editar Servicio</h4>
        {editingServices.length > 0 && (
          <>
            {defaultLanguage && (
              <Tabs
                languages={[defaultLanguage, ...languages]}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}
            {editingServices.filter(service => service.id_lang === currentTab).map(service => (
              <div key={service.id} className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={service.title}
                  onChange={(e) => {
                    const updatedServices = editingServices.map(s =>
                      s.id === service.id ? { ...s, title: e.target.value } : s
                    );
                    setEditingServices(updatedServices);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Descripción"
                  value={service.description}
                  onChange={(e) => {
                    const updatedServices = editingServices.map(s =>
                      s.id === service.id ? { ...s, description: e.target.value } : s
                    );
                    setEditingServices(updatedServices);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            ))}
            <div className="flex space-x-2 mt-4">
              <button onClick={handleUpdateService} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Actualizar</button>
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">Cancelar</button>
            </div>
          </>
        )}
      </Modal>
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={() => setIsConfirmModalOpen(false)}
        className="bg-white p-6 rounded-md shadow-lg w-1/3 mx-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      >
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Confirmar Eliminación</h4>
        <p>¿Estás seguro de que quieres eliminar este servicio?</p>
        <div className="flex space-x-2 mt-4">
          <button onClick={confirmDeleteService} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Eliminar</button>
          <button onClick={() => setIsConfirmModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">Cancelar</button>
        </div>
      </Modal>
      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={() => setIsImageModalOpen(false)}
        className="bg-white p-6 rounded-md shadow-lg w-1/3 mx-auto"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center"
      >
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Gestionar Imagen</h4>
        {serviceToManageImage && (
          <>
            {console.log('serviceToManageImage:', serviceToManageImage)}
            {console.log('serviceToManageImage.image:', serviceToManageImage.image)}
            {serviceToManageImage.image ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <img src={serviceToManageImage.image} alt={serviceToManageImage.title} className="h-32 w-32 object-cover mb-2" />
                  <button onClick={handleImageDelete} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 flex items-center">
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Eliminar Imagen
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2">
                  <button onClick={handleImageSave} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Guardar Imagen
                  </button>
                  <button onClick={() => setIsImageModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">Cancelar</button>
                </div>
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}

export default ServiceCRUDModule;
