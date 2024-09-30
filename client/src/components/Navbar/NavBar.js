import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../store/adminAuthStore';

const NavBar = () => {

  const { logout, setError, admin, error } = useAdminStore();
  const adminName = admin ? admin.name : "No user found!!";

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setError(error);
    }
    navigate('/');
  };

  return (
    <nav className="navbar">
      <h1>Admin Panel</h1>
      <ul>
        {admin ? <p>{adminName}</p> : <p>{error}</p>}
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
};

export default NavBar;
