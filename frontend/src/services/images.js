import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:8080/api';

export const getImages = async (images, userId, skip = 0, limit = 10) => {
  try {
    const token = getToken();
    const imageUrls = [];

    const requests = images.map(async (imageId) => {
      try {
        const res = await axios.get(
          `${API_URL}/images/userImagesGridFS/${imageId}?user=${userId}&skip=${skip}&limit=${limit}`,
          {
            responseType: "arraybuffer",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200 && res.data) {
          const contentType =
            res.headers["content-type"] || "image/jpeg";
          const blob = new Blob([res.data], { type: contentType });
          const url = URL.createObjectURL(blob);
          return url;
        } else {
          console.warn(`Imagen ${imageId} no obtenida`);
          return null;
        }
      } catch (err) {
        console.error(`Error con imagen ${imageId}:`, err);
        return null;
      }
    });

    const results = await Promise.all(requests);
    return results.filter(Boolean);
  } catch (error) {
    console.error("Error en getImages:", error);
    return [];
  }
};

export const getImagesDos = async (images, userId, skip = 0, limit = 10) => {

  const token = getToken();
  console.log(images)
  const imagesArray = new Array()
  const imagenesReq = images.forEach(async image => {
    console.log("imagen actual del foreach!: ",image)
    const res = await axios.get(`${API_URL}/images/userImagesGridFS/${image}?skip=${skip}&limit=${limit}*/`, {
        responseType: 'arraybuffer',
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log("RES: ", res)
    if(res.data){
        imagesArray.push(res)
        console.log("RES RES RES RES DE GET IMAGE")
        console.log(res)
    }else{
        console.log("Error al extraer el archivo")
    }
    
  });
  console.log(imagenesReq)
  return imagesArray //res.data.url.images
};

export const uploadImage = async (userId, file, metadata) => {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  formData.append('metadata', JSON.stringify(metadata));
  const res = await axios.post(`${API_URL}/images/uploadGridFS/${userId}`, formData, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteImage = async (imageId) => {
  const token = getToken();
  const res = await axios.delete(`${API_URL}/images/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateMetadata = async (imageId, metadata) => {
  const token = getToken();
  const res = await axios.put(`${API_URL}/images/${imageId}`, metadata, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
