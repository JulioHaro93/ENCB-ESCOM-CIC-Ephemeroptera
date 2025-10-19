import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, clearUser } from '../utils/auth';
import UserCard from './UserCard';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/SeeUsers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.result.users || []);
      } catch (err) {
        console.error(err);
        alert('Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate]);

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header>
        <h2>Dashboard de Usuarios</h2>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </header>

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : users.length === 0 ? (
        <p>No hay usuarios disponibles</p>
      ) : (
        <div className="users-grid">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
