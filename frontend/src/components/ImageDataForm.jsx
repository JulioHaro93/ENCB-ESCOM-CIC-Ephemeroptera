import React, { useState, useEffect } from "react";
import axios from "axios";
import families from "../lib/families.json";
import { getToken } from "../utils/auth";

export default function ImageDataForm({ imageId, existingData, onClose }) {
  const [formData, setFormData] = useState({
    description: "",
    order: "",
    family: "",
    bmwp: 0,
    location: "",
    season: "",
    recolector: "",
    vegetation: "",
    maduration: ""
  });

  const token = getToken();

  // Cargar datos existentes si hay
  useEffect(() => {
    if (existingData) setFormData(existingData);
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Si se cambia el orden, reiniciar familia y bmwp
    if (name === "order") {
      setFormData((prev) => ({ ...prev, family: "", bmwp: 0 }));
    }

    // Si se cambia la familia, asignar bmwp automáticamente
    if (name === "family" && formData.order) {
      const fam = families[formData.order]?.find((f) => f.family === value);
      if (fam) setFormData((prev) => ({ ...prev, bmwp: fam.bmwp }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (existingData) {
        // PUT - modificar
        await axios.put(
          `http://localhost:8080/api/imageData/modifyImageData/${imageId}`,
          formData,
          { headers }
        );
        alert("Metadata actualizada correctamente");
      } else {
        // POST - crear
        await axios.post(
          `http://localhost:8080/api/imageData/createImageData/${imageId}`,
          formData,
          { headers }
        );
        alert("Metadata creada correctamente");
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error al guardar los datos.");
    }
  };

  return (
    <div
      style={{
        background: "#222",
        color: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "10px",
      }}
    >
      <h3>{existingData ? "Modificar Información del animal" : "Agregar información del animal"}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
          style={{ width: "100%", height: "80px", marginBottom: "10px" }}
        />

        <label>Orden:</label>
        <select name="order" value={formData.order} onChange={handleChange}>
          <option value="">Seleccione un orden</option>
          {Object.keys(families).map((order) => (
            <option key={order} value={order}>
              {order}
            </option>
          ))}
        </select>

        {formData.order && (
          <>
            <label>Familia:</label>
            <select
              name="family"
              value={formData.family}
              onChange={handleChange}
            >
              <option value="">Seleccione una familia</option>
              {families[formData.order].map((f) => (
                <option key={f.family} value={f.family}>
                  {f.family}
                </option>
              ))}
            </select>
          </>
        )}

        <p>BMWP asignado: <strong>{formData.bmwp}</strong></p>

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Ubicación"
        />
        <input
          type="text"
          name="recolector"
          value={formData.recolector}
          onChange={handleChange}
          placeholder="Recolector"
        />
        <input
          type="text"
          name="vegetation"
          value={formData.vegetation}
          onChange={handleChange}
          placeholder="Vegetación"
        />
        <input
          type="text"
          name="maduration"
          value={formData.maduration}
          onChange={handleChange}
          placeholder="Maduración"
        />
        <input
          type="text"
          name="season"
          value={formData.season}
          onChange={handleChange}
          placeholder="Temporada"
        />

        <div style={{ marginTop: "10px" }}>
          <button type="submit" style={{ marginRight: "10px" }}>
            {existingData ? "Modificar" : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </form>
    </div>
  );
}
