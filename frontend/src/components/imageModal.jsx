import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import ImageForm from "./imageForm";

export default function ImageModal({ image, onClose }) {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchImageData = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/imageData/${image._id}`);
      const data = await res.json();
      setImageData(data?.error ? null : data);
    } catch (err) {
      console.error("Error al obtener metadata:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImageData();
  }, [image._id]);

  if (loading) return null;

  const modalContent = (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#f0f0f0",
          borderRadius: "12px",
          padding: "20px",
          width: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            fontSize: "20px",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ✕
        </button>

        <div style={{ textAlign: "center" }}>
          <img
            src={`http://localhost:8080/images/${image._id}`}
            alt="Seleccionada"
            style={{
              maxHeight: "250px",
              borderRadius: "8px",
              objectFit: "cover",
            }}
          />
          <h3>{image.metadata?.title || "Sin título"}</h3>
        </div>

        {/* Aquí va tu formulario */}
        <ImageForm imageData={imageData} imageId={image._id} />
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
