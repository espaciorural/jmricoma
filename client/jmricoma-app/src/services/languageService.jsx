import axios from 'axios';

const API_URL = 'http://jmricoma/api/languages';

const getLanguages = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.languages;
  } catch (error) {
    console.error('Error fetching languages:', error);
    return [];
  }
};

const getLanguageById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching language:", error);
    return null;
  }
};

export { getLanguages, getLanguageById };


