import React from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';

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
          <li><NavLink to="/" className={({ isActive }) => `${isActive ? 'activeClassName' : 'inactiveClassName'}`}>Home</NavLink></li>
          <li><NavLink to={url} className={({ isActive }) => `${isActive ? 'activeClassName' : 'inactiveClassName'}`}>Services</NavLink></li>
          <li><NavLink to="/find-doctor" className={({ isActive }) => `${isActive ? 'activeClassName' : 'inactiveClassName'}`} >Doctors</NavLink></li>
          <li><NavLink to="/feedback" className={({ isActive }) => `${isActive ? 'activeClassName' : 'inactiveClassName'}`} >Contact Us</NavLink></li>
          <li><NavLink to="/community" className={({ isActive }) => `${isActive ? 'activeClassName' : 'inactiveClassName'}`} >Community</NavLink></li>
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
