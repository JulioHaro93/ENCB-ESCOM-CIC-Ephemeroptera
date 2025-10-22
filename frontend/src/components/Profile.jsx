import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getImages } from "../services/images";
import ImageCard from "./ImageCard";
import ImageCarousel from "./ImageCarousel";
import UploadForm from "./UploadForm";
import ImageDataForm from "./ImageDataForm";
import { getToken } from "../utils/auth";
import "../styles/ImageCard.css";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [images, setImages] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageData, setSelectedImageData] = useState(null);
  const token = getToken();
  const navigate = useNavigate();

  const handleGoDashboard = () => navigate("/dashboard");

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

  const openCarousel = async (image) => {
    setCarouselIndex(images.findIndex((img) => img._id === image._id));

    
    try {
      const res = await axios.get(`http://localhost:8080/api/imageData/${image._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSelectedImageData(res.data.imagenes.imageData);
    } catch {
      setSelectedImageData(null);
    }
  };

  const closeCarousel = () => {
    setCarouselIndex(null);
    setSelectedImageData(null);
  };

  const handleUpdate = (imageId, action, metadata) => {
    if (action === "delete") setImages((prev) => prev.filter((img) => img._id !== imageId));
    if (action === "update")
      setImages((prev) =>
        prev.map((img) => (img._id === imageId ? { ...img, metadata } : img))
      );
  };

  const handleUpload = (newImage) => setImages((prev) => [newImage, ...prev]);

  return (
    <div className="profile-container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          {user && (
            <div className="user-info">
              <h2 style={{ color: "black" }}>{user.nombre}</h2>
              <p>Email: {user.correo}</p>
              <p>Rol: {user.roles}</p>
              <p>Institución: {user.institution}</p>
              <p>Perfil: {user.skill}</p>
            </div>
          )}

          <button onClick={handleGoDashboard} style={{ marginTop: "10px" }}>
            Volver al Dashboard
          </button>

          {images.length === 0 ? (
            <p>El usuario no ha subido imágenes aún</p>
          ) : (
            <div className="image-grid">
              {images.map((img) => (
                <ImageCard key={img._id} image={img} onClick={() => openCarousel(img)} />
              ))}
            </div>
          )}

          <div style={{ marginTop: "20px" }}>
            <UploadForm userId={id} onUpload={handleUpload} />
          </div>

          {carouselIndex !== null && (
            <>
              <ImageCarousel
                images={images}
                initialIndex={carouselIndex}
                onClose={closeCarousel}
                onUpdate={handleUpdate}
              />
              <ImageDataForm
                imageId={images[carouselIndex]._id}
                existingData={selectedImageData}
                onClose={closeCarousel}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}
