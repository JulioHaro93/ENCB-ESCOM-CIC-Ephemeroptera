import React, { useState } from "react";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";

export default function Gallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClick = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <ImageCard key={img._id} image={img} onClick={() => handleClick(img)} />
        ))}
      </div>

      {/* El modal SOLO se muestra si hay una imagen seleccionada */}
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleClose} />
      )}
    </div>
  );
}
