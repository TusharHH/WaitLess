import React from 'react';
import { useNavigate } from 'react-router-dom';

import useAdminStore from '../../store/adminAuthStore';


function Dashboard() {

    const { admin, logout, setError } = useAdminStore();
    const adminName = admin ? admin.name : "No user found!!";

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            setError(err);
        }
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <p>admin: {adminName}</p>

            <button onClick={handleLogout}>Logout</button>
            <button onClick={handleLogout}>Add Service</button>
        </div>
    );
}

export default Dashboard;
