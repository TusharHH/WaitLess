import React from 'react';
import NavBar from '../components/Navbar/NavBar.js';

const AdminLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
