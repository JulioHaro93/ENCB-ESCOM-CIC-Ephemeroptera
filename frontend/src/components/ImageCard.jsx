import React from "react";

export default function ImageCard({ image, onClick }) {
  return (
    <div className="image-card" onClick={onClick}>
      <img
        src={`http://localhost:8080/images/${image._id}`}
        alt={image.metadata?.title || "Imagen"}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      />
      <div style={{ textAlign: "center", marginTop: "5px", color: "white" }}>
        {image.metadata?.title || "Sin título"}
      </div>
    </div>
  );
}
