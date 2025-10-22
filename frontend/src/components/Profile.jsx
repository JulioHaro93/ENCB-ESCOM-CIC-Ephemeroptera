import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getImages } from '../services/images';
import Imagecard from './ImageCard';
import ImageCarousel from './ImageCarousel';
import UploadForm from './UploadForm';
import { getToken } from '../utils/auth';
import '../styles/ImageCard.css';
export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = getToken();
  const navigate = useNavigate();

  const handleGoDashboard = () => navigate('/dashboard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get(`http://localhost:8080/api/profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data);

        const imgs = await getImages(userRes.data.images, id, 0, 10);
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

  const openCarousel = (image) => {
    const index = images.findIndex((img) => img._id === image._id);
    setCarouselIndex(index);
  };

  const closeCarousel = () => setCarouselIndex(null);

  const handleUpdate = (imageId, action, metadata) => {
    if (action === 'delete') {
      setImages((prev) => prev.filter((img) => img._id !== imageId));
    } else if (action === 'update') {
      setImages((prev) =>
        prev.map((img) =>
          img._id === imageId ? { ...img, metadata } : img
        )
      );
    }
  };

  const handleUpload = (newImage) => {
    setImages((prev) => [newImage, ...prev]);
  };

  const handleImageClick = async (img) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/imagesData/${img._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const metadata = res.data || {};
      alert(
        `Metadata:\n` +
          `Autor: ${metadata.author || 'Desconocido'}\n` +
          `Fecha: ${metadata.date || 'Desconocido'}\n` +
          `Cámara: ${metadata.camera || 'Desconocido'}`
      );
    } catch (err) {
      alert('No hay metadata disponible o hubo un error al cargarla.');
    }
  };

  return (
    <div className="profile-container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {user ? (
            <div className="user-info">
              <h2 style={{ color: 'black' }}>{user.nombre}</h2>
              <p>Email: {user.correo}</p>
              <p>Rol: {user.roles}</p>
              <p>Institución: {user.institution}</p>
              <p>Perfil: {user.skill}</p>
            </div>
          ) : (
            <p>No se pudo cargar la información del usuario</p>
          )}

          {/* Botón para volver */}
          <button onClick={handleGoDashboard} style={{ marginTop: '10px' }}>
            Volver al Dashboard
          </button>

          {/* Cuadrícula de imágenes */}
          {images.length === 0 ? (
            <p>El usuario no ha subido imágenes aún</p>
          ) : (
            <div className="image-grid">
                {images.map((img, index) => (
                <Imagecard
                  key={img._id} image={img} onClick={openCarousel}
                  /*onClick={() => handleImageClick(img)}
                  onDelete={() => handleUpdate(img._id || index, 'delete')}
                  onModify={() => openCarousel(img)}*/
                />
              ))}
            </div>
          )}

          {/* Formulario de subida debajo de las imágenes */}
          <div style={{ marginTop: '20px' }}>
            <UploadForm userId={id} onUpload={handleUpload} />
          </div>

          {/* Modal tipo carrusel */}
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
