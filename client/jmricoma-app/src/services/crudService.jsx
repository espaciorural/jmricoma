import axios from 'axios';

const API_URL = 'http://jmricoma/api';

const getItems = async (resource) => {
  try {
    const response = await axios.get(`${API_URL}/${resource}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return [];
  }
};

const getItemById = async (resource, id) => {
  try {
    const response = await axios.get(`${API_URL}/${resource}/${id}`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${resource}:`, error);
    return null;
  }
};

const createItem = async (resource, item) => {
  try {
    const response = await axios.post(`${API_URL}/${resource}/create`, item, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(`Error creating ${resource}:`, error);
    return null;
  }
};

const updateItem = async (resource, id, item) => {
  try {
    const response = await axios.put(`${API_URL}/${resource}/update/${id}`, item, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error(`Error updating ${resource}:`, error);
    return null;
  }
};

const deleteItem = async (resource, id) => {
  try {
    await axios.delete(`${API_URL}/${resource}/delete/${id}`, { withCredentials: true });
    return true;
  } catch (error) {
    console.error(`Error deleting ${resource}:`, error);
    return false;
  }
};

export { getItems, getItemById, createItem, updateItem, deleteItem };
