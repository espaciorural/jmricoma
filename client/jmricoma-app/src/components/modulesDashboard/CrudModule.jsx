import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import {
  getItems,
  createItem,
  updateItem,
  deleteItem,
} from "../../services/crudService";
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

function CrudModule({ resource, mainResourceIdField }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    id_lang: 1,
    status: 1,
  });
  const [editingItems, setEditingItems] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [currentTab, setCurrentTab] = useState(1);
  const [defaultLanguage, setDefaultLanguage] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [itemToManageImage, setItemToManageImage] = useState(null);
  const [image, setImage] = useState(null);

  const loadItems = useCallback(async () => {
    const data = await getItems(resource);
    
    const itemsWithImage = await Promise.all(data.map(async (item) => {
      try {
        const response = await fetch(`http://jmricoma/api/check-image/${resource}/${item.id}`);
        const result = await response.json();
        return {
          ...item,
          image: result.exists ? result.url : null,
        };
      } catch (error) {
        console.error(`Error checking image for item ID ${item.id}:`, error);
        return {
          ...item,
          image: null,
        };
      }
    }));

    setItems(itemsWithImage);
    console.log("All items loaded:", itemsWithImage);
  }, [resource]);

  const loadLanguages = useCallback(async () => {
    const langs = await getLanguages();
    const defaultLang = langs.find(lang => Number(lang.id) === 1);
    const filteredLangs = langs.filter(lang => Number(lang.id) !== 1);
    setLanguages(filteredLangs);
    setDefaultLanguage(defaultLang);
    setCurrentTab(defaultLang ? defaultLang.id : 1);
    console.log("Languages loaded (excluding default):", filteredLangs);
  }, []);

  useEffect(() => {
    loadItems();
    loadLanguages();
  }, [loadItems, loadLanguages]);

  const handleCreateItem = async () => {
    try {
      const createdItem = await createItem(resource, newItem);
      if (createdItem) {
        const newItems = [...items, createdItem];
        const itemCreationPromises = languages.map(lang => {
          const itemInOtherLang = {
            ...newItem,
            id_lang: lang.id,
            [mainResourceIdField]: createdItem.id,
          };
          return createItem(resource, itemInOtherLang);
        });

        const createdItemsInLang = await Promise.all(itemCreationPromises);
        createdItemsInLang.forEach(item => {
          if (item) {
            newItems.push(item);
          }
        });

        setItems(newItems);
        setNewItem({ title: "", description: "", id_lang: 1, status: 1 });
        setIsCreateModalOpen(false);
        console.log("Item created:", createdItem);
        await loadItems();
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleUpdateItem = async () => {
    try {
      const updatedItems = items.map(item =>
        editingItems.find(edited => edited.id === item.id) || item
      );
      setItems(updatedItems);

      await Promise.all(
        editingItems.map(async (item) => {
          await updateItem(resource, item.id, item);
        })
      );

      console.log("Items updated:", editingItems);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating items:", error);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      const relatedItems = items.filter(item => item[mainResourceIdField] === id);
      const success = await deleteItem(resource, id);
      if (success) {

        await Promise.all(relatedItems.map(async (item) => {
          await deleteItem(resource, item.id);
        }));

        setItems(items.filter(item => item.id !== id && item[mainResourceIdField] !== id));
        console.log("Item and related items deleted:", id, relatedItems.map(s => s.id));
        await loadItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleToggleStatus = async (item) => {
    try {
      console.log("Toggling status for:", item);
      const newStatus = parseInt(item.status) === 1 ? 0 : 1;

      const updatedItems = items.map((s) =>
        s.id === item.id || s[mainResourceIdField] === item.id
          ? { ...s, status: newStatus }
          : s
      );
      setItems(updatedItems);

      const updatedItem = await updateItem(resource, item.id, {
        ...item,
        status: newStatus,
      });

      if (updatedItem) {
        const relatedItems = items.filter(s => s[mainResourceIdField] === item.id);
        await Promise.all(
          relatedItems.map(async (s) => {
            await updateItem(resource, s.id, {
              ...s,
              status: newStatus,
            });
          })
        );

        console.log("Status toggled:", updatedItem);
      } else {
        const revertedItems = items.map((s) =>
          s.id === item.id || s[mainResourceIdField] === item.id
            ? { ...s, status: parseInt(item.status) === 1 ? 0 : 1 }
            : s
        );
        setItems(revertedItems);
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      const revertedItems = items.map((s) =>
        s.id === item.id || s[mainResourceIdField] === item.id
          ? { ...s, status: parseInt(item.status) === 1 ? 0 : 1 }
          : s
      );
      setItems(revertedItems);
    }
  };

  const openEditModal = async (item) => {
    const relatedItems = items.filter(s => 
      s.id === item.id || 
      s[mainResourceIdField] === item.id || 
      s.id === item[mainResourceIdField]
    );

    if (item[mainResourceIdField]) {
      const mainItem = items.find(s => s.id === item[mainResourceIdField]);
      if (mainItem && !relatedItems.includes(mainItem)) {
        relatedItems.push(mainItem);
      }
    }

    console.log('Related items:', relatedItems);
    setEditingItems(relatedItems);
    setCurrentTab(item.id_lang);
    setIsEditModalOpen(true);
  };

  const openConfirmModal = (item) => {
    setItemToDelete(item);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteItem = async () => {
    if (itemToDelete) {
      await handleDeleteItem(itemToDelete.id);
      setIsConfirmModalOpen(false);
      setItemToDelete(null);
    }
  };

  const openImageModal = (item) => {
    setItemToManageImage(item);
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

    if (image && itemToManageImage) {
      try {
        const formData = new FormData();
        const newFilename = `${resource}_${itemToManageImage.id}.${image.name.split('.').pop()}`;
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
        itemToManageImage.image = uploadedImageURL;  // This should be the URL returned by your backend after upload
        await loadItems();
        setIsImageModalOpen(false);
        setImage(null);
        setItemToManageImage(null);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleImageDelete = async () => {
    if (itemToManageImage) {
        const token = localStorage.getItem('token');
        try {
          const response = await fetch(`http://jmricoma/api/delete-image/${resource}_${itemToManageImage.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

        if (!response.ok) {
          throw new Error('Error deleting image');
        }

        itemToManageImage.image = null;
        await loadItems();
        setIsImageModalOpen(false);
        setItemToManageImage(null);
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
        Crear Nuevo Item
      </button>
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Lista de Items</h4>
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
            {items.filter(item => item[mainResourceIdField] === null).map((item) => (
              <tr key={item.id} className="flex w-full">
                <td className="flex-1 py-2 px-4 border-b border-gray-200">
                  <div>
                    <strong className="block text-left">{item.title}</strong>
                  </div>
                </td>
                <td className="w-1/5 py-2 px-4 border-b border-gray-200 text-left">
                  {item.image ? (
                    <button onClick={() => openImageModal(item)} className="bg-gray-200 py-2 px-4 rounded-md flex items-center">
                      <PhotoIcon className="h-5 w-5 mr-2 text-green-500" />
                    </button>
                  ) : (
                    <button onClick={() => openImageModal(item)} className="bg-gray-200 py-2 px-4 rounded-md flex items-right">
                      <PhotoIcon className="h-5 w-5 mr-2" />
                    </button>
                  )}
                </td>
                <td className="w-1/5 py-2 px-4 border-b border-gray-200 text-right">
                  <button
                    onClick={() => handleToggleStatus(item)}
                    className={`py-1 px-2 rounded-md ${parseInt(item.status) === 1 ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                  >
                    {parseInt(item.status) === 1 ? "Activo" : "Inactivo"}
                  </button>
                </td>
                <td className="w-1/4 py-2 px-4 border-b border-gray-200 text-right">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openConfirmModal(item)}
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
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Crear Item</h4>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Título"
            value={newItem.title}
            onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Descripción"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            className="p-2 border border-gray-300 rounded-md"
          ></textarea>
          <div className="flex space-x-2">
            <button onClick={handleCreateItem} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Crear</button>
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
        <h4 className="text-xl font-semibold text-gray-700 mb-4">Editar Item</h4>
        {editingItems.length > 0 && (
          <>
            {defaultLanguage && (
              <Tabs
                languages={[defaultLanguage, ...languages]}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}
            {editingItems.filter(item => item.id_lang === currentTab).map(item => (
              <div key={item.id} className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={item.title}
                  onChange={(e) => {
                    const updatedItems = editingItems.map(s =>
                      s.id === item.id ? { ...s, title: e.target.value } : s
                    );
                    setEditingItems(updatedItems);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Descripción"
                  value={item.description}
                  onChange={(e) => {
                    const updatedItems = editingItems.map(s =>
                      s.id === item.id ? { ...s, description: e.target.value } : s
                    );
                    setEditingItems(updatedItems);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
            ))}
            <div className="flex space-x-2 mt-4">
              <button onClick={handleUpdateItem} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600">Actualizar</button>
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
        <p>¿Estás seguro de que quieres eliminar este item?</p>
        <div className="flex space-x-2 mt-4">
          <button onClick={confirmDeleteItem} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600">Eliminar</button>
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
        {itemToManageImage && (
          <>
          {console.log("itemToManageImage", itemToManageImage)}
            {itemToManageImage.image ? (
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-4">
                  <img src={itemToManageImage.image} alt={itemToManageImage.title} className="h-32 w-32 object-cover mb-2" />
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

export default CrudModule;
