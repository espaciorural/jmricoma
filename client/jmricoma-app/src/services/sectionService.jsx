import axios from 'axios';

const getSections = async (id_lang) => {
  try {
    const response = await axios.get(`/api/sections?lang=${id_lang}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Sections:", error);
    return [];
  }
};

export default getSections;
