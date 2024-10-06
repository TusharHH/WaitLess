import React, { useEffect } from 'react';
import useAdminStore from '../../store/adminAuthStore'; // Import the admin store
import './FindDoctor.scss';
import MAN from '../../assets/Images/man.png'

function FindDoctor() {
    const { admins, fetchAdmins, isLoading, error } = useAdminStore();

    useEffect(() => {
        fetchAdmins(); // Fetch admins on component mount
    }, [fetchAdmins]);

    return (
        <div className="find-doctor-container">
            <h1>Find a Doctor</h1>

            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}

            {!isLoading && admins.length === 0 && <p>No doctors available.</p>}

            <div className="admin-list">
                {admins.map((admin) => (
                    <div key={admin._id} className="admin-card">
                        <img
                            src={admin.avatar || MAN}
                            alt={admin.name}
                            className="admin-avatar"
                        />
                        <h3>{admin.name}</h3>
                        <p>Email: {admin.email}</p>
                        <p>Services: {admin.services?.map(service => service.name).join(', ') || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FindDoctor;
