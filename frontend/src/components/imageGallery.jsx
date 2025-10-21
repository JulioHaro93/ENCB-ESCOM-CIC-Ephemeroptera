import React, { useState } from "react";
import ImageCard from "./ImageCard";
import ImageModal from "./ImageModal";

export default function ImageGallery({ images }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
          <ImageCard key={img._id} image={img} onClick={() => handleImageClick(img)} />
        ))}
      </div>

      {selectedImage && (
        <ImageModal image={selectedImage} onClose={handleCloseModal} />
      )}
    </div>
  );
}
