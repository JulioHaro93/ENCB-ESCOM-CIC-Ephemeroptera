import React, { useState } from 'react';
import { uploadImage } from '../services/images';

export default function UploadForm({ userId, onUpload }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Selecciona un archivo');
    const metadata = { title };
    const newImage = await uploadImage(userId, file, metadata);
    onUpload(newImage);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Subir Imagen</button>
    </form>
  )
}
