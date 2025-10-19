import React, { useState } from 'react';
import { deleteImage, updateMetadata } from '../services/images';

export default function ImageCarousel({ images, initialIndex, onClose, onUpdate }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [metadata, setMetadata] = useState(images[initialIndex].metadata || { title: '', description: '' });

  const currentImage = images[currentIndex];

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);

  const handleDelete = async () => {
    await deleteImage(currentImage._id);
    onUpdate(currentImage._id, 'delete');
  };

  const handleMetadataChange = (e) => setMetadata({ ...metadata, [e.target.name]: e.target.value });

  const handleSaveMetadata = async () => {
    await updateMetadata(currentImage._id, metadata);
    onUpdate(currentImage._id, 'update', metadata);
  };

  return (
    <div className="carousel-overlay">
      <button className="close-btn" onClick={onClose}>×</button>
      <button className="prev-btn" onClick={handlePrev}>❮</button>
      <div className="carousel-content">
        <img src={currentImage.url} alt="Imagen" />
        <div className="metadata-editor">
          <input name="title" value={metadata.title} onChange={handleMetadataChange} placeholder="Título" />
          <textarea name="description" value={metadata.description} onChange={handleMetadataChange} placeholder="Descripción" />
          <button onClick={handleSaveMetadata}>Guardar</button>
          <button onClick={handleDelete}>Eliminar</button>
        </div>
      </div>
      <button className="next-btn" onClick={handleNext}>❯</button>
    </div>
  );
}
