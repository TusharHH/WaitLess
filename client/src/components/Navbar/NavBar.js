import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

import useAdminStore from '../../store/adminAuthStore';
import useUserStore from '../../store/userAuthStore';

import Logo from '../../assets/Images/logo-removebg.png';
import ProfilePic from '../../assets/Images/man.png';

import './NavBar.scss';

const NavBar = () => {
  const { logout: adminLogout, setError: setAdminError, admin, error: adminError } = useAdminStore();
  const { logout: userLogout, setError: setUserError, user, error: userError } = useUserStore();

  const navigate = useNavigate();

  const loggedInUser = Array.isArray(admin) ? admin[0] : admin || user;
  const name = loggedInUser ? loggedInUser.name : "No user found!";
  const avatarUrl = loggedInUser?.avatar || ProfilePic;
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

  const url = admin ? "dashboard" : 'u_dashboard';

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img
          src={Logo}
          alt="Logo"
          onClick={() => { navigate('/') }}
        />
      </div>
      <div className="navbar-links">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to={url}>Services</Link></li>
          <li><Link to="/find-doctor">Doctors</Link></li>
          <li><Link to="/community">Community</Link></li>
          <li><Link to="/feedback">Contact Us</Link></li>
        </ul>
      </div>
      <div className="navbar-user">
        <ul className="navbar-items">
          {loggedInUser ? (
            <>
              <p>{name}</p>
              <li>
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  className="user-avatar"
                  onClick={() => { navigate('/profile') }}
                />
              </li>
              <li onClick={handleLogout} className="logout-btn">
                Logout
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/signup" className="signup-btn">Signup</Link>
              </li>
              <li>
                <Link to="/login" className="login-btn">Login</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
