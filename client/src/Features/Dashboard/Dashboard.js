import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/Service/ServiceCard';
import useAdminStore from '../../store/adminAuthStore';


function Dashboard() {
    const { admin, logout, setError } = useAdminStore();
    const adminData = admin && admin.length > 0 ? admin[0] : null;
    const adminName = adminData ? adminData.name : "No user found!!";

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
            <br />
            <div className="container">
                <ServiceCard/>
            </div>
        </div>
    );
}

export default Dashboard;
