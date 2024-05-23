import axios from 'axios';

const getLiterals = async (id_section) => {
  try {
    const response = await axios.get(`http://jmricoma/api/literal/section/${id_section}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching Sections:", error);
    return [];
  }
};

export default getLiterals;
