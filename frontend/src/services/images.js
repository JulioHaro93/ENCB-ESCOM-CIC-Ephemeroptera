import axios from 'axios';
import { getToken } from '../utils/auth';

const API_URL = 'http://localhost:8080/api';

export const getImages = async (userId, skip = 0, limit = 10) => {
  const token = getToken();
  const res = await axios.get(`${API_URL}/images/userImages/${userId}?skip=${skip}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.url.images
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
