import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../store/adminAuthStore';
import useUserStore from '../../store/userAuthStore';

import Logo from '../../assets/Images/logo-removebg.png';
import ProfilePic from '../../assets/Images/man.png';

import './NavBar.scss';

const NavBar = () => {

  const { logout: adminLogout, setError: setAdminError, admin, error: adminError } = useAdminStore();
  const { logout: userLogout, setError: setUserError, user, error: userError } = useUserStore();

  const navigate = useNavigate();

  const loggedInUser = admin || user;
  const name = loggedInUser ? loggedInUser.name : "No user found!";
  const avatarUrl = loggedInUser?.avatarUrl || ProfilePic;
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
      <div>
        <img
          src={Logo}
          alt="Logo"
        />
      </div>
      <div>
        <ul>
          <li>Home</li>
          <li>Service</li>
          <li>Doctors</li>
          <li>About Us</li>
        </ul>
      </div>
      <div>

        <ul className="navbar-items">
          {loggedInUser ? <p>{name}</p> : <p>{error}</p>}
          <li>
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="user-avatar"
            />
          </li>
          <li onClick={handleLogout} className="logout-btn">
            Logout
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
