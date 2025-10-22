import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:8080/api';

export const getImages = async (images, userId, skip = 0, limit = 10) => {
  try {
    const token = getToken();

    const results = await Promise.all(
      images.map(async (imageId) => {
        try {
          // 🧠 1. Obtener metadata JSON
          const metaRes = await axios.get(
            `${API_URL}/images/userImagesInfo/${imageId}?user=${userId}&skip=${skip}&limit=${limit}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          // 🧠 2. Obtener imagen binaria
          const imgRes = await axios.get(
            `${API_URL}/images/userImagesGridFS/${imageId}?user=${userId}&skip=${skip}&limit=${limit}`,
            { responseType: "arraybuffer", headers: { Authorization: `Bearer ${token}` } }
          );

          const contentType = imgRes.headers["content-type"] || "image/jpeg";
          const blob = new Blob([imgRes.data], { type: contentType });
          const url = URL.createObjectURL(blob);

          // ✅ Combinar todo
          return {
            _id: imageId,
            url,
            metadata: metaRes.data || {},
          };
        } catch (err) {
          console.error(`Error al obtener imagen ${imageId}:`, err);
          return null;
        }
      })
    );

    // Filtrar nulos y duplicados
    const unique = results.filter(
      (img, index, self) => img && index === self.findIndex((i) => i._id === img._id)
    );

    return unique;
  } catch (err) {
    console.error("Error en getImages:", err);
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
