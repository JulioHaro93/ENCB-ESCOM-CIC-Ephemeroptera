import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getImages } from '../services/images';
import ImageCard from './ImageCard';
import ImageCarousel from './ImageCarousel';
import UploadForm from './UploadForm';
import { getToken } from '../utils/auth';

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getToken()
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:8080/api/profile/${id}`, {
          headers:{ Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },          
        }
        );
        setUser(userRes.data);
        const imgs = await getImages(id, 0, 10);
        console.log(imgs)
        setImages(imgs || []);
      } catch (err) {
        console.error(err);
        setUser(null);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const openCarousel = (image) => setCarouselIndex(images.findIndex((img) => img._id === image._id));
  const closeCarousel = () => setCarouselIndex(null);

  const handleUpdate = (imageId, action, metadata) => {
    if (action === 'delete') setImages((prev) => prev.filter((img) => img._id !== imageId));
    if (action === 'update') setImages((prev) => prev.map((img) => img._id === imageId ? { ...img, metadata } : img));
  };

  const handleUpload = (newImage) => setImages((prev) => [newImage, ...prev]);

  return (
    <div className="profile-container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {user ? (
            <div className="user-info">
              <h2>{user.nombre}</h2>
              <p>Email: {user.correo}</p>
              <p>Rol: {user.roles}</p>
              <p>Institución: {user.institution}</p>
            </div>
          ) : (
            <p>No se pudo cargar la información del usuario</p>
          )}

          <UploadForm userId={id} onUpload={handleUpload} />

          {images.length === 0 ? (
            <p>El usuario no ha subido imágenes aún</p>
          ) : (
            <div className="images-grid">
              {images.map((img) => (
                <ImageCard key={img._id} image={img} onClick={openCarousel} />
              ))}
            </div>
          )}

          {carouselIndex !== null && (
            <ImageCarousel
              images={images}
              initialIndex={carouselIndex}
              onClose={closeCarousel}
              onUpdate={handleUpdate}
            />
          )}
        </>
      )}
    </div>
  );
}
