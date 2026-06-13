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
        onClick={() => setCurrentTab(Number(lang.id))}
        className={`py-2 px-4 rounded-t-lg ${Number(currentTab) === Number(lang.id) ? 'bg-gray-300' : 'bg-gray-100'}`}
      >
        {lang.name}
      </button>
    ))}
  </div>
);

function CrudModule({ resource, mainResourceIdField }) {
  const isPortfolio = resource === "portfolio";
  const isSortableResource = ["portfolio", "services"].includes(resource);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    project_url: "",
    skills: "",
    item: 0,
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
  const [draggedItemId, setDraggedItemId] = useState(null);

  const allLanguages = defaultLanguage ? [defaultLanguage, ...languages] : languages;

  const getRootItemId = useCallback((item) => item[mainResourceIdField] || item.id, [mainResourceIdField]);

  const createEmptyTranslation = (rootItem, languageId) => ({
    title: "",
    description: "",
    id_lang: Number(languageId),
    status: rootItem.status,
    [mainResourceIdField]: rootItem.id,
    isDraft: true,
  });

  const buildEditingItems = (item) => {
    const rootItemId = getRootItemId(item);
    const rootItem = items.find(s => Number(s.id) === Number(rootItemId)) || item;
    const relatedItems = items.filter(s =>
      Number(s.id) === Number(rootItemId) ||
      Number(s[mainResourceIdField]) === Number(rootItemId)
    );

    return allLanguages.map((language) => {
      const existingItem = relatedItems.find(s => Number(s.id_lang) === Number(language.id));

      if (existingItem) {
        return existingItem;
      }

      if (Number(language.id) === Number(rootItem.id_lang)) {
        return rootItem;
      }

      return createEmptyTranslation(rootItem, language.id);
    });
  };

  const loadItems = useCallback(async () => {
    const data = await getItems(resource);
    const sortedData = isSortableResource
      ? [...data].sort((a, b) => Number(a.item || 0) - Number(b.item || 0))
      : data;
    
    const itemsWithImage = await Promise.all(sortedData.map(async (item) => {
      try {
        if (isPortfolio) {
          const response = await fetch(`/api/get-images?sectionId=${getRootItemId(item)}&type=portfolio_gallery`);
          const result = await response.json();
          return {
            ...item,
            imageGallery: result.images || [],
            image: result.images?.[0]?.path || null,
          };
        }

        const response = await fetch(`/api/check-image/${resource}/${item.id}`);
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
  }, [resource, isPortfolio, isSortableResource, getRootItemId]);

  const loadLanguages = useCallback(async () => {
    const langs = await getLanguages();
    const defaultLang = langs.find(lang => Number(lang.id) === 1);
    const filteredLangs = langs.filter(lang => Number(lang.id) !== 1);
    setLanguages(filteredLangs);
    setDefaultLanguage(defaultLang);
    setCurrentTab(defaultLang ? Number(defaultLang.id) : 1);
    console.log("Languages loaded (excluding default):", filteredLangs);
  }, []);

  useEffect(() => {
    loadItems();
    loadLanguages();
  }, [loadItems, loadLanguages]);

  const handleCreateItem = async () => {
    try {
      const itemToCreate = isSortableResource
        ? { ...newItem, item: rootItems.length + 1 }
        : newItem;
      const createdItem = await createItem(resource, itemToCreate);
      if (createdItem) {
        const newItems = [...items, createdItem];
        const itemCreationPromises = languages.map(lang => {
          const itemInOtherLang = {
            ...itemToCreate,
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
        setNewItem({ title: "", description: "", project_url: "", skills: "", item: 0, id_lang: 1, status: 1 });
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
          const itemToSave = { ...item };
          delete itemToSave.isDraft;

          if (item.isDraft) {
            if (!itemToSave.title?.trim()) {
              return;
            }

            await createItem(resource, itemToSave);
            return;
          }

          await updateItem(resource, item.id, itemToSave);
        })
      );

      console.log("Items updated:", editingItems);
      await loadItems();
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
    const relatedItems = buildEditingItems(item);

    console.log('Related items:', relatedItems);
    setEditingItems(relatedItems);
    setCurrentTab(defaultLanguage ? Number(defaultLanguage.id) : Number(item.id_lang));
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
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 1024 * 1024 * 8
    );

    if (isPortfolio) {
      setImage(validFiles);
      return;
    }

    const file = validFiles[0];
    if (file) {
      setImage(file);
    } else {
      setImage(null);
    }
  };

  const handleImageSave = async () => {

    if (image && itemToManageImage) {
      try {
        if (isPortfolio) {
          const files = Array.isArray(image) ? image : [image];
          const galleryOwnerId = getRootItemId(itemToManageImage);

          await Promise.all(files.map(async (file, index) => {
            const formData = new FormData();
            const extension = file.name.split('.').pop();
            const newFilename = `${resource}_${galleryOwnerId}_${Date.now()}_${index}.${extension}`;
            formData.append("file", file);
            formData.append("newFilename", newFilename);
            formData.append("id_section", galleryOwnerId);
            formData.append("type", "portfolio_gallery");

            const response = await fetch('/api/upload-image', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error('Error uploading image');
            }
          }));
        } else {
          const formData = new FormData();
          const newFilename = `${resource}_${itemToManageImage.id}.${image.name.split('.').pop()}`;
          formData.append("file", image);
          formData.append("newFilename", newFilename);

          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Error uploading image');
          }

          const uploadedImageURL = URL.createObjectURL(image);
          itemToManageImage.image = uploadedImageURL;
        }

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
          const response = await fetch(`/api/delete-image/${resource}_${itemToManageImage.id}`, {
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

  const handleGalleryImageDelete = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/delete-image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error deleting gallery image');
      }

      await loadItems();
      setItemToManageImage((currentItem) => {
        if (!currentItem) {
          return currentItem;
        }

        return {
          ...currentItem,
          imageGallery: (currentItem.imageGallery || []).filter((galleryImage) => galleryImage.id !== imageId),
        };
      });
    } catch (error) {
      console.error("Error deleting gallery image:", error);
    }
  };

  const rootItems = items
    .filter(item => item[mainResourceIdField] === null)
    .sort((a, b) => Number(a.item || 0) - Number(b.item || 0));

  const openCreateModal = () => {
    setNewItem((currentItem) => ({
      ...currentItem,
      item: isSortableResource ? rootItems.length + 1 : currentItem.item,
    }));
    setIsCreateModalOpen(true);
  };

  const handleDragStart = (id) => {
    setDraggedItemId(id);
  };

  const handleDrop = async (targetId) => {
    if (!isSortableResource || draggedItemId === null || Number(draggedItemId) === Number(targetId)) {
      setDraggedItemId(null);
      return;
    }

    const draggedIndex = rootItems.findIndex(item => Number(item.id) === Number(draggedItemId));
    const targetIndex = rootItems.findIndex(item => Number(item.id) === Number(targetId));

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedItemId(null);
      return;
    }

    const reorderedItems = [...rootItems];
    const [draggedItem] = reorderedItems.splice(draggedIndex, 1);
    reorderedItems.splice(targetIndex, 0, draggedItem);

    const updates = reorderedItems.flatMap((rootItem, index) => {
      const order = index + 1;
      const relatedItems = items.filter(item =>
        Number(item.id) === Number(rootItem.id) ||
        Number(item[mainResourceIdField]) === Number(rootItem.id)
      );

      return relatedItems.map(item => ({ ...item, item: order }));
    });

    setItems(currentItems => currentItems.map(currentItem => {
      const updatedItem = updates.find(item => Number(item.id) === Number(currentItem.id));
      return updatedItem || currentItem;
    }));

    try {
      await Promise.all(updates.map(item => updateItem(resource, item.id, item)));
      await loadItems();
    } catch (error) {
      console.error("Error updating portfolio order:", error);
      await loadItems();
    } finally {
      setDraggedItemId(null);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Listado</h2>
      <button
        onClick={openCreateModal}
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
              {isSortableResource && (
                <th className="w-20 py-2 px-4 border-b-2 border-gray-300 text-left leading-4 text-gray-700 tracking-wider">Orden</th>
              )}
              <th className="w-1/5 py-2 px-4 border-b-2 border-gray-300 text-left leading-4 text-gray-700 tracking-wider">Imagen</th>
              <th className="w-1/5 py-2 px-4 border-b-2 border-gray-300 text-right leading-4 text-gray-700 tracking-wider">Estado</th>
              <th className="w-1/4 py-2 px-4 border-b-2 border-gray-300 text-right leading-4 text-gray-700 tracking-wider">Opciones</th>
            </tr>
          </thead>
          <tbody className="flex flex-col w-full">
            {rootItems.map((item, index) => (
              <tr
                key={item.id}
                className={`flex w-full ${Number(draggedItemId) === Number(item.id) ? 'opacity-60' : ''}`}
                draggable={isSortableResource}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={(event) => {
                  if (isSortableResource) {
                    event.preventDefault();
                  }
                }}
                onDrop={() => handleDrop(item.id)}
              >
                <td className="flex-1 py-2 px-4 border-b border-gray-200">
                  <div>
                    <strong className="block text-left">{item.title}</strong>
                  </div>
                </td>
                {isSortableResource && (
                  <td className="w-20 py-2 px-4 border-b border-gray-200 text-left">
                    <span className="inline-flex cursor-move select-none rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
                      {index + 1}
                    </span>
                  </td>
                )}
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
          {isPortfolio && (
            <>
              <input
                type="url"
                placeholder="URL del projecte"
                value={newItem.project_url || ""}
                onChange={(e) => setNewItem({ ...newItem, project_url: e.target.value })}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Skills / tecnologies"
                value={newItem.skills || ""}
                onChange={(e) => setNewItem({ ...newItem, skills: e.target.value })}
                className="p-2 border border-gray-300 rounded-md"
              />
            </>
          )}
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
                languages={allLanguages}
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}
            {editingItems.filter(item => Number(item.id_lang) === Number(currentTab)).map(item => (
              <div key={item.id || `draft-${item.id_lang}`} className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  placeholder="Título"
                  value={item.title || ""}
                  onChange={(e) => {
                    const updatedItems = editingItems.map(s =>
                      Number(s.id_lang) === Number(item.id_lang) ? { ...s, title: e.target.value } : s
                    );
                    setEditingItems(updatedItems);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Descripción"
                  value={item.description || ""}
                  onChange={(e) => {
                    const updatedItems = editingItems.map(s =>
                      Number(s.id_lang) === Number(item.id_lang) ? { ...s, description: e.target.value } : s
                    );
                    setEditingItems(updatedItems);
                  }}
                  className="p-2 border border-gray-300 rounded-md"
                ></textarea>
                {isPortfolio && (
                  <>
                    <input
                      type="url"
                      placeholder="URL del projecte"
                      value={item.project_url || ""}
                      onChange={(e) => {
                        const updatedItems = editingItems.map(s =>
                          Number(s.id_lang) === Number(item.id_lang) ? { ...s, project_url: e.target.value } : s
                        );
                        setEditingItems(updatedItems);
                      }}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Skills / tecnologies"
                      value={item.skills || ""}
                      onChange={(e) => {
                        const updatedItems = editingItems.map(s =>
                          Number(s.id_lang) === Number(item.id_lang) ? { ...s, skills: e.target.value } : s
                        );
                        setEditingItems(updatedItems);
                      }}
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </>
                )}
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
            {isPortfolio ? (
              <div className="grid grid-cols-1 gap-4">
                {(itemToManageImage.imageGallery || []).length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {itemToManageImage.imageGallery.map((galleryImage) => (
                      <div key={galleryImage.id} className="border border-gray-200 rounded-md p-2">
                        <img src={galleryImage.path} alt={itemToManageImage.title} className="h-28 w-full object-cover mb-2 rounded" />
                        <button
                          onClick={() => handleGalleryImageDelete(galleryImage.id)}
                          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 flex items-center text-sm"
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="p-2 border border-gray-300 rounded-md"
                />
                <div className="flex space-x-2">
                  <button onClick={handleImageSave} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 flex items-center">
                    <PhotoIcon className="h-5 w-5 mr-2" />
                    Guardar imatges
                  </button>
                  <button onClick={() => setIsImageModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">Cancelar</button>
                </div>
              </div>
            ) : itemToManageImage.image ? (
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
                  accept="image/jpeg,image/png,image/webp"
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
