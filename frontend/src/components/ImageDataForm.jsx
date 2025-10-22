import React, { useEffect, useState } from "react";
import axios from "axios";
import familiesData from "../lib/families.json"; // importa tu archivo
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:8080/api";

export default function ImageDataForm({ imageId, existingData, onClose, onSaved }) {
  const token = getToken();

  const [formData, setFormData] = useState({
    description: "",
    order: "",
    family: "",
    location: "",
    season: "",
    recolector: "",
    vegetation: "",
    maduration: "",
    bmwp: 0,
    date: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    if (existingData) {
      setFormData({
        ...existingData,
        date: existingData.date ? existingData.date.split("T")[0] : new Date().toISOString().split("T")[0],
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newData = { ...formData, [name]: value };

    // cuando cambias de orden, reinicia familia y bmwp
    if (name === "order") {
      newData.family = "";
      newData.bmwp = 0;
    }

    // cuando cambias familia, busca bmwp
    if (name === "family" && newData.order) {
      const selectedFam = familiesData[newData.order]?.find(f => f.family === value);
      newData.bmwp = selectedFam ? selectedFam.bmwp : 0;
    }

    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = existingData
      ? `${API_URL}/images/modifyImageData/${imageId}`
      : `${API_URL}/images/createImageData/${imageId}`;

    const method = existingData ? "put" : "post";

    try {
      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        alert("Datos guardados correctamente");
        onSaved?.(res.data);
        onClose?.();
      } else {
        alert("Error al guardar datos");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión o validación");
    }
  };

  const orders = Object.keys(familiesData);
  const families = formData.order ? familiesData[formData.order] : [];

  return (
    <div className="image-data-form">
      <h3>{existingData ? "Modificar información de la imagen" : "Agregar información de la imagen"}</h3>
      <form onSubmit={handleSubmit}>
        <label>Descripción:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label>Orden:</label>
        <select name="order" value={formData.order} onChange={handleChange}>
          <option value="">Selecciona un orden</option>
          {orders.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <label>Familia:</label>
        <select name="family" value={formData.family} onChange={handleChange}>
          <option value="">Selecciona una familia</option>
          {families.map((f) => (
            <option key={f.family} value={f.family}>{f.family}</option>
          ))}
        </select>

        <label>BMWP:</label>
        <input type="number" name="bmwp" value={formData.bmwp} readOnly />

        <label>Ubicación:</label>
        <input name="location" value={formData.location} onChange={handleChange} />

        <label>Temporada:</label>
        <input name="season" value={formData.season} onChange={handleChange} />

        <label>Recolector:</label>
        <input name="recolector" value={formData.recolector} onChange={handleChange} />

        <label>Vegetación:</label>
        <input name="vegetation" value={formData.vegetation} onChange={handleChange} />

        <label>Maduración:</label>
        <input name="maduration" value={formData.maduration} onChange={handleChange} />


        <div style={{ marginTop: "12px" }}>
          <button type="submit" className="btn-guardar">💾 Guardar</button>
          <button type="button" onClick={onClose} className="btn-cancelar">Cancelar</button>
        </div>
      </form>
    </div>
  );
}
