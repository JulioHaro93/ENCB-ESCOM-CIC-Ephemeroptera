import React from 'react';

export default function ImageCard({ image, onClick }) {
  return (
    <div className="image-card" onClick={() => onClick(image)}>
      <img
        src={`http://localhost:8080/images/${image.url}`} // ahora apunta al servidor
        alt={image.metadata?.title || 'Imagen'}
      />
      <div className="image-title">{image.metadata?.title || 'Sin título'}</div>
    </div>
  );
}

