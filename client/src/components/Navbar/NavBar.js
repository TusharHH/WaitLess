import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminStore from '../../store/adminAuthStore'; // Admin store
import useUserStore from '../../store/userAuthStore';   // User store

const NavBar = () => {
  // Fetch admin and user data from respective stores
  const { logout: adminLogout, setError: setAdminError, admin, error: adminError } = useAdminStore();
  const { logout: userLogout, setError: setUserError, user, error: userError } = useUserStore();

  const navigate = useNavigate();

  // Check for logged-in admin or user
  const loggedInUser = admin || user;
  const name = loggedInUser ? loggedInUser.name : "No user found!";
  const avatarUrl = loggedInUser?.avatarUrl || '/default-avatar.png';
  const error = adminError || userError;

  const handleLogout = async () => {
    try {
      if (admin) {
        await adminLogout();
      } else if (user) {
        await userLogout();
      }
    } catch (error) {
      admin ? setAdminError(error) : setUserError(error);
    }
    navigate('/');
  };

  return (
    <nav className="navbar">
      {/* Replace "Admin Panel" with "Waitless" */}
      <h1>Waitless</h1>
      <ul className="navbar-items">
        {/* Display admin or user name */}
        {loggedInUser ? <p>{name}</p> : <p>{error}</p>}

        {/* Display avatar with conditional fallback */}
        <li>
          <img
            src={avatarUrl}
            alt="User Avatar"
            className="user-avatar"
          />
        </li>

        {/* Logout button */}
        <li onClick={handleLogout} className="logout-btn">
          Logout
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
