import React from 'react';

const AdminLayout = ({ children }) => {
  return (
    <div> 
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
