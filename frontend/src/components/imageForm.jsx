import React, { useState, useEffect } from "react";
import macroinvertebrados from "../lib/families.json";
import vegetaciones from "../lib/vegetations.json";
import seasons from "../lib/seasons.json";

export default function ImageForm({ defaultData, onSubmit }) {
  const [formData, setFormData] = useState(defaultData);
  const [orders, setOrders] = useState([]);
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    const ords = Object.keys(macroinvertebrados.macroinvertebrados);
    setOrders(ords);
  }, []);

  const handleOrderChange = (e) => {
    const order = e.target.value;
    const fams = Object.keys(macroinvertebrados.macroinvertebrados[order] || {});
    setFamilies(fams);
    setFormData({ ...formData, order, family: "", bmwp: 0 });
  };

  const handleFamilyChange = (e) => {
    const family = e.target.value;
    const bmwp =
      macroinvertebrados.macroinvertebrados[formData.order]?.[family]?.bmwp || 0;
    setFormData({ ...formData, family, bmwp });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form id="image-form" onSubmit={handleSubmit}>
      <label>Descripción</label>
      <input
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-1"
      />

      <label>Orden</label>
      <select name="order" value={formData.order} onChange={handleOrderChange}>
        <option value="">Seleccione orden</option>
        {orders.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>

      <label>Familia</label>
      <select name="family" value={formData.family} onChange={handleFamilyChange}>
        <option value="">Seleccione familia</option>
        {families.map((f) => (
          <option key={f}>{f}</option>
        ))}
      </select>

      <label>BMWP</label>
      <input name="bmwp" value={formData.bmwp} readOnly className="w-full border p-1" />

      <label>Vegetación</label>
      <select
        name="vegetation"
        value={formData.vegetation}
        onChange={handleChange}
      >
        <option value="">Seleccione vegetación</option>
        {vegetaciones.vegetations.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>

      <label>Temporada</label>
      <select
        name="season"
        value={formData.season}
        onChange={handleChange}
      >
        <option value="">Seleccione temporada</option>
        {seasons.seasons.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <label>Recolector</label>
      <input
        name="recolector"
        value={formData.recolector}
        onChange={handleChange}
        className="w-full border p-1"
      />

      <label>Maduración</label>
      <input
        name="maduration"
        value={formData.maduration}
        onChange={handleChange}
        className="w-full border p-1"
      />

      <label>Localización</label>
      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        className="w-full border p-1"
      />
    </form>
  );
}
