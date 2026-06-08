import axios from 'axios';

export const getImages = async (sectionId, type) => {
  try {
    const response = await axios.get('/api/get-images', {
      params: { sectionId, type }
    });
    return response.data.images;
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
};
