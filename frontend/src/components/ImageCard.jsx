import React, { useState } from 'react';

export default function ImageCard({ image, onClick }) {
  const {id} = useParams();
  const [name, setUser] = useState();
  return (
    <div className="image-card" onClick={() => onClick(image)}>
      <img
        src={`http://localhost:8080/images/${image._id}`}
        alt={image.metadata?.title || 'Imagen'}
      />
      <div className="image-title">{image.metadata?.title || 'Sin título'}</div>
    </div>
  );
}

