import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UserCard.css';

export default function UserCard({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${user._id}`);
  };

  return (
    <div className="user-card" onClick={handleClick}>
      <h3>{user.nombre}</h3>
      <p>{user.correo}</p>
      <p>{user.roles}</p>
    </div>
  );
}
