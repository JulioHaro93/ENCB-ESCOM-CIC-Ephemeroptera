import React from "react";

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='#ddd'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#888' font-size='20'>Imagen no disponible</text></svg>`
  );

export default function ImageCard({ image, onClick, onDelete, onModify }) {
  // image puede venir como: { _id, url, metadata } o solo { _id } (si aún no transformaste)
  const src = image?.url || image?.path || (image?._id ? `http://localhost:8080/images/${image._id}` : null);

  const handleError = (e) => {
    console.warn("Error cargando imagen, fallback a placeholder. image:", image);
    e.currentTarget.src = PLACEHOLDER;
  };

  return (
    <div className="image-card" onClick={() => onClick && onClick(image)} style={{ cursor: onClick ? "pointer" : "default" }}>
      <img
        src={src || PLACEHOLDER}
        alt={image?.metadata?.title || "Imagen"}
        onError={handleError}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
          borderRadius: "8px",
          display: "block",
          background: "#f0f0f0"
        }}
      />
      <div style={{ textAlign: "center", marginTop: "6px", color: "#111" }}>
        {image?.metadata?.title || image?.metadata?.family || "Sin título"}
      </div>

      {/* Opcionales: botones pequeños (no afectan el click general) */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "6px" }}>
        {onModify && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onModify(image); }} className="btn-modificar">
            Modificar
          </button>
        )}
        {onDelete && (
          <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(image._id || image); }} className="btn-borrar">
            Borrar
          </button>
        )}
      </div>
    </div>
  );
}

